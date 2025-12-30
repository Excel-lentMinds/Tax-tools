// ==================== PDF TOOLS JAVASCRIPT ====================

// Configuration
const MAX_FILES = 50;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file

// Global state
let uploadedFiles = [];
let currentTool = '';

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSearch();
});

// Theme toggle
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('pdfToolsTheme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle?.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        toggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('pdfToolsTheme', isDark ? 'light' : 'dark');
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('toolSearch');
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.tool-card').forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            card.style.display = (name.includes(query) || desc.includes(query)) ? '' : 'none';
        });
    });
}

// ==================== MODAL FUNCTIONS ====================
function openTool(toolId) {
    currentTool = toolId;
    uploadedFiles = [];

    const modal = document.getElementById('toolModal');
    const header = document.getElementById('modalHeader');
    const body = document.getElementById('modalBody');

    // Tool configurations
    const tools = {
        'merge-pdf': {
            title: 'Merge PDF',
            desc: 'Combine multiple PDF files into one document',
            icon: 'fa-layer-group',
            color: 'organize',
            multi: true,
            accept: '.pdf',
            content: getMergeContent()
        },
        'split-pdf': {
            title: 'Split PDF',
            desc: 'Separate a PDF into individual pages',
            icon: 'fa-cut',
            color: 'organize',
            multi: false,
            accept: '.pdf',
            content: getSplitContent()
        },
        'compress-pdf': {
            title: 'Compress PDF',
            desc: 'Reduce PDF file size',
            icon: 'fa-compress-arrows-alt',
            color: 'organize',
            multi: false,
            accept: '.pdf',
            content: getCompressContent()
        },
        'rotate-pdf': {
            title: 'Rotate PDF',
            desc: 'Rotate PDF pages',
            icon: 'fa-sync-alt',
            color: 'organize',
            multi: false,
            accept: '.pdf',
            content: getRotateContent()
        },
        'jpg-to-pdf': {
            title: 'JPG to PDF',
            desc: 'Convert images to PDF',
            icon: 'fa-file-image',
            color: 'convert',
            multi: true,
            accept: '.jpg,.jpeg,.png,.gif,.webp',
            content: getImageToPdfContent()
        },
        'pdf-to-jpg': {
            title: 'PDF to JPG',
            desc: 'Convert PDF pages to images',
            icon: 'fa-image',
            color: 'convert',
            multi: false,
            accept: '.pdf',
            content: getPdfToImageContent()
        },
        'add-watermark': {
            title: 'Add Watermark',
            desc: 'Add text or image watermark to PDF',
            icon: 'fa-stamp',
            color: 'edit',
            multi: false,
            accept: '.pdf',
            content: getWatermarkContent()
        },
        'add-page-numbers': {
            title: 'Add Page Numbers',
            desc: 'Add page numbers to PDF',
            icon: 'fa-list-ol',
            color: 'edit',
            multi: false,
            accept: '.pdf',
            content: getPageNumbersContent()
        },
        'protect-pdf': {
            title: 'Protect PDF',
            desc: 'Add password protection to PDF',
            icon: 'fa-lock',
            color: 'security',
            multi: false,
            accept: '.pdf',
            content: getProtectContent()
        },
        'delete-pages': {
            title: 'Delete Pages',
            desc: 'Remove specific pages from PDF',
            icon: 'fa-trash-alt',
            color: 'organize',
            multi: false,
            accept: '.pdf',
            content: getDeletePagesContent()
        },
        'extract-pages': {
            title: 'Extract Pages',
            desc: 'Extract specific pages from PDF',
            icon: 'fa-file-export',
            color: 'organize',
            multi: false,
            accept: '.pdf',
            content: getExtractPagesContent()
        },
        // ==================== ADVANCED TOOLS ====================
        'sign-pdf': {
            title: 'E-Sign PDF',
            desc: 'Draw your signature on PDF',
            icon: 'fa-signature',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getSignPdfContent()
        },
        'compare-pdf': {
            title: 'Compare PDFs',
            desc: 'Compare two PDFs side by side',
            icon: 'fa-columns',
            color: 'advanced',
            multi: true,
            accept: '.pdf',
            content: getComparePdfContent()
        },
        'reorder-pages': {
            title: 'Reorder Pages',
            desc: 'Drag and drop to reorder pages',
            icon: 'fa-sort',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getReorderContent()
        },
        'pdf-reader': {
            title: 'PDF Reader',
            desc: 'View PDF with zoom and navigation',
            icon: 'fa-book-reader',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getPdfReaderContent()
        },
        'qr-to-pdf': {
            title: 'Add QR Code',
            desc: 'Add QR code to your PDF',
            icon: 'fa-qrcode',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getQrCodeContent()
        },
        'pdf-metadata': {
            title: 'Edit Metadata',
            desc: 'Edit PDF title, author, and keywords',
            icon: 'fa-info-circle',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getMetadataContent()
        },
        'crop-pdf': {
            title: 'Crop PDF',
            desc: 'Crop PDF page margins',
            icon: 'fa-crop-alt',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getCropContent()
        },
        'flatten-pdf': {
            title: 'Flatten PDF',
            desc: 'Flatten form fields and annotations',
            icon: 'fa-compress',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getFlattenContent()
        },
        'redact-pdf': {
            title: 'Redact PDF',
            desc: 'Black out sensitive content',
            icon: 'fa-eraser',
            color: 'security',
            multi: false,
            accept: '.pdf',
            content: getRedactContent()
        },
        // ==================== OFFICE TOOLS ====================
        'excel-to-pdf': {
            title: 'Excel to PDF',
            desc: 'Convert spreadsheets to PDF',
            icon: 'fa-file-excel',
            color: 'convert',
            multi: false,
            accept: '.xlsx,.xls,.csv',
            content: getOfficeConvertContent('Excel')
        },
        'ppt-to-pdf': {
            title: 'PowerPoint to PDF',
            desc: 'Convert presentations to PDF',
            icon: 'fa-file-powerpoint',
            color: 'convert',
            multi: false,
            accept: '.pptx,.ppt',
            content: getOfficeConvertContent('PowerPoint')
        },
        'pdf-to-text': {
            title: 'PDF to Text',
            desc: 'Extract text from PDF',
            icon: 'fa-file-alt',
            color: 'convert',
            multi: false,
            accept: '.pdf',
            content: getPdfToTextContent()
        },
        'pdf-viewer': {
            title: 'PDF Viewer',
            desc: 'View PDF with full screen and annotations',
            icon: 'fa-eye',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getPdfViewerContent()
        },
        // ==================== SUPER ADVANCED TOOLS ====================
        'ocr-pdf': {
            title: 'OCR PDF',
            desc: 'Scan image PDF to searchable text',
            icon: 'fa-eye',
            color: 'advanced',
            multi: false,
            accept: '.pdf,.png,.jpg,.jpeg',
            content: getOcrContent()
        },
        'annotate-pdf': {
            title: 'Annotate PDF',
            desc: 'Draw, highlight, add notes',
            icon: 'fa-highlighter',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getAnnotateContent()
        },
        'header-footer': {
            title: 'Header & Footer',
            desc: 'Add custom headers and footers',
            icon: 'fa-heading',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getHeaderFooterContent()
        },
        'bates-numbering': {
            title: 'Bates Numbering',
            desc: 'Add legal document numbering',
            icon: 'fa-gavel',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getBatesContent()
        },
        'batch-process': {
            title: 'Batch Process',
            desc: 'Apply actions to multiple PDFs',
            icon: 'fa-layer-group',
            color: 'advanced',
            multi: true,
            accept: '.pdf',
            content: getBatchContent()
        },
        'pdf-optimize': {
            title: 'PDF Optimizer',
            desc: 'Advanced compression & cleanup',
            icon: 'fa-magic',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getOptimizerContent()
        },
        'form-filler': {
            title: 'Form Filler',
            desc: 'Fill PDF form fields',
            icon: 'fa-edit',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getFormFillerContent()
        },
        'pdf-compare': {
            title: 'PDF Compare',
            desc: 'Visual diff between two PDFs',
            icon: 'fa-not-equal',
            color: 'advanced',
            multi: true,
            accept: '.pdf',
            content: getPdfCompareContent()
        },
        'pdf-editor': {
            title: 'PDF Editor',
            desc: 'Edit text, erase, draw, add images',
            icon: 'fa-edit',
            color: 'advanced',
            multi: false,
            accept: '.pdf',
            content: getPdfEditorContent()
        },
        'text-to-html': {
            title: 'Text to HTML',
            desc: 'Convert text to colorful structured HTML',
            icon: 'fa-code',
            color: 'advanced',
            multi: false,
            accept: '.txt,.md,.text',
            content: getTextToHtmlContent()
        }
    };

    const tool = tools[toolId];
    if (!tool) {
        showToast('❌ Tool not found');
        return;
    }

    // Update modal
    header.innerHTML = `
        <div class="modal-icon" style="background: linear-gradient(135deg, var(--${tool.color}-color), var(--${tool.color}-color));">
            <i class="fas ${tool.icon}"></i>
        </div>
        <h2>${tool.title}</h2>
        <p>${tool.desc}</p>
    `;
    body.innerHTML = tool.content;

    // Setup file upload
    setTimeout(() => setupFileUpload(tool.multi, tool.accept), 100);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTool() {
    document.getElementById('toolModal').classList.remove('active');
    document.body.style.overflow = '';
    uploadedFiles = [];
}

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTool();
});

// ==================== FILE UPLOAD ====================
function setupFileUpload(multi, accept) {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    if (!dropZone || !fileInput) return;

    fileInput.accept = accept;
    fileInput.multiple = multi;

    // Drag & drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files, multi);
    });

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files, multi);
    });
}

function handleFiles(files, multi) {
    const fileArray = Array.from(files);

    if (!multi) {
        uploadedFiles = [fileArray[0]];
    } else {
        // Limit to MAX_FILES
        const remaining = MAX_FILES - uploadedFiles.length;
        const toAdd = fileArray.slice(0, remaining);
        uploadedFiles = [...uploadedFiles, ...toAdd];

        if (fileArray.length > remaining) {
            showToast(`⚠️ Maximum ${MAX_FILES} files allowed`);
        }
    }

    updateFileList();
    updateProcessButton();
}

function updateFileList() {
    const list = document.getElementById('fileList');
    if (!list) return;

    if (uploadedFiles.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = uploadedFiles.map((file, i) => `
        <div class="file-item" data-index="${i}">
            <i class="fas fa-file-pdf"></i>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" onclick="removeFile(${i})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    // Show file count
    const countEl = document.getElementById('fileCount');
    if (countEl) {
        countEl.textContent = `${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} selected (max ${MAX_FILES})`;
    }
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
    updateProcessButton();
}

function updateProcessButton() {
    const btn = document.getElementById('processBtn');
    if (btn) {
        btn.disabled = uploadedFiles.length === 0;
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ==================== TOOL CONTENT TEMPLATES ====================
function getUploadArea(multi = false) {
    return `
        <div class="upload-area" id="dropZone">
            <i class="fas fa-cloud-upload-alt"></i>
            <h3>Drag & drop ${multi ? 'files' : 'file'} here</h3>
            <p>or click to browse</p>
            <input type="file" id="fileInput" hidden ${multi ? 'multiple' : ''}>
            <button class="upload-btn">
                <i class="fas fa-folder-open"></i> Select ${multi ? 'Files' : 'File'}
            </button>
            ${multi ? `<p style="margin-top:1rem;font-size:0.85rem;color:var(--text-light);">Up to ${MAX_FILES} files</p>` : ''}
        </div>
        <div id="fileList" class="file-list"></div>
        ${multi ? '<p id="fileCount" style="text-align:center;color:var(--text-light);margin-top:0.5rem;"></p>' : ''}
    `;
}

function getMergeContent() {
    return `
        ${getUploadArea(true)}
        <p style="margin-top:1rem;color:var(--text-light);text-align:center;">
            <i class="fas fa-info-circle"></i> Drag files to reorder them before merging
        </p>
        <button class="process-btn" id="processBtn" disabled onclick="processMerge()">
            <i class="fas fa-layer-group"></i> Merge PDFs
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDFs Merged Successfully!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download Merged PDF
            </button>
        </div>
    `;
}

function getSplitContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Split Options:</label>
            <select id="splitOption" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="all">Extract all pages as separate PDFs</option>
                <option value="range">Extract specific page range</option>
            </select>
            <div id="rangeInput" style="margin-top:1rem;display:none;">
                <input type="text" id="pageRange" placeholder="e.g., 1-3, 5, 7-10" 
                    style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processSplit()">
            <i class="fas fa-cut"></i> Split PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Split Successfully!</h3>
            <div id="downloadLinks"></div>
        </div>
    `;
}

function getCompressContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Compression Level:</label>
            <select id="compressLevel" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="low">Low (larger file, better quality)</option>
                <option value="medium" selected>Medium (balanced)</option>
                <option value="high">High (smaller file, lower quality)</option>
            </select>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processCompress()">
            <i class="fas fa-compress-arrows-alt"></i> Compress PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Compressed!</h3>
            <p id="compressionStats"></p>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download Compressed PDF
            </button>
        </div>
    `;
}

function getRotateContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Rotation:</label>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
                    <input type="radio" name="rotation" value="90" checked> 90° Right
                </label>
                <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
                    <input type="radio" name="rotation" value="180"> 180°
                </label>
                <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
                    <input type="radio" name="rotation" value="270"> 90° Left
                </label>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processRotate()">
            <i class="fas fa-sync-alt"></i> Rotate PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Rotated!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download Rotated PDF
            </button>
        </div>
    `;
}

function getImageToPdfContent() {
    return `
        ${getUploadArea(true)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Page Size:</label>
            <select id="pageSize" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="fit">Fit to Image</option>
            </select>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processImageToPdf()">
            <i class="fas fa-file-pdf"></i> Convert to PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Images Converted to PDF!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
    `;
}

function getPdfToImageContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Image Format:</label>
            <select id="imageFormat" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
            </select>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processPdfToImage()">
            <i class="fas fa-image"></i> Convert to Images
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Converted to Images!</h3>
            <div id="downloadLinks"></div>
        </div>
    `;
}

function getWatermarkContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Watermark Text:</label>
            <input type="text" id="watermarkText" placeholder="e.g., CONFIDENTIAL" 
                style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:1rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Position:</label>
            <select id="watermarkPosition" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="center">Center</option>
                <option value="diagonal">Diagonal</option>
            </select>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processWatermark()">
            <i class="fas fa-stamp"></i> Add Watermark
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Watermark Added!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
    `;
}

function getPageNumbersContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Position:</label>
            <select id="numberPosition" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
            </select>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processPageNumbers()">
            <i class="fas fa-list-ol"></i> Add Page Numbers
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Page Numbers Added!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
    `;
}

function getProtectContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Password:</label>
            <input type="password" id="pdfPassword" placeholder="Enter password" 
                style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:1rem;">
            <input type="password" id="pdfPasswordConfirm" placeholder="Confirm password" 
                style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processProtect()">
            <i class="fas fa-lock"></i> Protect PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Protected!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download Protected PDF
            </button>
        </div>
    `;
}

function getDeletePagesContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Pages to Delete:</label>
            <input type="text" id="deletePages" placeholder="e.g., 1, 3, 5-7" 
                style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
            <p style="font-size:0.85rem;color:var(--text-light);margin-top:0.5rem;">
                Enter page numbers separated by commas. Use hyphen for ranges.
            </p>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processDeletePages()">
            <i class="fas fa-trash-alt"></i> Delete Pages
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Pages Deleted!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
    `;
}

function getExtractPagesContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Pages to Extract:</label>
            <input type="text" id="extractPages" placeholder="e.g., 1, 3, 5-7" 
                style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
            <p style="font-size:0.85rem;color:var(--text-light);margin-top:0.5rem;">
                Enter page numbers separated by commas. Use hyphen for ranges.
            </p>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processExtractPages()">
            <i class="fas fa-file-export"></i> Extract Pages
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Pages Extracted!</h3>
            <button class="download-btn" id="downloadBtn">
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
    `;
}

// ==================== PROCESS FUNCTIONS ====================

// Update progress
function updateProgress(percent, text) {
    const container = document.getElementById('progressContainer');
    const fill = document.getElementById('progressFill');
    const textEl = document.getElementById('progressText');

    container.classList.add('active');
    fill.style.width = percent + '%';
    textEl.textContent = text || 'Processing...';
}

// Show result
function showResult() {
    document.getElementById('progressContainer').classList.remove('active');
    document.getElementById('resultSection').classList.add('active');
}

