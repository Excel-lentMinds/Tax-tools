// Resume Builder JavaScript

// State
let resumeData = {
    personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: '',
    projects: [],
    certifications: [],
    languages: ''
};

let currentTemplate = 'modern';
let currentColor = 'blue';
let currentPhoto = null; // Base64 photo data
let cropShape = 'circle'; // circle or square
let cropper = null;
// Advanced Customization State
let currentFont = 'sans'; // sans, serif, mono
let currentFontSize = '1'; // multiplier
let customHexColor = '#3B82F6';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    addExperience();
    addEducation();
    updatePreview();

    // Character count for summary
    document.getElementById('summaryText')?.addEventListener('input', function () {
        document.getElementById('summaryCount').textContent = this.value.length;
    });
});

// Scroll to builder
function scrollToBuilder() {
    document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
}

// Toggle section
function toggleSection(id) {
    const section = document.getElementById(id);
    section.classList.toggle('collapsed');
    const header = section.previousElementSibling;
    header.querySelector('.fa-chevron-down').style.transform =
        section.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0)';
}

// Template selection
function selectTemplate(template) {
    currentTemplate = template;
    document.querySelectorAll('.template-card').forEach(card => card.classList.remove('active'));
    document.querySelector(`[data-template="${template}"]`).classList.add('active');
    updatePreview();
}

// Color theme
// Color theme
function changeColorTheme() {
    const val = document.getElementById('colorTheme').value;
    if (val === 'custom') {
        // Handled by color picker
    } else {
        currentColor = val;
        updatePreview();
    }
}

// ==================== ADVANCED CUSTOMIZATION ====================

function updateFont(font) {
    currentFont = font;
    updatePreview();
}

function updateFontSize(size) {
    currentFontSize = size;
    updatePreview();
}

function updateCustomColor(color) {
    customHexColor = color;
    // Set theme dropdown to 'custom' if it exists, or just use valid logic
    // We'll treat 'custom' as a virtual concept or modify preview logic
    currentColor = 'custom';
    updatePreview();
}

