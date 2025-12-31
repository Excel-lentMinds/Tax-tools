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

    let html = `
        <div class="resume-header">
            <div class="resume-name">${data.fullName || 'Your Name'}</div>
            <div class="resume-title">${data.jobTitle || 'Professional Title'}</div>
            <div class="resume-contact">
                ${data.email ? `<span><i class="fas fa-envelope"></i> ${data.email}</span>` : ''}
                ${data.phone ? `<span><i class="fas fa-phone"></i> ${data.phone}</span>` : ''}
                ${data.location ? `<span><i class="fas fa-map-marker-alt"></i> ${data.location}</span>` : ''}
                ${data.linkedin ? `<span><i class="fab fa-linkedin"></i> ${data.linkedin}</span>` : ''}
                ${data.website ? `<span><i class="fas fa-globe"></i> ${data.website}</span>` : ''}
            </div>
        </div>
    `;

    // Summary
    if (data.summary) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Professional Summary</div>
                <p>${data.summary}</p>
            </div>
        `;
    }

    // Experience
    if (data.experience.length > 0) {
        html += `<div class="resume-section"><div class="resume-section-title">Work Experience</div>`;
        data.experience.forEach(exp => {
            html += `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <span class="resume-entry-title">${exp.title}</span>
                        <span class="resume-entry-date">${exp.startDate}${exp.endDate ? ' - ' + exp.endDate : ''}</span>
                    </div>
                    <div class="resume-entry-subtitle">${exp.company}</div>
                    ${exp.description ? `<div class="resume-entry-desc">${exp.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    // Education
    if (data.education.length > 0) {
        html += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
        data.education.forEach(edu => {
            html += `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <span class="resume-entry-title">${edu.degree}</span>
                        <span class="resume-entry-date">${edu.year}</span>
                    </div>
                    <div class="resume-entry-subtitle">${edu.institution}${edu.gpa ? ' | ' + edu.gpa : ''}</div>
                </div>
            `;
        });
        html += `</div>`;
    }

    // Skills
    if (data.skills) {
        const skillsArr = data.skills.split(',').map(s => s.trim()).filter(s => s);
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Skills</div>
                <div class="resume-skills">
                    ${skillsArr.map(s => `<span class="resume-skill">${s}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Projects
    if (data.projects.length > 0) {
        html += `<div class="resume-section"><div class="resume-section-title">Projects</div>`;
        data.projects.forEach(proj => {
            html += `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <span class="resume-entry-title">${proj.name}</span>
                        <span class="resume-entry-date">${proj.tech}</span>
                    </div>
                    ${proj.description ? `<div class="resume-entry-desc">${proj.description}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    // Certifications
    if (data.certifications.length > 0) {
        html += `<div class="resume-section"><div class="resume-section-title">Certifications</div>`;
        data.certifications.forEach(cert => {
            html += `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <span class="resume-entry-title">${cert.name}</span>
                        <span class="resume-entry-date">${cert.date}</span>
                    </div>
                    <div class="resume-entry-subtitle">${cert.issuer}</div>
                </div>
            `;
        });
        html += `</div>`;
    }

    // Languages
    if (data.languages) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Languages</div>
                <p>${data.languages}</p>
            </div>
        `;
    }

    preview.innerHTML = html;
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