// Download file
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Merge PDFs
async function processMerge() {
    if (uploadedFiles.length < 2) {
        showToast('❌ Please upload at least 2 PDF files');
        return;
    }

    try {
        updateProgress(10, 'Loading PDF library...');
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            updateProgress(10 + (i / uploadedFiles.length) * 80, `Processing ${file.name}...`);

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        }

        updateProgress(95, 'Finalizing...');
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'merged.pdf');
        };

        showResult();
        showToast('✅ PDFs merged successfully!');

    } catch (error) {
        console.error('Merge error:', error);
        showToast('❌ Error merging PDFs: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Split PDF
async function processSplit() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(20, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();

        const splitOption = document.getElementById('splitOption').value;
        const downloadLinks = document.getElementById('downloadLinks');
        downloadLinks.innerHTML = '';

        if (splitOption === 'all') {
            // Extract each page
            for (let i = 0; i < pageCount; i++) {
                updateProgress(20 + (i / pageCount) * 70, `Extracting page ${i + 1}...`);

                const newPdf = await PDFDocument.create();
                const [page] = await newPdf.copyPages(pdf, [i]);
                newPdf.addPage(page);

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                downloadLinks.innerHTML += `
                    <a href="${url}" download="page_${i + 1}.pdf" class="download-btn" style="margin:0.25rem;">
                        <i class="fas fa-download"></i> Page ${i + 1}
                    </a>
                `;
            }
        } else if (splitOption === 'range') {
            // Extract specific page range
            const rangeText = document.getElementById('pageRange').value;
            if (!rangeText.trim()) {
                showToast('⚠️ Please enter page numbers to extract');
                document.getElementById('progressContainer').classList.remove('active');
                return;
            }

            // Parse range string (e.g., "1-3, 5, 7-10")
            const pagesToExtract = [];
            const parts = rangeText.split(',').map(p => p.trim());

            for (const part of parts) {
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                    if (isNaN(start) || isNaN(end) || start < 1 || end > pageCount || start > end) {
                        showToast(`⚠️ Invalid range: ${part}. Pages must be between 1 and ${pageCount}`);
                        document.getElementById('progressContainer').classList.remove('active');
                        return;
                    }
                    for (let i = start; i <= end; i++) {
                        if (!pagesToExtract.includes(i - 1)) pagesToExtract.push(i - 1);
                    }
                } else {
                    const pageNum = parseInt(part);
                    if (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount) {
                        showToast(`⚠️ Invalid page: ${part}. Pages must be between 1 and ${pageCount}`);
                        document.getElementById('progressContainer').classList.remove('active');
                        return;
                    }
                    if (!pagesToExtract.includes(pageNum - 1)) pagesToExtract.push(pageNum - 1);
                }
            }

            pagesToExtract.sort((a, b) => a - b);
            updateProgress(50, `Extracting ${pagesToExtract.length} pages...`);

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadLinks.innerHTML = `
                <a href="${url}" download="extracted_pages.pdf" class="download-btn">
                    <i class="fas fa-download"></i> Download Extracted Pages (${pagesToExtract.length} pages)
                </a>
            `;
        }

        showResult();
        showToast('✅ PDF split successfully!');

    } catch (error) {
        console.error('Split error:', error);
        showToast('❌ Error splitting PDF: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Compress PDF (basic - removes metadata)
async function processCompress() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const originalSize = file.size;

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        updateProgress(60, 'Compressing...');
        // Remove metadata for compression
        pdf.setTitle('');
        pdf.setAuthor('');
        pdf.setSubject('');
        pdf.setKeywords([]);
        pdf.setProducer('');
        pdf.setCreator('');

        const pdfBytes = await pdf.save({ useObjectStreams: true });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const newSize = blob.size;

        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        document.getElementById('compressionStats').textContent =
            `Reduced from ${formatFileSize(originalSize)} to ${formatFileSize(newSize)} (${reduction}% smaller)`;

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'compressed.pdf');
        };

        showResult();
        showToast('✅ PDF compressed!');

    } catch (error) {
        console.error('Compress error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Rotate PDF
async function processRotate() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument, degrees } = PDFLib;
        const file = uploadedFiles[0];
        const rotation = parseInt(document.querySelector('input[name="rotation"]:checked').value);

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        updateProgress(60, 'Rotating pages...');
        const pages = pdf.getPages();
        pages.forEach(page => {
            page.setRotation(degrees(page.getRotation().angle + rotation));
        });

        updateProgress(90, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'rotated.pdf');
        };

        showResult();
        showToast('✅ PDF rotated!');

    } catch (error) {
        console.error('Rotate error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Image to PDF
async function processImageToPdf() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const pdf = await PDFDocument.create();
        const pageSize = document.getElementById('pageSize').value;

        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            updateProgress(10 + (i / uploadedFiles.length) * 80, `Processing ${file.name}...`);

            const arrayBuffer = await file.arrayBuffer();
            let image;

            if (file.type === 'image/png') {
                image = await pdf.embedPng(arrayBuffer);
            } else {
                image = await pdf.embedJpg(arrayBuffer);
            }

            let pageWidth, pageHeight;
            if (pageSize === 'a4') {
                pageWidth = 595;
                pageHeight = 842;
            } else if (pageSize === 'letter') {
                pageWidth = 612;
                pageHeight = 792;
            } else {
                pageWidth = image.width;
                pageHeight = image.height;
            }

            const page = pdf.addPage([pageWidth, pageHeight]);
            const { width, height } = image.scaleToFit(pageWidth - 40, pageHeight - 40);

            page.drawImage(image, {
                x: (pageWidth - width) / 2,
                y: (pageHeight - height) / 2,
                width,
                height
            });
        }

        updateProgress(95, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'images.pdf');
        };

        showResult();
        showToast('✅ Images converted to PDF!');

    } catch (error) {
        console.error('Image to PDF error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Add watermark
async function processWatermark() {
    if (uploadedFiles.length === 0) return;

    const text = document.getElementById('watermarkText').value.trim();
    if (!text) {
        showToast('❌ Please enter watermark text');
        return;
    }

    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const font = await pdf.embedFont(StandardFonts.Helvetica);

        updateProgress(60, 'Adding watermark...');
        const pages = pdf.getPages();

        pages.forEach(page => {
            const { width, height } = page.getSize();
            page.drawText(text, {
                x: width / 2 - font.widthOfTextAtSize(text, 40) / 2,
                y: height / 2,
                size: 40,
                font,
                color: rgb(0.7, 0.7, 0.7),
                opacity: 0.3,
                rotate: PDFLib.degrees(45)
            });
        });

        updateProgress(90, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'watermarked.pdf');
        };

        showResult();
        showToast('✅ Watermark added!');

    } catch (error) {
        console.error('Watermark error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Add page numbers
async function processPageNumbers() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const file = uploadedFiles[0];
        const position = document.getElementById('numberPosition').value;

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const font = await pdf.embedFont(StandardFonts.Helvetica);

        updateProgress(60, 'Adding page numbers...');
        const pages = pdf.getPages();

        pages.forEach((page, i) => {
            const { width, height } = page.getSize();
            const text = `${i + 1}`;
            const textWidth = font.widthOfTextAtSize(text, 12);

            let x, y;
            if (position.includes('center')) {
                x = width / 2 - textWidth / 2;
            } else {
                x = width - 50;
            }

            if (position.includes('bottom')) {
                y = 30;
            } else {
                y = height - 30;
            }

            page.drawText(text, { x, y, size: 12, font, color: rgb(0, 0, 0) });
        });

        updateProgress(90, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'numbered.pdf');
        };

        showResult();
        showToast('✅ Page numbers added!');

    } catch (error) {
        console.error('Page numbers error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Delete pages
async function processDeletePages() {
    if (uploadedFiles.length === 0) return;

    const pagesInput = document.getElementById('deletePages').value.trim();
    if (!pagesInput) {
        showToast('❌ Please enter pages to delete');
        return;
    }

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const pageCount = srcPdf.getPageCount();

        // Parse pages to delete
        const pagesToDelete = new Set();
        pagesInput.split(',').forEach(part => {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                for (let i = start; i <= end; i++) pagesToDelete.add(i);
            } else {
                pagesToDelete.add(parseInt(part));
            }
        });

        updateProgress(60, 'Deleting pages...');
        const newPdf = await PDFDocument.create();
        const pagesToKeep = [];

        for (let i = 0; i < pageCount; i++) {
            if (!pagesToDelete.has(i + 1)) {
                pagesToKeep.push(i);
            }
        }

        const pages = await newPdf.copyPages(srcPdf, pagesToKeep);
        pages.forEach(page => newPdf.addPage(page));

        updateProgress(90, 'Saving...');
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'modified.pdf');
        };

        showResult();
        showToast('✅ Pages deleted!');

    } catch (error) {
        console.error('Delete pages error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Extract pages
async function processExtractPages() {
    if (uploadedFiles.length === 0) return;

    const pagesInput = document.getElementById('extractPages').value.trim();
    if (!pagesInput) {
        showToast('❌ Please enter pages to extract');
        return;
    }

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);

        // Parse pages to extract
        const pagesToExtract = [];
        pagesInput.split(',').forEach(part => {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                for (let i = start; i <= end; i++) pagesToExtract.push(i - 1);
            } else {
                pagesToExtract.push(parseInt(part) - 1);
            }
        });

        updateProgress(60, 'Extracting pages...');
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(srcPdf, pagesToExtract);
        pages.forEach(page => newPdf.addPage(page));

        updateProgress(90, 'Saving...');
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => {
            downloadFile(blob, 'extracted.pdf');
        };

        showResult();
        showToast('✅ Pages extracted!');

    } catch (error) {
        console.error('Extract pages error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// PDF to Image - Convert PDF pages to images
async function processPdfToImage() {
    if (uploadedFiles.length === 0) return;

    try {
        const file = uploadedFiles[0];
        const format = document.getElementById('imageFormat').value;
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';

        updateProgress(10, 'Loading PDF...');

        // Load PDF using PDF.js
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageCount = pdf.numPages;

        const downloadLinks = document.getElementById('downloadLinks');
        downloadLinks.innerHTML = '';

        updateProgress(20, `Converting ${pageCount} pages...`);

        for (let i = 1; i <= pageCount; i++) {
            updateProgress(20 + (i / pageCount) * 70, `Converting page ${i} of ${pageCount}...`);

            const page = await pdf.getPage(i);
            const scale = 2; // Higher quality
            const viewport = page.getViewport({ scale });

            // Create canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render page to canvas
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            // Convert to image
            const imageData = canvas.toDataURL(mimeType, 0.95);

            downloadLinks.innerHTML += `
                <a href="${imageData}" download="page_${i}.${format}" class="download-btn" style="margin:0.25rem;">
                    <i class="fas fa-download"></i> Page ${i}
                </a>
            `;
        }

        showResult();
        showToast(`✅ Converted ${pageCount} pages to ${format.toUpperCase()}!`);

    } catch (error) {
        console.error('PDF to Image error:', error);
        showToast('❌ Error converting PDF: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Protect PDF
async function processProtect() {
    const password = document.getElementById('pdfPassword').value;
    const confirm = document.getElementById('pdfPasswordConfirm').value;

    if (!password) {
        showToast('❌ Please enter a password');
        return;
    }
    if (password !== confirm) {
        showToast('❌ Passwords do not match');
        return;
    }

    showToast('⚠️ Password protection requires server-side processing. Use Print → Save with password in Adobe Reader.');
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Split option toggle
document.addEventListener('change', (e) => {
    if (e.target.id === 'splitOption') {
        document.getElementById('rangeInput').style.display =
            e.target.value === 'range' ? 'block' : 'none';
    }
});

// ==================== ADVANCED TOOL CONTENT TEMPLATES ====================

function getSignPdfContent() {
    return `
        ${getUploadArea(false)}
        <div style="margin-top:1.5rem;">
            <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Draw Your Signature:</label>
            <div class="signature-container">
                <canvas id="signatureCanvas" class="signature-canvas" width="600" height="200"></canvas>
                <div class="signature-controls">
                    <button class="sig-clear" onclick="clearSignature()"><i class="fas fa-eraser"></i> Clear</button>
                    <input type="color" id="sigColor" value="#000000" class="sig-color" onchange="updateSignatureColor(this.value)">
                    <select id="sigThickness" style="padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;" onchange="updateSignatureThickness(this.value)">
                        <option value="2">Thin</option>
                        <option value="4" selected>Medium</option>
                        <option value="6">Thick</option>
                    </select>
                </div>
            </div>
            <div style="display:flex;gap:1rem;margin-top:1rem;">
                <div class="input-group" style="flex:1;">
                    <label>X Position (%)</label>
                    <input type="number" id="sigX" value="70" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                </div>
                <div class="input-group" style="flex:1;">
                    <label>Y Position (%)</label>
                    <input type="number" id="sigY" value="85" min="0" max="100" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                </div>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processSignPdf()">
            <i class="fas fa-signature"></i> Apply Signature to PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Signature Added!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download Signed PDF</button>
        </div>
    `;
}

function getComparePdfContent() {
    return `
        <p style="text-align:center;color:var(--text-light);margin-bottom:1rem;">
            <i class="fas fa-info-circle"></i> Upload 2 PDFs to compare side by side
        </p>
        ${getUploadArea(true)}
        <button class="process-btn" id="processBtn" disabled onclick="processCompare()">
            <i class="fas fa-columns"></i> Compare PDFs
        </button>
        <div class="compare-container" id="compareContainer" style="display:none;">
            <div class="compare-panel">
                <h4>PDF 1</h4>
                <div class="compare-content" id="compare1"></div>
            </div>
            <div class="compare-panel">
                <h4>PDF 2</h4>
                <div class="compare-content" id="compare2"></div>
            </div>
        </div>
    `;
}

function getReorderContent() {
    return `
        ${getUploadArea(false)}
        <div id="previewSection" style="display:none;">
            <div class="preview-toolbar">
                <div class="toolbar-left">
                    <span id="pageStats" style="font-weight:600;"></span>
                </div>
                <div class="toolbar-actions">
                    <button onclick="selectAllPages()" class="toolbar-btn">
                        <i class="fas fa-check-double"></i> Select All
                    </button>
                    <button onclick="rotateSelectedPages(90)" class="toolbar-btn">
                        <i class="fas fa-redo"></i> Rotate Right
                    </button>
                    <button onclick="rotateSelectedPages(-90)" class="toolbar-btn">
                        <i class="fas fa-undo"></i> Rotate Left
                    </button>
                    <button onclick="deleteSelectedPages()" class="toolbar-btn danger">
                        <i class="fas fa-trash"></i> Delete Selected
                    </button>
                </div>
            </div>
            <p style="text-align:center;color:var(--text-light);margin:0.75rem 0;font-size:0.9rem;">
                <i class="fas fa-info-circle"></i> Drag thumbnails to reorder • Click to select • Ctrl+Click for multi-select
            </p>
            <div id="thumbnailGrid" class="thumbnail-grid"></div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processReorder()">
            <i class="fas fa-save"></i> Save Changes & Download
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Updated Successfully!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

function getPdfReaderContent() {
    return `
        ${getUploadArea(false)}
        <div id="readerContainer" class="pdf-reader-container" style="display:none;">
            <div class="reader-toolbar">
                <button onclick="readerPrevPage()"><i class="fas fa-chevron-left"></i></button>
                <span class="page-info">Page <span id="currentPage">1</span> of <span id="totalPages">1</span></span>
                <button onclick="readerNextPage()"><i class="fas fa-chevron-right"></i></button>
                <button onclick="readerZoomOut()"><i class="fas fa-search-minus"></i></button>
                <span id="zoomLevel" style="margin:0 0.5rem;">100%</span>
                <button onclick="readerZoomIn()"><i class="fas fa-search-plus"></i></button>
                <button onclick="readerRotate()"><i class="fas fa-sync-alt"></i></button>
            </div>
            <div class="pdf-viewport" id="pdfViewport">
                <canvas id="readerCanvas"></canvas>
            </div>
        </div>
    `;
}

function getQrCodeContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">QR Code Content:</label>
            <input type="text" id="qrContent" placeholder="https://example.com or any text" 
                style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:1rem;">
            <div style="display:flex;gap:1rem;">
                <div style="flex:1;">
                    <label style="font-weight:500;display:block;margin-bottom:0.25rem;">Position</label>
                    <select id="qrPosition" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                        <option value="bottom-right">Bottom Right</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-left">Top Left</option>
                        <option value="center">Center</option>
                    </select>
                </div>
                <div style="flex:1;">
                    <label style="font-weight:500;display:block;margin-bottom:0.25rem;">Size</label>
                    <select id="qrSize" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                        <option value="50">Small (50px)</option>
                        <option value="80" selected>Medium (80px)</option>
                        <option value="120">Large (120px)</option>
                    </select>
                </div>
            </div>
            <button onclick="previewQr()" style="margin-top:1rem;padding:0.5rem 1rem;background:#f1f5f9;border:none;border-radius:6px;cursor:pointer;">
                <i class="fas fa-eye"></i> Preview QR
            </button>
            <div id="qrPreview" class="qr-preview" style="display:none;"></div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processQrCode()">
            <i class="fas fa-qrcode"></i> Add QR Code to PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>QR Code Added!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

function getMetadataContent() {
    return `
        ${getUploadArea(false)}
        <div id="metadataForm" class="metadata-form" style="display:none;margin-top:1.5rem;">
            <div>
                <label>Title</label>
                <input type="text" id="metaTitle" placeholder="Document Title">
            </div>
            <div>
                <label>Author</label>
                <input type="text" id="metaAuthor" placeholder="Author Name">
            </div>
            <div>
                <label>Subject</label>
                <input type="text" id="metaSubject" placeholder="Document Subject">
            </div>
            <div>
                <label>Keywords (comma separated)</label>
                <input type="text" id="metaKeywords" placeholder="keyword1, keyword2, keyword3">
            </div>
            <div>
                <label>Creator</label>
                <input type="text" id="metaCreator" placeholder="Application Name">
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processMetadata()">
            <i class="fas fa-save"></i> Save Metadata
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Metadata Updated!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

function getCropContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Crop Margins (in points, 72 points = 1 inch):</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label>Top</label>
                    <input type="number" id="cropTop" value="36" min="0" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                </div>
                <div>
                    <label>Bottom</label>
                    <input type="number" id="cropBottom" value="36" min="0" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                </div>
                <div>
                    <label>Left</label>
                    <input type="number" id="cropLeft" value="36" min="0" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                </div>
                <div>
                    <label>Right</label>
                    <input type="number" id="cropRight" value="36" min="0" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                </div>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processCrop()">
            <i class="fas fa-crop-alt"></i> Crop PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Cropped!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

function getFlattenContent() {
    return `
        ${getUploadArea(false)}
        <div style="margin-top:1rem;padding:1rem;background:#fef3c7;border-radius:8px;color:#92400e;">
            <i class="fas fa-info-circle"></i> Flattening will merge form fields and annotations into the PDF content, making them non-editable.
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processFlatten()">
            <i class="fas fa-compress"></i> Flatten PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Flattened!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

function getRedactContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Text to Redact:</label>
            <input type="text" id="redactText" placeholder="Enter text to black out" 
                style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
            <p style="font-size:0.85rem;color:var(--text-light);margin-top:0.5rem;">
                This will search for the text and cover it with a black rectangle.
            </p>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processRedact()">
            <i class="fas fa-eraser"></i> Redact PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Content Redacted!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

// ==================== SIGNATURE CANVAS ====================
let signatureCtx = null;
let isDrawing = false;
let sigColor = '#000000';
let sigThickness = 4;

function initSignatureCanvas() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;

    signatureCtx = canvas.getContext('2d');
    signatureCtx.strokeStyle = sigColor;
    signatureCtx.lineWidth = sigThickness;
    signatureCtx.lineCap = 'round';
    signatureCtx.lineJoin = 'round';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e.touches[0]); });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); });
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = document.getElementById('signatureCanvas').getBoundingClientRect();
    signatureCtx.beginPath();
    signatureCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = document.getElementById('signatureCanvas').getBoundingClientRect();
    signatureCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    signatureCtx.stroke();
}

function stopDrawing() { isDrawing = false; }

function clearSignature() {
    const canvas = document.getElementById('signatureCanvas');
    if (signatureCtx && canvas) {
        signatureCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function updateSignatureColor(color) {
    sigColor = color;
    if (signatureCtx) signatureCtx.strokeStyle = color;
}

function updateSignatureThickness(thickness) {
    sigThickness = parseInt(thickness);
    if (signatureCtx) signatureCtx.lineWidth = sigThickness;
}

// Initialize signature canvas when tool opens
const originalSetupFileUpload = setupFileUpload;
setupFileUpload = function (multi, accept) {
    originalSetupFileUpload(multi, accept);
    setTimeout(initSignatureCanvas, 100);
};

// ==================== ADVANCED PROCESS FUNCTIONS ====================

async function processSignPdf() {
    if (uploadedFiles.length === 0) return;

    const canvas = document.getElementById('signatureCanvas');
    const sigData = canvas.toDataURL('image/png');

    if (!sigData || sigData === 'data:,') {
        showToast('❌ Please draw your signature first');
        return;
    }

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        updateProgress(60, 'Adding signature...');
        const sigImage = await pdf.embedPng(sigData);
        const pages = pdf.getPages();
        const lastPage = pages[pages.length - 1];
        const { width, height } = lastPage.getSize();

        const sigX = (parseInt(document.getElementById('sigX').value) || 70) / 100 * width;
        const sigY = height - (parseInt(document.getElementById('sigY').value) || 85) / 100 * height;

        lastPage.drawImage(sigImage, {
            x: sigX - 75,
            y: sigY - 25,
            width: 150,
            height: 50
        });

        updateProgress(90, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'signed.pdf');
        showResult();
        showToast('✅ Signature added!');

    } catch (error) {
        console.error('Sign error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

async function processMetadata() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        updateProgress(60, 'Updating metadata...');
        pdf.setTitle(document.getElementById('metaTitle').value || '');
        pdf.setAuthor(document.getElementById('metaAuthor').value || '');
        pdf.setSubject(document.getElementById('metaSubject').value || '');
        pdf.setKeywords((document.getElementById('metaKeywords').value || '').split(',').map(k => k.trim()));
        pdf.setCreator(document.getElementById('metaCreator').value || '');

        updateProgress(90, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'updated_metadata.pdf');
        showResult();
        showToast('✅ Metadata updated!');

    } catch (error) {
        console.error('Metadata error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

async function processCrop() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        const cropTop = parseInt(document.getElementById('cropTop').value) || 0;
        const cropBottom = parseInt(document.getElementById('cropBottom').value) || 0;
        const cropLeft = parseInt(document.getElementById('cropLeft').value) || 0;
        const cropRight = parseInt(document.getElementById('cropRight').value) || 0;

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        updateProgress(60, 'Cropping pages...');
        const pages = pdf.getPages();

        pages.forEach(page => {
            const { width, height } = page.getSize();
            page.setCropBox(cropLeft, cropBottom, width - cropLeft - cropRight, height - cropTop - cropBottom);
        });

        updateProgress(90, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'cropped.pdf');
        showResult();
        showToast('✅ PDF cropped!');

    } catch (error) {
        console.error('Crop error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

async function processFlatten() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        updateProgress(60, 'Flattening...');
        // PDFLib doesn't have native flatten, so we just re-save
        const form = pdf.getForm();
        form.flatten();

        updateProgress(90, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'flattened.pdf');
        showResult();
        showToast('✅ PDF flattened!');

    } catch (error) {
        console.error('Flatten error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

function processCompare() {
    if (uploadedFiles.length < 2) {
        showToast('❌ Please upload 2 PDFs to compare');
        return;
    }

    const container = document.getElementById('compareContainer');
    container.style.display = 'grid';

    // Simple text-based comparison info
    document.getElementById('compare1').innerHTML = `
        <p><strong>File:</strong> ${uploadedFiles[0].name}</p>
        <p><strong>Size:</strong> ${formatFileSize(uploadedFiles[0].size)}</p>
    `;
    document.getElementById('compare2').innerHTML = `
        <p><strong>File:</strong> ${uploadedFiles[1].name}</p>
        <p><strong>Size:</strong> ${formatFileSize(uploadedFiles[1].size)}</p>
    `;

    showToast('✅ PDFs loaded for comparison');
}

function processRedact() {
    showToast('⚠️ Text redaction requires content analysis. Use the Watermark tool to add black shapes over sensitive areas.');
}

function processReorder() {
    showToast('⚠️ Page reordering requires thumbnail preview. Upload a PDF and drag to reorder.');
}

function previewQr() {
    const content = document.getElementById('qrContent').value;
    if (!content) {
        showToast('❌ Enter QR code content first');
        return;
    }

    const preview = document.getElementById('qrPreview');
    preview.style.display = 'block';
    preview.innerHTML = `<p style="color:var(--text-light);">QR Code will contain: "${content}"</p>
        <p style="font-size:0.85rem;color:#64748b;">Full QR generation requires an external library. The PDF will include the QR code.</p>`;
}

function processQrCode() {
    showToast('⚠️ QR Code generation requires qrcode.js library. Add the library and implement QR embedding.');
}

// Show metadata form when file is loaded
const originalHandleFiles = handleFiles;
handleFiles = function (files, multi) {
    originalHandleFiles(files, multi);

    // Show metadata form if applicable
    const metaForm = document.getElementById('metadataForm');
    if (metaForm && uploadedFiles.length > 0) {
        metaForm.style.display = 'grid';
        loadPdfMetadata();
    }
};

async function loadPdfMetadata() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const arrayBuffer = await uploadedFiles[0].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);

        document.getElementById('metaTitle').value = pdf.getTitle() || '';
        document.getElementById('metaAuthor').value = pdf.getAuthor() || '';
        document.getElementById('metaSubject').value = pdf.getSubject() || '';
        document.getElementById('metaKeywords').value = (pdf.getKeywords() || []).join(', ');
        document.getElementById('metaCreator').value = pdf.getCreator() || '';
    } catch (e) {
        console.log('Could not load metadata:', e);
    }
}

// ==================== PDF PREVIEW & REORDER SYSTEM ====================

// Page data storage
let pdfPages = [];
let selectedPages = new Set();
let draggedItem = null;
let pdfDoc = null; // PDF.js document

// Initialize PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// Extend file handler for reorder tool
const baseHandleFiles = handleFiles;
handleFiles = function (files, multi) {
    baseHandleFiles(files, multi);

    // Check if we're in reorder mode
    const previewSection = document.getElementById('previewSection');
    if (previewSection && uploadedFiles.length > 0) {
        loadPdfForPreview(uploadedFiles[0]);
    }

    // Show PDF reader if applicable
    const readerContainer = document.getElementById('readerContainer');
    if (readerContainer && uploadedFiles.length > 0) {
        initPdfReader(uploadedFiles[0]);
    }
};

// Load PDF and generate thumbnails
async function loadPdfForPreview(file) {
    const previewSection = document.getElementById('previewSection');
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    const pageStats = document.getElementById('pageStats');

    if (!previewSection || !thumbnailGrid) return;

    try {
        showToast('⏳ Loading PDF preview...');

        // Reset state
        pdfPages = [];
        selectedPages.clear();
        thumbnailGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;"><i class="fas fa-spinner fa-spin" style="font-size:2rem;color:var(--primary);"></i><p style="margin-top:1rem;">Generating thumbnails...</p></div>';
        previewSection.style.display = 'block';

        // Load PDF with pdf.js
        const arrayBuffer = await file.arrayBuffer();
        pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdfDoc.numPages;

        pageStats.textContent = `${numPages} page${numPages > 1 ? 's' : ''} • ${formatFileSize(file.size)}`;

        // Generate thumbnails for each page
        thumbnailGrid.innerHTML = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const canvas = await renderPageToCanvas(page, 150);

            pdfPages.push({
                pageNum: i,
                originalIndex: i - 1,
                rotation: 0,
                deleted: false,
                canvas: canvas.toDataURL()
            });

            const thumb = createThumbnailElement(i - 1);
            thumbnailGrid.appendChild(thumb);
        }

        updateProcessButton();
        showToast('✅ PDF loaded! Drag to reorder, click to select.');

    } catch (error) {
        console.error('PDF preview error:', error);
        showToast('❌ Error loading PDF: ' + error.message);
        previewSection.style.display = 'none';
    }
}

// Render a PDF page to canvas
async function renderPageToCanvas(page, maxWidth) {
    const viewport = page.getViewport({ scale: 1 });
    const scale = maxWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    await page.render({
        canvasContext: context,
        viewport: scaledViewport
    }).promise;

    return canvas;
}

// Create thumbnail element
function createThumbnailElement(index) {
    const pageData = pdfPages[index];
    const div = document.createElement('div');
    div.className = 'thumbnail-item';
    div.dataset.index = index;
    div.draggable = true;

    div.innerHTML = `
        <div class="thumbnail-number">${index + 1}</div>
        <div class="thumbnail-select" onclick="event.stopPropagation(); togglePageSelection(${index})"></div>
        <img src="${pageData.canvas}" class="thumbnail-canvas" style="transform: rotate(${pageData.rotation}deg);" alt="Page ${index + 1}">
        ${pageData.rotation !== 0 ? `<div class="thumbnail-rotation">${pageData.rotation}°</div>` : ''}
        <div class="thumbnail-actions">
            <button onclick="event.stopPropagation(); rotatePage(${index}, -90)" title="Rotate Left">
                <i class="fas fa-undo"></i>
            </button>
            <button onclick="event.stopPropagation(); rotatePage(${index}, 90)" title="Rotate Right">
                <i class="fas fa-redo"></i>
            </button>
            <button onclick="event.stopPropagation(); deletePage(${index})" class="danger" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Click to select
    div.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey) {
            togglePageSelection(index);
        } else {
            clearSelection();
            togglePageSelection(index);
        }
    });

    // Drag events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('dragenter', handleDragEnter);
    div.addEventListener('dragleave', handleDragLeave);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragend', handleDragEnd);

    return div;
}

// Selection functions
function togglePageSelection(index) {
    const item = document.querySelector(`.thumbnail-item[data-index="${index}"]`);
    if (selectedPages.has(index)) {
        selectedPages.delete(index);
        item?.classList.remove('selected');
    } else {
        selectedPages.add(index);
        item?.classList.add('selected');
    }
    updateSelectionInfo();
}

function clearSelection() {
    selectedPages.clear();
    document.querySelectorAll('.thumbnail-item.selected').forEach(el => el.classList.remove('selected'));
    updateSelectionInfo();
}

function selectAllPages() {
    pdfPages.forEach((_, i) => {
        if (!pdfPages[i].deleted) {
            selectedPages.add(i);
            document.querySelector(`.thumbnail-item[data-index="${i}"]`)?.classList.add('selected');
        }
    });
    updateSelectionInfo();
    showToast(`✅ Selected ${selectedPages.size} pages`);
}

function updateSelectionInfo() {
    const activePages = pdfPages.filter(p => !p.deleted).length;
    const pageStats = document.getElementById('pageStats');
    if (pageStats) {
        pageStats.textContent = `${activePages} page${activePages > 1 ? 's' : ''} • ${selectedPages.size} selected`;
    }
}

// Rotation functions
function rotatePage(index, degrees) {
    pdfPages[index].rotation = (pdfPages[index].rotation + degrees + 360) % 360;
    const img = document.querySelector(`.thumbnail-item[data-index="${index}"] .thumbnail-canvas`);
    if (img) {
        img.style.transform = `rotate(${pdfPages[index].rotation}deg)`;
    }

    // Update rotation badge
    const item = document.querySelector(`.thumbnail-item[data-index="${index}"]`);
    let badge = item?.querySelector('.thumbnail-rotation');
    if (pdfPages[index].rotation !== 0) {
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'thumbnail-rotation';
            item?.insertBefore(badge, item.querySelector('.thumbnail-actions'));
        }
        badge.textContent = `${pdfPages[index].rotation}°`;
    } else if (badge) {
        badge.remove();
    }

    showToast(`🔄 Page ${index + 1} rotated ${degrees > 0 ? 'right' : 'left'}`);
}

function rotateSelectedPages(degrees) {
    if (selectedPages.size === 0) {
        showToast('⚠️ Select pages first');
        return;
    }
    selectedPages.forEach(index => rotatePage(index, degrees));
}

// Delete functions
function deletePage(index) {
    if (pdfPages.filter(p => !p.deleted).length <= 1) {
        showToast('⚠️ Cannot delete the only remaining page');
        return;
    }

    pdfPages[index].deleted = true;
    const item = document.querySelector(`.thumbnail-item[data-index="${index}"]`);
    if (item) {
        item.style.opacity = '0.3';
        item.style.pointerEvents = 'none';
        item.classList.add('deleted');
    }
    selectedPages.delete(index);
    updateSelectionInfo();
    renumberPages();
    showToast(`🗑️ Page ${index + 1} marked for deletion`);
}

function deleteSelectedPages() {
    if (selectedPages.size === 0) {
        showToast('⚠️ Select pages first');
        return;
    }

    const activeCount = pdfPages.filter(p => !p.deleted).length;
    if (selectedPages.size >= activeCount) {
        showToast('⚠️ Cannot delete all pages');
        return;
    }

    selectedPages.forEach(index => {
        pdfPages[index].deleted = true;
        const item = document.querySelector(`.thumbnail-item[data-index="${index}"]`);
        if (item) {
            item.style.opacity = '0.3';
            item.style.pointerEvents = 'none';
        }
    });

    showToast(`🗑️ ${selectedPages.size} pages marked for deletion`);
    selectedPages.clear();
    updateSelectionInfo();
    renumberPages();
}

function renumberPages() {
    let num = 1;
    document.querySelectorAll('.thumbnail-item').forEach(item => {
        const index = parseInt(item.dataset.index);
        const numEl = item.querySelector('.thumbnail-number');
        if (!pdfPages[index].deleted && numEl) {
            numEl.textContent = num++;
        }
    });
}

// Drag and Drop
function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    if (draggedItem !== this) {
        const grid = document.getElementById('thumbnailGrid');
        const items = Array.from(grid.children);
        const draggedIdx = items.indexOf(draggedItem);
        const targetIdx = items.indexOf(this);

        // Swap in pdfPages array
        const temp = pdfPages[draggedIdx];
        pdfPages.splice(draggedIdx, 1);
        pdfPages.splice(targetIdx, 0, temp);

        // Swap in DOM
        if (draggedIdx < targetIdx) {
            this.parentNode.insertBefore(draggedItem, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedItem, this);
        }

        // Update data-index and numbers
        grid.querySelectorAll('.thumbnail-item').forEach((item, i) => {
            item.dataset.index = i;
            const numEl = item.querySelector('.thumbnail-number');
            if (numEl && !pdfPages[i].deleted) {
                numEl.textContent = i + 1;
            }
        });

        renumberPages();
    }

    this.classList.remove('drag-over');
}

function handleDragEnd(e) {
    document.querySelectorAll('.thumbnail-item').forEach(item => {
        item.classList.remove('dragging', 'drag-over');
    });
    draggedItem = null;
}

// Process and save reordered PDF
async function processReorder() {
    const activePages = pdfPages.filter(p => !p.deleted);

    if (activePages.length === 0) {
        showToast('❌ No pages to save');
        return;
    }

    try {
        updateProgress(10, 'Creating new PDF...');

        const { PDFDocument, degrees } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const newPdf = await PDFDocument.create();

        for (let i = 0; i < pdfPages.length; i++) {
            const pageData = pdfPages[i];
            if (pageData.deleted) continue;

            updateProgress(10 + (i / pdfPages.length) * 80, `Processing page ${i + 1}...`);

            const [copiedPage] = await newPdf.copyPages(srcPdf, [pageData.originalIndex]);

            // Apply rotation
            if (pageData.rotation !== 0) {
                copiedPage.setRotation(degrees(copiedPage.getRotation().angle + pageData.rotation));
            }

            newPdf.addPage(copiedPage);
        }

        updateProgress(95, 'Saving...');
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'edited.pdf');
        showResult();
        showToast('✅ PDF saved successfully!');

    } catch (error) {
        console.error('Reorder error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// ==================== PDF READER ====================
let readerPdfDoc = null;
let currentPageNum = 1;
let readerScale = 1.0;
let readerRotation = 0;

async function initPdfReader(file) {
    const container = document.getElementById('readerContainer');
    if (!container) return;

    try {
        const arrayBuffer = await file.arrayBuffer();
        readerPdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        document.getElementById('totalPages').textContent = readerPdfDoc.numPages;
        container.style.display = 'block';

        currentPageNum = 1;
        readerScale = 1.0;
        readerRotation = 0;

        renderReaderPage(currentPageNum);
        showToast('📖 PDF Reader loaded!');

    } catch (error) {
        console.error('Reader error:', error);
        showToast('❌ Error loading PDF: ' + error.message);
    }
}

async function renderReaderPage(num) {
    if (!readerPdfDoc) return;

    const page = await readerPdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: readerScale, rotation: readerRotation });

    const canvas = document.getElementById('readerCanvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;

    document.getElementById('currentPage').textContent = num;
    document.getElementById('zoomLevel').textContent = Math.round(readerScale * 100) + '%';
}

function readerPrevPage() {
    if (currentPageNum <= 1) return;
    currentPageNum--;
    renderReaderPage(currentPageNum);
}

function readerNextPage() {
    if (!readerPdfDoc || currentPageNum >= readerPdfDoc.numPages) return;
    currentPageNum++;
    renderReaderPage(currentPageNum);
}

function readerZoomIn() {
    readerScale = Math.min(readerScale + 0.25, 3.0);
    renderReaderPage(currentPageNum);
}

function readerZoomOut() {
    readerScale = Math.max(readerScale - 0.25, 0.5);
    renderReaderPage(currentPageNum);
}

function readerRotate() {
    readerRotation = (readerRotation + 90) % 360;
    renderReaderPage(currentPageNum);
}

// ==================== OFFICE TOOL CONTENT TEMPLATES ====================

function getOfficeConvertContent(type) {
    return `
        ${getUploadArea(false)}
        <div style="margin-top:1rem;padding:1rem;background:#dbeafe;border-radius:8px;color:#1e40af;">
            <i class="fas fa-info-circle"></i> <strong>Note:</strong> ${type} to PDF conversion requires Microsoft Office or similar software.
            For best results, open your file in ${type === 'Excel' ? 'Excel' : 'PowerPoint'} and use "Save As PDF" or "Print to PDF".
        </div>
        <div style="margin-top:1rem;">
            <h4 style="margin-bottom:0.5rem;">Quick Instructions:</h4>
            <ol style="padding-left:1.5rem;color:var(--text-light);">
                <li>Open your file in Microsoft ${type === 'Excel' ? 'Excel' : 'PowerPoint'}</li>
                <li>Go to File → Save As (or Export)</li>
                <li>Choose PDF as the format</li>
                <li>Click Save</li>
            </ol>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="showOfficeGuide()">
            <i class="fas fa-external-link-alt"></i> Open ${type} Guide
        </button>
    `;
}

function getPdfToTextContent() {
    return `
        ${getUploadArea(false)}
        <div id="textExtractionResult" style="display:none;margin-top:1.5rem;">
            <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Extracted Text:</label>
            <textarea id="extractedText" readonly style="width:100%;height:300px;padding:1rem;border-radius:8px;border:1px solid #e2e8f0;font-family:monospace;resize:vertical;"></textarea>
            <div style="display:flex;gap:1rem;margin-top:1rem;">
                <button onclick="copyExtractedText()" class="process-btn" style="flex:1;">
                    <i class="fas fa-copy"></i> Copy Text
                </button>
                <button onclick="downloadExtractedText()" class="process-btn" style="flex:1;background:#22c55e;">
                    <i class="fas fa-download"></i> Download TXT
                </button>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processPdfToText()">
            <i class="fas fa-file-alt"></i> Extract Text
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
    `;
}

function getPdfViewerContent() {
    return `
        ${getUploadArea(false)}
        <div style="text-align:center;margin-top:1rem;">
            <p style="color:var(--text-light);margin-bottom:1rem;">
                <i class="fas fa-expand"></i> Upload a PDF to open the full-screen viewer with advanced controls
            </p>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="openFullscreenPdfViewer()">
            <i class="fas fa-expand"></i> Open Full-Screen Viewer
        </button>
    `;
}

// PDF to Text extraction
async function processPdfToText() {
    if (uploadedFiles.length === 0) return;

    try {
        updateProgress(20, 'Loading PDF...');
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            updateProgress(20 + (i / pdf.numPages) * 70, `Extracting page ${i}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        }

        document.getElementById('extractedText').value = fullText;
        document.getElementById('textExtractionResult').style.display = 'block';
        document.getElementById('progressContainer').classList.remove('active');
        showToast('✅ Text extracted successfully!');

    } catch (error) {
        console.error('Text extraction error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

function copyExtractedText() {
    const text = document.getElementById('extractedText').value;
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Text copied to clipboard!');
    });
}

function downloadExtractedText() {
    const text = document.getElementById('extractedText').value;
    const blob = new Blob([text], { type: 'text/plain' });
    downloadFile(blob, 'extracted_text.txt');
}

function showOfficeGuide() {
    showToast('📖 Open your file in Microsoft Office and use File → Save As PDF');
}

// ==================== FULL-SCREEN PDF VIEWER ====================
let viewerPdf = null;
let viewerCurrentPage = 1;
let viewerZoom = 1.0;
let viewerRotation = 0;
let viewerFile = null;
let viewerThumbnails = [];

function openFullscreenPdfViewer() {
    if (uploadedFiles.length === 0) {
        showToast('❌ Please upload a PDF first');
        return;
    }

    viewerFile = uploadedFiles[0];
    closeTool(); // Close the modal first

    const viewer = document.getElementById('fullscreenViewer');
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.getElementById('viewerFilename').textContent = viewerFile.name;

    loadPdfInViewer(viewerFile);
}

async function loadPdfInViewer(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        viewerPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        viewerCurrentPage = 1;
        viewerZoom = 1.0;
        viewerRotation = 0;

        document.getElementById('viewerTotalPages').textContent = viewerPdf.numPages;
        document.getElementById('viewerPageInput').max = viewerPdf.numPages;

        renderViewerPage();
        generateViewerThumbnails();

    } catch (error) {
        console.error('Viewer load error:', error);
        showToast('❌ Error loading PDF: ' + error.message);
    }
}

async function renderViewerPage() {
    if (!viewerPdf) return;

    const page = await viewerPdf.getPage(viewerCurrentPage);
    const canvas = document.getElementById('viewerCanvas');
    const context = canvas.getContext('2d');

    let scale = viewerZoom;

    // Fit width calculation
    if (viewerZoom === 'fit') {
        const container = document.getElementById('viewerMain');
        const defaultViewport = page.getViewport({ scale: 1 });
        scale = (container.clientWidth - 80) / defaultViewport.width;
    }

    const viewport = page.getViewport({ scale: parseFloat(scale), rotation: viewerRotation });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;

    document.getElementById('viewerPageInput').value = viewerCurrentPage;

    // Update zoom select
    const zoomSelect = document.getElementById('viewerZoomSelect');
    if (typeof viewerZoom === 'number') {
        zoomSelect.value = viewerZoom.toString();
    }

    // Highlight active thumbnail
    document.querySelectorAll('.sidebar-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === viewerCurrentPage - 1);
    });
}

async function generateViewerThumbnails() {
    const container = document.getElementById('viewerThumbnails');
    container.innerHTML = '';
    viewerThumbnails = [];

    for (let i = 1; i <= viewerPdf.numPages; i++) {
        const page = await viewerPdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        }).promise;

        const div = document.createElement('div');
        div.className = 'sidebar-thumb' + (i === 1 ? ' active' : '');
        div.onclick = () => viewerGoToPage(i);
        div.innerHTML = `
            <img src="${canvas.toDataURL()}" alt="Page ${i}">
            <div class="sidebar-thumb-num">${i}</div>
        `;

        container.appendChild(div);
        viewerThumbnails.push(canvas.toDataURL());
    }
}

function closeFullscreenViewer() {
    document.getElementById('fullscreenViewer').classList.remove('active');
    document.body.style.overflow = '';
    viewerPdf = null;
}

function viewerPrevPage() {
    if (viewerCurrentPage > 1) {
        viewerCurrentPage--;
        renderViewerPage();
    }
}

function viewerNextPage() {
    if (viewerPdf && viewerCurrentPage < viewerPdf.numPages) {
        viewerCurrentPage++;
        renderViewerPage();
    }
}

function viewerGoToPage(num) {
    const pageNum = parseInt(num);
    if (pageNum >= 1 && viewerPdf && pageNum <= viewerPdf.numPages) {
        viewerCurrentPage = pageNum;
        renderViewerPage();
    }
}

function viewerZoomIn() {
    if (typeof viewerZoom !== 'number') viewerZoom = 1.0;
    viewerZoom = Math.min(viewerZoom + 0.25, 3.0);
    document.getElementById('viewerZoomSelect').value = viewerZoom.toString();
    renderViewerPage();
}

function viewerZoomOut() {
    if (typeof viewerZoom !== 'number') viewerZoom = 1.0;
    viewerZoom = Math.max(viewerZoom - 0.25, 0.5);
    document.getElementById('viewerZoomSelect').value = viewerZoom.toString();
    renderViewerPage();
}

function viewerSetZoom(value) {
    viewerZoom = value === 'fit' ? 'fit' : parseFloat(value);
    renderViewerPage();
}

function viewerRotate() {
    viewerRotation = (viewerRotation + 90) % 360;
    renderViewerPage();
}

function viewerToggleSidebar() {
    document.getElementById('viewerSidebar').classList.toggle('hidden');
}

function viewerPrint() {
    if (!viewerFile) return;

    const url = URL.createObjectURL(viewerFile);
    const printWindow = window.open(url);
    printWindow.onload = () => {
        printWindow.print();
    };
}

function viewerDownload() {
    if (!viewerFile) return;
    downloadFile(viewerFile, viewerFile.name);
}

function viewerFullscreen() {
    const viewer = document.getElementById('fullscreenViewer');
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        viewer.requestFullscreen();
    }
}

// Keyboard navigation for viewer
document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById('fullscreenViewer');
    if (!viewer.classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
            viewerPrevPage();
            break;
        case 'ArrowRight':
        case 'PageDown':
            viewerNextPage();
            break;
        case 'Home':
            viewerGoToPage(1);
            break;
        case 'End':
            if (viewerPdf) viewerGoToPage(viewerPdf.numPages);
            break;
        case '+':
        case '=':
            viewerZoomIn();
            break;
        case '-':
            viewerZoomOut();
            break;
        case 'Escape':
            closeFullscreenViewer();
            break;
    }
});

// ==================== SUPER ADVANCED TOOLS CONTENT ====================

function getOcrContent() {
    return `
        ${getUploadArea(false)}
        <div style="margin-top:1rem;padding:1rem;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;">
            <p style="color:#92400e;margin:0;"><i class="fas fa-magic"></i> <strong>OCR (Optical Character Recognition)</strong> - Converts scanned images/PDFs to searchable text using AI.</p>
        </div>
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Language:</label>
            <select id="ocrLanguage" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="spa">Spanish</option>
                <option value="fra">French</option>
                <option value="deu">German</option>
                <option value="chi_sim">Chinese (Simplified)</option>
            </select>
        </div>
        <div id="ocrResult" style="display:none;margin-top:1.5rem;">
            <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Recognized Text:</label>
            <textarea id="ocrText" readonly style="width:100%;height:250px;padding:1rem;border-radius:8px;border:1px solid #e2e8f0;font-family:monospace;"></textarea>
            <div style="display:flex;gap:1rem;margin-top:1rem;">
                <button onclick="copyOcrText()" class="process-btn" style="flex:1;"><i class="fas fa-copy"></i> Copy</button>
                <button onclick="downloadOcrText()" class="process-btn" style="flex:1;background:#22c55e;"><i class="fas fa-download"></i> Download TXT</button>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processOcr()">
            <i class="fas fa-eye"></i> Start OCR Scan
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
    `;
}

function getAnnotateContent() {
    return `
        ${getUploadArea(false)}
        <div id="annotationSection" style="display:none;margin-top:1.5rem;">
            <div class="annotation-toolbar" style="display:flex;gap:0.5rem;flex-wrap:wrap;padding:1rem;background:#f1f5f9;border-radius:12px;margin-bottom:1rem;">
                <button onclick="setAnnotationTool('pen')" class="annotation-tool active" id="toolPen">
                    <i class="fas fa-pen"></i> Draw
                </button>
                <button onclick="setAnnotationTool('highlight')" class="annotation-tool" id="toolHighlight">
                    <i class="fas fa-highlighter"></i> Highlight
                </button>
                <button onclick="setAnnotationTool('text')" class="annotation-tool" id="toolText">
                    <i class="fas fa-font"></i> Text
                </button>
                <button onclick="setAnnotationTool('rect')" class="annotation-tool" id="toolRect">
                    <i class="fas fa-square"></i> Rectangle
                </button>
                <button onclick="setAnnotationTool('arrow')" class="annotation-tool" id="toolArrow">
                    <i class="fas fa-arrow-right"></i> Arrow
                </button>
                <input type="color" id="annotationColor" value="#ff0000" style="width:40px;height:36px;padding:0;border:none;cursor:pointer;">
                <select id="annotationSize" style="padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                    <option value="2">Thin</option>
                    <option value="4" selected>Medium</option>
                    <option value="8">Thick</option>
                </select>
                <button onclick="clearAnnotations()" style="margin-left:auto;padding:0.5rem 1rem;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;">
                    <i class="fas fa-trash"></i> Clear All
                </button>
            </div>
            <div class="annotation-canvas-container" style="position:relative;background:#525659;border-radius:12px;overflow:hidden;">
                <canvas id="annotationCanvas" style="display:block;margin:0 auto;cursor:crosshair;"></canvas>
            </div>
            <div style="display:flex;gap:1rem;margin-top:1rem;">
                <button onclick="prevAnnotationPage()" class="process-btn" style="flex:1;"><i class="fas fa-chevron-left"></i> Prev</button>
                <span id="annotationPageInfo" style="display:flex;align-items:center;font-weight:600;">Page 1 of 1</span>
                <button onclick="nextAnnotationPage()" class="process-btn" style="flex:1;"><i class="fas fa-chevron-right"></i> Next</button>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="loadAnnotationPdf()">
            <i class="fas fa-highlighter"></i> Open for Annotation
        </button>
        <button class="process-btn" id="saveAnnotationBtn" style="display:none;background:#22c55e;" onclick="saveAnnotatedPdf()">
            <i class="fas fa-save"></i> Save Annotated PDF
        </button>
    `;
}

function getHeaderFooterContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Header Text:</label>
                    <input type="text" id="headerText" placeholder="Document Title" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                </div>
                <div>
                    <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Footer Text:</label>
                    <input type="text" id="footerText" placeholder="Page {page} of {total}" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                </div>
            </div>
            <p style="font-size:0.85rem;color:var(--text-light);margin-top:0.5rem;">
                Use <code>{page}</code> for page number and <code>{total}</code> for total pages.
            </p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
                <div>
                    <label style="font-weight:500;display:block;margin-bottom:0.25rem;">Header Position</label>
                    <select id="headerPosition" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                        <option value="left">Left</option>
                        <option value="center" selected>Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div>
                    <label style="font-weight:500;display:block;margin-bottom:0.25rem;">Footer Position</label>
                    <select id="footerPosition" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">
                        <option value="left">Left</option>
                        <option value="center" selected>Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processHeaderFooter()">
            <i class="fas fa-heading"></i> Add Header & Footer
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Header & Footer Added!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

function getBatesContent() {
    return `
        ${getUploadArea(false)}
        <div style="margin-top:1rem;padding:1rem;background:#dbeafe;border-radius:8px;color:#1e40af;">
            <i class="fas fa-gavel"></i> <strong>Bates Numbering</strong> - A unique identifier used in legal, business, and medical fields to label and identify each page in a document set.
        </div>
        <div class="options-section" style="margin-top:1.5rem;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Prefix:</label>
                    <input type="text" id="batesPrefix" value="DOC-" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                </div>
                <div>
                    <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Starting Number:</label>
                    <input type="number" id="batesStart" value="1" min="1" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
                <div>
                    <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Suffix:</label>
                    <input type="text" id="batesSuffix" value="" placeholder="Optional" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                </div>
                <div>
                    <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Number of Digits:</label>
                    <select id="batesDigits" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                        <option value="4">4 (0001)</option>
                        <option value="5">5 (00001)</option>
                        <option value="6" selected>6 (000001)</option>
                        <option value="8">8 (00000001)</option>
                    </select>
                </div>
            </div>
            <div style="margin-top:1rem;">
                <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Position:</label>
                <select id="batesPosition" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                    <option value="bottom-right" selected>Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                </select>
            </div>
            <div style="margin-top:1rem;padding:1rem;background:#f1f5f9;border-radius:8px;">
                <strong>Preview:</strong> <span id="batesPreview">DOC-000001</span>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processBates()">
            <i class="fas fa-gavel"></i> Apply Bates Numbering
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Bates Numbering Applied!</h3>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download PDF</button>
        </div>
    `;
}

function getBatchContent() {
    return `
        ${getUploadArea(true)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Select Batch Action:</label>
            <select id="batchAction" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
                <option value="merge">Merge All PDFs</option>
                <option value="compress">Compress All PDFs</option>
                <option value="rotate90">Rotate All 90° Right</option>
                <option value="rotate180">Rotate All 180°</option>
                <option value="addPageNumbers">Add Page Numbers to All</option>
                <option value="addWatermark">Add Watermark to All</option>
            </select>
            <div id="batchWatermarkOption" style="display:none;margin-top:1rem;">
                <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Watermark Text:</label>
                <input type="text" id="batchWatermark" placeholder="CONFIDENTIAL" style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid #e2e8f0;">
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processBatch()">
            <i class="fas fa-layer-group"></i> Process Batch
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>Batch Processing Complete!</h3>
            <div id="batchDownloadLinks"></div>
        </div>
    `;
}

function getOptimizerContent() {
    return `
        ${getUploadArea(false)}
        <div class="options-section" style="margin-top:1.5rem;">
            <label style="font-weight:600;margin-bottom:0.5rem;display:block;">Optimization Options:</label>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.75rem;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                    <input type="checkbox" id="optRemoveMetadata" checked style="width:18px;height:18px;">
                    <span><strong>Remove Metadata</strong> - Strip title, author, creation date</span>
                </label>
                <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.75rem;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                    <input type="checkbox" id="optRemoveAnnotations" style="width:18px;height:18px;">
                    <span><strong>Remove Annotations</strong> - Strip comments and highlights</span>
                </label>
                <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.75rem;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                    <input type="checkbox" id="optLinearize" checked style="width:18px;height:18px;">
                    <span><strong>Optimize for Web</strong> - Fast web viewing (linearization)</span>
                </label>
                <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.75rem;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                    <input type="checkbox" id="optCompressImages" checked style="width:18px;height:18px;">
                    <span><strong>Compress Images</strong> - Reduce image quality/size</span>
                </label>
            </div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="processOptimize()">
            <i class="fas fa-magic"></i> Optimize PDF
        </button>
        <div class="progress-container" id="progressContainer">
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <p class="progress-text" id="progressText">Processing...</p>
        </div>
        <div class="result-section" id="resultSection">
            <i class="fas fa-check-circle"></i>
            <h3>PDF Optimized!</h3>
            <p id="optimizeStats" style="margin:1rem 0;"></p>
            <button class="download-btn" id="downloadBtn"><i class="fas fa-download"></i> Download Optimized PDF</button>
        </div>
    `;
}

function getFormFillerContent() {
    return `
        ${getUploadArea(false)}
        <div id="formFieldsSection" style="display:none;margin-top:1.5rem;">
            <h4 style="margin-bottom:1rem;"><i class="fas fa-edit"></i> Detected Form Fields:</h4>
            <div id="formFieldsList" style="display:flex;flex-direction:column;gap:1rem;max-height:400px;overflow-y:auto;padding:1rem;background:#f8fafc;border-radius:12px;"></div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="loadFormFields()">
            <i class="fas fa-search"></i> Detect Form Fields
        </button>
        <button class="process-btn" id="saveFormBtn" style="display:none;background:#22c55e;" onclick="saveFilledForm()">
            <i class="fas fa-save"></i> Save Filled Form
        </button>
    `;
}

function getPdfCompareContent() {
    return `
        <p style="text-align:center;color:var(--text-light);margin-bottom:1rem;">
            <i class="fas fa-not-equal"></i> Upload 2 PDFs to compare visually
        </p>
        ${getUploadArea(true)}
        <div id="comparisonResult" style="display:none;margin-top:1.5rem;">
            <div class="comparison-slider" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <h4 style="text-align:center;margin-bottom:0.75rem;color:var(--text);">PDF 1 (Original)</h4>
                    <canvas id="compareCanvas1" style="width:100%;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);"></canvas>
                </div>
                <div>
                    <h4 style="text-align:center;margin-bottom:0.75rem;color:var(--text);">PDF 2 (Comparison)</h4>
                    <canvas id="compareCanvas2" style="width:100%;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);"></canvas>
                </div>
            </div>
            <div style="display:flex;justify-content:center;gap:1rem;margin-top:1rem;">
                <button onclick="prevComparePage()" class="process-btn"><i class="fas fa-chevron-left"></i> Prev</button>
                <span id="comparePageInfo" style="display:flex;align-items:center;font-weight:600;">Page 1</span>
                <button onclick="nextComparePage()" class="process-btn"><i class="fas fa-chevron-right"></i> Next</button>
            </div>
            <div id="diffStats" style="margin-top:1rem;padding:1rem;background:#f1f5f9;border-radius:8px;text-align:center;"></div>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="startPdfCompare()">
            <i class="fas fa-not-equal"></i> Compare PDFs
        </button>
    `;
}

// ==================== ADVANCED TOOL PROCESS FUNCTIONS ====================

// OCR Processing
async function processOcr() {
    if (uploadedFiles.length === 0) return;

    try {
        updateProgress(10, 'Loading Tesseract.js...');

        // Check if Tesseract is loaded
        if (typeof Tesseract === 'undefined') {
            // Load Tesseract.js dynamically
            await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js');
        }

        updateProgress(20, 'Preparing image...');
        const file = uploadedFiles[0];
        let imageData;

        if (file.type === 'application/pdf') {
            // Render first page of PDF to image
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 2.0 });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            }).promise;

            imageData = canvas.toDataURL('image/png');
        } else {
            // Use image directly
            imageData = URL.createObjectURL(file);
        }

        const lang = document.getElementById('ocrLanguage').value;

        updateProgress(30, 'Running OCR (this may take a minute)...');

        const result = await Tesseract.recognize(imageData, lang, {
            logger: m => {
                if (m.status === 'recognizing text') {
                    updateProgress(30 + m.progress * 60, `Recognizing text... ${Math.round(m.progress * 100)}%`);
                }
            }
        });

        document.getElementById('ocrText').value = result.data.text;
        document.getElementById('ocrResult').style.display = 'block';
        document.getElementById('progressContainer').classList.remove('active');
        showToast('✅ OCR completed!');

    } catch (error) {
        console.error('OCR error:', error);
        showToast('❌ OCR Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

function copyOcrText() {
    navigator.clipboard.writeText(document.getElementById('ocrText').value);
    showToast('✅ Copied to clipboard!');
}

function downloadOcrText() {
    const blob = new Blob([document.getElementById('ocrText').value], { type: 'text/plain' });
    downloadFile(blob, 'ocr_result.txt');
}

// Header & Footer
async function processHeaderFooter() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const font = await pdf.embedFont(StandardFonts.Helvetica);

        const headerText = document.getElementById('headerText').value || '';
        const footerText = document.getElementById('footerText').value || '';
        const headerPos = document.getElementById('headerPosition').value;
        const footerPos = document.getElementById('footerPosition').value;

        const pages = pdf.getPages();
        const totalPages = pages.length;

        pages.forEach((page, i) => {
            const { width, height } = page.getSize();

            // Header
            if (headerText) {
                let x = 50;
                if (headerPos === 'center') x = width / 2 - font.widthOfTextAtSize(headerText, 10) / 2;
                if (headerPos === 'right') x = width - 50 - font.widthOfTextAtSize(headerText, 10);

                page.drawText(headerText, { x, y: height - 30, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
            }

            // Footer
            if (footerText) {
                let text = footerText.replace('{page}', i + 1).replace('{total}', totalPages);
                let x = 50;
                if (footerPos === 'center') x = width / 2 - font.widthOfTextAtSize(text, 10) / 2;
                if (footerPos === 'right') x = width - 50 - font.widthOfTextAtSize(text, 10);

                page.drawText(text, { x, y: 20, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
            }

            updateProgress(30 + (i / totalPages) * 60, `Processing page ${i + 1}...`);
        });

        updateProgress(95, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'with_header_footer.pdf');
        showResult();
        showToast('✅ Header & Footer added!');

    } catch (error) {
        console.error('Header/Footer error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Bates Numbering
async function processBates() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const file = uploadedFiles[0];

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const font = await pdf.embedFont(StandardFonts.CourierBold);

        const prefix = document.getElementById('batesPrefix').value || '';
        const suffix = document.getElementById('batesSuffix').value || '';
        const startNum = parseInt(document.getElementById('batesStart').value) || 1;
        const digits = parseInt(document.getElementById('batesDigits').value);
        const position = document.getElementById('batesPosition').value;

        const pages = pdf.getPages();

        pages.forEach((page, i) => {
            const { width, height } = page.getSize();
            const batesNum = prefix + String(startNum + i).padStart(digits, '0') + suffix;

            let x = width - 100, y = 20;
            if (position === 'bottom-left') { x = 20; y = 20; }
            if (position === 'bottom-center') { x = width / 2 - 30; y = 20; }
            if (position === 'top-right') { x = width - 100; y = height - 30; }
            if (position === 'top-left') { x = 20; y = height - 30; }

            page.drawText(batesNum, { x, y, size: 9, font, color: rgb(0, 0, 0) });
            updateProgress(30 + (i / pages.length) * 60, `Processing page ${i + 1}...`);
        });

        updateProgress(95, 'Saving...');
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'bates_numbered.pdf');
        showResult();
        showToast('✅ Bates Numbering applied!');

    } catch (error) {
        console.error('Bates error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Update Bates preview
document.addEventListener('input', (e) => {
    if (['batesPrefix', 'batesStart', 'batesSuffix', 'batesDigits'].includes(e.target.id)) {
        const preview = document.getElementById('batesPreview');
        if (preview) {
            const prefix = document.getElementById('batesPrefix')?.value || '';
            const suffix = document.getElementById('batesSuffix')?.value || '';
            const startNum = parseInt(document.getElementById('batesStart')?.value) || 1;
            const digits = parseInt(document.getElementById('batesDigits')?.value) || 6;
            preview.textContent = prefix + String(startNum).padStart(digits, '0') + suffix;
        }
    }

    // Show/hide batch watermark option
    if (e.target.id === 'batchAction') {
        const watermarkOpt = document.getElementById('batchWatermarkOption');
        if (watermarkOpt) {
            watermarkOpt.style.display = e.target.value === 'addWatermark' ? 'block' : 'none';
        }
    }
});

// Batch Processing
async function processBatch() {
    if (uploadedFiles.length < 1) return;

    const action = document.getElementById('batchAction').value;
    const downloadLinks = document.getElementById('batchDownloadLinks');
    downloadLinks.innerHTML = '';

    try {
        const { PDFDocument, degrees, rgb, StandardFonts } = PDFLib;

        if (action === 'merge') {
            updateProgress(10, 'Merging all PDFs...');
            const mergedPdf = await PDFDocument.create();

            for (let i = 0; i < uploadedFiles.length; i++) {
                updateProgress(10 + (i / uploadedFiles.length) * 80, `Merging ${uploadedFiles[i].name}...`);
                const arrayBuffer = await uploadedFiles[i].arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            downloadLinks.innerHTML = `<button class="download-btn" onclick="downloadFile(window.batchBlob, 'merged.pdf')"><i class="fas fa-download"></i> Download Merged PDF</button>`;
            window.batchBlob = blob;

        } else {
            // Process each file individually
            for (let i = 0; i < uploadedFiles.length; i++) {
                updateProgress(10 + (i / uploadedFiles.length) * 80, `Processing ${uploadedFiles[i].name}...`);

                const arrayBuffer = await uploadedFiles[i].arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);

                if (action === 'compress') {
                    pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); pdf.setKeywords([]);
                } else if (action === 'rotate90') {
                    pdf.getPages().forEach(p => p.setRotation(degrees(p.getRotation().angle + 90)));
                } else if (action === 'rotate180') {
                    pdf.getPages().forEach(p => p.setRotation(degrees(p.getRotation().angle + 180)));
                } else if (action === 'addPageNumbers') {
                    const font = await pdf.embedFont(StandardFonts.Helvetica);
                    const pages = pdf.getPages();
                    pages.forEach((p, idx) => {
                        const { width } = p.getSize();
                        p.drawText(`${idx + 1}`, { x: width / 2, y: 20, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
                    });
                } else if (action === 'addWatermark') {
                    const watermark = document.getElementById('batchWatermark').value || 'CONFIDENTIAL';
                    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
                    pdf.getPages().forEach(p => {
                        const { width, height } = p.getSize();
                        p.drawText(watermark, { x: width / 2 - 100, y: height / 2, size: 50, font, color: rgb(0.8, 0.8, 0.8), opacity: 0.3 });
                    });
                }

                const pdfBytes = await pdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                downloadLinks.innerHTML += `<a href="${url}" download="processed_${uploadedFiles[i].name}" class="download-btn" style="margin:0.25rem;display:inline-block;"><i class="fas fa-download"></i> ${uploadedFiles[i].name}</a>`;
            }
        }

        showResult();
        showToast('✅ Batch processing complete!');

    } catch (error) {
        console.error('Batch error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// PDF Optimizer
async function processOptimize() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const originalSize = file.size;

        updateProgress(30, 'Loading PDF...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

        updateProgress(50, 'Optimizing...');

        if (document.getElementById('optRemoveMetadata').checked) {
            pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject('');
            pdf.setKeywords([]); pdf.setProducer(''); pdf.setCreator('');
        }

        updateProgress(80, 'Saving optimized PDF...');
        const pdfBytes = await pdf.save({
            useObjectStreams: document.getElementById('optLinearize').checked
        });

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const newSize = blob.size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        document.getElementById('optimizeStats').textContent =
            `Reduced from ${formatFileSize(originalSize)} to ${formatFileSize(newSize)} (${reduction > 0 ? reduction + '% smaller' : 'no significant change'})`;

        document.getElementById('downloadBtn').onclick = () => downloadFile(blob, 'optimized.pdf');
        showResult();
        showToast('✅ PDF optimized!');

    } catch (error) {
        console.error('Optimize error:', error);
        showToast('❌ Error: ' + error.message);
        document.getElementById('progressContainer').classList.remove('active');
    }
}

// Form Filler
async function loadFormFields() {
    if (uploadedFiles.length === 0) return;

    try {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];

        const arrayBuffer = await file.arrayBuffer();
        window.formPdf = await PDFDocument.load(arrayBuffer);

        const form = window.formPdf.getForm();
        const fields = form.getFields();

        const fieldsList = document.getElementById('formFieldsList');
        fieldsList.innerHTML = '';

        if (fields.length === 0) {
            fieldsList.innerHTML = '<p style="text-align:center;color:var(--text-light);">No form fields detected in this PDF.</p>';
        } else {
            fields.forEach((field, i) => {
                const name = field.getName();
                const type = field.constructor.name;

                let inputHtml = '';
                if (type === 'PDFTextField') {
                    inputHtml = `<input type="text" id="field_${i}" data-field="${name}" placeholder="Enter value..." style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">`;
                } else if (type === 'PDFCheckBox') {
                    inputHtml = `<label><input type="checkbox" id="field_${i}" data-field="${name}"> Check</label>`;
                } else if (type === 'PDFDropdown') {
                    const options = field.getOptions();
                    inputHtml = `<select id="field_${i}" data-field="${name}" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e2e8f0;">${options.map(o => `<option>${o}</option>`).join('')}</select>`;
                }

                fieldsList.innerHTML += `
                    <div style="padding:0.75rem;background:white;border-radius:8px;border:1px solid #e2e8f0;">
                        <label style="font-weight:600;display:block;margin-bottom:0.5rem;">${name}</label>
                        ${inputHtml}
                    </div>
                `;
            });
        }

        document.getElementById('formFieldsSection').style.display = 'block';
        document.getElementById('saveFormBtn').style.display = fields.length > 0 ? 'block' : 'none';
        document.getElementById('processBtn').style.display = 'none';
        showToast(`✅ Found ${fields.length} form field(s)`);

    } catch (error) {
        console.error('Form load error:', error);
        showToast('❌ Error: ' + error.message);
    }
}

async function saveFilledForm() {
    try {
        const form = window.formPdf.getForm();

        document.querySelectorAll('#formFieldsList input, #formFieldsList select').forEach(input => {
            const fieldName = input.dataset.field;
            const field = form.getField(fieldName);

            if (field && field.constructor.name === 'PDFTextField') {
                field.setText(input.value);
            } else if (field && field.constructor.name === 'PDFCheckBox') {
                if (input.checked) field.check(); else field.uncheck();
            } else if (field && field.constructor.name === 'PDFDropdown') {
                field.select(input.value);
            }
        });

        const pdfBytes = await window.formPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        downloadFile(blob, 'filled_form.pdf');
        showToast('✅ Form saved!');

    } catch (error) {
        console.error('Form save error:', error);
        showToast('❌ Error: ' + error.message);
    }
}

// PDF Compare
let comparePdf1 = null, comparePdf2 = null, compareCurrentPage = 1;

async function startPdfCompare() {
    if (uploadedFiles.length < 2) {
        showToast('❌ Please upload 2 PDFs to compare');
        return;
    }

    try {
        const ab1 = await uploadedFiles[0].arrayBuffer();
        const ab2 = await uploadedFiles[1].arrayBuffer();

        comparePdf1 = await pdfjsLib.getDocument({ data: ab1 }).promise;
        comparePdf2 = await pdfjsLib.getDocument({ data: ab2 }).promise;

        compareCurrentPage = 1;
        document.getElementById('comparisonResult').style.display = 'block';

        renderComparePages();
        showToast('✅ PDFs loaded for comparison');

    } catch (error) {
        console.error('Compare error:', error);
        showToast('❌ Error: ' + error.message);
    }
}

async function renderComparePages() {
    if (!comparePdf1 || !comparePdf2) return;

    const page1 = await comparePdf1.getPage(Math.min(compareCurrentPage, comparePdf1.numPages));
    const page2 = await comparePdf2.getPage(Math.min(compareCurrentPage, comparePdf2.numPages));

    const viewport1 = page1.getViewport({ scale: 1.0 });
    const viewport2 = page2.getViewport({ scale: 1.0 });

    const canvas1 = document.getElementById('compareCanvas1');
    const canvas2 = document.getElementById('compareCanvas2');

    canvas1.width = viewport1.width;
    canvas1.height = viewport1.height;
    canvas2.width = viewport2.width;
    canvas2.height = viewport2.height;

    await page1.render({ canvasContext: canvas1.getContext('2d'), viewport: viewport1 }).promise;
    await page2.render({ canvasContext: canvas2.getContext('2d'), viewport: viewport2 }).promise;

    document.getElementById('comparePageInfo').textContent = `Page ${compareCurrentPage} / ${Math.max(comparePdf1.numPages, comparePdf2.numPages)}`;

    // Simple diff stats
    document.getElementById('diffStats').innerHTML = `
        <strong>PDF 1:</strong> ${comparePdf1.numPages} pages | 
        <strong>PDF 2:</strong> ${comparePdf2.numPages} pages
    `;
}

function prevComparePage() {
    if (compareCurrentPage > 1) {
        compareCurrentPage--;
        renderComparePages();
    }
}

function nextComparePage() {
    const maxPages = Math.max(comparePdf1?.numPages || 1, comparePdf2?.numPages || 1);
    if (compareCurrentPage < maxPages) {
        compareCurrentPage++;
        renderComparePages();
    }
}

// Annotation tool placeholders
function loadAnnotationPdf() {
    showToast('📝 Annotation tool opening... (Canvas-based annotation coming soon)');
    document.getElementById('annotationSection').style.display = 'block';
    document.getElementById('processBtn').style.display = 'none';
    document.getElementById('saveAnnotationBtn').style.display = 'block';
}

function setAnnotationTool(tool) {
    document.querySelectorAll('.annotation-tool').forEach(el => el.classList.remove('active'));
    document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1))?.classList.add('active');
    showToast(`Selected: ${tool}`);
}