// Data Portability
function exportJson() {
    const data = collectData();
    data.meta = {
        template: currentTemplate,
        color: currentColor,
        customColor: customHexColor,
        font: currentFont,
        fontSize: currentFontSize
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume-data-" + new Date().toISOString().slice(0, 10) + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importJson(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.personal) {
                // Populate fields
                document.getElementById('fullName').value = data.personal.fullName || '';
                document.getElementById('jobTitle').value = data.personal.jobTitle || '';
                document.getElementById('email').value = data.personal.email || '';
                document.getElementById('phone').value = data.personal.phone || '';
                document.getElementById('location').value = data.personal.location || '';
                document.getElementById('linkedin').value = data.personal.linkedin || '';
                document.getElementById('website').value = data.personal.website || '';

                document.getElementById('summaryText').value = data.summary || '';
                document.getElementById('skillsText').value = data.skills || '';
                document.getElementById('languagesText').value = data.languages || '';

                // Restore photo
                if (data.photo) {
                    currentPhoto = data.photo;
                    const preview = document.querySelector('.photo-preview');
                    preview.innerHTML = `<img src="${currentPhoto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                    document.querySelector('.photo-actions').style.display = 'flex';
                }

                // Restore Experience & Education (Clear and Re-add)
                document.getElementById('experienceList').innerHTML = '';
                if (data.experience && data.experience.length) {
                    data.experience.forEach(exp => {
                        addExperience();
                        const entries = document.querySelectorAll('.experience-entry');
                        const lastEntry = entries[entries.length - 1];
                        lastEntry.querySelector('input[placeholder="Job Title"]').value = exp.title;
                        lastEntry.querySelector('input[placeholder="Company"]').value = exp.company;
                        lastEntry.querySelector('input[placeholder="Start Date"]').value = exp.startDate;
                        lastEntry.querySelector('input[placeholder="End Date"]').value = exp.endDate;
                        lastEntry.querySelector('textarea').value = exp.description;
                    });
                } else {
                    addExperience();
                }

                document.getElementById('educationList').innerHTML = '';
                if (data.education && data.education.length) {
                    data.education.forEach(edu => {
                        addEducation();
                        const entries = document.querySelectorAll('.education-entry');
                        const lastEntry = entries[entries.length - 1];
                        lastEntry.querySelector('input[placeholder="Degree"]').value = edu.degree;
                        lastEntry.querySelector('input[placeholder="Institution"]').value = edu.institution;
                        lastEntry.querySelector('input[placeholder="Year"]').value = edu.year;
                    });
                } else {
                    addEducation();
                }

                // Restore Meta
                if (data.meta) {
                    currentTemplate = data.meta.template || 'modern';
                    currentColor = data.meta.color || 'blue';
                    customHexColor = data.meta.customColor || '#3B82F6';
                    currentFont = data.meta.font || 'sans';
                    currentFontSize = data.meta.fontSize || '1';

                    // Update UI Controls
                    if (document.getElementById('fontFamily')) document.getElementById('fontFamily').value = currentFont;
                    if (document.getElementById('fontSize')) document.getElementById('fontSize').value = currentFontSize;
                    if (document.getElementById('customColor')) document.getElementById('customColor').value = customHexColor;

                    selectTemplate(currentTemplate);
                }

                updatePreview();
                saveToLocalStorage();
                alert('Resume data restored successfully!');
            }
        } catch (err) {
            console.error(err);
            alert('Error parsing JSON file.');
        }
    };
    reader.readAsText(file);
}

// ==================== AI RESUME SCORE ====================

function calculateResumeScore(data) {
    let score = 0;
    const checks = {
        name: !!data.personal.fullName, // 10
        email: !!data.personal.email, // 10
        phone: !!data.personal.phone, // 5
        summary: data.summary.length > 50, // 15
        experience: data.experience.length > 0, // 20
        education: data.education.length > 0, // 10
        skills: data.skills.length > 10, // 15
        bullets: data.experience.some(e => e.description.length > 100) // 15
    };

    if (checks.name) score += 10;
    if (checks.email) score += 10;
    if (checks.phone) score += 5;
    if (checks.summary) score += 15;
    if (checks.experience) score += 20;
    if (checks.education) score += 10;
    if (checks.skills) score += 15;
    if (checks.bullets) score += 15;

    return Math.min(score, 100);
}

function updateResumeScoreUI(score) {
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreText = document.getElementById('scoreText');
    if (!scoreCircle || !scoreText) return;

    // Stroke Dasharray calculation: Circumference = 2 * pi * 15.9155 ≈ 100
    // So distinct percent is just the value
    scoreCircle.style.strokeDasharray = `${score}, 100`;

    // Color based on score
    if (score < 50) scoreCircle.setAttribute('stroke', '#EF4444'); // Red
    else if (score < 80) scoreCircle.setAttribute('stroke', '#F59E0B'); // Yellow
    else scoreCircle.setAttribute('stroke', '#10B981'); // Green

    scoreText.textContent = score;
}

// Experience management
let expCounter = 0;
function addExperience() {
    const list = document.getElementById('experienceList');
    const id = expCounter++;
    const html = `
        <div class="rb-entry" id="exp-${id}">
            <div class="rb-entry-header">
                <span>Experience #${id + 1}</span>
                <button class="rb-delete-btn" onclick="removeEntry('exp-${id}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="rb-row">
                <div class="rb-field">
                    <label>Job Title</label>
                    <input type="text" placeholder="Software Engineer" oninput="updatePreview()">
                </div>
                <div class="rb-field">
                    <label>Company</label>
                    <input type="text" placeholder="Google" oninput="updatePreview()">
                </div>
            </div>
            <div class="rb-row">
                <div class="rb-field">
                    <label>Start Date</label>
                    <input type="text" placeholder="Jan 2022" oninput="updatePreview()">
                </div>
                <div class="rb-field">
                    <label>End Date</label>
                    <input type="text" placeholder="Present" oninput="updatePreview()">
                </div>
            </div>
            <div class="rb-field">
                <label>Description</label>
                <textarea rows="3" placeholder="Key achievements and responsibilities..." oninput="updatePreview()"></textarea>
            </div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', html);
}

// Education management
let eduCounter = 0;
function addEducation() {
    const list = document.getElementById('educationList');
    const id = eduCounter++;
    const html = `
        <div class="rb-entry" id="edu-${id}">
            <div class="rb-entry-header">
                <span>Education #${id + 1}</span>
                <button class="rb-delete-btn" onclick="removeEntry('edu-${id}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="rb-row">
                <div class="rb-field">
                    <label>Degree</label>
                    <input type="text" placeholder="B.Tech Computer Science" oninput="updatePreview()">
                </div>
                <div class="rb-field">
                    <label>Institution</label>
                    <input type="text" placeholder="IIT Delhi" oninput="updatePreview()">
                </div>
            </div>
            <div class="rb-row">
                <div class="rb-field">
                    <label>Year</label>
                    <input type="text" placeholder="2018 - 2022" oninput="updatePreview()">
                </div>
                <div class="rb-field">
                    <label>GPA/Percentage</label>
                    <input type="text" placeholder="8.5 CGPA" oninput="updatePreview()">
                </div>
            </div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', html);
}

// Projects management
let projCounter = 0;
function addProject() {
    const list = document.getElementById('projectsList');
    const id = projCounter++;
    const html = `
        <div class="rb-entry" id="proj-${id}">
            <div class="rb-entry-header">
                <span>Project #${id + 1}</span>
                <button class="rb-delete-btn" onclick="removeEntry('proj-${id}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="rb-row">
                <div class="rb-field">
                    <label>Project Name</label>
                    <input type="text" placeholder="E-commerce Platform" oninput="updatePreview()">
                </div>
                <div class="rb-field">
                    <label>Technologies</label>
                    <input type="text" placeholder="React, Node.js, MongoDB" oninput="updatePreview()">
                </div>
            </div>
            <div class="rb-field">
                <label>Description</label>
                <textarea rows="2" placeholder="Brief project description..." oninput="updatePreview()"></textarea>
            </div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', html);
}

// Certifications management
let certCounter = 0;
function addCertification() {
    const list = document.getElementById('certificationsList');
    const id = certCounter++;
    const html = `
        <div class="rb-entry" id="cert-${id}">
            <div class="rb-entry-header">
                <span>Certification #${id + 1}</span>
                <button class="rb-delete-btn" onclick="removeEntry('cert-${id}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="rb-row">
                <div class="rb-field">
                    <label>Certificate Name</label>
                    <input type="text" placeholder="AWS Solutions Architect" oninput="updatePreview()">
                </div>
                <div class="rb-field">
                    <label>Issuing Organization</label>
                    <input type="text" placeholder="Amazon Web Services" oninput="updatePreview()">
                </div>
            </div>
            <div class="rb-field">
                <label>Date</label>
                <input type="text" placeholder="2023" oninput="updatePreview()">
            </div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', html);
}

// Remove entry
function removeEntry(id) {
    document.getElementById(id)?.remove();
    updatePreview();
}

// Collect form data
function collectData() {
    const data = {
        personal: {
            fullName: document.getElementById('fullName')?.value || '',
            jobTitle: document.getElementById('jobTitle')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            location: document.getElementById('location')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            website: document.getElementById('website')?.value || ''
        },
        summary: document.getElementById('summaryText')?.value || '',
        skills: document.getElementById('skillsText')?.value || '',
        languages: document.getElementById('languagesText')?.value || '',
        experience: [],
        education: [],
        projects: [],
        certifications: []
    };

    // Flatten for template rendering compatibility (templates expect data.fullName, not data.personal.fullName)
    Object.assign(data, data.personal);

    // Collect experience
    document.querySelectorAll('#experienceList .rb-entry').forEach(entry => {
        const inputs = entry.querySelectorAll('input, textarea');
        if (inputs[0]?.value || inputs[1]?.value) {
            data.experience.push({
                title: inputs[0]?.value || '',
                company: inputs[1]?.value || '',
                startDate: inputs[2]?.value || '',
                endDate: inputs[3]?.value || '',
                description: inputs[4]?.value || ''
            });
        }
    });

    // Collect education
    document.querySelectorAll('#educationList .rb-entry').forEach(entry => {
        const inputs = entry.querySelectorAll('input');
        if (inputs[0]?.value || inputs[1]?.value) {
            data.education.push({
                degree: inputs[0]?.value || '',
                institution: inputs[1]?.value || '',
                year: inputs[2]?.value || '',
                gpa: inputs[3]?.value || ''
            });
        }
    });

    // Collect projects
    document.querySelectorAll('#projectsList .rb-entry').forEach(entry => {
        const inputs = entry.querySelectorAll('input, textarea');
        if (inputs[0]?.value) {
            data.projects.push({
                name: inputs[0]?.value || '',
                tech: inputs[1]?.value || '',
                description: inputs[2]?.value || ''
            });
        }
    });

    // Collect certifications
    document.querySelectorAll('#certificationsList .rb-entry').forEach(entry => {
        const inputs = entry.querySelectorAll('input');
        if (inputs[0]?.value) {
            data.certifications.push({
                name: inputs[0]?.value || '',
                year: inputs[1]?.value || ''
            });
        }
    });

    // Add photo
    data.photo = currentPhoto;
    return data;
}

// Update preview
function updatePreview() {
    const data = collectData();
    const previewContainer = document.getElementById('resumePreview');

    // Apply Template and Color
    previewContainer.className = `rb-resume theme-${currentColor}`;

    // Apply Font (using CSS variables or direct style)
    let fontFamily = "'Inter', sans-serif";
    if (currentFont === 'serif') fontFamily = "'Merriweather', 'Times New Roman', serif";
    if (currentFont === 'mono') fontFamily = "'Roboto Mono', monospace";
    previewContainer.style.fontFamily = fontFamily;

    // Apply Font Size
    previewContainer.style.fontSize = `${currentFontSize * 16}px`;

    // Apply Custom Color if active
    if (currentColor === 'custom') {
        previewContainer.style.setProperty('--primary', customHexColor);
        // Simple light variant generation
        previewContainer.style.setProperty('--primary-light', customHexColor + '20');
    } else {
        previewContainer.style.removeProperty('--primary');
        previewContainer.style.removeProperty('--primary-light');
    }

    // Render Template
    previewContainer.innerHTML = getTemplateHTML(currentTemplate, data);

    // Update Score
    const score = calculateResumeScore(data);
    updateResumeScoreUI(score);
}

function getTemplateHTML(template, data) {
    switch (template) {
        case 'modern': return getModernTemplate(data);
        case 'classic': return getClassicTemplate(data);
        case 'creative': return getCreativeTemplate(data);
        case 'minimal': return getMinimalTemplate(data);
        case 'executive': return getExecutiveTemplate(data);
        case 'tech': return getTechTemplate(data);
        case 'academic': return getAcademicTemplate(data);
        case 'designer': return getDesignerTemplate(data);
        case 'healthcare': return getHealthcareTemplate(data);
        case 'sales': return getSalesTemplate(data);
        // Photo templates
        case 'photo-sidebar': return getPhotoSidebarTemplate(data);
        case 'photo-timeline': return getPhotoTimelineTemplate(data);
        case 'photo-creative': return getPhotoCreativeTemplate(data);
        case 'photo-professional': return getPhotoProfessionalTemplate(data);
        // Corporate templates
        case 'mba': return getMbaTemplate(data);
        case 'consultant': return getConsultantTemplate(data);
        case 'executive': return getExecutiveTemplateCorp(data); // Renamed to avoid conflict
        case 'ivy': return getIvyTemplate(data);
        default: return getModernTemplate(data);
    }
}

// MODERN Template - Two-column header with sidebar accent
function getModernTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-modern">
            <div class="tpl-header" style="background: linear-gradient(135deg, var(--accent-color, #1E3A8A) 0%, var(--accent-light, #3B82F6) 100%); color: white; padding: 1.5rem; margin: -2rem -2rem 1.5rem -2rem;">
                <div class="tpl-name" style="font-size: 2em; font-weight: 700; margin-bottom: 0.25rem;">${data.fullName || 'Your Name'}</div>
                <div class="tpl-title" style="font-size: 1.2em; opacity: 0.9; margin-bottom: 1rem;">${data.jobTitle || 'Professional Title'}</div>
                <div class="tpl-contact" style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85em;">
                    ${data.email ? `<span>📧 ${data.email}</span>` : ''}
                    ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
                    ${data.location ? `<span>📍 ${data.location}</span>` : ''}
                    ${data.linkedin ? `<span>💼 ${data.linkedin}</span>` : ''}
                </div>
            </div>
            ${data.summary ? `<div class="tpl-section"><h3 style="color: var(--accent-color, #1E3A8A); border-bottom: 2px solid; padding-bottom: 0.3rem; margin-bottom: 0.75rem;">PROFESSIONAL SUMMARY</h3><p style="line-height: 1.6;">${data.summary}</p></div>` : ''}
            ${data.experience.length ? `<div class="tpl-section"><h3 style="color: var(--accent-color, #1E3A8A); border-bottom: 2px solid; padding-bottom: 0.3rem; margin-bottom: 0.75rem;">EXPERIENCE</h3>${data.experience.map(e => `<div style="margin-bottom: 0.75rem;"><div style="display: flex; justify-content: space-between;"><strong>${e.title}</strong><span style="color: #666;">${e.startDate} - ${e.endDate}</span></div><div style="color: #666;">${e.company}</div><p style="margin: 0.25rem 0; font-size: 0.95em;">${e.description}</p></div>`).join('')}</div>` : ''}
            ${data.education.length ? `<div class="tpl-section"><h3 style="color: var(--accent-color, #1E3A8A); border-bottom: 2px solid; padding-bottom: 0.3rem; margin-bottom: 0.75rem;">EDUCATION</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><div style="display: flex; justify-content: space-between;"><strong>${e.degree}</strong><span style="color: #666;">${e.year}</span></div><div style="color: #666;">${e.institution}${e.gpa ? ' | ' + e.gpa : ''}</div></div>`).join('')}</div>` : ''}
            ${skillsArr.length ? `<div class="tpl-section"><h3 style="color: var(--accent-color, #1E3A8A); border-bottom: 2px solid; padding-bottom: 0.3rem; margin-bottom: 0.75rem;">SKILLS</h3><div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${skillsArr.map(s => `<span style="background: #E5E7EB; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.85em;">${s}</span>`).join('')}</div></div>` : ''}
            ${data.projects.length ? `<div class="tpl-section"><h3 style="color: var(--accent-color, #1E3A8A); border-bottom: 2px solid; padding-bottom: 0.3rem; margin-bottom: 0.75rem;">PROJECTS</h3>${data.projects.map(p => `<div style="margin-bottom: 0.5rem;"><strong>${p.name}</strong> <span style="color: #666; font-size: 0.9em;">(${p.tech})</span><p style="margin: 0.25rem 0; font-size: 0.95em;">${p.description}</p></div>`).join('')}</div>` : ''}
        </div>
    `;
}

// CLASSIC Template - Traditional corporate style
function getClassicTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-classic" style="font-family: 'Georgia', serif;">
            <div style="text-align: center; border-bottom: 3px double #333; padding-bottom: 1rem; margin-bottom: 1rem;">
                <div style="font-size: 2.2em; font-weight: bold; text-transform: uppercase; letter-spacing: 3px;">${data.fullName || 'Your Name'}</div>
                <div style="font-size: 1.1em; font-style: italic; color: #555; margin: 0.5rem 0;">${data.jobTitle || 'Professional Title'}</div>
                <div style="font-size: 0.9em; color: #666;">${[data.email, data.phone, data.location].filter(Boolean).join(' • ')}</div>
            </div>
            ${data.summary ? `<div style="margin-bottom: 1rem;"><h3 style="text-transform: uppercase; font-size: 1em; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 0.25rem;">Professional Summary</h3><p style="text-align: justify; line-height: 1.7; font-size: 0.95em;">${data.summary}</p></div>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1rem;"><h3 style="text-transform: uppercase; font-size: 1em; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 0.25rem;">Professional Experience</h3>${data.experience.map(e => `<div style="margin: 0.75rem 0;"><div style="font-weight: bold;">${e.title} - ${e.company}</div><div style="font-style: italic; color: #666; font-size: 0.9em;">${e.startDate} - ${e.endDate}</div><p style="margin: 0.25rem 0; font-size: 0.95em; text-align: justify;">${e.description}</p></div>`).join('')}</div>` : ''}
            ${data.education.length ? `<div style="margin-bottom: 1rem;"><h3 style="text-transform: uppercase; font-size: 1em; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 0.25rem;">Education</h3>${data.education.map(e => `<div style="margin: 0.5rem 0;"><strong>${e.degree}</strong>, ${e.institution} (${e.year})${e.gpa ? ' - ' + e.gpa : ''}</div>`).join('')}</div>` : ''}
            ${skillsArr.length ? `<div><h3 style="text-transform: uppercase; font-size: 1em; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 0.25rem;">Skills</h3><p style="font-size: 0.95em;">${skillsArr.join(' • ')}</p></div>` : ''}
        </div>
    `;
}

// CREATIVE Template - Bold colors and modern layout
function getCreativeTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-creative" style="display: grid; grid-template-columns: 180px 1fr; gap: 0;">
            <div style="background: linear-gradient(180deg, #7C3AED 0%, #EC4899 100%); color: white; padding: 1.5rem 1rem; margin: -2rem 0 -2rem -2rem;">
                <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2em; font-weight: bold;">${(data.fullName || 'YN').split(' ').map(n => n[0]).join('')}</div>
                <div style="font-size: 0.75em; margin-bottom: 1.5rem;">
                    ${data.email ? `<div style="margin: 0.5rem 0;">📧 ${data.email}</div>` : ''}
                    ${data.phone ? `<div style="margin: 0.5rem 0;">📱 ${data.phone}</div>` : ''}
                    ${data.location ? `<div style="margin: 0.5rem 0;">📍 ${data.location}</div>` : ''}
                </div>
                ${skillsArr.length ? `<div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 1rem;"><h4 style="margin: 0 0 0.5rem; font-size: 0.85em; text-transform: uppercase;">Skills</h4>${skillsArr.map(s => `<div style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: 4px; margin: 0.25rem 0; font-size: 0.75em;">${s}</div>`).join('')}</div>` : ''}
            </div>
            <div style="padding: 0 1rem;">
                <h1 style="font-size: 1.8em; margin: 0 0 0.25rem; color: #7C3AED;">${data.fullName || 'Your Name'}</h1>
                <div style="color: #EC4899; font-size: 1.1em; font-weight: 500; margin-bottom: 1rem;">${data.jobTitle || 'Professional Title'}</div>
                ${data.summary ? `<div style="margin-bottom: 1rem;"><p style="color: #666; line-height: 1.6; font-size: 0.9em; border-left: 3px solid #7C3AED; padding-left: 1rem;">${data.summary}</p></div>` : ''}
                ${data.experience.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #7C3AED; font-size: 1em; margin-bottom: 0.5rem;">💼 EXPERIENCE</h3>${data.experience.map(e => `<div style="margin-bottom: 0.75rem; padding-left: 1rem; border-left: 2px solid #EC4899;"><strong style="font-size: 0.95em;">${e.title}</strong><div style="color: #666; font-size: 0.85em;">${e.company} | ${e.startDate} - ${e.endDate}</div><p style="margin: 0.25rem 0; font-size: 0.85em; color: #555;">${e.description}</p></div>`).join('')}</div>` : ''}
                ${data.education.length ? `<div><h3 style="color: #7C3AED; font-size: 1em; margin-bottom: 0.5rem;">🎓 EDUCATION</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><strong style="font-size: 0.9em;">${e.degree}</strong><div style="color: #666; font-size: 0.85em;">${e.institution} | ${e.year}</div></div>`).join('')}</div>` : ''}
            </div>
        </div>
    `;
}

