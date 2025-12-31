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
function changeColorTheme() {
    currentColor = document.getElementById('colorTheme').value;
    updatePreview();
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
        fullName: document.getElementById('fullName')?.value || '',
        jobTitle: document.getElementById('jobTitle')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        location: document.getElementById('location')?.value || '',
        linkedin: document.getElementById('linkedin')?.value || '',
        website: document.getElementById('website')?.value || '',
        summary: document.getElementById('summaryText')?.value || '',
        skills: document.getElementById('skillsText')?.value || '',
        languages: document.getElementById('languagesText')?.value || '',
        experience: [],
        education: [],
        projects: [],
        certifications: []
    };

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
                issuer: inputs[1]?.value || '',
                date: inputs[2]?.value || ''
            });
        }
    });

    return data;
}

// Update preview
function updatePreview() {
    const data = collectData();
    const preview = document.getElementById('resumePreview');
    preview.setAttribute('data-color', currentColor);
    preview.setAttribute('data-template', currentTemplate);

    // Get template-specific HTML
    const html = getTemplateHTML(currentTemplate, data);
    preview.innerHTML = html;
}

// Template generators
function getTemplateHTML(template, data) {
    switch (template) {
        case 'modern': return getModernTemplate(data);
        case 'classic': return getClassicTemplate(data);
        case 'creative': return getCreativeTemplate(data);
        case 'minimal': return getMinimalTemplate(data);
        case 'executive': return getExecutiveTemplate(data);
        case 'tech': return getTechTemplate(data);
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