function clearAnnotations() {
    showToast('🗑️ Annotations cleared');
}

function saveAnnotatedPdf() {
    showToast('💾 Saving annotated PDF...');
}

// Load external script helper
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ==================== FULL-SCREEN PDF EDITOR ====================

function getPdfEditorContent() {
    return `
        ${getUploadArea(false)}
        <div style="margin-top:1rem;padding:1rem;background:linear-gradient(135deg,#dbeafe,#e0e7ff);border-radius:12px;">
            <p style="color:#1e40af;margin:0;"><i class="fas fa-magic"></i> <strong>PRO PDF Editor</strong> - Edit text directly on PDF, erase words with white-out, draw, add shapes, images, and stamps!</p>
        </div>
        <button class="process-btn" id="processBtn" disabled onclick="openPdfEditor()">
            <i class="fas fa-edit"></i> Open Full-Screen Editor
        </button>
    `;
}

// Editor State
let editorPdf = null;
let editorPdfBytes = null;
let editorCurrentPage = 1;
let editorTotalPages = 1;
let editorZoom = 1.0;
let editorTool = 'select';
let editorFile = null;

// Canvas State
let editorBgCanvas, editorBgCtx, editorOverlayCanvas, editorOverlayCtx;
let editorIsDrawing = false;
let editorStartX, editorStartY, editorLastX, editorLastY;