// MINIMAL Template - Clean and simple
function getMinimalTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-minimal" style="font-family: 'Inter', sans-serif;">
            <div style="margin-bottom: 2rem;">
                <h1 style="font-size: 2em; font-weight: 300; margin: 0; color: #111;">${data.fullName || 'Your Name'}</h1>
                <div style="font-size: 1em; color: #888; margin: 0.25rem 0;">${data.jobTitle || 'Professional Title'}</div>
                <div style="font-size: 0.8em; color: #aaa; margin-top: 0.5rem;">${[data.email, data.phone, data.location].filter(Boolean).join(' / ')}</div>
            </div>
            ${data.summary ? `<div style="margin-bottom: 1.5rem;"><p style="color: #555; line-height: 1.7; font-size: 0.9em;">${data.summary}</p></div>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1.5rem;"><h2 style="font-size: 0.75em; text-transform: uppercase; letter-spacing: 3px; color: #aaa; margin-bottom: 1rem;">Experience</h2>${data.experience.map(e => `<div style="margin-bottom: 1rem;"><div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;"><span style="font-weight: 500;">${e.title}</span><span style="color: #888; font-size: 0.85em;">${e.startDate} — ${e.endDate}</span></div><div style="color: #666; font-size: 0.9em; margin-bottom: 0.25rem;">${e.company}</div><p style="color: #777; font-size: 0.85em; margin: 0;">${e.description}</p></div>`).join('')}</div>` : ''}
            ${data.education.length ? `<div style="margin-bottom: 1.5rem;"><h2 style="font-size: 0.75em; text-transform: uppercase; letter-spacing: 3px; color: #aaa; margin-bottom: 1rem;">Education</h2>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><span style="font-weight: 500;">${e.degree}</span><span style="color: #888;"> — ${e.institution}, ${e.year}</span></div>`).join('')}</div>` : ''}
            ${skillsArr.length ? `<div><h2 style="font-size: 0.75em; text-transform: uppercase; letter-spacing: 3px; color: #aaa; margin-bottom: 0.75rem;">Skills</h2><p style="color: #666; font-size: 0.85em;">${skillsArr.join(', ')}</p></div>` : ''}
        </div>
    `;
}