// Edits History (for undo/redo)
let editorHistory = [];
let historyIndex = -1;
let pageEdits = {}; // Store edits per page

// Pending text position
let pendingTextPos = null;
let stampToAdd = null;

function openPdfEditor() {
    if (uploadedFiles.length === 0) {
        showToast('❌ Please upload a PDF first');
        return;
    }

    editorFile = uploadedFiles[0];
    closeTool();

    const editor = document.getElementById('pdfEditor');
    editor.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.getElementById('editorFilename').textContent = editorFile.name;

    loadPdfInEditor(editorFile);
}

async function loadPdfInEditor(file) {
    try {
        editorPdfBytes = await file.arrayBuffer();
        editorPdf = await pdfjsLib.getDocument({ data: editorPdfBytes }).promise;

        editorCurrentPage = 1;
        editorTotalPages = editorPdf.numPages;
        editorZoom = 1.0;
        editorHistory = [];
        historyIndex = -1;
        pageEdits = {};

        document.getElementById('editorTotalPages').textContent = editorTotalPages;
        document.getElementById('editorCurrentPage').textContent = editorCurrentPage;

        // Initialize canvases
        editorBgCanvas = document.getElementById('editorBackgroundCanvas');
        editorBgCtx = editorBgCanvas.getContext('2d');
        editorOverlayCanvas = document.getElementById('editorOverlayCanvas');
        editorOverlayCtx = editorOverlayCanvas.getContext('2d');

        // Setup event listeners
        setupEditorEvents();

        // Render first page
        await renderEditorPage();

        updateStatus('Ready to edit');
        showToast('✅ PDF loaded in editor!');

    } catch (error) {
        console.error('Editor load error:', error);
        showToast('❌ Error loading PDF: ' + error.message);
    }
}

async function renderEditorPage() {
    if (!editorPdf) return;

    const page = await editorPdf.getPage(editorCurrentPage);
    const viewport = page.getViewport({ scale: editorZoom * 1.5 });

    editorBgCanvas.width = viewport.width;
    editorBgCanvas.height = viewport.height;
    editorOverlayCanvas.width = viewport.width;
    editorOverlayCanvas.height = viewport.height;

    // Render PDF page
    await page.render({
        canvasContext: editorBgCtx,
        viewport: viewport
    }).promise;

    // Clear overlay and redraw edits for this page
    editorOverlayCtx.clearRect(0, 0, editorOverlayCanvas.width, editorOverlayCanvas.height);
    if (pageEdits[editorCurrentPage]) {
        replayEdits(pageEdits[editorCurrentPage]);
    }

    document.getElementById('editorCurrentPage').textContent = editorCurrentPage;
    document.getElementById('editorZoomDisplay').textContent = Math.round(editorZoom * 100) + '%';
}

function replayEdits(edits) {
    edits.forEach(edit => {
        applyEdit(edit, false);
    });
}

function setupEditorEvents() {
    editorOverlayCanvas.onmousedown = handleEditorMouseDown;
    editorOverlayCanvas.onmousemove = handleEditorMouseMove;
    editorOverlayCanvas.onmouseup = handleEditorMouseUp;
    editorOverlayCanvas.onmouseleave = handleEditorMouseUp;

    // Touch support
    editorOverlayCanvas.ontouchstart = (e) => { e.preventDefault(); handleEditorMouseDown(e.touches[0]); };
    editorOverlayCanvas.ontouchmove = (e) => { e.preventDefault(); handleEditorMouseMove(e.touches[0]); };
    editorOverlayCanvas.ontouchend = handleEditorMouseUp;
}

function getEditorCanvasCoords(e) {
    const rect = editorOverlayCanvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (editorOverlayCanvas.width / rect.width),
        y: (e.clientY - rect.top) * (editorOverlayCanvas.height / rect.height)
    };
}

function handleEditorMouseDown(e) {
    const pos = getEditorCanvasCoords(e);
    editorStartX = editorLastX = pos.x;
    editorStartY = editorLastY = pos.y;
    editorIsDrawing = true;

    if (editorTool === 'text') {
        pendingTextPos = { x: pos.x, y: pos.y };
        document.getElementById('textInputModal').classList.add('active');
        document.getElementById('editorTextInput').focus();
        editorIsDrawing = false;
        return;
    }

    if (editorTool === 'draw' || editorTool === 'highlight' || editorTool === 'erase') {
        editorOverlayCtx.beginPath();
        editorOverlayCtx.moveTo(pos.x, pos.y);
    }
}

function handleEditorMouseMove(e) {
    if (!editorIsDrawing) return;

    const pos = getEditorCanvasCoords(e);
    const color = document.getElementById('editorColor').value;
    const strokeWidth = parseInt(document.getElementById('editorStrokeWidth').value);

    if (editorTool === 'draw') {
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.lineCap = 'round';
        editorOverlayCtx.lineJoin = 'round';
        editorOverlayCtx.lineTo(pos.x, pos.y);
        editorOverlayCtx.stroke();
        editorOverlayCtx.beginPath();
        editorOverlayCtx.moveTo(pos.x, pos.y);
    } else if (editorTool === 'highlight') {
        editorOverlayCtx.strokeStyle = hexToRgba(color, 0.3);
        editorOverlayCtx.lineWidth = 20;
        editorOverlayCtx.lineCap = 'round';
        editorOverlayCtx.lineTo(pos.x, pos.y);
        editorOverlayCtx.stroke();
        editorOverlayCtx.beginPath();
        editorOverlayCtx.moveTo(pos.x, pos.y);
    } else if (editorTool === 'erase') {
        // White-out eraser
        editorOverlayCtx.strokeStyle = 'white';
        editorOverlayCtx.lineWidth = strokeWidth * 5;
        editorOverlayCtx.lineCap = 'round';
        editorOverlayCtx.lineTo(pos.x, pos.y);
        editorOverlayCtx.stroke();
        editorOverlayCtx.beginPath();
        editorOverlayCtx.moveTo(pos.x, pos.y);
    }

    editorLastX = pos.x;
    editorLastY = pos.y;
}

function handleEditorMouseUp(e) {
    if (!editorIsDrawing) return;
    editorIsDrawing = false;

    if (!e) return;
    const pos = getEditorCanvasCoords(e);

    const color = document.getElementById('editorColor').value;
    const strokeWidth = parseInt(document.getElementById('editorStrokeWidth').value);

    // Save the edit
    let edit = null;

    if (editorTool === 'draw') {
        // For draw, we save a path (simplified: save as line between points)
        edit = { type: 'draw', color, strokeWidth, x1: editorStartX, y1: editorStartY, x2: pos.x, y2: pos.y };
    } else if (editorTool === 'erase') {
        edit = { type: 'erase', x1: editorStartX, y1: editorStartY, x2: pos.x, y2: pos.y, strokeWidth: strokeWidth * 5 };
    } else if (editorTool === 'highlight') {
        edit = { type: 'highlight', color, x1: editorStartX, y1: editorStartY, x2: pos.x, y2: pos.y };
    } else if (editorTool === 'rect') {
        const w = pos.x - editorStartX;
        const h = pos.y - editorStartY;
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.strokeRect(editorStartX, editorStartY, w, h);
        edit = { type: 'rect', color, strokeWidth, x: editorStartX, y: editorStartY, w, h };
    } else if (editorTool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - editorStartX, 2) + Math.pow(pos.y - editorStartY, 2));
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.beginPath();
        editorOverlayCtx.arc(editorStartX, editorStartY, radius, 0, Math.PI * 2);
        editorOverlayCtx.stroke();
        edit = { type: 'circle', color, strokeWidth, cx: editorStartX, cy: editorStartY, radius };
    } else if (editorTool === 'line' || editorTool === 'arrow') {
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.beginPath();
        editorOverlayCtx.moveTo(editorStartX, editorStartY);
        editorOverlayCtx.lineTo(pos.x, pos.y);
        editorOverlayCtx.stroke();

        if (editorTool === 'arrow') {
            drawEditorArrowHead(editorOverlayCtx, editorStartX, editorStartY, pos.x, pos.y, strokeWidth, color);
        }

        edit = { type: editorTool, color, strokeWidth, x1: editorStartX, y1: editorStartY, x2: pos.x, y2: pos.y };
    }

    if (edit) {
        saveEdit(edit);
    }
}

function drawEditorArrowHead(ctx, x1, y1, x2, y2, size, color) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - size * 3 * Math.cos(angle - Math.PI / 6), y2 - size * 3 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - size * 3 * Math.cos(angle + Math.PI / 6), y2 - size * 3 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
}

function saveEdit(edit) {
    if (!pageEdits[editorCurrentPage]) {
        pageEdits[editorCurrentPage] = [];
    }
    pageEdits[editorCurrentPage].push(edit);

    // Save to history for undo
    editorHistory = editorHistory.slice(0, historyIndex + 1);
    editorHistory.push({ page: editorCurrentPage, edit });
    historyIndex++;

    updateLayersPanel();
    updateStatus(`Edit added: ${edit.type}`);
}

function applyEdit(edit, save = true) {
    const color = edit.color || '#000000';
    const strokeWidth = edit.strokeWidth || 2;

    editorOverlayCtx.strokeStyle = color;
    editorOverlayCtx.lineWidth = strokeWidth;
    editorOverlayCtx.lineCap = 'round';
    editorOverlayCtx.lineJoin = 'round';

    switch (edit.type) {
        case 'text':
            editorOverlayCtx.fillStyle = color;
            editorOverlayCtx.font = `${edit.fontSize}px ${edit.font}`;
            editorOverlayCtx.fillText(edit.text, edit.x, edit.y);
            break;
        case 'erase':
            editorOverlayCtx.strokeStyle = 'white';
            editorOverlayCtx.lineWidth = edit.strokeWidth;
            editorOverlayCtx.beginPath();
            editorOverlayCtx.moveTo(edit.x1, edit.y1);
            editorOverlayCtx.lineTo(edit.x2, edit.y2);
            editorOverlayCtx.stroke();
            break;
        case 'rect':
            editorOverlayCtx.strokeRect(edit.x, edit.y, edit.w, edit.h);
            break;
        case 'circle':
            editorOverlayCtx.beginPath();
            editorOverlayCtx.arc(edit.cx, edit.cy, edit.radius, 0, Math.PI * 2);
            editorOverlayCtx.stroke();
            break;
        case 'line':
        case 'arrow':
            editorOverlayCtx.beginPath();
            editorOverlayCtx.moveTo(edit.x1, edit.y1);
            editorOverlayCtx.lineTo(edit.x2, edit.y2);
            editorOverlayCtx.stroke();
            if (edit.type === 'arrow') {
                drawEditorArrowHead(editorOverlayCtx, edit.x1, edit.y1, edit.x2, edit.y2, strokeWidth, color);
            }
            break;
        case 'stamp':
            editorOverlayCtx.save();
            editorOverlayCtx.font = 'bold 24px Arial';
            editorOverlayCtx.strokeStyle = edit.stampColor;
            editorOverlayCtx.fillStyle = 'transparent';
            editorOverlayCtx.lineWidth = 2;
            editorOverlayCtx.strokeText(edit.text, edit.x, edit.y);
            editorOverlayCtx.strokeRect(edit.x - 5, edit.y - 25, editorOverlayCtx.measureText(edit.text).width + 10, 32);
            editorOverlayCtx.restore();
            break;
    }
}