// EXECUTIVE Template - Premium corporate
function getExecutiveTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-executive">
            <div style="background: #1F2937; color: white; padding: 2rem; margin: -2rem -2rem 1.5rem; position: relative;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #D4AF37, #F59E0B);"></div>
                <h1 style="font-size: 2.2em; font-weight: 700; margin: 0; letter-spacing: 1px;">${data.fullName || 'Your Name'}</h1>
                <div style="color: #D4AF37; font-size: 1.2em; font-weight: 500; margin: 0.5rem 0;">${data.jobTitle || 'Professional Title'}</div>
                <div style="display: flex; gap: 1.5rem; font-size: 0.85em; margin-top: 1rem; color: #9CA3AF;">
                    ${data.email ? `<span>${data.email}</span>` : ''}
                    ${data.phone ? `<span>${data.phone}</span>` : ''}
                    ${data.location ? `<span>${data.location}</span>` : ''}
                </div>
            </div>
            ${data.summary ? `<div style="margin-bottom: 1.5rem; padding: 1rem; background: #F9FAFB; border-left: 4px solid #D4AF37;"><p style="margin: 0; line-height: 1.7; color: #374151;">${data.summary}</p></div>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1.5rem;"><h3 style="font-size: 1em; color: #1F2937; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #D4AF37; padding-bottom: 0.5rem; margin-bottom: 1rem;">Professional Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 1rem;"><div style="display: flex; justify-content: space-between;"><strong style="color: #1F2937;">${e.title}</strong><span style="color: #D4AF37; font-weight: 500;">${e.startDate} - ${e.endDate}</span></div><div style="color: #6B7280; font-weight: 500;">${e.company}</div><p style="color: #4B5563; font-size: 0.9em; margin: 0.5rem 0;">${e.description}</p></div>`).join('')}</div>` : ''}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                ${data.education.length ? `<div><h3 style="font-size: 0.9em; color: #1F2937; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #D4AF37; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Education</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><strong style="font-size: 0.9em;">${e.degree}</strong><div style="color: #6B7280; font-size: 0.85em;">${e.institution}</div></div>`).join('')}</div>` : ''}
                ${skillsArr.length ? `<div><h3 style="font-size: 0.9em; color: #1F2937; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #D4AF37; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">Core Competencies</h3><div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${skillsArr.map(s => `<span style="background: #FEF3C7; color: #92400E; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8em;">${s}</span>`).join('')}</div></div>` : ''}
            </div>
        </div>
    `;
}

// TECH Template - Developer-focused with code-like styling
function getTechTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-tech" style="font-family: 'JetBrains Mono', 'Consolas', monospace; background: #0F172A; color: #E2E8F0; padding: 2rem; margin: -2rem; min-height: calc(100% + 4rem);">
            <div style="margin-bottom: 1.5rem;">
                <div style="color: #10B981; font-size: 0.8em;">// Developer Profile</div>
                <h1 style="font-size: 1.8em; color: #F1F5F9; margin: 0.25rem 0;">${data.fullName || 'Your Name'}<span style="color: #10B981;">()</span></h1>
                <div style="color: #94A3B8;">${data.jobTitle || 'Professional Title'}</div>
                <div style="font-size: 0.8em; color: #64748B; margin-top: 0.5rem;">
                    ${data.email ? `<span style="color: #10B981;">@</span>${data.email} ` : ''}
                    ${data.phone ? `<span style="color: #10B981;">tel:</span>${data.phone} ` : ''}
                    ${data.location ? `<span style="color: #10B981;">loc:</span>${data.location}` : ''}
                </div>
            </div>
            ${data.summary ? `<div style="margin-bottom: 1.5rem;"><div style="color: #64748B; font-size: 0.8em;">/* About */</div><p style="color: #CBD5E1; font-size: 0.9em; line-height: 1.6; padding-left: 1rem; border-left: 2px solid #10B981;">${data.summary}</p></div>` : ''}
            ${skillsArr.length ? `<div style="margin-bottom: 1.5rem;"><div style="color: #64748B; font-size: 0.8em;">const skills = [</div><div style="margin-left: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">${skillsArr.map(s => `<span style="background: #1E293B; border: 1px solid #10B981; color: #10B981; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8em;">"${s}"</span>`).join(', ')}</div><div style="color: #64748B; font-size: 0.8em;">];</div></div>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1.5rem;"><div style="color: #64748B; font-size: 0.8em;">// Experience</div>${data.experience.map(e => `<div style="margin: 0.75rem 0; padding-left: 1rem; border-left: 2px solid #3B82F6;"><div style="color: #F1F5F9;"><span style="color: #3B82F6;">function</span> ${e.title.replace(/\s+/g, '_')}<span style="color: #10B981;">()</span></div><div style="color: #64748B; font-size: 0.85em;">// ${e.company} | ${e.startDate} - ${e.endDate}</div><p style="color: #94A3B8; font-size: 0.85em; margin: 0.25rem 0;">${e.description}</p></div>`).join('')}</div>` : ''}
            ${data.education.length ? `<div><div style="color: #64748B; font-size: 0.8em;">// Education</div>${data.education.map(e => `<div style="margin: 0.5rem 0; padding-left: 1rem;"><span style="color: #F1F5F9;">${e.degree}</span><span style="color: #64748B;"> @ ${e.institution} (${e.year})</span></div>`).join('')}</div>` : ''}
    `;
}

// ACADEMIC Template - Scholarly style
function getAcademicTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-academic" style="font-family: 'Times New Roman', serif;">
            <div style="background: #1E40AF; color: white; padding: 1.5rem; margin: -2rem -2rem 1.5rem;">
                <h1 style="font-size: 2em; margin: 0; font-weight: normal;">${data.fullName || 'Your Name'}, Ph.D.</h1>
                <div style="font-size: 1.1em; opacity: 0.9; margin: 0.5rem 0;">${data.jobTitle || 'Professional Title'}</div>
                <div style="font-size: 0.85em; opacity: 0.8;">${[data.email, data.phone, data.location].filter(Boolean).join(' | ')}</div>
            </div>
            ${data.summary ? `<div style="margin-bottom: 1.5rem;"><h3 style="color: #1E40AF; font-size: 1.1em; text-transform: uppercase; margin-bottom: 0.5rem; border-bottom: 2px solid #1E40AF;">Research Interests</h3><p style="line-height: 1.7; text-align: justify;">${data.summary}</p></div>` : ''}
            ${data.education.length ? `<div style="margin-bottom: 1.5rem;"><h3 style="color: #1E40AF; font-size: 1.1em; text-transform: uppercase; margin-bottom: 0.5rem; border-bottom: 2px solid #1E40AF;">Education</h3>${data.education.map(e => `<div style="margin-bottom: 0.75rem;"><strong>${e.degree}</strong><div style="color: #666;">${e.institution}, ${e.year}${e.gpa ? ' | ' + e.gpa : ''}</div></div>`).join('')}</div>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1.5rem;"><h3 style="color: #1E40AF; font-size: 1.1em; text-transform: uppercase; margin-bottom: 0.5rem; border-bottom: 2px solid #1E40AF;">Professional Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 1rem;"><div style="display: flex; justify-content: space-between;"><strong>${e.title}</strong><span style="color: #666;">${e.startDate} - ${e.endDate}</span></div><div style="font-style: italic; color: #666;">${e.company}</div><p style="margin: 0.25rem 0;">${e.description}</p></div>`).join('')}</div>` : ''}
            ${skillsArr.length ? `<div><h3 style="color: #1E40AF; font-size: 1.1em; text-transform: uppercase; margin-bottom: 0.5rem; border-bottom: 2px solid #1E40AF;">Technical Skills</h3><p>${skillsArr.join(' • ')}</p></div>` : ''}
        </div>
    `;
}

// DESIGNER Template - Portfolio style
function getDesignerTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-designer" style="font-family: 'Helvetica Neue', sans-serif;">
            <div style="background: linear-gradient(135deg, #F472B6, #A855F7, #3B82F6); color: white; padding: 2rem; margin: -2rem -2rem 1.5rem; text-align: center;">
                <div style="width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2em; font-weight: bold; color: #A855F7;">${(data.fullName || 'YN').split(' ').map(n => n[0]).join('')}</div>
                <h1 style="font-size: 2em; margin: 0; font-weight: 300;">${data.fullName || 'Your Name'}</h1>
                <div style="font-size: 1.2em; opacity: 0.9; margin: 0.5rem 0; font-weight: 500;">${data.jobTitle || 'Creative Professional'}</div>
                <div style="font-size: 0.85em; opacity: 0.8; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                    ${data.email ? `<span>✉ ${data.email}</span>` : ''}
                    ${data.website ? `<span>🌐 ${data.website}</span>` : ''}
                </div>
            </div>
            ${data.summary ? `<div style="margin-bottom: 1.5rem; text-align: center;"><p style="color: #666; line-height: 1.7; font-size: 1em; max-width: 500px; margin: 0 auto; font-style: italic;">"${data.summary}"</p></div>` : ''}
            ${skillsArr.length ? `<div style="margin-bottom: 1.5rem; text-align: center;"><div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">${skillsArr.map(s => `<span style="background: linear-gradient(135deg, #F472B6, #A855F7); color: white; padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85em;">${s}</span>`).join('')}</div></div>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1.5rem;"><h3 style="color: #A855F7; font-size: 0.9em; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 1rem; text-align: center;">Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 1rem; padding: 1rem; background: #F9FAFB; border-radius: 12px;"><div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;"><strong style="color: #A855F7;">${e.title}</strong><span style="color: #888; font-size: 0.9em;">${e.startDate} - ${e.endDate}</span></div><div style="color: #666; font-size: 0.9em; margin-bottom: 0.25rem;">${e.company}</div><p style="margin: 0; color: #555; font-size: 0.9em;">${e.description}</p></div>`).join('')}</div>` : ''}
            ${data.education.length ? `<div><h3 style="color: #A855F7; font-size: 0.9em; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 1rem; text-align: center;">Education</h3><div style="text-align: center;">${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><strong>${e.degree}</strong> — ${e.institution}</div>`).join('')}</div></div>` : ''}
        </div>
    `;
}