function updateLayersPanel() {
    const layersDiv = document.getElementById('editorLayers');
    const edits = pageEdits[editorCurrentPage] || [];

    layersDiv.innerHTML = edits.length === 0
        ? '<p style="color:rgba(255,255,255,0.5);font-size:0.75rem;">No edits yet</p>'
        : edits.map((e, i) => `
            <div class="layer-item">
                <span><i class="fas fa-${getEditIcon(e.type)}"></i> ${e.type}</span>
                <button onclick="deleteEdit(${i})" style="background:none;border:none;color:#ef4444;cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
}

function getEditIcon(type) {
    const icons = { text: 'font', erase: 'eraser', draw: 'pencil-alt', highlight: 'highlighter', rect: 'square', circle: 'circle', line: 'minus', arrow: 'arrow-right', stamp: 'stamp', image: 'image' };
    return icons[type] || 'edit';
}

function deleteEdit(index) {
    if (pageEdits[editorCurrentPage]) {
        pageEdits[editorCurrentPage].splice(index, 1);
        renderEditorPage();
        updateLayersPanel();
        showToast('🗑️ Edit removed');
    }
}

// Tool Selection
function setEditorTool(tool) {
    editorTool = tool;
    document.querySelectorAll('.editor-btn.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1))?.classList.add('active');
    updateStatus(`Tool: ${tool}`);

    // Update cursor
    if (tool === 'select') overlayCanvas.style.cursor = 'default';
    else if (tool === 'text') overlayCanvas.style.cursor = 'text';
    else if (tool === 'erase') overlayCanvas.style.cursor = 'cell';
    else overlayCanvas.style.cursor = 'crosshair';
}

// Text Input
function confirmTextInput() {
    const text = document.getElementById('editorTextInput').value.trim();
    if (text && pendingTextPos) {
        const color = document.getElementById('editorColor').value;
        const fontSize = parseInt(document.getElementById('editorFontSize').value);
        const font = document.getElementById('editorFont').value;

        const edit = { type: 'text', text, color, fontSize, font, x: pendingTextPos.x, y: pendingTextPos.y };
        applyEdit(edit);
        saveEdit(edit);
    }

    document.getElementById('textInputModal').classList.remove('active');
    document.getElementById('editorTextInput').value = '';
    pendingTextPos = null;
}

function cancelTextInput() {
    document.getElementById('textInputModal').classList.remove('active');
    document.getElementById('editorTextInput').value = '';
    pendingTextPos = null;
}

// Stamps
function addStampToEditor() {
    document.getElementById('stampModal').classList.add('active');
}

function selectStamp(stampText) {
    stampToAdd = stampText;
    document.getElementById('stampModal').classList.remove('active');
    setEditorTool('select');
    showToast('📍 Click on PDF to place stamp');

    // One-time click handler for placing stamp
    overlayCanvas.onclick = function (e) {
        const pos = getCanvasCoords(e);
        const stampColors = {
            'APPROVED': '#22c55e', 'REJECTED': '#ef4444', 'CONFIDENTIAL': '#f59e0b',
            'DRAFT': '#6366f1', 'FINAL': '#10b981', 'COPY': '#8b5cf6', 'VOID': '#dc2626', 'PAID': '#2563eb'
        };

        const edit = { type: 'stamp', text: stampToAdd, x: pos.x, y: pos.y, stampColor: stampColors[stampToAdd] || '#000' };
        applyEdit(edit);
        saveEdit(edit);

        overlayCanvas.onclick = null;
        stampToAdd = null;
    };
}

function closeStampModal() {
    document.getElementById('stampModal').classList.remove('active');
}

// Add Image
function addImageToEditor() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const img = new Image();
                img.onload = () => {
                    // Draw at center
                    const x = overlayCanvas.width / 2 - img.width / 4;
                    const y = overlayCanvas.height / 2 - img.height / 4;
                    overlayCtx.drawImage(img, x, y, img.width / 2, img.height / 2);

                    saveEdit({ type: 'image', src: evt.target.result, x, y, w: img.width / 2, h: img.height / 2 });
                    showToast('✅ Image added!');
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Undo/Redo
function editorUndo() {
    if (historyIndex < 0) {
        showToast('⚠️ Nothing to undo');
        return;
    }

    const lastAction = editorHistory[historyIndex];
    const edits = pageEdits[lastAction.page];
    if (edits && edits.length > 0) {
        edits.pop();
    }
    historyIndex--;

    renderEditorPage();
    updateLayersPanel();
    showToast('↩️ Undo');
}

function editorRedo() {
    if (historyIndex >= editorHistory.length - 1) {
        showToast('⚠️ Nothing to redo');
        return;
    }

    historyIndex++;
    const action = editorHistory[historyIndex];
    if (!pageEdits[action.page]) pageEdits[action.page] = [];
    pageEdits[action.page].push(action.edit);

    renderEditorPage();
    updateLayersPanel();
    showToast('↪️ Redo');
}

// Zoom
function editorZoomIn() {
    editorZoom = Math.min(editorZoom + 0.25, 3.0);
    renderEditorPage();
}

function editorZoomOut() {
    editorZoom = Math.max(editorZoom - 0.25, 0.5);
    renderEditorPage();
}

// Page Navigation
function editorPrevPage() {
    if (editorCurrentPage > 1) {
        editorCurrentPage--;
        renderEditorPage();
        updateLayersPanel();
    }
}

function editorNextPage() {
    if (editorCurrentPage < editorTotalPages) {
        editorCurrentPage++;
        renderEditorPage();
        updateLayersPanel();
    }
}

// Save Edited PDF
async function saveEditedPdf() {
    try {
        updateStatus('Saving PDF...');

        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.load(editorPdfBytes);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Apply edits to each page
        for (let pageNum = 1; pageNum <= editorTotalPages; pageNum++) {
            const edits = pageEdits[pageNum] || [];
            if (edits.length === 0) continue;

            const page = pdfDoc.getPage(pageNum - 1);
            const { width, height } = page.getSize();

            // Scale factor (canvas is 1.5x)
            const scale = 1 / (editorZoom * 1.5);

            for (const edit of edits) {
                try {
                    const color = edit.color ? hexToRgb(edit.color) : rgb(0, 0, 0);

                    if (edit.type === 'text') {
                        page.drawText(edit.text, {
                            x: edit.x * scale,
                            y: height - edit.y * scale,
                            size: edit.fontSize * scale,
                            font: font,
                            color: color
                        });
                    } else if (edit.type === 'erase') {
                        // Draw white rectangle over area
                        page.drawRectangle({
                            x: Math.min(edit.x1, edit.x2) * scale - 10,
                            y: height - Math.max(edit.y1, edit.y2) * scale - 10,
                            width: Math.abs(edit.x2 - edit.x1) * scale + 20,
                            height: Math.abs(edit.y2 - edit.y1) * scale + 20,
                            color: rgb(1, 1, 1)
                        });
                    } else if (edit.type === 'rect') {
                        page.drawRectangle({
                            x: edit.x * scale,
                            y: height - (edit.y + edit.h) * scale,
                            width: edit.w * scale,
                            height: edit.h * scale,
                            borderColor: color,
                            borderWidth: edit.strokeWidth * scale
                        });
                    } else if (edit.type === 'stamp') {
                        page.drawText(edit.text, {
                            x: edit.x * scale,
                            y: height - edit.y * scale,
                            size: 24 * scale,
                            font: font,
                            color: hexToRgb(edit.stampColor)
                        });
                    }
                } catch (err) {
                    console.log('Edit apply error:', err);
                }
            }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        downloadFile(blob, 'edited_' + editorFile.name);

        updateStatus('PDF saved!');
        showToast('✅ PDF saved successfully!');

    } catch (error) {
        console.error('Save error:', error);
        showToast('❌ Error saving: ' + error.message);
        updateStatus('Save failed');
    }
}

function closeEditor() {
    document.getElementById('pdfEditor').classList.remove('active');
    document.body.style.overflow = '';
    editorPdf = null;
    pageEdits = {};
}

function updateStatus(msg) {
    document.getElementById('editorStatus').textContent = msg;
}

// Helper functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return PDFLib.rgb(
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
        );
    }
    return PDFLib.rgb(0, 0, 0);
}

function hexToRgba(hex, alpha) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
    }
    return `rgba(0, 0, 0, ${alpha})`;
}

// Keyboard shortcuts for editor
document.addEventListener('keydown', (e) => {
    const editor = document.getElementById('pdfEditor');
    if (!editor.classList.contains('active')) return;

    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
            e.preventDefault();
            editorUndo();
        } else if (e.key === 'y') {
            e.preventDefault();
            editorRedo();
        } else if (e.key === 's') {
            e.preventDefault();
            saveEditedPdf();
        }
    } else if (e.key === 'Escape') {
        closeEditor();
    }
});

// ==================== ADVANCED EDITOR FEATURES ====================

// Whiteout data
let whiteoutArea = null;

// Find & Replace Panel
function openFindReplace() {
    document.getElementById('findReplacePanel').classList.add('active');
    document.getElementById('findText').focus();
}

function closeFindReplace() {
    document.getElementById('findReplacePanel').classList.remove('active');
}

async function findNextText() {
    const findStr = document.getElementById('findText').value.trim();
    if (!findStr) {
        showToast('⚠️ Enter text to find');
        return;
    }

    // Extract text from current page
    const page = await editorPdf.getPage(editorCurrentPage);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');

    if (text.toLowerCase().includes(findStr.toLowerCase())) {
        document.getElementById('findResults').innerHTML = `<span style="color:#22c55e">✓ Found "${findStr}" on page ${editorCurrentPage}</span>`;
        showToast(`✅ Found "${findStr}" on this page`);
    } else {
        document.getElementById('findResults').innerHTML = `<span style="color:#ef4444">✗ "${findStr}" not found on page ${editorCurrentPage}</span>`;
    }
}

function replaceCurrentText() {
    const findStr = document.getElementById('findText').value.trim();
    const replaceStr = document.getElementById('replaceText').value;

    if (!findStr) {
        showToast('⚠️ Enter text to find');
        return;
    }

    // Add whiteout + text replacement
    showToast('📍 Draw rectangle over text to replace, then new text will be added');
    setEditorTool('whiteout');
    document.getElementById('whiteoutReplaceText').value = replaceStr;
    closeFindReplace();
}

function replaceAllText() {
    showToast('ℹ️ Use Whiteout tool to replace text areas across your document');
    closeFindReplace();
}

// Signature Panel
let sigCanvas, sigCtx, sigDrawing = false;

function openSignaturePanel() {
    document.getElementById('signaturePanel').classList.add('active');
    initSignatureCanvas();
}

function closeSignaturePanel() {
    document.getElementById('signaturePanel').classList.remove('active');
}

function initSignatureCanvas() {
    sigCanvas = document.getElementById('signatureCanvas');
    sigCtx = sigCanvas.getContext('2d');
    sigCtx.strokeStyle = '#000';
    sigCtx.lineWidth = 2;
    sigCtx.lineCap = 'round';

    sigCanvas.onmousedown = (e) => {
        sigDrawing = true;
        const rect = sigCanvas.getBoundingClientRect();
        sigCtx.beginPath();
        sigCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    sigCanvas.onmousemove = (e) => {
        if (!sigDrawing) return;
        const rect = sigCanvas.getBoundingClientRect();
        sigCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        sigCtx.stroke();
    };

    sigCanvas.onmouseup = () => sigDrawing = false;
    sigCanvas.onmouseleave = () => sigDrawing = false;
}

function clearSignature() {
    if (sigCtx) {
        sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    }
}

function switchSigTab(tab) {
    document.querySelectorAll('.sig-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sig-content').forEach(c => c.classList.add('hidden'));

    event.target.classList.add('active');
    document.getElementById('sig' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Content').classList.remove('hidden');
}

function insertSignature() {
    showToast('📍 Click on PDF where you want to place your signature');
    closeSignaturePanel();

    // Get signature image
    let sigImage = null;
    const activeTab = document.querySelector('.sig-tab.active').textContent.toLowerCase();

    if (activeTab === 'draw') {
        sigImage = sigCanvas.toDataURL();
    } else if (activeTab === 'type') {
        const text = document.getElementById('signatureText').value;
        const font = document.getElementById('signatureFont').value;
        if (!text) {
            showToast('⚠️ Enter signature text');
            return;
        }
        // Create text signature
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 300;
        tempCanvas.height = 80;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.font = `40px ${font}`;
        tempCtx.fillStyle = '#000';
        tempCtx.fillText(text, 10, 50);
        sigImage = tempCanvas.toDataURL();
    }

    if (sigImage) {
        // Add click listener to place signature
        editorOverlayCanvas.onclick = function (e) {
            const pos = getEditorCanvasCoords(e);
            const img = new Image();
            img.onload = () => {
                editorOverlayCtx.drawImage(img, pos.x - 75, pos.y - 30, 150, 60);
                saveEdit({ type: 'signature', src: sigImage, x: pos.x - 75, y: pos.y - 30, w: 150, h: 60 });
                showToast('✅ Signature added!');
            };
            img.src = sigImage;
            editorOverlayCanvas.onclick = null;
        };
    }
}

// Initials
function addInitials() {
    const initials = prompt('Enter your initials (e.g., JD):');
    if (initials) {
        showToast('📍 Click where to place initials');
        editorOverlayCanvas.onclick = function (e) {
            const pos = getEditorCanvasCoords(e);
            editorOverlayCtx.font = 'bold 24px Arial';
            editorOverlayCtx.fillStyle = '#000';
            editorOverlayCtx.fillText(initials, pos.x, pos.y);
            saveEdit({ type: 'text', text: initials, color: '#000000', fontSize: 24, font: 'Arial', x: pos.x, y: pos.y });
            editorOverlayCanvas.onclick = null;
            showToast('✅ Initials added');
        };
    }
}

// Comment
function addComment() {
    const comment = prompt('Enter your comment:');
    if (comment) {
        showToast('📍 Click where to place comment');
        editorOverlayCanvas.onclick = function (e) {
            const pos = getEditorCanvasCoords(e);
            // Draw comment icon
            editorOverlayCtx.fillStyle = '#fbbf24';
            editorOverlayCtx.beginPath();
            editorOverlayCtx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
            editorOverlayCtx.fill();
            editorOverlayCtx.fillStyle = '#000';
            editorOverlayCtx.font = 'bold 10px Arial';
            editorOverlayCtx.fillText('!', pos.x - 3, pos.y + 4);

            saveEdit({ type: 'comment', text: comment, x: pos.x, y: pos.y });
            editorOverlayCanvas.onclick = null;
            showToast('✅ Comment added');
        };
    }
}

// Link
function addLink() {
    const url = prompt('Enter URL:');
    if (url) {
        showToast('📍 Click where to place link');
        editorOverlayCanvas.onclick = function (e) {
            const pos = getEditorCanvasCoords(e);
            editorOverlayCtx.fillStyle = '#2563eb';
            editorOverlayCtx.font = '14px Arial';
            editorOverlayCtx.fillText('🔗 ' + url, pos.x, pos.y);

            saveEdit({ type: 'link', url: url, x: pos.x, y: pos.y });
            editorOverlayCanvas.onclick = null;
            showToast('✅ Link added');
        };
    }
}

// Checkmark tool
function handleCheckmarkCrossmark(e, isCheckmark) {
    const pos = getEditorCanvasCoords(e);
    const color = isCheckmark ? '#22c55e' : '#ef4444';
    const symbol = isCheckmark ? '✓' : '✗';

    editorOverlayCtx.font = 'bold 24px Arial';
    editorOverlayCtx.fillStyle = color;
    editorOverlayCtx.fillText(symbol, pos.x - 8, pos.y + 8);

    saveEdit({ type: isCheckmark ? 'checkmark' : 'crossmark', x: pos.x, y: pos.y, color });
}

// Delete selected (clear last edit)
function deleteSelected() {
    const edits = pageEdits[editorCurrentPage];
    if (edits && edits.length > 0) {
        edits.pop();
        renderEditorPage();
        updateLayersPanel();
        showToast('🗑️ Last edit removed');
    } else {
        showToast('⚠️ No edits to delete');
    }
}

// Fit Width
function editorFitWidth() {
    if (!editorPdf) return;
    editorPdf.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = document.getElementById('editorCanvasArea').clientWidth - 100;
        editorZoom = containerWidth / viewport.width / 1.5;
        renderEditorPage();
        showToast('📐 Fit to width');
    });
}

// Preview
function previewEditedPdf() {
    showToast('👁️ Preview: Your edits are shown on the canvas!');
}

// Page Thumbnails in sidebar
async function generateEditorThumbnails() {
    const container = document.getElementById('editorPageThumbnails');
    if (!container || !editorPdf) return;

    container.innerHTML = '';

    for (let i = 1; i <= editorTotalPages; i++) {
        const page = await editorPdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });

        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = viewport.width;
        thumbCanvas.height = viewport.height;

        await page.render({
            canvasContext: thumbCanvas.getContext('2d'),
            viewport: viewport
        }).promise;

        const thumbDiv = document.createElement('div');
        thumbDiv.className = 'page-thumb' + (i === editorCurrentPage ? ' active' : '');
        thumbDiv.onclick = () => goToEditorPage(i);
        thumbDiv.appendChild(thumbCanvas);

        const label = document.createElement('div');
        label.className = 'page-thumb-label';
        label.textContent = `Page ${i}`;
        thumbDiv.appendChild(label);

        container.appendChild(thumbDiv);
    }
}

function goToEditorPage(pageNum) {
    editorCurrentPage = pageNum;
    renderEditorPage();
    updateLayersPanel();

    // Update active thumbnail
    document.querySelectorAll('.page-thumb').forEach((t, i) => {
        t.classList.toggle('active', i + 1 === pageNum);
    });
}

// Whiteout & Replace
function cancelWhiteout() {
    document.getElementById('whiteoutModal').classList.remove('active');
    if (whiteoutArea) {
        // Just apply whiteout
        editorOverlayCtx.fillStyle = '#ffffff';
        editorOverlayCtx.fillRect(whiteoutArea.x, whiteoutArea.y, whiteoutArea.w, whiteoutArea.h);
        saveEdit({ type: 'whiteout', ...whiteoutArea });
        whiteoutArea = null;
    }
    setEditorTool('select');
}

function confirmWhiteoutReplace() {
    const replaceText = document.getElementById('whiteoutReplaceText').value;
    document.getElementById('whiteoutModal').classList.remove('active');

    if (whiteoutArea) {
        // Apply whiteout
        editorOverlayCtx.fillStyle = '#ffffff';
        editorOverlayCtx.fillRect(whiteoutArea.x, whiteoutArea.y, whiteoutArea.w, whiteoutArea.h);
        saveEdit({ type: 'whiteout', ...whiteoutArea });

        // Add replacement text
        if (replaceText) {
            const fontSize = parseInt(document.getElementById('editorFontSize').value);
            const font = document.getElementById('editorFont').value;
            const color = document.getElementById('editorColor').value;

            editorOverlayCtx.fillStyle = color;
            editorOverlayCtx.font = `${fontSize}px ${font}`;
            editorOverlayCtx.fillText(replaceText, whiteoutArea.x + 2, whiteoutArea.y + fontSize);

            saveEdit({ type: 'text', text: replaceText, color, fontSize, font, x: whiteoutArea.x + 2, y: whiteoutArea.y + fontSize });
        }

        whiteoutArea = null;
    }
    setEditorTool('select');
}

// Enhanced setEditorTool for new tools
const originalSetEditorTool = setEditorTool;
setEditorTool = function (tool) {
    editorTool = tool;
    document.querySelectorAll('.editor-btn.tool-btn').forEach(btn => btn.classList.remove('active'));

    // Try to find and activate the tool button
    const toolButton = document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1));
    if (toolButton) toolButton.classList.add('active');

    updateStatus(`Tool: ${tool}`);

    // Update cursor
    const cursors = {
        select: 'default',
        text: 'text',
        whiteout: 'crosshair',
        draw: 'crosshair',
        highlight: 'crosshair',
        underline: 'crosshair',
        strikethrough: 'crosshair',
        rect: 'crosshair',
        filledRect: 'crosshair',
        circle: 'crosshair',
        line: 'crosshair',
        arrow: 'crosshair',
        checkmark: 'pointer',
        crossmark: 'pointer'
    };
    editorOverlayCanvas.style.cursor = cursors[tool] || 'crosshair';

    // Special handlers for click-based tools
    if (tool === 'checkmark' || tool === 'crossmark') {
        editorOverlayCanvas.onclick = (e) => {
            handleCheckmarkCrossmark(e, tool === 'checkmark');
            editorOverlayCanvas.onclick = null;
            setEditorTool('select');
        };
    }
};

// Enhanced handleEditorMouseUp to support new tools
const originalHandleEditorMouseUp = handleEditorMouseUp;
handleEditorMouseUp = function (e) {
    if (!editorIsDrawing) return;
    editorIsDrawing = false;

    if (!e) return;
    const pos = getEditorCanvasCoords(e);
    const color = document.getElementById('editorColor').value;
    const fillColor = document.getElementById('editorFillColor')?.value || '#ffffff';
    const strokeWidth = parseInt(document.getElementById('editorStrokeWidth').value);
    const opacity = parseFloat(document.getElementById('editorOpacity')?.value || '1');

    let edit = null;

    if (editorTool === 'whiteout') {
        const w = pos.x - editorStartX;
        const h = pos.y - editorStartY;

        // Show preview rectangle
        editorOverlayCtx.strokeStyle = '#ef4444';
        editorOverlayCtx.lineWidth = 2;
        editorOverlayCtx.setLineDash([5, 5]);
        editorOverlayCtx.strokeRect(editorStartX, editorStartY, w, h);
        editorOverlayCtx.setLineDash([]);

        // Store whiteout area and show modal
        whiteoutArea = { x: editorStartX, y: editorStartY, w, h };
        document.getElementById('whiteoutModal').classList.add('active');
        return;

    } else if (editorTool === 'filledRect') {
        const w = pos.x - editorStartX;
        const h = pos.y - editorStartY;
        editorOverlayCtx.fillStyle = fillColor;
        editorOverlayCtx.globalAlpha = opacity;
        editorOverlayCtx.fillRect(editorStartX, editorStartY, w, h);
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.strokeRect(editorStartX, editorStartY, w, h);
        editorOverlayCtx.globalAlpha = 1;
        edit = { type: 'filledRect', fillColor, color, strokeWidth, x: editorStartX, y: editorStartY, w, h, opacity };

    } else if (editorTool === 'underline' || editorTool === 'strikethrough') {
        const y = editorTool === 'strikethrough' ? editorStartY : editorStartY + 5;
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = 2;
        editorOverlayCtx.beginPath();
        editorOverlayCtx.moveTo(editorStartX, y);
        editorOverlayCtx.lineTo(pos.x, y);
        editorOverlayCtx.stroke();
        edit = { type: editorTool, color, x1: editorStartX, y1: y, x2: pos.x, y2: y };

    } else if (editorTool === 'draw') {
        edit = { type: 'draw', color, strokeWidth, x1: editorStartX, y1: editorStartY, x2: pos.x, y2: pos.y };
    } else if (editorTool === 'highlight') {
        edit = { type: 'highlight', color, x1: editorStartX, y1: editorStartY, x2: pos.x, y2: pos.y };
    } else if (editorTool === 'rect') {
        const w = pos.x - editorStartX;
        const h = pos.y - editorStartY;
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.strokeRect(editorStartX, editorStartY, w, h);
        edit = { type: 'rect', color, strokeWidth, x: editorStartX, y: editorStartY, w, h };
    } else if (editorTool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - editorStartX, 2) + Math.pow(pos.y - editorStartY, 2));
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.beginPath();
        editorOverlayCtx.arc(editorStartX, editorStartY, radius, 0, Math.PI * 2);
        editorOverlayCtx.stroke();
        edit = { type: 'circle', color, strokeWidth, cx: editorStartX, cy: editorStartY, radius };
    } else if (editorTool === 'line' || editorTool === 'arrow') {
        editorOverlayCtx.strokeStyle = color;
        editorOverlayCtx.lineWidth = strokeWidth;
        editorOverlayCtx.beginPath();
        editorOverlayCtx.moveTo(editorStartX, editorStartY);
        editorOverlayCtx.lineTo(pos.x, pos.y);
        editorOverlayCtx.stroke();

        if (editorTool === 'arrow') {
            drawEditorArrowHead(editorOverlayCtx, editorStartX, editorStartY, pos.x, pos.y, strokeWidth, color);
        }
        edit = { type: editorTool, color, strokeWidth, x1: editorStartX, y1: editorStartY, x2: pos.x, y2: pos.y };
    }

    if (edit) {
        saveEdit(edit);
    }
};

// Enhanced applyEdit for new edit types
const originalApplyEdit = applyEdit;
applyEdit = function (edit, save = true) {
    const color = edit.color || '#000000';
    const strokeWidth = edit.strokeWidth || 2;

    editorOverlayCtx.strokeStyle = color;
    editorOverlayCtx.lineWidth = strokeWidth;
    editorOverlayCtx.lineCap = 'round';
    editorOverlayCtx.lineJoin = 'round';

    switch (edit.type) {
        case 'text':
            editorOverlayCtx.fillStyle = color;
            editorOverlayCtx.font = `${edit.fontSize}px ${edit.font}`;
            editorOverlayCtx.fillText(edit.text, edit.x, edit.y);
            break;
        case 'whiteout':
            editorOverlayCtx.fillStyle = '#ffffff';
            editorOverlayCtx.fillRect(edit.x, edit.y, edit.w, edit.h);
            break;
        case 'filledRect':
            editorOverlayCtx.fillStyle = edit.fillColor || '#ffffff';
            editorOverlayCtx.globalAlpha = edit.opacity || 1;
            editorOverlayCtx.fillRect(edit.x, edit.y, edit.w, edit.h);
            editorOverlayCtx.strokeRect(edit.x, edit.y, edit.w, edit.h);
            editorOverlayCtx.globalAlpha = 1;
            break;
        case 'underline':
        case 'strikethrough':
            editorOverlayCtx.beginPath();
            editorOverlayCtx.moveTo(edit.x1, edit.y1);
            editorOverlayCtx.lineTo(edit.x2, edit.y2);
            editorOverlayCtx.stroke();
            break;
        case 'checkmark':
            editorOverlayCtx.font = 'bold 24px Arial';
            editorOverlayCtx.fillStyle = edit.color || '#22c55e';
            editorOverlayCtx.fillText('✓', edit.x - 8, edit.y + 8);
            break;
        case 'crossmark':
            editorOverlayCtx.font = 'bold 24px Arial';
            editorOverlayCtx.fillStyle = edit.color || '#ef4444';
            editorOverlayCtx.fillText('✗', edit.x - 8, edit.y + 8);
            break;
        case 'signature':
            const sigImg = new Image();
            sigImg.onload = () => {
                editorOverlayCtx.drawImage(sigImg, edit.x, edit.y, edit.w, edit.h);
            };
            sigImg.src = edit.src;
            break;
        case 'rect':
            editorOverlayCtx.strokeRect(edit.x, edit.y, edit.w, edit.h);
            break;
        case 'circle':
            editorOverlayCtx.beginPath();
            editorOverlayCtx.arc(edit.cx, edit.cy, edit.radius, 0, Math.PI * 2);
            editorOverlayCtx.stroke();
            break;
        case 'line':
        case 'arrow':
            editorOverlayCtx.beginPath();
            editorOverlayCtx.moveTo(edit.x1, edit.y1);
            editorOverlayCtx.lineTo(edit.x2, edit.y2);
            editorOverlayCtx.stroke();
            if (edit.type === 'arrow') {
                drawEditorArrowHead(editorOverlayCtx, edit.x1, edit.y1, edit.x2, edit.y2, strokeWidth, color);
            }
            break;
        case 'stamp':
            editorOverlayCtx.save();
            editorOverlayCtx.font = 'bold 24px Arial';
            editorOverlayCtx.strokeStyle = edit.stampColor;
            editorOverlayCtx.lineWidth = 2;
            editorOverlayCtx.strokeText(edit.text, edit.x, edit.y);
            editorOverlayCtx.strokeRect(edit.x - 5, edit.y - 25, editorOverlayCtx.measureText(edit.text).width + 10, 32);
            editorOverlayCtx.restore();
            break;
        case 'comment':
            editorOverlayCtx.fillStyle = '#fbbf24';
            editorOverlayCtx.beginPath();
            editorOverlayCtx.arc(edit.x, edit.y, 12, 0, Math.PI * 2);
            editorOverlayCtx.fill();
            editorOverlayCtx.fillStyle = '#000';
            editorOverlayCtx.font = 'bold 10px Arial';
            editorOverlayCtx.fillText('!', edit.x - 3, edit.y + 4);
            break;
    }
};

// Generate thumbnails after loading PDF
const originalLoadPdfInEditor = loadPdfInEditor;
loadPdfInEditor = async function (file) {
    await originalLoadPdfInEditor(file);
    generateEditorThumbnails();
};

// ==================== MOVABLE/RESIZABLE OBJECTS & AI FORMAT MATCHING ====================

// Selected object state
let selectedEditIndex = -1;
let isDraggingObject = false;
let isResizingObject = false;
let dragOffsetX = 0, dragOffsetY = 0;
let detectedPdfFormats = [];

// AI Format Detection - Analyze PDF text to get common formats
async function analyzeAIFormats() {
    if (!editorPdf) return;

    try {
        const page = await editorPdf.getPage(editorCurrentPage);
        const textContent = await page.getTextContent();

        detectedPdfFormats = [];
        const formatCounts = {};

        textContent.items.forEach(item => {
            const height = Math.round(item.height || 12);
            const fontName = item.fontName || 'Helvetica';
            const key = `${height}-${fontName}`;

            if (!formatCounts[key]) {
                formatCounts[key] = { count: 0, height, fontName };
            }
            formatCounts[key].count++;
        });

        // Sort by frequency
        detectedPdfFormats = Object.values(formatCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        updateStatus('AI analyzed document formats');

    } catch (e) {
        console.log('Format analysis error:', e);
    }
}

// Get AI-suggested format (most common in PDF)
function getAIFormat() {
    if (detectedPdfFormats.length > 0) {
        const main = detectedPdfFormats[0];
        return {
            fontSize: Math.round(main.height * 1.5), // Scale for canvas
            fontFamily: main.fontName.includes('Bold') ? 'Arial' :
                main.fontName.includes('Times') ? 'Times New Roman' : 'Helvetica',
            color: '#000000'
        };
    }
    return { fontSize: 14, fontFamily: 'Helvetica', color: '#000000' };
}

// Smart Text Tool with AI format matching
function activateSmartText() {
    analyzeAIFormats();
    const format = getAIFormat();

    // Auto-apply detected format to toolbar
    document.getElementById('editorFontSize').value = format.fontSize;
    document.getElementById('editorFont').value = format.fontFamily;
    document.getElementById('editorColor').value = format.color;

    showToast(`🤖 AI detected format: ${format.fontSize}px ${format.fontFamily}`);
    setEditorTool('text');
}

// Object Selection and Manipulation
function selectObject(index) {
    selectedEditIndex = index;
    renderEditorPage();
    drawSelectionHandles(index);
    updatePropertiesPanel(index);
}

function deselectObject() {
    selectedEditIndex = -1;
    renderEditorPage();
    document.getElementById('propertiesContent').innerHTML =
        '<p class="no-selection">Select an element to edit its properties</p>';
}

function drawSelectionHandles(index) {
    const edits = pageEdits[editorCurrentPage];
    if (!edits || !edits[index]) return;

    const edit = edits[index];
    let bounds = getEditBounds(edit);
    if (!bounds) return;

    const ctx = editorOverlayCtx;
    const handleSize = 8;

    // Selection rectangle
    ctx.save();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.w + 10, bounds.h + 10);
    ctx.setLineDash([]);

    // Corner handles
    ctx.fillStyle = '#2563eb';
    const handles = [
        { x: bounds.x - 5, y: bounds.y - 5 },
        { x: bounds.x + bounds.w - 3, y: bounds.y - 5 },
        { x: bounds.x - 5, y: bounds.y + bounds.h - 3 },
        { x: bounds.x + bounds.w - 3, y: bounds.y + bounds.h - 3 }
    ];
    handles.forEach(h => {
        ctx.fillRect(h.x, h.y, handleSize, handleSize);
    });

    // Move handle (center)
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(bounds.x + bounds.w / 2, bounds.y - 15, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('↕', bounds.x + bounds.w / 2 - 5, bounds.y - 12);

    ctx.restore();
}

function getEditBounds(edit) {
    if (!edit) return null;

    switch (edit.type) {
        case 'text':
            const textWidth = editorOverlayCtx.measureText(edit.text || '').width || 100;
            return { x: edit.x, y: edit.y - (edit.fontSize || 14), w: textWidth + 20, h: (edit.fontSize || 14) + 10 };
        case 'rect':
        case 'filledRect':
        case 'whiteout':
            return { x: edit.x, y: edit.y, w: edit.w, h: edit.h };
        case 'circle':
            return { x: edit.cx - edit.radius, y: edit.cy - edit.radius, w: edit.radius * 2, h: edit.radius * 2 };
        case 'signature':
        case 'image':
            return { x: edit.x, y: edit.y, w: edit.w || 150, h: edit.h || 60 };
        case 'checkmark':
        case 'crossmark':
        case 'comment':
            return { x: edit.x - 15, y: edit.y - 15, w: 30, h: 30 };
        case 'stamp':
            return { x: edit.x - 5, y: edit.y - 30, w: 150, h: 40 };
        default:
            if (edit.x1 !== undefined) {
                const minX = Math.min(edit.x1, edit.x2 || edit.x1);
                const minY = Math.min(edit.y1, edit.y2 || edit.y1);
                const maxX = Math.max(edit.x1, edit.x2 || edit.x1);
                const maxY = Math.max(edit.y1, edit.y2 || edit.y1);
                return { x: minX, y: minY, w: maxX - minX || 20, h: maxY - minY || 20 };
            }
            return null;
    }
}

function updatePropertiesPanel(index) {
    const edits = pageEdits[editorCurrentPage];
    if (!edits || !edits[index]) return;

    const edit = edits[index];
    const panel = document.getElementById('propertiesContent');

    let html = `
        <div class="prop-group">
            <label>Type:</label>
            <span class="prop-value">${edit.type}</span>
        </div>`;

    if (edit.type === 'text') {
        html += `
        <div class="prop-group">
            <label>Text:</label>
            <input type="text" id="propText" value="${edit.text || ''}" onchange="updateEditProperty(${index}, 'text', this.value)" class="prop-input">
        </div>
        <div class="prop-group">
            <label>Size:</label>
            <input type="number" id="propFontSize" value="${edit.fontSize || 14}" onchange="updateEditProperty(${index}, 'fontSize', parseInt(this.value))" class="prop-input small">
        </div>
        <div class="prop-group">
            <label>Color:</label>
            <input type="color" id="propColor" value="${edit.color || '#000000'}" onchange="updateEditProperty(${index}, 'color', this.value)" class="prop-input">
        </div>
        <div class="prop-group">
            <label>Font:</label>
            <select id="propFont" onchange="updateEditProperty(${index}, 'font', this.value)" class="prop-input">
                <option value="Helvetica" ${edit.font === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
                <option value="Arial" ${edit.font === 'Arial' ? 'selected' : ''}>Arial</option>
                <option value="Times New Roman" ${edit.font === 'Times New Roman' ? 'selected' : ''}>Times</option>
                <option value="Courier" ${edit.font === 'Courier' ? 'selected' : ''}>Courier</option>
            </select>
        </div>`;
    }

    html += `
        <div class="prop-group">
            <label>Position:</label>
            <span class="prop-value">X: ${Math.round(edit.x || edit.x1 || 0)}, Y: ${Math.round(edit.y || edit.y1 || 0)}</span>
        </div>
        <div class="prop-actions">
            <button onclick="duplicateEdit(${index})" class="prop-btn"><i class="fas fa-copy"></i> Duplicate</button>
            <button onclick="deleteEditByIndex(${index})" class="prop-btn danger"><i class="fas fa-trash"></i> Delete</button>
        </div>
        <div class="prop-actions">
            <button onclick="moveEditLayer(${index}, -1)" class="prop-btn"><i class="fas fa-arrow-up"></i> Up</button>
            <button onclick="moveEditLayer(${index}, 1)" class="prop-btn"><i class="fas fa-arrow-down"></i> Down</button>
        </div>`;

    panel.innerHTML = html;
}

function updateEditProperty(index, property, value) {
    const edits = pageEdits[editorCurrentPage];
    if (edits && edits[index]) {
        edits[index][property] = value;
        renderEditorPage();
        if (selectedEditIndex === index) {
            drawSelectionHandles(index);
        }
        showToast(`✏️ Updated ${property}`);
    }
}

function duplicateEdit(index) {
    const edits = pageEdits[editorCurrentPage];
    if (edits && edits[index]) {
        const copy = JSON.parse(JSON.stringify(edits[index]));
        // Offset position
        if (copy.x !== undefined) copy.x += 20;
        if (copy.y !== undefined) copy.y += 20;
        if (copy.x1 !== undefined) { copy.x1 += 20; copy.x2 += 20; }
        if (copy.y1 !== undefined) { copy.y1 += 20; copy.y2 += 20; }
        if (copy.cx !== undefined) copy.cx += 20;
        if (copy.cy !== undefined) copy.cy += 20;

        edits.push(copy);
        renderEditorPage();
        selectObject(edits.length - 1);
        showToast('📋 Duplicated');
    }
}

function deleteEditByIndex(index) {
    const edits = pageEdits[editorCurrentPage];
    if (edits && edits[index]) {
        edits.splice(index, 1);
        deselectObject();
        updateLayersPanel();
        showToast('🗑️ Deleted');
    }
}

function moveEditLayer(index, direction) {
    const edits = pageEdits[editorCurrentPage];
    if (!edits) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= edits.length) return;

    [edits[index], edits[newIndex]] = [edits[newIndex], edits[index]];
    renderEditorPage();
    selectObject(newIndex);
    updateLayersPanel();
    showToast(direction < 0 ? '⬆️ Moved up' : '⬇️ Moved down');
}

// Enhanced mouse handlers for object manipulation
function handleObjectInteraction(e) {
    if (editorTool !== 'select') return false;

    const pos = getEditorCanvasCoords(e);
    const edits = pageEdits[editorCurrentPage];
    if (!edits) return false;

    // Check if clicking on existing object
    for (let i = edits.length - 1; i >= 0; i--) {
        const bounds = getEditBounds(edits[i]);
        if (bounds && isPointInBounds(pos, bounds)) {
            selectObject(i);
            isDraggingObject = true;
            dragOffsetX = pos.x - bounds.x;
            dragOffsetY = pos.y - bounds.y;
            return true;
        }
    }

    deselectObject();
    return false;
}

function isPointInBounds(pos, bounds) {
    return pos.x >= bounds.x - 10 && pos.x <= bounds.x + bounds.w + 10 &&
        pos.y >= bounds.y - 10 && pos.y <= bounds.y + bounds.h + 10;
}

function handleObjectDrag(e) {
    if (!isDraggingObject || selectedEditIndex < 0) return;

    const pos = getEditorCanvasCoords(e);
    const edits = pageEdits[editorCurrentPage];
    if (!edits || !edits[selectedEditIndex]) return;

    const edit = edits[selectedEditIndex];
    const newX = pos.x - dragOffsetX;
    const newY = pos.y - dragOffsetY;

    // Update position based on edit type
    if (edit.x !== undefined) {
        edit.x = newX;
        edit.y = newY;
    } else if (edit.x1 !== undefined) {
        const dx = newX - edit.x1;
        const dy = newY - edit.y1;
        edit.x1 += dx;
        edit.y1 += dy;
        if (edit.x2 !== undefined) edit.x2 += dx;
        if (edit.y2 !== undefined) edit.y2 += dy;
    } else if (edit.cx !== undefined) {
        edit.cx = newX + (getEditBounds(edit)?.w || 0) / 2;
        edit.cy = newY + (getEditBounds(edit)?.h || 0) / 2;
    }

    renderEditorPage();
    drawSelectionHandles(selectedEditIndex);
}

function handleObjectDragEnd() {
    if (isDraggingObject) {
        isDraggingObject = false;
        updatePropertiesPanel(selectedEditIndex);
        showToast('📍 Moved');
    }
}

// Override mouse handlers to include object manipulation
const baseHandleEditorMouseDown = handleEditorMouseDown;
handleEditorMouseDown = function (e) {
    if (editorTool === 'select') {
        if (handleObjectInteraction(e)) {
            return;
        }
    }
    baseHandleEditorMouseDown(e);
};

const baseHandleEditorMouseMove = handleEditorMouseMove;
handleEditorMouseMove = function (e) {
    if (isDraggingObject) {
        handleObjectDrag(e);
        return;
    }
    baseHandleEditorMouseMove(e);
};

const baseHandleEditorMouseUp2 = handleEditorMouseUp;
handleEditorMouseUp = function (e) {
    if (isDraggingObject) {
        handleObjectDragEnd();
        return;
    }
    baseHandleEditorMouseUp2(e);
};

// Live Inline Text Editor
function startInlineEdit(index) {
    const edits = pageEdits[editorCurrentPage];
    if (!edits || !edits[index] || edits[index].type !== 'text') return;

    const edit = edits[index];
    const bounds = getEditBounds(edit);
    if (!bounds) return;

    const canvasArea = document.getElementById('editorCanvasArea');
    const wrapper = document.getElementById('canvasWrapper');
    const wrapperRect = wrapper.getBoundingClientRect();
    const areaRect = canvasArea.getBoundingClientRect();

    // Create inline input
    const input = document.createElement('input');
    input.type = 'text';
    input.value = edit.text || '';
    input.className = 'inline-text-editor';
    input.style.cssText = `
        position: absolute;
        left: ${wrapperRect.left - areaRect.left + bounds.x}px;
        top: ${wrapperRect.top - areaRect.top + bounds.y - edit.fontSize}px;
        font-size: ${edit.fontSize}px;
        font-family: ${edit.font || 'Helvetica'};
        color: ${edit.color || '#000'};
        background: rgba(255,255,255,0.9);
        border: 2px solid #2563eb;
        padding: 4px 8px;
        z-index: 1000;
        min-width: 100px;
    `;

    input.onblur = () => {
        edit.text = input.value;
        input.remove();
        renderEditorPage();
        if (selectedEditIndex === index) drawSelectionHandles(index);
    };

    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            input.remove();
            renderEditorPage();
        }
    };

    canvasArea.appendChild(input);
    input.focus();
    input.select();
}

// Double-click to edit text
editorOverlayCanvas?.addEventListener('dblclick', (e) => {
    if (selectedEditIndex >= 0) {
        const edits = pageEdits[editorCurrentPage];
        if (edits && edits[selectedEditIndex]?.type === 'text') {
            startInlineEdit(selectedEditIndex);
        }
    }
});

// Add AI Smart Text button to toolbar
function addAIButton() {
    const toolsGroup = document.querySelector('.toolbar-group.tools');
    if (toolsGroup && !document.getElementById('toolAIText')) {
        const aiBtn = document.createElement('button');
        aiBtn.id = 'toolAIText';
        aiBtn.className = 'editor-btn tool-btn ai-btn';
        aiBtn.title = 'AI Smart Text (Auto-match format)';
        aiBtn.onclick = activateSmartText;
        aiBtn.innerHTML = '<i class="fas fa-magic"></i>';

        // Insert after text button
        const textBtn = document.getElementById('toolText');
        if (textBtn) {
            textBtn.after(aiBtn);
        }
    }
}

// Run AI analysis when PDF loads
const enhancedLoadPdfInEditor = loadPdfInEditor;
loadPdfInEditor = async function (file) {
    await enhancedLoadPdfInEditor(file);
    analyzeAIFormats();
    addAIButton();
};

// Add CSS for inline editor and AI button
const editorStyles = document.createElement('style');
editorStyles.textContent = `
    .inline-text-editor {
        outline: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        border-radius: 4px;
    }
    .prop-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        padding: 0.3rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .prop-group label {
        color: rgba(255,255,255,0.6);
        font-size: 0.8rem;
    }
    .prop-value {
        color: white;
        font-weight: 500;
    }
    .prop-input {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        padding: 0.3rem;
        border-radius: 4px;
        width: 100px;
    }
    .prop-input.small {
        width: 60px;
    }
    .prop-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    .prop-btn {
        flex: 1;
        padding: 0.4rem;
        border: none;
        border-radius: 4px;
        background: rgba(255,255,255,0.1);
        color: white;
        cursor: pointer;
        font-size: 0.75rem;
    }
    .prop-btn:hover {
        background: rgba(255,255,255,0.2);
    }
    .prop-btn.danger {
        background: rgba(239, 68, 68, 0.3);
    }
    .prop-btn.danger:hover {
        background: rgba(239, 68, 68, 0.5);
    }
    .ai-btn {
        background: linear-gradient(135deg, #f59e0b, #ef4444) !important;
    }
    .ai-btn:hover {
        box-shadow: 0 0 15px rgba(245, 158, 11, 0.5) !important;
    }
`;
document.head.appendChild(editorStyles);

// Enhanced layers panel to support clicking to select
const originalUpdateLayersPanel = updateLayersPanel;
updateLayersPanel = function () {
    const layersDiv = document.getElementById('editorLayers');
    const edits = pageEdits[editorCurrentPage] || [];

    layersDiv.innerHTML = edits.length === 0
        ? '<p style="color:rgba(255,255,255,0.5);font-size:0.75rem;padding:0.5rem;">No edits yet</p>'
        : edits.map((e, i) => `
            <div class="layer-item ${selectedEditIndex === i ? 'selected' : ''}" onclick="selectObject(${i})">
                <span><i class="fas fa-${getEditIcon(e.type)}"></i> ${e.type}${e.text ? ': ' + e.text.substring(0, 10) : ''}</span>
                <button onclick="event.stopPropagation(); deleteEditByIndex(${i})" style="background:none;border:none;color:#ef4444;cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
};

// Add selected layer style
const layerStyle = document.createElement('style');
layerStyle.textContent = `
    .layer-item.selected {
        background: rgba(37, 99, 235, 0.3) !important;
        border-left: 3px solid #2563eb;
    }
`;

// ==================== ULTIMATE TEXT TO HTML CONVERTER ====================
// Powered by Marked.js + Prism.js - Industry-leading professional converter

// Load external libraries dynamically
function loadConverterLibraries() {
    // Load Marked.js
    if (!window.marked) {
        const markedScript = document.createElement('script');
        markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(markedScript);
    }

    // Load Prism.js CSS
    if (!document.querySelector('link[href*="prism"]')) {
        const prismCSS = document.createElement('link');
        prismCSS.rel = 'stylesheet';
        prismCSS.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
        document.head.appendChild(prismCSS);
    }

    // Load Prism.js
    if (!window.Prism) {
        const prismScript = document.createElement('script');
        prismScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
        document.head.appendChild(prismScript);

        // Load additional languages
        setTimeout(() => {
            const langs = ['python', 'java', 'csharp', 'cpp', 'go', 'rust', 'typescript', 'jsx', 'bash', 'sql', 'json', 'yaml', 'markdown'];
            langs.forEach(lang => {
                const langScript = document.createElement('script');
                langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
                document.head.appendChild(langScript);
            });
        }, 500);
    }
}

// Call on load
loadConverterLibraries();

// Document Templates
const documentTemplates = {
    empty: { name: '📄 Empty Document', content: '' },
    blog: {
        name: '📝 Blog Post', content: `# Your Blog Title Here

**Published:** ${new Date().toLocaleDateString()} | **Author:** Your Name | **Reading Time:** 5 min

---

## Introduction

Write a compelling introduction that hooks your readers and explains what they'll learn.

## Main Content

### First Point

Explain your first main point here. Use examples and evidence to support your argument.

### Second Point

Continue with your second point. Keep paragraphs short and readable.

### Third Point

Add more sections as needed. Use headers to organize your content.

## Key Takeaways

- **Point 1:** Summary of first key insight
- **Point 2:** Summary of second key insight
- **Point 3:** Summary of third key insight

## Conclusion

Wrap up your post with a strong conclusion and call to action.

---

*Did you find this helpful? Share it with others!*` },

    resume: {
        name: '💼 Resume/CV', content: `# John Doe
## Senior Software Developer

📧 john@email.com | 📱 +1 234 567 890 | 🔗 [linkedin.com/in/johndoe](https://linkedin.com) | 💻 [github.com/johndoe](https://github.com)

---

## Professional Summary

Experienced software developer with 8+ years of expertise in full-stack development. Passionate about building scalable applications and mentoring junior developers.

---

## Experience

### Senior Developer | **Tech Company Inc.**
*Jan 2020 - Present*

- Led development of microservices architecture serving 1M+ users
- Reduced deployment time by 60% through CI/CD implementation
- Mentored team of 5 junior developers

### Full Stack Developer | **Startup XYZ**
*Mar 2017 - Dec 2019*

- Built React.js frontend with Node.js backend
- Implemented real-time features using WebSockets
- Improved application performance by 40%

---

## Skills

| Category | Technologies |
|----------|-------------|
| **Frontend** | React, Vue, TypeScript, CSS |
| **Backend** | Node.js, Python, Java |
| **Database** | PostgreSQL, MongoDB, Redis |
| **DevOps** | Docker, Kubernetes, AWS |

---

## Education

### BS Computer Science | **University Name**
*2013 - 2017* | GPA: 3.8/4.0

---

## Certifications

- AWS Certified Solutions Architect
- Google Cloud Professional Developer` },

    documentation: {
        name: '📚 Documentation', content: `# Project Name

> A brief description of what this project does and who it's for

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)

---

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [FAQ](#faq)

---

## ⚙️ Installation

\`\`\`bash
# Using npm
npm install your-package

# Using yarn
yarn add your-package
\`\`\`

---

## 🚀 Usage

### Basic Example

\`\`\`javascript
import { YourPackage } from 'your-package';

const instance = new YourPackage({
    option1: 'value1',
    option2: true
});

instance.doSomething();
\`\`\`

### Advanced Usage

\`\`\`javascript
// More complex example here
\`\`\`

---

## 📖 API Reference

### \`methodName(param1, param2)\`

| Parameter | Type | Description |
|-----------|------|-------------|
| param1 | \`string\` | Description of param1 |
| param2 | \`boolean\` | Description of param2 |

**Returns:** \`Promise<Result>\`

---

## ⚙️ Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| debug | boolean | false | Enable debug mode |
| timeout | number | 5000 | Request timeout in ms |

---

## ❓ FAQ

### How do I...?

Answer to the question.

### Why does...?

Answer to another question.

---

## 📄 License

MIT © Your Name` },

    readme: {
        name: '📖 README', content: `# 🚀 Project Name

![Banner](https://via.placeholder.com/1200x300)

**One-line description of your awesome project**

---

## ✨ Features

- 🎯 **Feature 1** - Brief description
- ⚡ **Feature 2** - Brief description
- 🔒 **Feature 3** - Brief description
- 📱 **Feature 4** - Brief description

---

## 🛠️ Quick Start

\`\`\`bash
git clone https://github.com/username/project.git
cd project
npm install
npm start
\`\`\`

---

## 📸 Screenshots

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light](url) | ![Dark](url) |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See \`LICENSE\` for more information.

---

## 📧 Contact

Your Name - [@twitter](https://twitter.com) - email@example.com

Project Link: [https://github.com/username/project](https://github.com/username/project)` },

    report: {
        name: '📊 Report', content: `# Quarterly Business Report
## Q4 2024

**Prepared by:** Analysis Team  
**Date:** ${new Date().toLocaleDateString()}  
**Confidential:** Internal Use Only

---

## Executive Summary

This report summarizes the key performance metrics and achievements for Q4 2024.

---

## Key Metrics

| Metric | Q3 2024 | Q4 2024 | Change |
|--------|---------|---------|--------|
| Revenue | $1.2M | $1.5M | +25% |
| Users | 50,000 | 75,000 | +50% |
| NPS Score | 42 | 58 | +16 |

---

## Highlights

### 🎯 Achievements

- [x] Launched new product line
- [x] Expanded to 3 new markets
- [x] Achieved ISO certification

### 📈 Growth Areas

1. **Customer Acquisition** - 50% increase in new signups
2. **Revenue** - Record quarterly revenue
3. **Engagement** - 40% improvement in retention

---

## Challenges & Solutions

> "The main challenge was scaling infrastructure to meet demand."

| Challenge | Solution | Status |
|-----------|----------|--------|
| Server load | Added load balancers | ✅ Complete |
| Support tickets | Hired 5 new agents | ✅ Complete |

---

## Recommendations

1. Invest in automation tools
2. Expand marketing budget by 20%
3. Focus on customer retention programs

---

## Appendix

*Additional data and charts available upon request.*` },

    letter: {
        name: '✉️ Formal Letter', content: `**Your Name**  
Your Address  
City, State ZIP  
Email: your@email.com  
Phone: (123) 456-7890

---

${new Date().toLocaleDateString()}

**Recipient Name**  
Their Title  
Company Name  
Company Address  
City, State ZIP

---

**RE: Subject of the Letter**

Dear Mr./Ms. Last Name,

I am writing to [state the purpose of your letter]. This opening paragraph should clearly introduce the main topic.

In the body paragraphs, provide more details about your purpose. Include relevant information, facts, and any supporting details that strengthen your message.

Continue with additional paragraphs as needed. Each paragraph should focus on one main point.

Thank you for your time and consideration. I look forward to [expected outcome]. Please feel free to contact me at [phone] or [email] if you have any questions.

Sincerely,

*[Your Signature]*

**Your Name**  
Your Title

---

*Enclosures: (if any)*` },

    notes: {
        name: '📝 Meeting Notes', content: `# Meeting Notes
## Project Kickoff Meeting

**Date:** ${new Date().toLocaleDateString()}  
**Time:** 10:00 AM - 11:30 AM  
**Location:** Conference Room A / Zoom  
**Attendees:** John, Sarah, Mike, Lisa

---

## Agenda

1. Project overview
2. Timeline discussion
3. Role assignments
4. Q&A

---

## Discussion Points

### Project Overview

- Project goal: [Describe the main objective]
- Expected outcome: [What success looks like]
- Budget: $XXX,XXX

### Timeline

| Phase | Start | End | Owner |
|-------|-------|-----|-------|
| Planning | Jan 1 | Jan 15 | John |
| Development | Jan 16 | Mar 31 | Sarah |
| Testing | Apr 1 | Apr 30 | Mike |
| Launch | May 1 | May 15 | Lisa |

---

## Action Items

- [ ] **John:** Complete project charter by Friday
- [ ] **Sarah:** Set up development environment
- [ ] **Mike:** Prepare testing plan
- [ ] **Lisa:** Schedule stakeholder review

---

## Decisions Made

1. Weekly standups every Monday at 9 AM
2. Use Slack for team communication
3. Documentation in Confluence

---

## Next Meeting

**Date:** Next Monday  
**Time:** 9:00 AM  
**Topic:** Sprint planning

---

*Notes taken by: [Your Name]*` },

    presentation: {
        name: '🎬 Presentation', content: `# Presentation Title
## Subtitle or Tagline

**Presenter:** Your Name  
**Date:** ${new Date().toLocaleDateString()}

---

## Slide 1: Introduction

- Welcome and introductions
- Today's agenda
- What you'll learn

---

## Slide 2: The Problem

> "A compelling quote that sets the stage"

- Problem statement 1
- Problem statement 2
- Why this matters

---

## Slide 3: Our Solution

### Key Features

| Feature | Benefit |
|---------|---------|
| Feature A | Saves time |
| Feature B | Reduces cost |
| Feature C | Improves quality |

---

## Slide 4: How It Works

\`\`\`
Step 1 → Step 2 → Step 3 → Result
\`\`\`

1. **First**, do this
2. **Then**, do that
3. **Finally**, achieve this

---

## Slide 5: Results

### Before vs After

- 📈 50% improvement in X
- ⏱️ 30% faster Y
- 💰 20% cost reduction

---

## Slide 6: Case Study

> "This solution transformed our business" — Happy Customer

**Company:** Example Corp  
**Challenge:** Description  
**Solution:** What we did  
**Result:** Measurable outcome

---

## Slide 7: Next Steps

- [ ] Schedule demo
- [ ] Review proposal
- [ ] Make decision

---

## Thank You!

### Questions?

📧 email@example.com  
🌐 www.example.com  
📱 @socialmedia` }
};

function getTextToHtmlContent() {
    return `
        <div class="ultimate-converter">
            <!-- Top Bar: Mode Toggle & Stats -->
            <div class="converter-topbar">
                <div class="mode-switcher">
                    <button onclick="setConverterMode('edit')" class="mode-btn active" id="modeEdit"><i class="fas fa-edit"></i> Editor</button>
                    <button onclick="setConverterMode('live')" class="mode-btn" id="modeLive"><i class="fas fa-columns"></i> Live Preview</button>
                </div>
                <div class="live-stats" id="liveStats">
                    <span class="stat"><i class="fas fa-font"></i> <span id="wordCount">0</span> words</span>
                    <span class="stat"><i class="fas fa-text-width"></i> <span id="charCount">0</span> chars</span>
                    <span class="stat"><i class="fas fa-clock"></i> <span id="readTime">0</span> min read</span>
                    <span class="stat"><i class="fas fa-paragraph"></i> <span id="paraCount">0</span> paragraphs</span>
                </div>
            </div>

            <!-- Template Bar -->
            <div class="template-bar">
                <label><i class="fas fa-file-alt"></i> Template:</label>
                <select id="templateSelect" onchange="loadTemplate()" class="template-select">
                    <option value="empty">📄 Empty Document</option>
                    <option value="blog">📝 Blog Post</option>
                    <option value="resume">💼 Resume/CV</option>
                    <option value="documentation">📚 Documentation</option>
                    <option value="readme">📖 README</option>
                    <option value="report">📊 Report</option>
                    <option value="letter">✉️ Formal Letter</option>
                    <option value="notes">📝 Meeting Notes</option>
                    <option value="presentation">🎬 Presentation</option>
                </select>
                <div class="template-actions">
                    <label class="action-btn file-upload">
                        <input type="file" accept=".txt,.md,.text,.markdown" onchange="loadTextFile(event)">
                        <i class="fas fa-upload"></i> Upload
                    </label>
                    <button onclick="clearEditor()" class="action-btn danger"><i class="fas fa-trash"></i></button>
                </div>
            </div>

            <!-- Main Editor Area -->
            <div class="editor-container" id="editorContainer">
                <!-- Markdown Editor -->
                <div class="editor-pane" id="editorPane">
                    <div class="pane-header">
                        <span><i class="fab fa-markdown"></i> Markdown</span>
                        <div class="editor-toolbar">
                            <button onclick="insertFormat('**', '**')" title="Bold (Ctrl+B)"><i class="fas fa-bold"></i></button>
                            <button onclick="insertFormat('*', '*')" title="Italic (Ctrl+I)"><i class="fas fa-italic"></i></button>
                            <button onclick="insertFormat('~~', '~~')" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
                            <button onclick="insertFormat('\\n# ', '')" title="Heading"><i class="fas fa-heading"></i></button>
                            <button onclick="insertFormat('\\n- ', '')" title="List"><i class="fas fa-list"></i></button>
                            <button onclick="insertFormat('\\n&gt; ', '')" title="Quote"><i class="fas fa-quote-right"></i></button>
                            <button onclick="insertFormat('&#96;', '&#96;')" title="Code"><i class="fas fa-code"></i></button>
                            <button onclick="insertFormat('[', '](url)')" title="Link"><i class="fas fa-link"></i></button>
                            <button onclick="insertFormat('![alt](', ')')" title="Image"><i class="fas fa-image"></i></button>
                            <button onclick="insertFormat('\\n| Col1 | Col2 |\\n|------|------|\\n| ', ' | |')" title="Table"><i class="fas fa-table"></i></button>
                        </div>
                    </div>
                    <textarea id="markdownInput" class="markdown-editor" placeholder="# Start typing your Markdown here...

Use the toolbar above for formatting, or type Markdown directly.

**Keyboard shortcuts:**
- Ctrl+B: Bold
- Ctrl+I: Italic
- Ctrl+K: Link
- Ctrl+Shift+C: Code block

**Supported syntax:**
- # ## ### Headings
- **bold** and *italic*
- - bullet lists
- 1. numbered lists
- [links](url) and ![images](url)
- \`inline code\` and \`\`\`code blocks\`\`\`
- > blockquotes
- | tables |
- - [x] task lists" oninput="updateLivePreview()"></textarea>
                </div>

                <!-- Live Preview Pane -->
                <div class="preview-pane" id="previewPane">
                    <div class="pane-header">
                        <span><i class="fas fa-eye"></i> Live Preview</span>
                        <select id="previewTheme" onchange="updateLivePreview()" class="theme-mini-select">
                            <option value="github">GitHub</option>
                            <option value="notion">Notion</option>
                            <option value="dark">Dark</option>
                            <option value="minimal">Minimal</option>
                        </select>
                    </div>
                    <div id="livePreviewContent" class="live-preview-content"></div>
                </div>
            </div>

            <!-- Options Panel -->
            <div class="converter-options-bar">
                <div class="option-group">
                    <label><i class="fas fa-palette"></i> Export Theme:</label>
                    <select id="exportTheme" class="premium-select">
                        <optgroup label="🎨 Light">
                            <option value="github">GitHub README</option>
                            <option value="notion">Notion</option>
                            <option value="modern">Modern Gradient</option>
                            <option value="professional">Professional</option>
                            <option value="minimal">Minimal</option>
                            <option value="academic">Academic</option>
                            <option value="newspaper">Newspaper</option>
                        </optgroup>
                        <optgroup label="🌙 Dark">
                            <option value="dark">Dark Mode</option>
                            <option value="dracula">Dracula</option>
                            <option value="nord">Nord</option>
                            <option value="monokai">Monokai</option>
                            <option value="synthwave">Synthwave</option>
                        </optgroup>
                        <optgroup label="🌈 Colorful">
                            <option value="vibrant">Vibrant</option>
                            <option value="sunset">Sunset</option>
                            <option value="ocean">Ocean</option>
                            <option value="forest">Forest</option>
                        </optgroup>
                    </select>
                </div>
                <div class="option-group checkboxes">
                    <label><input type="checkbox" id="optTOC" checked> 📑 TOC</label>
                    <label><input type="checkbox" id="optHighlight" checked> 🎨 Syntax</label>
                    <label><input type="checkbox" id="optResponsive" checked> 📱 Responsive</label>
                    <label><input type="checkbox" id="optPrint" checked> 🖨️ Print Ready</label>
                </div>
            </div>

            <!-- AI Enhancement Panel -->
            <div class="ai-panel">
                <div class="ai-header">
                    <div class="ai-title">
                        <i class="fas fa-robot"></i>
                        <span>AI-Powered Generation</span>
                        <span class="ai-badge">OpenRouter</span>
                    </div>
                    <button onclick="toggleAiSettings()" class="ai-settings-btn">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
                
                <div class="ai-settings" id="aiSettings" style="display:none;">
                    <div class="ai-key-input">
                        <label>
                            <i class="fas fa-key"></i> OpenRouter API Key:
                            <a href="https://openrouter.ai/keys" target="_blank" class="get-key-link">Get Free Key →</a>
                        </label>
                        <input type="password" id="openRouterKey" placeholder="sk-or-v1-..." 
                               onchange="saveApiKey()" value="">
                    </div>
                    <div class="ai-model-select">
                        <label><i class="fas fa-brain"></i> AI Model:</label>
                        <select id="aiModel">
                            <optgroup label="🆓 Free Models">
                                <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Free)</option>
                                <option value="google/gemma-2-9b-it:free">Gemma 2 9B (Free)</option>
                                <option value="mistralai/mistral-7b-instruct:free">Mistral 7B (Free)</option>
                            </optgroup>
                            <optgroup label="⭐ Best Quality">
                                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                                <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Cheap)</option>
                                <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                                <option value="google/gemini-pro-1.5">Gemini 1.5 Pro</option>
                            </optgroup>
                        </select>
                    </div>
                    <p class="ai-info">
                        <i class="fas fa-info-circle"></i>
                        Free models work without credits. Premium models use your OpenRouter balance.
                        New users get $1 free credit!
                    </p>
                </div>
                
                <div class="ai-actions">
                    <button onclick="aiEnhanceContent('enhance')" class="ai-btn enhance">
                        <i class="fas fa-magic"></i> Enhance Writing
                    </button>
                    <button onclick="aiEnhanceContent('beautify')" class="ai-btn beautify">
                        <i class="fas fa-sparkles"></i> Beautify HTML
                    </button>
                    <button onclick="aiEnhanceContent('generate')" class="ai-btn generate">
                        <i class="fas fa-wand-magic-sparkles"></i> Generate from Description
                    </button>
                </div>
                
                <div class="ai-prompt-input" id="aiPromptInput" style="display:none;">
                    <textarea id="aiPrompt" placeholder="Describe what you want to create...
Example: Create a professional landing page for a SaaS product with hero section, features, pricing, and testimonials"></textarea>
                    <button onclick="executeAiGeneration()" class="ai-execute-btn">
                        <i class="fas fa-paper-plane"></i> Generate
                    </button>
                </div>
                
                <div class="ai-loading" id="aiLoading" style="display:none;">
                    <div class="ai-spinner"></div>
                    <span>AI is thinking...</span>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="converter-actions">
                <button onclick="generateFinalHtml()" class="primary-btn">
                    <i class="fas fa-wand-magic-sparkles"></i> Generate HTML
                    <span class="pro-badge">PRO</span>
                </button>
                <button onclick="copyMarkdown()" class="secondary-btn"><i class="fas fa-copy"></i> Copy MD</button>
                <button onclick="downloadMarkdown()" class="secondary-btn"><i class="fab fa-markdown"></i> Save .md</button>
            </div>

            <!-- Output Section -->
            <div class="output-panel" id="outputPanel" style="display:none;">
                <div class="output-header">
                    <div class="output-tabs">
                        <button onclick="showOutputTab('code')" class="tab-btn active" id="tabCode">
                            <i class="fas fa-code"></i> HTML Code
                        </button>
                        <button onclick="showOutputTab('preview')" class="tab-btn" id="tabPreview">
                            <i class="fas fa-eye"></i> Full Preview
                        </button>
                    </div>
                    <div class="output-actions">
                        <span class="output-size" id="outputSize">0 KB</span>
                        <button onclick="copyFinalHtml()" class="action-btn"><i class="fas fa-copy"></i> Copy</button>
                        <button onclick="downloadFinalHtml()" class="action-btn success"><i class="fas fa-download"></i> Download HTML</button>
                    </div>
                </div>
                <div id="outputCode" class="output-code"></div>
                <div id="outputPreview" class="output-preview" style="display:none;"></div>
            </div>
        </div>
    `;
}

// Converter state
let converterMode = 'edit';
let generatedHtml = '';

function setConverterMode(mode) {
    converterMode = mode;
    const container = document.getElementById('editorContainer');

    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode === 'edit' ? 'modeEdit' : 'modeLive').classList.add('active');

    if (mode === 'live') {
        container.classList.add('live-mode');
        document.getElementById('previewPane').style.display = 'flex';
        updateLivePreview();
    } else {
        container.classList.remove('live-mode');
        document.getElementById('previewPane').style.display = 'none';
    }
}

function loadTemplate() {
    const templateKey = document.getElementById('templateSelect').value;
    const template = documentTemplates[templateKey];
    if (template) {
        document.getElementById('markdownInput').value = template.content;
        updateStats();
        updateLivePreview();
        if (template.content) {
            showToast(`✨ Loaded: ${template.name}`);
        }
    }
}

function clearEditor() {
    document.getElementById('markdownInput').value = '';
    document.getElementById('templateSelect').value = 'empty';
    document.getElementById('outputPanel').style.display = 'none';
    updateStats();
    updateLivePreview();
}

function insertFormat(before, after) {
    const textarea = document.getElementById('markdownInput');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    textarea.value = text.substring(0, start) + before + selected + after + text.substring(end);
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;

    updateStats();
    updateLivePreview();
}

function updateStats() {
    const text = document.getElementById('markdownInput').value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const readTime = Math.max(1, Math.ceil(words / 200));

    document.getElementById('wordCount').textContent = words.toLocaleString();
    document.getElementById('charCount').textContent = chars.toLocaleString();
    document.getElementById('readTime').textContent = readTime;
    document.getElementById('paraCount').textContent = paragraphs;
}

function updateLivePreview() {
    updateStats();

    const markdown = document.getElementById('markdownInput').value;
    const theme = document.getElementById('previewTheme')?.value || 'github';
    const preview = document.getElementById('livePreviewContent');

    if (!preview) return;

    // Use Marked.js if available, otherwise fallback
    let html;
    if (window.marked) {
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: true,
            mangle: false
        });
        html = marked.parse(markdown);
    } else {
        html = parseMarkdownFallback(markdown);
    }

    preview.innerHTML = html;
    preview.className = `live-preview-content theme-${theme}`;

    // Apply Prism.js syntax highlighting
    if (window.Prism) {
        preview.querySelectorAll('pre code').forEach(block => {
            Prism.highlightElement(block);
        });
    }
}