// HEALTHCARE Template - Medical professional style
function getHealthcareTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-healthcare">
            <div style="display: grid; grid-template-columns: 160px 1fr;">
                <div style="background: linear-gradient(180deg, #14B8A6 0%, #0D9488 100%); color: white; padding: 1.5rem 1rem; margin: -2rem 0 -2rem -2rem;">
                    <div style="width: 70px; height: 70px; background: white; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 2em;">⚕️</span>
                    </div>
                    <div style="font-size: 0.8em; margin-bottom: 1rem;">
                        ${data.email ? `<div style="margin: 0.5rem 0;">📧 ${data.email}</div>` : ''}
                        ${data.phone ? `<div style="margin: 0.5rem 0;">📱 ${data.phone}</div>` : ''}
                        ${data.location ? `<div style="margin: 0.5rem 0;">📍 ${data.location}</div>` : ''}
                    </div>
                    ${skillsArr.length ? `<div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 1rem;"><h4 style="margin: 0 0 0.5rem; font-size: 0.8em; text-transform: uppercase;">Clinical Skills</h4>${skillsArr.slice(0, 6).map(s => `<div style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 4px; margin: 0.25rem 0; font-size: 0.75em;">${s}</div>`).join('')}</div>` : ''}
                </div>
                <div style="padding: 0 1rem;">
                    <h1 style="font-size: 1.8em; margin: 0 0 0.25rem; color: #0D9488;">${data.fullName || 'Your Name'}</h1>
                    <div style="color: #14B8A6; font-size: 1.1em; font-weight: 500; margin-bottom: 1rem;">${data.jobTitle || 'Healthcare Professional'}</div>
                    ${data.summary ? `<div style="margin-bottom: 1rem; padding: 0.75rem; background: #F0FDFA; border-radius: 8px; border-left: 4px solid #14B8A6;"><p style="margin: 0; color: #0D9488; font-size: 0.9em; line-height: 1.6;">${data.summary}</p></div>` : ''}
                    ${data.experience.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #0D9488; font-size: 1em; margin-bottom: 0.5rem; border-bottom: 2px solid #14B8A6; padding-bottom: 0.25rem;">Clinical Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 0.75rem;"><div style="display: flex; justify-content: space-between;"><strong style="font-size: 0.95em;">${e.title}</strong><span style="color: #14B8A6; font-size: 0.85em;">${e.startDate} - ${e.endDate}</span></div><div style="color: #666; font-size: 0.9em;">${e.company}</div><p style="margin: 0.25rem 0; font-size: 0.85em; color: #555;">${e.description}</p></div>`).join('')}</div>` : ''}
                    ${data.education.length ? `<div><h3 style="color: #0D9488; font-size: 1em; margin-bottom: 0.5rem; border-bottom: 2px solid #14B8A6; padding-bottom: 0.25rem;">Education & Certifications</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><strong style="font-size: 0.9em;">${e.degree}</strong><div style="color: #666; font-size: 0.85em;">${e.institution} | ${e.year}</div></div>`).join('')}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// SALES Template - Results-driven business style
function getSalesTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    return `
        <div class="tpl-sales">
            <div style="background: linear-gradient(90deg, #F59E0B 0%, #D97706 100%); color: white; padding: 1.5rem 2rem; margin: -2rem -2rem 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1 style="font-size: 2em; margin: 0; font-weight: 700;">${data.fullName || 'Your Name'}</h1>
                        <div style="font-size: 1.2em; opacity: 0.95; margin-top: 0.25rem;">${data.jobTitle || 'Sales Professional'}</div>
                    </div>
                    <div style="text-align: right; font-size: 0.85em; opacity: 0.9;">
                        ${data.email ? `<div>${data.email}</div>` : ''}
                        ${data.phone ? `<div>${data.phone}</div>` : ''}
                        ${data.location ? `<div>${data.location}</div>` : ''}
                    </div>
                </div>
            </div>
            <div style="background: #1F2937; color: white; padding: 0.75rem 2rem; margin: -1.5rem -2rem 1.5rem; display: flex; gap: 2rem; justify-content: center;">
                <div style="text-align: center;"><div style="font-size: 1.5em; font-weight: bold; color: #F59E0B;">150%</div><div style="font-size: 0.75em; opacity: 0.8;">Quota Achievement</div></div>
                <div style="text-align: center;"><div style="font-size: 1.5em; font-weight: bold; color: #F59E0B;">$2M+</div><div style="font-size: 0.75em; opacity: 0.8;">Revenue Generated</div></div>
                <div style="text-align: center;"><div style="font-size: 1.5em; font-weight: bold; color: #F59E0B;">Top 5%</div><div style="font-size: 0.75em; opacity: 0.8;">Performance Rank</div></div>
            </div>
            ${data.summary ? `<div style="margin-bottom: 1.5rem;"><h3 style="color: #D97706; font-size: 1em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Professional Summary</h3><p style="line-height: 1.6; color: #374151;">${data.summary}</p></div>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1.5rem;"><h3 style="color: #D97706; font-size: 1em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem;">Sales Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 1rem; padding-left: 1rem; border-left: 3px solid #F59E0B;"><div style="display: flex; justify-content: space-between;"><strong>${e.title}</strong><span style="color: #F59E0B; font-weight: 500;">${e.startDate} - ${e.endDate}</span></div><div style="color: #6B7280;">${e.company}</div><p style="margin: 0.25rem 0; color: #374151; font-size: 0.95em;">${e.description}</p></div>`).join('')}</div>` : ''}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                ${skillsArr.length ? `<div><h3 style="color: #D97706; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Core Competencies</h3><div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${skillsArr.map(s => `<span style="background: #FEF3C7; color: #92400E; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8em;">${s}</span>`).join('')}</div></div>` : ''}
                ${data.education.length ? `<div><h3 style="color: #D97706; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Education</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><strong style="font-size: 0.9em;">${e.degree}</strong><div style="color: #6B7280; font-size: 0.85em;">${e.institution}</div></div>`).join('')}</div>` : ''}
            </div>
        </div>
    `;
}

// Save to localStorage
function saveToLocalStorage() {
    const data = collectData();
    localStorage.setItem('resumeBuilderData', JSON.stringify(data));
    showToast('Resume saved successfully!');
}

// Load from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('resumeBuilderData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            document.getElementById('fullName').value = data.fullName || '';
            document.getElementById('jobTitle').value = data.jobTitle || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('location').value = data.location || '';
            document.getElementById('linkedin').value = data.linkedin || '';
            document.getElementById('website').value = data.website || '';
            document.getElementById('summaryText').value = data.summary || '';
            document.getElementById('skillsText').value = data.skills || '';
            document.getElementById('languagesText').value = data.languages || '';
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Download PDF
async function downloadPDF() {
    const resume = document.getElementById('resumePreview');
    const data = collectData();
    const fileName = (data.fullName || 'resume').replace(/\s+/g, '_') + '_resume.pdf';

    try {
        showToast('Generating PDF...');

        const canvas = await html2canvas(resume, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(fileName);

        showToast('PDF downloaded successfully!');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Error generating PDF. Please try again.');
    }
}

// Toast notification
function showToast(message) {
    const existing = document.querySelector('.rb-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'rb-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        animation: slideUp 0.3s ease;
        box-shadow: 0 10px 30px rgba(16,185,129,0.4);
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ==================== PHOTO HANDLING ====================

// Handle photo upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        openCropModal(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Open crop modal
function openCropModal(imageSrc) {
    const modal = document.getElementById('cropModal');
    const image = document.getElementById('cropImage');

    modal.classList.add('active');
    image.src = imageSrc;

    // Initialize Cropper
    if (cropper) cropper.destroy();

    setTimeout(() => {
        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false
        });
        setCropShape(cropShape);
    }, 100);
}

// Set crop shape (circle or square)
function setCropShape(shape) {
    cropShape = shape;

    // Update buttons
    document.querySelectorAll('.crop-shape-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shape === shape);
    });

    // Update cropper view
    const cropperViewBox = document.querySelector('.cropper-view-box');
    const cropperFace = document.querySelector('.cropper-face');

    if (shape === 'circle') {
        cropperViewBox?.style.setProperty('border-radius', '50%');
        cropperFace?.style.setProperty('border-radius', '50%');
    } else {
        cropperViewBox?.style.setProperty('border-radius', '0');
        cropperFace?.style.setProperty('border-radius', '0');
    }
}

// Close crop modal
function closeCropModal() {
    const modal = document.getElementById('cropModal');
    modal.classList.remove('active');

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    document.getElementById('photoInput').value = '';
}

// Confirm crop
function confirmCrop() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    // If circular, apply circular mask
    if (cropShape === 'circle') {
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(200, 200, 200, 0, Math.PI * 2);
        ctx.fill();
    }

    currentPhoto = canvas.toDataURL('image/png');

    // Update preview
    const photoPreview = document.getElementById('photoPreview');
    photoPreview.innerHTML = `<img src="${currentPhoto}" alt="Profile photo">`;
    photoPreview.style.borderRadius = cropShape === 'circle' ? '50%' : '8px';

    document.getElementById('removePhotoBtn').style.display = 'flex';

    closeCropModal();
    updatePreview();
    showToast('Photo added successfully!');
}