// Fallback parser if Marked.js not loaded
function parseMarkdownFallback(text) {
    let html = text
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Links and images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Lists
        .replace(/^- \[x\] (.*$)/gim, '<li class="task checked"><input type="checkbox" checked disabled> $1</li>')
        .replace(/^- \[ \] (.*$)/gim, '<li class="task"><input type="checkbox" disabled> $1</li>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        // Horizontal rule
        .replace(/^---$/gim, '<hr>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    return '<p>' + html + '</p>';
}

function generateFinalHtml() {
    const markdown = document.getElementById('markdownInput').value;
    if (!markdown.trim()) {
        showToast('⚠️ Please enter some content first!');
        return;
    }

    const theme = document.getElementById('exportTheme').value;
    const includeTOC = document.getElementById('optTOC').checked;
    const syntaxHighlight = document.getElementById('optHighlight').checked;
    const responsive = document.getElementById('optResponsive').checked;
    const printReady = document.getElementById('optPrint').checked;

    // Parse with Marked.js
    let content;
    if (window.marked) {
        marked.setOptions({ gfm: true, breaks: true, headerIds: true });
        content = marked.parse(markdown);
    } else {
        content = parseMarkdownFallback(markdown);
    }

    // Generate TOC
    let tocHtml = '';
    if (includeTOC) {
        const headings = [];
        content.replace(/<h([1-3]) id="([^"]+)">([^<]+)<\/h[1-3]>/g, (match, level, id, text) => {
            headings.push({ level: parseInt(level), id, text });
        });
        if (headings.length > 0) {
            tocHtml = '<nav class="toc"><h2>📑 Table of Contents</h2><ul>' +
                headings.map(h => `<li class="toc-${h.level}"><a href="#${h.id}">${h.text}</a></li>`).join('') +
                '</ul></nav>';
        }
    }

    generatedHtml = buildUltimateDocument(tocHtml + content, { theme, syntaxHighlight, responsive, printReady });

    // Show output
    document.getElementById('outputPanel').style.display = 'block';
    document.getElementById('outputCode').textContent = generatedHtml;
    document.getElementById('outputSize').textContent = (generatedHtml.length / 1024).toFixed(1) + ' KB';

    showOutputTab('code');
    showToast('✅ HTML generated successfully!');
}