// Remove photo
function removePhoto() {
    currentPhoto = null;

    const photoPreview = document.getElementById('photoPreview');
    photoPreview.innerHTML = '<i class="fas fa-user"></i>';
    photoPreview.style.borderRadius = '50%';

    document.getElementById('removePhotoBtn').style.display = 'none';
    document.getElementById('photoInput').value = '';

    updatePreview();
    showToast('Photo removed');
}

// ==================== PHOTO TEMPLATES ====================
// These templates match industry-standard resume designs with photo

// PHOTO SIDEBAR Template - Dark sidebar with circular photo (like Max Johnson)
function getPhotoSidebarTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    const photoHTML = data.photo
        ? `<img src="${data.photo}" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; object-fit: cover;">`
        : `<div style="width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 3em; color: rgba(255,255,255,0.5);">👤</div>`;

    return `
        <div class="tpl-photo-sidebar" style="display: grid; grid-template-columns: 180px 1fr; gap: 0; min-height: 100%;">
            <div style="background: linear-gradient(180deg, #0F766E 0%, #115E59 100%); color: white; padding: 1.5rem 1rem; margin: -2rem 0 -2rem -2rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    ${photoHTML}
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 0.8em; text-transform: uppercase; opacity: 0.8; margin: 0 0 0.5rem;">Contact</h4>
                    ${data.location ? `<div style="font-size: 0.75em; margin: 0.4rem 0;"><i class="fas fa-map-marker-alt" style="width: 16px;"></i> ${data.location}</div>` : ''}
                    ${data.phone ? `<div style="font-size: 0.75em; margin: 0.4rem 0;"><i class="fas fa-phone" style="width: 16px;"></i> ${data.phone}</div>` : ''}
                    ${data.email ? `<div style="font-size: 0.75em; margin: 0.4rem 0;"><i class="fas fa-envelope" style="width: 16px;"></i> ${data.email}</div>` : ''}
                </div>
                ${skillsArr.length ? `<div style="margin-bottom: 1.5rem;"><h4 style="font-size: 0.8em; text-transform: uppercase; opacity: 0.8; margin: 0 0 0.5rem;">Skills</h4>${skillsArr.slice(0, 8).map(s => `<div style="font-size: 0.75em; margin: 0.3rem 0; padding: 0.2rem 0.5rem; background: rgba(255,255,255,0.15); border-radius: 4px;">• ${s}</div>`).join('')}</div>` : ''}
                ${data.languages ? `<div><h4 style="font-size: 0.8em; text-transform: uppercase; opacity: 0.8; margin: 0 0 0.5rem;">Languages</h4><div style="font-size: 0.75em;">${data.languages}</div></div>` : ''}
            </div>
            <div style="padding: 0 1rem;">
                <h1 style="font-size: 1.8em; color: #0F766E; margin: 0; text-transform: uppercase; letter-spacing: 1px;">${data.fullName || 'Your Name'}</h1>
                <div style="color: #6B7280; font-size: 1.1em; margin-bottom: 1rem;">${data.jobTitle || 'Professional Title'}</div>
                ${data.summary ? `<div style="margin-bottom: 1rem;"><h3 style="color: #0F766E; font-size: 1em; margin-bottom: 0.5rem;">Profile</h3><p style="color: #4B5563; line-height: 1.6; font-size: 0.9em;">${data.summary}</p></div>` : ''}
                ${data.experience.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #0F766E; font-size: 1em; margin-bottom: 0.5rem;">Work Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 0.75rem;"><div style="display: flex; justify-content: space-between;"><strong style="font-size: 0.95em;">${e.title}</strong><span style="color: #0F766E; font-size: 0.8em;">${e.startDate} - ${e.endDate}</span></div><div style="color: #6B7280; font-size: 0.85em;">${e.company}</div><p style="margin: 0.25rem 0; font-size: 0.85em; color: #4B5563;">${e.description}</p></div>`).join('')}</div>` : ''}
                ${data.education.length ? `<div><h3 style="color: #0F766E; font-size: 1em; margin-bottom: 0.5rem;">Education</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><strong style="font-size: 0.9em;">${e.degree}</strong><div style="color: #6B7280; font-size: 0.85em;">${e.institution} | ${e.year}</div></div>`).join('')}</div>` : ''}
            </div>
        </div>
    `;
}

// PHOTO TIMELINE Template - Clean layout with square photo and timeline (like Devika Parmar)
function getPhotoTimelineTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    const photoHTML = data.photo
        ? `<img src="${data.photo}" style="width: 100px; height: 100px; border-radius: 8px; object-fit: cover;">`
        : '';

    return `
        <div class="tpl-photo-timeline">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 3px solid #2563EB;">
                <div style="flex: 1;">
                    <h1 style="font-size: 1.8em; color: #2563EB; margin: 0;">${data.fullName || 'Your Name'}</h1>
                    <div style="color: #6B7280; font-size: 1em; margin: 0.25rem 0;">${data.jobTitle || 'Professional Title'}</div>
                    <div style="font-size: 0.8em; color: #6B7280; display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem;">
                        ${data.email ? `<span>${data.email}</span>` : ''}
                        ${data.phone ? `<span>${data.phone}</span>` : ''}
                        ${data.location ? `<span>${data.location}</span>` : ''}
                    </div>
                </div>
                ${photoHTML}
            </div>
            ${data.summary ? `<p style="color: #4B5563; line-height: 1.6; font-size: 0.9em; margin-bottom: 1rem;">${data.summary}</p>` : ''}
            ${data.experience.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #2563EB; font-size: 1em; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;"><span style="width: 24px; height: 24px; background: #2563EB; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7em;">💼</span> Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 0.75rem; padding-left: 1.5rem; border-left: 2px solid #DBEAFE; position: relative;"><div style="position: absolute; left: -5px; top: 0; width: 8px; height: 8px; background: #2563EB; border-radius: 50%;"></div><div style="display: flex; justify-content: space-between;"><strong style="font-size: 0.95em;">${e.title}</strong><span style="color: #2563EB; font-size: 0.8em;">${e.startDate} - ${e.endDate}</span></div><div style="color: #6B7280; font-size: 0.85em;">${e.company}</div><p style="margin: 0.25rem 0; font-size: 0.85em; color: #4B5563;">${e.description}</p></div>`).join('')}</div>` : ''}
            ${data.education.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #2563EB; font-size: 1em; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;"><span style="width: 24px; height: 24px; background: #2563EB; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7em;">🎓</span> Education</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><strong style="font-size: 0.9em;">${e.degree}</strong><div style="color: #6B7280; font-size: 0.85em;">${e.institution}, ${e.year}</div></div>`).join('')}</div>` : ''}
            ${skillsArr.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #2563EB; font-size: 1em; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;"><span style="width: 24px; height: 24px; background: #2563EB; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7em;">⚡</span> Technical Skills</h3><div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${skillsArr.map(s => `<span style="background: #DBEAFE; color: #1E40AF; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8em;">${s}</span>`).join('')}</div></div>` : ''}
        </div>
    `;
}

// PHOTO CREATIVE Template - Purple gradient sidebar (like Wade Calhoun)
function getPhotoCreativeTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    const photoHTML = data.photo
        ? `<img src="${data.photo}" style="width: 100px; height: 100px; border-radius: 12px; border: 3px solid white; object-fit: cover;">`
        : `<div style="width: 100px; height: 100px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 2.5em; color: rgba(255,255,255,0.6); border: 3px solid white;">👤</div>`;

    return `
        <div class="tpl-photo-creative" style="display: grid; grid-template-columns: 160px 1fr; gap: 0; min-height: 100%;">
            <div style="background: linear-gradient(180deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%); color: white; padding: 1.5rem 0.75rem; margin: -2rem 0 -2rem -2rem;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    ${photoHTML}
                    <h2 style="font-size: 1em; margin: 0.75rem 0 0.25rem;">${data.fullName || 'Your Name'}</h2>
                    <div style="font-size: 0.75em; opacity: 0.9;">${data.jobTitle || 'Professional Title'}</div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <h4 style="font-size: 0.7em; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin: 0 0 0.5rem; padding-left: 0.5rem;">Contact</h4>
                    ${data.phone ? `<div style="font-size: 0.7em; margin: 0.3rem 0; padding: 0.25rem 0.5rem;"><span style="opacity: 0.7;">📱</span> ${data.phone}</div>` : ''}
                    ${data.email ? `<div style="font-size: 0.7em; margin: 0.3rem 0; padding: 0.25rem 0.5rem; word-break: break-all;"><span style="opacity: 0.7;">✉</span> ${data.email}</div>` : ''}
                    ${data.location ? `<div style="font-size: 0.7em; margin: 0.3rem 0; padding: 0.25rem 0.5rem;"><span style="opacity: 0.7;">📍</span> ${data.location}</div>` : ''}
                </div>
                ${data.education.length ? `<div style="margin-bottom: 1rem;"><h4 style="font-size: 0.7em; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin: 0 0 0.5rem; padding-left: 0.5rem;">Education</h4>${data.education.map(e => `<div style="font-size: 0.7em; margin: 0.3rem 0; padding: 0.25rem 0.5rem;"><strong>${e.degree}</strong><div style="opacity: 0.8;">${e.institution}</div></div>`).join('')}</div>` : ''}
                ${data.linkedin ? `<div><h4 style="font-size: 0.7em; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin: 0 0 0.5rem; padding-left: 0.5rem;">Links</h4><div style="font-size: 0.65em; padding: 0.25rem 0.5rem; word-break: break-all;">${data.linkedin}</div></div>` : ''}
            </div>
            <div style="padding: 0 1rem; background: #FAF5FF;">
                ${data.summary ? `<div style="margin-bottom: 1rem;"><h3 style="color: #7C3AED; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Professional Summary</h3><p style="color: #4B5563; line-height: 1.6; font-size: 0.85em;">${data.summary}</p></div>` : ''}
                ${data.experience.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #7C3AED; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Experience</h3>${data.experience.map(e => `<div style="margin-bottom: 0.75rem; padding: 0.75rem; background: white; border-radius: 8px; border-left: 3px solid #7C3AED;"><div style="display: flex; justify-content: space-between;"><strong style="font-size: 0.9em; color: #7C3AED;">${e.title}</strong><span style="color: #6B7280; font-size: 0.75em;">${e.startDate} - ${e.endDate}</span></div><div style="color: #6B7280; font-size: 0.8em;">${e.company}</div><p style="margin: 0.25rem 0 0; font-size: 0.8em; color: #4B5563;">${e.description}</p></div>`).join('')}</div>` : ''}
                ${skillsArr.length ? `<div><h3 style="color: #7C3AED; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Skills</h3><div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">${skillsArr.map(s => `<span style="background: #7C3AED; color: white; padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.75em;">${s}</span>`).join('')}</div></div>` : ''}
            </div>
        </div>
    `;
}

// PHOTO PROFESSIONAL Template - Two-column with skill bars (like Frank Shelby)
function getPhotoProfessionalTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    const photoHTML = data.photo
        ? `<img src="${data.photo}" style="width: 90px; height: 90px; border-radius: 8px; object-fit: cover;">`
        : `<div style="width: 90px; height: 90px; border-radius: 8px; background: #E5E7EB; display: flex; align-items: center; justify-content: center; font-size: 2em; color: #9CA3AF;">👤</div>`;

    return `
        <div class="tpl-photo-professional" style="display: grid; grid-template-columns: 180px 1fr; gap: 0; min-height: 100%;">
            <div style="background: #F3F4F6; padding: 1.5rem 1rem; margin: -2rem 0 -2rem -2rem; border-right: 3px solid #3B82F6;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    ${photoHTML}
                    <h2 style="font-size: 1.1em; color: #1F2937; margin: 0.75rem 0 0.25rem;">${data.fullName || 'Your Name'}</h2>
                    <div style="font-size: 0.8em; color: #3B82F6; font-weight: 500;">${data.jobTitle || 'Professional Title'}</div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <h4 style="font-size: 0.8em; color: #3B82F6; text-transform: uppercase; margin: 0 0 0.5rem;">Personal Info</h4>
                    ${data.email ? `<div style="font-size: 0.75em; margin: 0.3rem 0; color: #4B5563;"><strong>Email</strong><div>${data.email}</div></div>` : ''}
                    ${data.phone ? `<div style="font-size: 0.75em; margin: 0.3rem 0; color: #4B5563;"><strong>Phone</strong><div>${data.phone}</div></div>` : ''}
                    ${data.linkedin ? `<div style="font-size: 0.75em; margin: 0.3rem 0; color: #4B5563;"><strong>LinkedIn</strong><div style="word-break: break-all;">${data.linkedin}</div></div>` : ''}
                </div>
                ${skillsArr.length ? `<div style="margin-bottom: 1rem;"><h4 style="font-size: 0.8em; color: #3B82F6; text-transform: uppercase; margin: 0 0 0.5rem;">Skills</h4>${skillsArr.slice(0, 6).map((s, i) => `<div style="margin: 0.4rem 0;"><div style="font-size: 0.75em; color: #4B5563; margin-bottom: 0.2rem;">${s}</div><div style="height: 6px; background: #E5E7EB; border-radius: 3px;"><div style="height: 100%; background: linear-gradient(90deg, #3B82F6, #60A5FA); border-radius: 3px; width: ${90 - i * 10}%;"></div></div></div>`).join('')}</div>` : ''}
                ${data.languages ? `<div><h4 style="font-size: 0.8em; color: #3B82F6; text-transform: uppercase; margin: 0 0 0.5rem;">Languages</h4><div style="font-size: 0.75em; color: #4B5563;">${data.languages}</div></div>` : ''}
            </div>
            <div style="padding: 0 1rem;">
                ${data.experience.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #1F2937; font-size: 1em; border-bottom: 2px solid #3B82F6; padding-bottom: 0.25rem; margin-bottom: 0.75rem;">Work History</h3>${data.experience.map(e => `<div style="margin-bottom: 0.75rem;"><div style="display: flex; justify-content: space-between; align-items: baseline;"><strong style="font-size: 0.95em;">${e.title}</strong><span style="color: #3B82F6; font-size: 0.8em; font-weight: 500;">${e.startDate} - ${e.endDate}</span></div><div style="color: #3B82F6; font-size: 0.85em; font-weight: 500;">${e.company}</div><ul style="margin: 0.25rem 0 0; padding-left: 1.25rem; font-size: 0.85em; color: #4B5563;"><li>${e.description}</li></ul></div>`).join('')}</div>` : ''}
                ${data.education.length ? `<div style="margin-bottom: 1rem;"><h3 style="color: #1F2937; font-size: 1em; border-bottom: 2px solid #3B82F6; padding-bottom: 0.25rem; margin-bottom: 0.75rem;">Education</h3>${data.education.map(e => `<div style="margin-bottom: 0.5rem;"><div style="display: flex; justify-content: space-between;"><strong style="font-size: 0.9em;">${e.degree}</strong><span style="color: #3B82F6; font-size: 0.8em;">${e.year}</span></div><div style="color: #6B7280; font-size: 0.85em;">${e.institution}</div></div>`).join('')}</div>` : ''}
                ${data.projects.length ? `<div><h3 style="color: #1F2937; font-size: 1em; border-bottom: 2px solid #3B82F6; padding-bottom: 0.25rem; margin-bottom: 0.75rem;">Projects</h3>${data.projects.map(p => `<div style="margin-bottom: 0.5rem;"><strong style="font-size: 0.9em;">${p.name}</strong> <span style="color: #3B82F6; font-size: 0.8em;">(${p.tech})</span><p style="margin: 0.25rem 0; font-size: 0.85em; color: #4B5563;">${p.description}</p></div>`).join('')}</div>` : ''}
            </div>
        </div>
    `;
}

// ==================== CORPORATE TEMPLATES ====================

// MBA / FINANCE Template - Conservative, serif, education focused
function getMbaTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

    return `
        <div class="tpl-mba" style="font-family: 'Times New Roman', serif; color: #000;">
            <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <h1 style="font-size: 2.2em; text-transform: uppercase; margin: 0; letter-spacing: 1px;">${data.fullName || 'YOUR NAME'}</h1>
                <div style="font-size: 1em; margin-top: 0.5rem;">
                    ${[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(' | ')}
                </div>
            </div>

            ${data.education.length ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1em; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 0.75rem; padding-bottom: 2px;">Education</h3>
                ${data.education.map(e => `
                    <div style="margin-bottom: 0.75rem; display: flex; justify-content: space-between;">
                        <div>
                            <strong style="font-size: 1.1em;">${e.institution}</strong>
                            <div style="font-style: italic;">${e.degree}</div>
                        </div>
                        <div style="text-align: right;">
                            <div>${e.year}</div>
                            ${e.location ? `<div style="font-style: italic;">${e.location}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>` : ''}

            ${data.experience.length ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1em; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 0.75rem; padding-bottom: 2px;">Professional Experience</h3>
                ${data.experience.map(e => `
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                            <strong style="font-size: 1.1em;">${e.company}</strong>
                            <span>${e.startDate} – ${e.endDate}</span>
                        </div>
                        <div style="font-style: italic; margin-bottom: 0.25rem;">${e.title}</div>
                        <p style="margin: 0; font-size: 0.95em; line-height: 1.5;">${e.description}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            ${skillsArr.length ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1em; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 0.75rem; padding-bottom: 2px;">Additional Information</h3>
                <div style="font-size: 0.95em;">
                    <strong>Technical Skills:</strong> ${skillsArr.join(', ')}
                </div>
                ${data.languages ? `<div style="font-size: 0.95em; margin-top: 0.25rem;"><strong>Languages:</strong> ${data.languages}</div>` : ''}
            </div>` : ''}
        </div>
    `;
}

// CONSULTANT Template (Deloitte Style) - Structured, blue/green accents, competency based
function getConsultantTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

    return `
        <div class="tpl-consultant" style="font-family: 'Arial', sans-serif; color: #333;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 4px solid #86EFAC; margin-bottom: 2rem; padding-bottom: 1rem;">
                <div>
                    <h1 style="font-size: 2.5em; color: #064E3B; margin: 0; line-height: 1;">${data.fullName || 'Your Name'}</h1>
                    <div style="font-size: 1.2em; color: #059669; margin-top: 0.5rem; letter-spacing: 0.5px;">${data.jobTitle || 'Management Consultant'}</div>
                </div>
                <div style="text-align: right; font-size: 0.85em; color: #555;">
                    <div>${data.email}</div>
                    <div>${data.phone}</div>
                    <div>${data.location}</div>
                </div>
            </div>

            ${data.summary ? `
            <div style="margin-bottom: 1.5rem; background: #F0FDF4; padding: 1rem; border-left: 4px solid #059669;">
                <h3 style="font-size: 0.9em; text-transform: uppercase; color: #064E3B; margin: 0 0 0.5rem;">Executive Summary</h3>
                <p style="margin: 0; font-size: 0.9em; line-height: 1.6;">${data.summary}</p>
            </div>` : ''}

            ${data.experience.length ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.1em; color: #064E3B; border-bottom: 1px solid #D1D5DB; padding-bottom: 0.5rem; margin-bottom: 1rem;">Professional Experience</h3>
                ${data.experience.map(e => `
                    <div style="margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; color: #064E3B; margin-bottom: 0.25rem;">
                            <strong style="font-size: 1.1em;">${e.company}</strong>
                            <span style="font-weight: bold;">${e.startDate} - ${e.endDate}</span>
                        </div>
                        <div style="color: #059669; font-weight: 500; margin-bottom: 0.5rem;">${e.title}</div>
                        <p style="margin: 0; font-size: 0.95em; line-height: 1.5; color: #444;">${e.description}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                ${data.education.length ? `
                <div>
                    <h3 style="font-size: 1.1em; color: #064E3B; border-bottom: 1px solid #D1D5DB; padding-bottom: 0.5rem; margin-bottom: 1rem;">Education</h3>
                    ${data.education.map(e => `
                        <div style="margin-bottom: 1rem;">
                            <strong style="display: block; color: #1F2937;">${e.institution}</strong>
                            <div>${e.degree}</div>
                            <div style="font-size: 0.9em; color: #6B7280;">${e.year}</div>
                        </div>
                    `).join('')}
                </div>` : ''}
                
                ${skillsArr.length ? `
                <div>
                    <h3 style="font-size: 1.1em; color: #064E3B; border-bottom: 1px solid #D1D5DB; padding-bottom: 0.5rem; margin-bottom: 1rem;">Competencies</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${skillsArr.map(s => `
                            <span style="background: #DCFCE7; color: #166534; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85em; border: 1px solid #86EFAC;">${s}</span>
                        `).join('')}
                    </div>
                </div>` : ''}
            </div>
        </div>
    `;
}

// EXECUTIVE Template (KPMG Style) - Clean blue lines, airy, professional
function getExecutiveTemplateCorp(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

    return `
        <div class="tpl-executive-corp" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e3a8a;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3B82F6; padding-bottom: 1.5rem; margin-bottom: 2rem;">
                <div>
                    <h1 style="font-size: 2.8em; margin: 0; font-weight: 700; letter-spacing: -1px;">${data.fullName || 'Your Name'}</h1>
                    <div style="font-size: 1.4em; color: #60A5FA; font-weight: 300; margin-top: 0.25rem;">${data.jobTitle || 'Executive Director'}</div>
                </div>
                <div style="font-size: 2.5em; font-weight: 900; color: #DBEAFE; letter-spacing: -2px;">
                    ${(data.fullName || 'YN').split(' ').map(n => n[0]).join('')}
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
                <div>
                    ${data.summary ? `
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 0.9em; text-transform: uppercase; letter-spacing: 2px; color: #93C5FD; margin-bottom: 1rem;">Profile</h3>
                        <p style="margin: 0; color: #334155; line-height: 1.7; font-size: 1em;">${data.summary}</p>
                    </div>` : ''}

                    ${data.experience.length ? `
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 0.9em; text-transform: uppercase; letter-spacing: 2px; color: #93C5FD; margin-bottom: 1.5rem;">Experience</h3>
                        ${data.experience.map(e => `
                            <div style="margin-bottom: 2rem; position: relative; padding-left: 1.5rem; border-left: 2px solid #E2E8F0;">
                                <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; background: #3B82F6; border-radius: 50%;"></div>
                                <div style="margin-bottom: 0.25rem;">
                                    <strong style="color: #1e3a8a; font-size: 1.1em;">${e.title}</strong>
                                </div>
                                <div style="color: #64748B; font-size: 0.9em; margin-bottom: 0.75rem;">
                                    ${e.company} | ${e.startDate} - ${e.endDate}
                                </div>
                                <p style="margin: 0; color: #475569; line-height: 1.6; font-size: 0.95em;">${e.description}</p>
                            </div>
                        `).join('')}
                    </div>` : ''}
                </div>

                <div>
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 0.9em; text-transform: uppercase; letter-spacing: 2px; color: #93C5FD; margin-bottom: 1rem;">Contact</h3>
                        <div style="font-size: 0.9em; color: #334155; line-height: 2;">
                            ${data.email ? `<div><span style="color: #3B82F6;">✉</span> ${data.email}</div>` : ''}
                            ${data.phone ? `<div><span style="color: #3B82F6;">📞</span> ${data.phone}</div>` : ''}
                            ${data.location ? `<div><span style="color: #3B82F6;">📍</span> ${data.location}</div>` : ''}
                        </div>
                    </div>

                    ${data.education.length ? `
                    <div style="margin-bottom: 2rem;">
                        <h3 style="font-size: 0.9em; text-transform: uppercase; letter-spacing: 2px; color: #93C5FD; margin-bottom: 1rem;">Education</h3>
                        ${data.education.map(e => `
                            <div style="margin-bottom: 1rem;">
                                <strong style="color: #1e3a8a;">${e.degree}</strong>
                                <div style="color: #64748B; font-size: 0.9em;">${e.institution}</div>
                                <div style="color: #94A3B8; font-size: 0.85em;">${e.year}</div>
                            </div>
                        `).join('')}
                    </div>` : ''}

                    ${skillsArr.length ? `
                    <div>
                        <h3 style="font-size: 0.9em; text-transform: uppercase; letter-spacing: 2px; color: #93C5FD; margin-bottom: 1rem;">Expertise</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${skillsArr.map(s => `
                                <li style="margin-bottom: 0.5rem; color: #334155; font-size: 0.95em; border-bottom: 1px solid #F1F5F9; padding-bottom: 0.25rem;">${s}</li>
                            `).join('')}
                        </ul>
                    </div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// IVY LEAGUE Template (Harvard Style) - Strict black & white, dense, compact
function getIvyTemplate(data) {
    const skillsArr = data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

    return `
        <div class="tpl-ivy" style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.4;">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <h1 style="font-size: 1.8em; margin: 0; text-transform: uppercase; letter-spacing: 1px;">${data.fullName || 'Your Name'}</h1>
                <div style="font-size: 1em; margin-top: 0.25rem;">
                    ${[data.location, data.phone, data.email, data.linkedin].filter(Boolean).join(' • ')}
                </div>
            </div>

            ${data.education.length ? `
            <div style="margin-bottom: 1rem;">
                <h3 style="font-size: 1em; text-transform: uppercase; border-bottom: 1px solid #000; margin: 0 0 0.5rem 0; padding-bottom: 0.1rem;">Education</h3>
                ${data.education.map(e => `
                    <div style="margin-bottom: 0.5rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${e.institution}</strong>
                            <span>${e.year}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>${e.degree}</span>
                            <span>${e.location || ''}</span>
                        </div>
                    </div>
                `).join('')}
            </div>` : ''}

            ${data.experience.length ? `
            <div style="margin-bottom: 1rem;">
                <h3 style="font-size: 1em; text-transform: uppercase; border-bottom: 1px solid #000; margin: 0 0 0.5rem 0; padding-bottom: 0.1rem;">Experience</h3>
                ${data.experience.map(e => `
                    <div style="margin-bottom: 0.75rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${e.company}</strong>
                            <span>${e.startDate} – ${e.endDate}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-style: italic; margin-bottom: 0.2rem;">
                            <span>${e.title}</span>
                            <span>${e.location || ''}</span>
                        </div>
                        <p style="margin: 0; font-size: 1em; text-align: justify;">${e.description}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            ${data.projects.length ? `
            <div style="margin-bottom: 1rem;">
                <h3 style="font-size: 1em; text-transform: uppercase; border-bottom: 1px solid #000; margin: 0 0 0.5rem 0; padding-bottom: 0.1rem;">Leadership & Projects</h3>
                ${data.projects.map(p => `
                    <div style="margin-bottom: 0.5rem;">
                        <strong>${p.name}</strong>: ${p.description}
                    </div>
                `).join('')}
            </div>` : ''}

            ${skillsArr.length ? `
            <div>
                <h3 style="font-size: 1em; text-transform: uppercase; border-bottom: 1px solid #000; margin: 0 0 0.5rem 0; padding-bottom: 0.1rem;">Skills & Interests</h3>
                <div style="margin: 0;">
                    <strong>Technical:</strong> ${skillsArr.join(', ')}
                </div>
                ${data.languages ? `<div style="margin-top: 0.2rem;"><strong>Languages:</strong> ${data.languages}</div>` : ''}
            </div>` : ''}
        </div>
    `;
}