function buildUltimateDocument(content, options) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    ${options.syntaxHighlight ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">' : ''}
    <style>
        ${getUltimateTheme(options.theme)}
        ${getUltimateBaseStyles()}
        ${options.responsive ? getUltimateResponsiveStyles() : ''}
        ${options.printReady ? getUltimatePrintStyles() : ''}
    </style>
</head>
<body>
    <article class="document">
        ${content}
    </article>
    ${options.syntaxHighlight ? '<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"><\/script>' : ''}
</body>
</html>`;
}

function getUltimateTheme(theme) {
    const themes = {
        github: ':root{--bg:#fff;--text:#24292f;--heading:#0969da;--link:#0969da;--code-bg:#f6f8fa;--code-text:#24292f;--border:#d0d7de;--quote-bg:#f6f8fa;--quote-border:#d0d7de;--table-bg:#f6f8fa}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text)}',
        notion: ':root{--bg:#fff;--text:#37352f;--heading:#37352f;--link:#2eaadc;--code-bg:rgba(135,131,120,0.15);--code-text:#eb5757;--border:#e9e9e7;--quote-bg:#f7f6f3;--quote-border:#37352f;--table-bg:#f7f6f3}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text)}',
        modern: ':root{--bg:linear-gradient(135deg,#667eea,#764ba2);--text:#374151;--heading:#667eea;--link:#2563eb;--code-bg:#1e293b;--code-text:#e2e8f0;--border:#e5e7eb;--quote-bg:#f5f3ff;--quote-border:#667eea;--table-bg:#f9fafb}body{font-family:"Inter",sans-serif;background:var(--bg);min-height:100vh;padding:2rem}.document{background:#fff;border-radius:20px;box-shadow:0 25px 100px rgba(0,0,0,0.15)}',
        professional: ':root{--bg:#f8fafc;--text:#4b5563;--heading:#1e40af;--link:#1e40af;--code-bg:#1f2937;--code-text:#e5e7eb;--border:#e5e7eb;--quote-bg:#f0f9ff;--quote-border:#1e40af;--table-bg:#f9fafb}body{font-family:"Inter",Georgia,serif;background:var(--bg)}.document{background:#fff;box-shadow:0 4px 20px rgba(0,0,0,0.08);border-top:4px solid var(--heading)}',
        minimal: ':root{--bg:#fff;--text:#374151;--heading:#111827;--link:#2563eb;--code-bg:#f5f5f5;--code-text:#dc2626;--border:#e5e7eb;--quote-bg:#f9fafb;--quote-border:#d1d5db;--table-bg:#f9fafb}body{font-family:"Inter",system-ui,sans-serif;background:var(--bg);color:var(--text)}',
        academic: ':root{--bg:#fffff8;--text:#333;--heading:#1a1a1a;--link:#00529b;--code-bg:#f4f4f4;--code-text:#c7254e;--border:#ddd;--quote-bg:#f9f9f9;--quote-border:#ccc;--table-bg:#f9f9f9}body{font-family:"Palatino Linotype","Book Antiqua",Palatino,serif;background:var(--bg);color:var(--text);line-height:1.8}',
        newspaper: ':root{--bg:#f5f0e6;--text:#2d2d2d;--heading:#1a1a1a;--link:#8b0000;--code-bg:#fff;--code-text:#333;--border:#d4c9a8;--quote-bg:#fff;--quote-border:#8b0000;--table-bg:#fff}body{font-family:Georgia,"Times New Roman",serif;background:var(--bg);color:var(--text)}',
        dark: ':root{--bg:#0f172a;--text:#cbd5e1;--heading:#60a5fa;--link:#38bdf8;--code-bg:#1e293b;--code-text:#fb923c;--border:#334155;--quote-bg:rgba(96,165,250,0.1);--quote-border:#60a5fa;--table-bg:#1e293b}body{font-family:"Inter",sans-serif;background:var(--bg);color:var(--text)}.document{background:#1e293b;border-radius:16px}',
        dracula: ':root{--bg:#282a36;--text:#f8f8f2;--heading:#bd93f9;--link:#8be9fd;--code-bg:#1e1f29;--code-text:#ff79c6;--border:#6272a4;--quote-bg:rgba(189,147,249,0.1);--quote-border:#bd93f9;--table-bg:#44475a}body{font-family:"Inter",sans-serif;background:var(--bg);color:var(--text)}.document{background:#44475a;border-radius:16px}',
        nord: ':root{--bg:#2e3440;--text:#eceff4;--heading:#88c0d0;--link:#81a1c1;--code-bg:#3b4252;--code-text:#bf616a;--border:#4c566a;--quote-bg:rgba(136,192,208,0.1);--quote-border:#88c0d0;--table-bg:#3b4252}body{font-family:"Inter",sans-serif;background:var(--bg);color:var(--text)}.document{background:#3b4252;border-radius:12px}',
        monokai: ':root{--bg:#272822;--text:#f8f8f2;--heading:#a6e22e;--link:#66d9ef;--code-bg:#1e1f1c;--code-text:#f92672;--border:#49483e;--quote-bg:rgba(253,151,31,0.1);--quote-border:#fd971f;--table-bg:#3e3d32}body{font-family:"Inter",sans-serif;background:var(--bg);color:var(--text)}.document{background:#3e3d32;border-radius:12px}',
        synthwave: ':root{--bg:linear-gradient(180deg,#2b213a,#1a1a2e);--text:#f5f5f5;--heading:#ff00ff;--link:#00ffff;--code-bg:#16161d;--code-text:#ff79c6;--border:#ff00ff33;--quote-bg:rgba(255,0,255,0.1);--quote-border:#ff00ff;--table-bg:#2b213a}body{font-family:"Inter",sans-serif;background:var(--bg);min-height:100vh;color:var(--text)}.document{background:rgba(0,0,0,0.3);border-radius:16px;border:1px solid #ff00ff33}',
        vibrant: ':root{--bg:linear-gradient(45deg,#ff6b6b,#feca57,#48dbfb,#ff9ff3);--text:#2d3436;--heading:#e84393;--link:#0984e3;--code-bg:#2d3436;--code-text:#dfe6e9;--border:#dfe6e9;--quote-bg:#ffeaa7;--quote-border:#fd79a8;--table-bg:rgba(255,255,255,0.9)}body{font-family:"Inter",sans-serif;background:var(--bg);background-size:400% 400%;animation:gradient 15s ease infinite;min-height:100vh;padding:2rem}@keyframes gradient{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}.document{background:rgba(255,255,255,0.95);border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.2)}',
        sunset: ':root{--bg:linear-gradient(135deg,#ff9a56,#ff6b6b);--text:#5d4037;--heading:#bf360c;--link:#f57c00;--code-bg:#5d4037;--code-text:#fff8e1;--border:#ffcc80;--quote-bg:#fff8e1;--quote-border:#ff9a56;--table-bg:#ffe0b2}body{font-family:"Inter",sans-serif;background:var(--bg);min-height:100vh;padding:2rem}.document{background:#fffaf5;border-radius:20px;box-shadow:0 20px 60px rgba(255,107,107,0.2)}',
        ocean: ':root{--bg:linear-gradient(135deg,#0093E9,#80D0C7);--text:#164e63;--heading:#0891b2;--link:#0e7490;--code-bg:#164e63;--code-text:#67e8f9;--border:#a5f3fc;--quote-bg:#cffafe;--quote-border:#06b6d4;--table-bg:#ecfeff}body{font-family:"Inter",sans-serif;background:var(--bg);min-height:100vh;padding:2rem}.document{background:#f0fdff;border-radius:20px;box-shadow:0 20px 60px rgba(0,147,233,0.2)}',
        forest: ':root{--bg:linear-gradient(135deg,#134e4a,#059669);--text:#14532d;--heading:#166534;--link:#15803d;--code-bg:#14532d;--code-text:#bbf7d0;--border:#86efac;--quote-bg:#dcfce7;--quote-border:#22c55e;--table-bg:#f0fdf4}body{font-family:"Inter",sans-serif;background:var(--bg);min-height:100vh;padding:2rem}.document{background:#f0fdf4;border-radius:20px;box-shadow:0 20px 60px rgba(5,150,105,0.2)}'
    };
    return themes[theme] || themes.github;
}

function getUltimateBaseStyles() {
    return `
        *{margin:0;padding:0;box-sizing:border-box}
        .document{max-width:900px;margin:0 auto;padding:3rem 2rem}
        h1,h2,h3,h4,h5,h6{color:var(--heading);line-height:1.3;margin:2rem 0 1rem}
        h1{font-size:2.5rem}h2{font-size:2rem;border-bottom:2px solid var(--border);padding-bottom:0.5rem}h3{font-size:1.5rem}
        p{line-height:1.8;margin:1rem 0}
        a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
        code{background:var(--code-bg);color:var(--code-text);padding:0.2em 0.4em;border-radius:4px;font-family:"Fira Code",monospace;font-size:0.9em}
        pre{background:var(--code-bg);border-radius:8px;padding:1.5rem;overflow-x:auto;margin:1.5rem 0}
        pre code{background:transparent;padding:0}
        blockquote{margin:1.5rem 0;padding:1rem 1.5rem;border-left:4px solid var(--quote-border);background:var(--quote-bg);border-radius:0 8px 8px 0}
        ul,ol{margin:1rem 0 1rem 1.5rem}li{margin:0.5rem 0;line-height:1.6}
        table{width:100%;border-collapse:collapse;margin:1.5rem 0}
        th,td{padding:0.75rem 1rem;border:1px solid var(--border);text-align:left}
        th{background:var(--table-bg);font-weight:600}
        img{max-width:100%;height:auto;border-radius:8px;margin:1rem 0}
        hr{border:none;height:2px;background:var(--border);margin:2rem 0}
        .toc{background:var(--table-bg);padding:1.5rem;border-radius:12px;margin-bottom:2rem}
        .toc h2{margin:0 0 1rem;font-size:1.2rem}
        .toc ul{list-style:none;padding:0;margin:0}
        .toc li{margin:0.3rem 0}
        .toc-2{padding-left:1rem}.toc-3{padding-left:2rem}
        .task{list-style:none}
        .task input{margin-right:0.5rem}
        .task.checked{text-decoration:line-through;opacity:0.6}
    `;
}

function getUltimateResponsiveStyles() {
    return '@media(max-width:768px){.document{padding:1.5rem 1rem}h1{font-size:2rem}h2{font-size:1.5rem}pre{padding:1rem;font-size:0.8rem}}';
}

function getUltimatePrintStyles() {
    return '@media print{body{background:#fff!important}.document{box-shadow:none!important;border:none!important}pre,code{background:#f5f5f5!important;color:#333!important}a{color:#000!important}}';
}

function showOutputTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tab === 'code' ? 'tabCode' : 'tabPreview').classList.add('active');

    if (tab === 'code') {
        document.getElementById('outputCode').style.display = 'block';
        document.getElementById('outputPreview').style.display = 'none';
    } else {
        document.getElementById('outputCode').style.display = 'none';
        const preview = document.getElementById('outputPreview');
        preview.innerHTML = `<iframe srcdoc="${generatedHtml.replace(/"/g, '&quot;')}" style="width:100%;height:600px;border:none;border-radius:8px;"></iframe>`;
        preview.style.display = 'block';
    }
}

function copyFinalHtml() {
    navigator.clipboard.writeText(generatedHtml).then(() => showToast('📋 HTML copied!'));
}

function downloadFinalHtml() {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ HTML downloaded!');
}

function copyMarkdown() {
    const md = document.getElementById('markdownInput').value;
    navigator.clipboard.writeText(md).then(() => showToast('📋 Markdown copied!'));
}

function downloadMarkdown() {
    const md = document.getElementById('markdownInput').value;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ Markdown saved!');
}

function loadTextFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('markdownInput').value = e.target.result;
            updateStats();
            updateLivePreview();
            showToast('✅ Loaded: ' + file.name);
        };
        reader.readAsText(file);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('markdownInput')) return;
    if (!document.getElementById('markdownInput').matches(':focus')) return;

    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'b': e.preventDefault(); insertFormat('**', '**'); break;
            case 'i': e.preventDefault(); insertFormat('*', '*'); break;
            case 'k': e.preventDefault(); insertFormat('[', '](url)'); break;
        }
        if (e.shiftKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            insertFormat('```\n', '\n```');
        }
    }
});

// ==================== OPENROUTER AI INTEGRATION ====================

// Load saved API key on page load
function loadApiKey() {
    const savedKey = localStorage.getItem('openrouter_api_key');
    const keyInput = document.getElementById('openRouterKey');
    if (savedKey && keyInput) {
        keyInput.value = savedKey;
    }
}

// Save API key to localStorage
function saveApiKey() {
    const key = document.getElementById('openRouterKey').value;
    if (key) {
        localStorage.setItem('openrouter_api_key', key);
        showToast('🔑 API Key saved!');
    }
}

// Toggle AI settings panel
function toggleAiSettings() {
    const settings = document.getElementById('aiSettings');
    if (settings) {
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
        loadApiKey();
    }
}

// AI Enhancement functions
async function aiEnhanceContent(action) {
    const apiKey = document.getElementById('openRouterKey')?.value || localStorage.getItem('openrouter_api_key');
    const model = document.getElementById('aiModel')?.value || 'meta-llama/llama-3.1-8b-instruct:free';
    const content = document.getElementById('markdownInput')?.value || '';

    // Check if using free model (no API key needed for some)
    const isFreeModel = model.includes(':free');

    if (!apiKey && !isFreeModel) {
        document.getElementById('aiSettings').style.display = 'block';
        showToast('⚠️ Please enter your OpenRouter API key first!');
        return;
    }

    if (action === 'generate') {
        // Show prompt input for generation
        const promptInput = document.getElementById('aiPromptInput');
        if (promptInput) {
            promptInput.style.display = promptInput.style.display === 'none' ? 'block' : 'none';
        }
        return;
    }

    if (!content.trim() && action !== 'generate') {
        showToast('⚠️ Please enter some content to enhance!');
        return;
    }

    let prompt = '';
    switch (action) {
        case 'enhance':
            prompt = `You are a professional writer. Enhance and improve the following Markdown content while preserving its structure and meaning. Make it more engaging, clearer, and professional. Fix any grammar or spelling issues. Return ONLY the improved Markdown, no explanations:

${content}`;
            break;
        case 'beautify':
            prompt = `You are a web design expert. Convert the following Markdown content to beautiful, modern HTML with inline CSS styling. Use:
- Modern color scheme with gradients
- Clean typography (font-family: 'Inter', sans-serif)
- Proper spacing and layout
- Responsive design
- Beautiful code blocks if any
- Styled tables, lists, and blockquotes
Return ONLY the complete HTML code (including <!DOCTYPE html>) with embedded CSS, no explanations:

${content}`;
            break;
    }

    await callOpenRouterAPI(prompt, apiKey, model);
}

// Execute AI generation from custom prompt
async function executeAiGeneration() {
    const apiKey = document.getElementById('openRouterKey')?.value || localStorage.getItem('openrouter_api_key');
    const model = document.getElementById('aiModel')?.value || 'meta-llama/llama-3.1-8b-instruct:free';
    const customPrompt = document.getElementById('aiPrompt')?.value || '';

    const isFreeModel = model.includes(':free');

    if (!apiKey && !isFreeModel) {
        showToast('⚠️ Please enter your OpenRouter API key!');
        return;
    }

    if (!customPrompt.trim()) {
        showToast('⚠️ Please describe what you want to create!');
        return;
    }

    const prompt = `You are an expert web developer and designer. Create beautiful, modern HTML based on this description:

"${customPrompt}"

Requirements:
- Generate complete, self-contained HTML with embedded CSS
- Use modern design patterns (gradients, shadows, rounded corners)
- Make it responsive
- Use professional typography (Google Fonts like Inter, Poppins)
- Add subtle animations where appropriate
- Include proper semantic HTML5
- Make it visually stunning and production-ready

Return ONLY the complete HTML code (including <!DOCTYPE html>), no explanations.`;

    await callOpenRouterAPI(prompt, apiKey, model);
    document.getElementById('aiPromptInput').style.display = 'none';
}

// Call OpenRouter API
async function callOpenRouterAPI(prompt, apiKey, model) {
    const loading = document.getElementById('aiLoading');
    if (loading) loading.style.display = 'flex';

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Text to HTML Converter',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4096
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || '';

        if (aiResponse) {
            // Check if response is HTML or Markdown
            if (aiResponse.includes('<!DOCTYPE') || aiResponse.includes('<html')) {
                // It's HTML - show in output
                generatedHtml = aiResponse;
                document.getElementById('outputPanel').style.display = 'block';
                document.getElementById('outputCode').textContent = generatedHtml;
                document.getElementById('outputSize').textContent = (generatedHtml.length / 1024).toFixed(1) + ' KB';
                showOutputTab('code');
                showToast('✨ AI generated beautiful HTML!');
            } else {
                // It's enhanced Markdown - put in editor
                document.getElementById('markdownInput').value = aiResponse;
                updateStats();
                updateLivePreview();
                showToast('✨ Content enhanced by AI!');
            }
        }
    } catch (error) {
        console.error('OpenRouter API Error:', error);
        showToast('❌ Error: ' + error.message);
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

// Initialize API key on load
document.addEventListener('DOMContentLoaded', loadApiKey);

// Add layerStyle to document
document.head.appendChild(layerStyle);
