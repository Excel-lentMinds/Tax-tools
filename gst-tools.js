/* ===================================================
   GST TOOLS - JAVASCRIPT
   Complete functionality for all 9 GST calculators
   =================================================== */

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initToolNavigation();
    initGSTCalculator();
    initHSNFinder();
    initITCCalculator();
    initInterestCalculator();
    initEwayCalculator();
    initCompositionChecker();
    initReconciliation();
    initAnnualReturn();
    initAntiProfiteering();
    setDefaultDate();
});

// ==================== TOOL NAVIGATION ====================
function initToolNavigation() {
    const navItems = document.querySelectorAll('.tool-nav-item');
    const sections = document.querySelectorAll('.tool-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const toolId = item.getAttribute('data-tool');

            // Update nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Update sections
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(toolId).classList.add('active');

            // Scroll to top of content
            window.scrollTo({ top: 200, behavior: 'smooth' });
        });
    });
}

// ==================== UTILITY FUNCTIONS ====================
function formatINR(num) {
    if (isNaN(num)) return '₹ 0.00';
    return '₹ ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseAmount(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/,/g, '')) || 0;
}

function setDefaultDate() {
    const today = new Date();
    const dateInputs = document.querySelectorAll('input[type="date"], input[type="datetime-local"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            if (input.type === 'datetime-local') {
                input.value = today.toISOString().slice(0, 16);
            } else {
                input.value = today.toISOString().slice(0, 10);
            }
        }
    });
}

// ==================== GST CALCULATOR ====================
function initGSTCalculator() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const rateButtons = document.querySelectorAll('.rate-btn');
    const calculateBtn = document.getElementById('calculateGST');
    const amountInput = document.getElementById('gstAmount');
    const amountLabel = document.getElementById('amountLabel');
    const customRateWrapper = document.getElementById('customRateWrapper');

    let currentMode = 'add';
    let currentRate = 12;

    // Mode selection
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.getAttribute('data-mode');

            // Update label
            if (currentMode === 'add') {
                amountLabel.textContent = 'Amount (Excluding GST)';
            } else if (currentMode === 'remove') {
                amountLabel.textContent = 'Amount (Including GST)';
            } else {
                amountLabel.textContent = 'Base Amount';
            }
        });
    });

    // Rate selection
    rateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            rateButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const rate = btn.getAttribute('data-rate');

            if (rate === 'custom') {
                customRateWrapper.classList.remove('hidden');
            } else {
                customRateWrapper.classList.add('hidden');
                currentRate = parseFloat(rate);
            }
        });
    });

    // Calculate
    calculateBtn.addEventListener('click', () => {
        const customRateInput = document.getElementById('customRate');
        if (!customRateWrapper.classList.contains('hidden')) {
            currentRate = parseFloat(customRateInput.value) || 0;
        }

        const amount = parseAmount(amountInput.value);
        const taxType = document.querySelector('input[name="taxType"]:checked').value;
        const cessRate = parseFloat(document.getElementById('cessRate').value) || 0;

        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        let baseAmount, gstAmount, cessAmount, finalAmount;

        if (currentMode === 'add') {
            baseAmount = amount;
            gstAmount = baseAmount * (currentRate / 100);
            cessAmount = baseAmount * (cessRate / 100);
            finalAmount = baseAmount + gstAmount + cessAmount;
        } else if (currentMode === 'remove') {
            finalAmount = amount;
            baseAmount = amount / (1 + (currentRate / 100) + (cessRate / 100));
            gstAmount = baseAmount * (currentRate / 100);
            cessAmount = baseAmount * (cessRate / 100);
        } else {
            baseAmount = amount;
            gstAmount = baseAmount * (currentRate / 100);
            cessAmount = baseAmount * (cessRate / 100);
            finalAmount = baseAmount + gstAmount + cessAmount;
        }

        // Display results
        const resultDiv = document.getElementById('gstResult');
        resultDiv.classList.remove('hidden');

        document.getElementById('resultBase').textContent = formatINR(baseAmount);

        const cgstRow = document.getElementById('cgstRow');
        const sgstRow = document.getElementById('sgstRow');
        const igstRow = document.getElementById('igstRow');
        const cessRow = document.getElementById('cessRow');

        if (taxType === 'igst') {
            cgstRow.classList.add('hidden');
            sgstRow.classList.add('hidden');
            igstRow.classList.remove('hidden');
            document.getElementById('resultIGST').textContent = formatINR(gstAmount) + ` @ ${currentRate}%`;
        } else {
            cgstRow.classList.remove('hidden');
            sgstRow.classList.remove('hidden');
            igstRow.classList.add('hidden');
            document.getElementById('resultCGST').textContent = formatINR(gstAmount / 2) + ` @ ${currentRate / 2}%`;
            document.getElementById('resultSGST').textContent = formatINR(gstAmount / 2) + ` @ ${currentRate / 2}%`;
        }

        if (cessRate > 0) {
            cessRow.classList.remove('hidden');
            document.getElementById('resultCess').textContent = formatINR(cessAmount) + ` @ ${cessRate}%`;
        } else {
            cessRow.classList.add('hidden');
        }

        document.getElementById('resultTotalGST').textContent = formatINR(gstAmount + cessAmount);
        document.getElementById('resultFinal').textContent = formatINR(finalAmount);
    });

    // Copy result
    document.getElementById('copyResult').addEventListener('click', () => {
        const result = document.getElementById('gstResult').innerText;
        navigator.clipboard.writeText(result).then(() => {
            alert('Result copied to clipboard!');
        });
    });

    // Clear
    document.getElementById('clearResult').addEventListener('click', () => {
        amountInput.value = '';
        document.getElementById('customRate').value = '';
        document.getElementById('cessRate').value = '0';
        document.getElementById('gstResult').classList.add('hidden');
    });
}

// ==================== HSN/SAC FINDER ====================
function initHSNFinder() {
    const searchInput = document.getElementById('hsnSearch');
    const searchBtn = document.getElementById('searchHSN');
    const resultsDiv = document.getElementById('hsnResults');
    const typeButtons = document.querySelectorAll('.search-type-btn');
    const popularItems = document.querySelectorAll('.popular-item');

    // HSN Database (Top 100 items)
    const hsnDatabase = [
        { code: '0401', type: 'hsn', desc: 'Milk and cream', rate: 0, cess: 0 },
        { code: '0402', type: 'hsn', desc: 'Milk powder', rate: 5, cess: 0 },
        { code: '1001', type: 'hsn', desc: 'Wheat and meslin', rate: 0, cess: 0 },
        { code: '1006', type: 'hsn', desc: 'Rice', rate: 5, cess: 0 },
        { code: '2201', type: 'hsn', desc: 'Mineral water, aerated water', rate: 18, cess: 0 },
        { code: '2202', type: 'hsn', desc: 'Beverages, soft drinks', rate: 28, cess: 12 },
        { code: '3004', type: 'hsn', desc: 'Medicaments, pharmaceuticals', rate: 12, cess: 0 },
        { code: '3304', type: 'hsn', desc: 'Beauty/makeup preparations', rate: 28, cess: 0 },
        { code: '3401', type: 'hsn', desc: 'Soap, organic products', rate: 18, cess: 0 },
        { code: '3926', type: 'hsn', desc: 'Plastic articles', rate: 18, cess: 0 },
        { code: '6109', type: 'hsn', desc: 'T-shirts, singlets', rate: 12, cess: 0 },
        { code: '6203', type: 'hsn', desc: 'Men\'s suits, jackets', rate: 12, cess: 0 },
        { code: '6403', type: 'hsn', desc: 'Footwear', rate: 18, cess: 0 },
        { code: '7113', type: 'hsn', desc: 'Gold/silver jewellery', rate: 3, cess: 0 },
        { code: '7318', type: 'hsn', desc: 'Screws, bolts, nuts', rate: 18, cess: 0 },
        { code: '8415', type: 'hsn', desc: 'Air conditioning machines', rate: 28, cess: 0 },
        { code: '8418', type: 'hsn', desc: 'Refrigerators, freezers', rate: 18, cess: 0 },
        { code: '8450', type: 'hsn', desc: 'Washing machines', rate: 18, cess: 0 },
        { code: '8471', type: 'hsn', desc: 'Computers, laptops', rate: 18, cess: 0 },
        { code: '8517', type: 'hsn', desc: 'Mobile phones, smartphones', rate: 12, cess: 0 },
        { code: '8528', type: 'hsn', desc: 'Television sets, monitors', rate: 18, cess: 0 },
        { code: '8703', type: 'hsn', desc: 'Motor cars, vehicles', rate: 28, cess: 22 },
        { code: '8711', type: 'hsn', desc: 'Motorcycles, scooters', rate: 28, cess: 0 },
        { code: '9403', type: 'hsn', desc: 'Furniture', rate: 18, cess: 0 },
        { code: '9963', type: 'sac', desc: 'Restaurant services (without AC)', rate: 5, cess: 0 },
        { code: '9964', type: 'sac', desc: 'Hotel accommodation', rate: 12, cess: 0 },
        { code: '9965', type: 'sac', desc: 'Passenger transport (rail)', rate: 5, cess: 0 },
        { code: '9966', type: 'sac', desc: 'Goods transport by road', rate: 5, cess: 0 },
        { code: '9967', type: 'sac', desc: 'Courier services', rate: 18, cess: 0 },
        { code: '9971', type: 'sac', desc: 'Financial services', rate: 18, cess: 0 },
        { code: '9972', type: 'sac', desc: 'Real estate services', rate: 18, cess: 0 },
        { code: '9973', type: 'sac', desc: 'Leasing/rental services', rate: 18, cess: 0 },
        { code: '9981', type: 'sac', desc: 'Research & development', rate: 18, cess: 0 },
        { code: '9982', type: 'sac', desc: 'Legal services', rate: 18, cess: 0 },
        { code: '9983', type: 'sac', desc: 'Professional services (CA, CS)', rate: 18, cess: 0 },
        { code: '9984', type: 'sac', desc: 'Telecom services', rate: 18, cess: 0 },
        { code: '9985', type: 'sac', desc: 'Support services', rate: 18, cess: 0 },
        { code: '9986', type: 'sac', desc: 'Other professional services', rate: 18, cess: 0 },
        { code: '9987', type: 'sac', desc: 'Maintenance & repair', rate: 18, cess: 0 },
        { code: '9988', type: 'sac', desc: 'Manufacturing services', rate: 18, cess: 0 },
        { code: '9991', type: 'sac', desc: 'Public administration', rate: 0, cess: 0 },
        { code: '9992', type: 'sac', desc: 'Education services', rate: 0, cess: 0 },
        { code: '9993', type: 'sac', desc: 'Health services', rate: 0, cess: 0 },
        { code: '9995', type: 'sac', desc: 'Recreation services', rate: 18, cess: 0 },
        { code: '9954', type: 'sac', desc: 'Construction services', rate: 18, cess: 0 },
        { code: '9961', type: 'sac', desc: 'Telecommunication', rate: 18, cess: 0 },
        { code: '9997', type: 'sac', desc: 'Other services', rate: 18, cess: 0 }
    ];

    let searchType = 'all';

    // Type toggle
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            searchType = btn.getAttribute('data-type');
        });
    });

    // Search function
    function performSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            resultsDiv.innerHTML = `
                <div class="hsn-placeholder">
                    <i class="fas fa-search"></i>
                    <p>Enter HSN/SAC code or product name to find GST rate</p>
                    <span>Try: "laptop", "8471", "restaurant", "9963"</span>
                </div>`;
            return;
        }

        let results = hsnDatabase.filter(item => {
            const matchesQuery = item.code.includes(query) || item.desc.toLowerCase().includes(query);
            const matchesType = searchType === 'all' || item.type === searchType;
            return matchesQuery && matchesType;
        });

        if (results.length === 0) {
            resultsDiv.innerHTML = `
                <div class="hsn-placeholder">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No results found for "${query}"</p>
                    <span>Try a different search term or code</span>
                </div>`;
            return;
        }

        let html = '<div class="hsn-results-list">';
        results.forEach(item => {
            const typeLabel = item.type.toUpperCase();
            const cessInfo = item.cess > 0 ? ` + ${item.cess}% Cess` : '';
            html += `
                <div class="hsn-result-item">
                    <div class="hsn-result-header">
                        <span class="hsn-result-code">${item.code}</span>
                        <span class="hsn-result-type ${item.type}">${typeLabel}</span>
                        <span class="hsn-result-rate">${item.rate}%${cessInfo}</span>
                    </div>
                    <div class="hsn-result-desc">${item.desc}</div>
                    <div class="hsn-result-details">
                        <span>CGST: ${item.rate / 2}%</span>
                        <span>SGST: ${item.rate / 2}%</span>
                        <span>IGST: ${item.rate}%</span>
                    </div>
                </div>`;
        });
        html += '</div>';

        resultsDiv.innerHTML = html;
    }

    // Event listeners
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });

    popularItems.forEach(item => {
        item.addEventListener('click', () => {
            const hsn = item.getAttribute('data-hsn');
            searchInput.value = hsn;
            performSearch(hsn);
        });
    });
}

// ==================== ITC CALCULATOR ====================
function initITCCalculator() {
    const tabs = document.querySelectorAll('.itc-tab');
    const contents = document.querySelectorAll('.itc-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab') + '-content').classList.add('active');
        });
    });

    // Eligibility check
    document.getElementById('checkITCEligibility').addEventListener('click', () => {
        const checks = ['itc1', 'itc2', 'itc3', 'itc4', 'itc5', 'itc6'];
        const blocked = ['blocked1', 'blocked2', 'blocked3', 'blocked4', 'blocked5'];

        let eligible = true;
        let reasons = [];

        checks.forEach((id, idx) => {
            if (!document.getElementById(id).checked) {
                eligible = false;
                const labels = [
                    'Supplier not registered',
                    'No valid tax invoice',
                    'Goods/services not received',
                    'Supplier has not filed GSTR-1',
                    'Not for business purpose',
                    'Payment not made within 180 days'
                ];
                reasons.push(labels[idx]);
            }
        });

        let blockedReasons = [];
        blocked.forEach((id, idx) => {
            if (document.getElementById(id).checked) {
                eligible = false;
                const labels = [
                    'Motor vehicles (blocked under 17(5))',
                    'Food & beverages (blocked)',
                    'Health & fitness services (blocked)',
                    'Personal consumption (blocked)',
                    'Construction of immovable property (blocked)'
                ];
                blockedReasons.push(labels[idx]);
            }
        });

        const resultDiv = document.getElementById('itcEligibilityResult');
        resultDiv.classList.remove('hidden');

        if (eligible) {
            resultDiv.innerHTML = `
                <div class="result-success">
                    <i class="fas fa-check-circle"></i>
                    <h4>ITC is ELIGIBLE</h4>
                    <p>All eligibility conditions are satisfied. You can claim Input Tax Credit on this purchase.</p>
                </div>`;
        } else {
            let html = `
                <div class="result-error">
                    <i class="fas fa-times-circle"></i>
                    <h4>ITC is NOT ELIGIBLE</h4>
                    <ul>`;
            reasons.forEach(r => html += `<li>${r}</li>`);
            blockedReasons.forEach(r => html += `<li>${r}</li>`);
            html += `</ul></div>`;
            resultDiv.innerHTML = html;
        }
    });

    // ITC Utilization
    document.getElementById('calculateITCUtil').addEventListener('click', () => {
        const igstCredit = parseAmount(document.getElementById('igstCredit').value);
        const cgstCredit = parseAmount(document.getElementById('cgstCredit').value);
        const sgstCredit = parseAmount(document.getElementById('sgstCredit').value);

        let igstPayable = parseAmount(document.getElementById('igstPayable').value);
        let cgstPayable = parseAmount(document.getElementById('cgstPayable').value);
        let sgstPayable = parseAmount(document.getElementById('sgstPayable').value);

        let remainingIGST = igstCredit;
        let remainingCGST = cgstCredit;
        let remainingSGST = sgstCredit;

        let utilization = [];

        // Step 1: IGST liability - use IGST first, then CGST, then SGST
        if (igstPayable > 0) {
            const igstUsed = Math.min(remainingIGST, igstPayable);
            remainingIGST -= igstUsed;
            igstPayable -= igstUsed;
            utilization.push(`IGST Credit ${formatINR(igstUsed)} → IGST Liability`);

            if (igstPayable > 0 && remainingCGST > 0) {
                const cgstUsed = Math.min(remainingCGST, igstPayable);
                remainingCGST -= cgstUsed;
                igstPayable -= cgstUsed;
                utilization.push(`CGST Credit ${formatINR(cgstUsed)} → IGST Liability`);
            }

            if (igstPayable > 0 && remainingSGST > 0) {
                const sgstUsed = Math.min(remainingSGST, igstPayable);
                remainingSGST -= sgstUsed;
                igstPayable -= sgstUsed;
                utilization.push(`SGST Credit ${formatINR(sgstUsed)} → IGST Liability`);
            }
        }

        // Step 2: CGST liability - use CGST first, then IGST
        if (cgstPayable > 0) {
            const cgstUsed = Math.min(remainingCGST, cgstPayable);
            remainingCGST -= cgstUsed;
            cgstPayable -= cgstUsed;
            if (cgstUsed > 0) utilization.push(`CGST Credit ${formatINR(cgstUsed)} → CGST Liability`);

            if (cgstPayable > 0 && remainingIGST > 0) {
                const igstUsed = Math.min(remainingIGST, cgstPayable);
                remainingIGST -= igstUsed;
                cgstPayable -= igstUsed;
                utilization.push(`IGST Credit ${formatINR(igstUsed)} → CGST Liability`);
            }
        }

        // Step 3: SGST liability - use SGST first, then IGST
        if (sgstPayable > 0) {
            const sgstUsed = Math.min(remainingSGST, sgstPayable);
            remainingSGST -= sgstUsed;
            sgstPayable -= sgstUsed;
            if (sgstUsed > 0) utilization.push(`SGST Credit ${formatINR(sgstUsed)} → SGST Liability`);

            if (sgstPayable > 0 && remainingIGST > 0) {
                const igstUsed = Math.min(remainingIGST, sgstPayable);
                remainingIGST -= igstUsed;
                sgstPayable -= igstUsed;
                utilization.push(`IGST Credit ${formatINR(igstUsed)} → SGST Liability`);
            }
        }

        const cashPayment = igstPayable + cgstPayable + sgstPayable;
        const carryForward = remainingIGST + remainingCGST + remainingSGST;

        const resultDiv = document.getElementById('itcUtilResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="itc-util-summary">
                <h4><i class="fas fa-check-circle"></i> ITC Utilization Summary</h4>
                <div class="util-steps">
                    ${utilization.map(u => `<div class="util-step">${u}</div>`).join('')}
                </div>
                <div class="util-result">
                    <div class="util-item"><span>Cash Payment Required</span><strong>${formatINR(cashPayment)}</strong></div>
                    <div class="util-item"><span>Credit Carried Forward</span><strong>${formatINR(carryForward)}</strong></div>
                </div>
            </div>`;
    });

    // ITC Reversal
    document.getElementById('calculateReversal').addEventListener('click', () => {
        const totalITC = parseAmount(document.getElementById('totalITC').value);
        const exemptITC = parseAmount(document.getElementById('exemptITC').value);
        const taxableITC = parseAmount(document.getElementById('taxableITC').value);
        const exemptTurnover = parseAmount(document.getElementById('exemptTurnover').value);
        const totalTurnover = parseAmount(document.getElementById('totalTurnover').value);

        if (totalTurnover <= 0) {
            alert('Total turnover must be greater than 0');
            return;
        }

        const commonITC = totalITC - exemptITC - taxableITC;
        const reversalRatio = exemptTurnover / totalTurnover;
        const itcToReverse = exemptITC + (commonITC * reversalRatio);
        const eligibleITC = totalITC - itcToReverse;

        const resultDiv = document.getElementById('reversalResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="reversal-summary">
                <h4><i class="fas fa-calculator"></i> ITC Reversal Calculation (Rule 42)</h4>
                <div class="result-grid">
                    <div class="result-item"><span>Total ITC</span><span>${formatINR(totalITC)}</span></div>
                    <div class="result-item"><span>Common ITC</span><span>${formatINR(commonITC)}</span></div>
                    <div class="result-item"><span>Reversal Ratio</span><span>${(reversalRatio * 100).toFixed(2)}%</span></div>
                    <div class="result-item result-total"><span>ITC to be Reversed</span><span>${formatINR(itcToReverse)}</span></div>
                    <div class="result-item result-grand"><span>Eligible ITC</span><span>${formatINR(eligibleITC)}</span></div>
                </div>
            </div>`;
    });
}

// ==================== INTEREST & LATE FEE CALCULATOR ====================
function initInterestCalculator() {
    document.getElementById('calculateInterest').addEventListener('click', () => {
        const returnType = document.getElementById('returnType').value;
        const month = parseInt(document.getElementById('taxMonth').value);
        const year = parseInt(document.getElementById('taxYear').value);
        const filingDate = new Date(document.getElementById('filingDate').value);
        const returnNature = document.querySelector('input[name="returnNature"]:checked').value;
        const turnoverSlab = parseFloat(document.getElementById('turnoverSlab').value);

        const igst = parseAmount(document.getElementById('intIGST').value);
        const cgst = parseAmount(document.getElementById('intCGST').value);
        const sgst = parseAmount(document.getElementById('intSGST').value);
        const cess = parseAmount(document.getElementById('intCess').value);
        const totalTax = igst + cgst + sgst + cess;

        // Calculate due date based on return type
        let dueDate;
        if (returnType === 'gstr3b') {
            dueDate = new Date(year, month, 20); // 20th of next month
        } else if (returnType === 'gstr1') {
            dueDate = new Date(year, month, 11); // 11th of next month
        } else if (returnType === 'gstr9') {
            dueDate = new Date(year + 1, 11, 31); // 31st Dec of next FY
        } else {
            dueDate = new Date(year, month, 18); // 18th default
        }

        // Calculate delay
        const delay = Math.max(0, Math.floor((filingDate - dueDate) / (1000 * 60 * 60 * 24)));

        // Calculate interest (18% p.a.)
        const interestIGST = (igst * 0.18 * delay) / 365;
        const interestCGST = (cgst * 0.18 * delay) / 365;
        const interestSGST = (sgst * 0.18 * delay) / 365;
        const totalInterest = interestIGST + interestCGST + interestSGST;

        // Calculate late fee
        let lateFeePerDay, maxLateFee;
        if (returnNature === 'nil') {
            lateFeePerDay = 20;
            maxLateFee = 500;
        } else if (turnoverSlab <= 1.5) {
            lateFeePerDay = 50;
            maxLateFee = 2000;
        } else if (turnoverSlab <= 5) {
            lateFeePerDay = 50;
            maxLateFee = 5000;
        } else {
            lateFeePerDay = 50;
            maxLateFee = 10000;
        }

        const lateFee = Math.min(delay * lateFeePerDay, maxLateFee);
        const cgstLateFee = lateFee / 2;
        const sgstLateFee = lateFee / 2;

        const grandTotal = totalTax + totalInterest + lateFee;

        const resultDiv = document.getElementById('interestResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="interest-summary">
                <h4><i class="fas fa-calculator"></i> Interest & Late Fee Computation</h4>
                <div class="result-grid">
                    <div class="result-item"><span>Return Period</span><span>${month}/${year}</span></div>
                    <div class="result-item"><span>Due Date</span><span>${dueDate.toLocaleDateString()}</span></div>
                    <div class="result-item"><span>Filing Date</span><span>${filingDate.toLocaleDateString()}</span></div>
                    <div class="result-item"><span>Delay</span><span>${delay} days</span></div>
                    <div class="result-item"><span>Total Tax</span><span>${formatINR(totalTax)}</span></div>
                    <div class="result-item highlight-igst"><span>Interest @ 18% p.a.</span><span>${formatINR(totalInterest)}</span></div>
                    <div class="result-item highlight-cgst"><span>CGST Late Fee</span><span>${formatINR(cgstLateFee)}</span></div>
                    <div class="result-item highlight-sgst"><span>SGST Late Fee</span><span>${formatINR(sgstLateFee)}</span></div>
                    <div class="result-item result-total"><span>Total Late Fee</span><span>${formatINR(lateFee)}</span></div>
                    <div class="result-item result-grand"><span>Grand Total Payable</span><span>${formatINR(grandTotal)}</span></div>
                </div>
            </div>`;
    });
}

// ==================== E-WAY BILL CALCULATOR ====================
function initEwayCalculator() {
    document.getElementById('calculateEway').addEventListener('click', () => {
        const value = parseAmount(document.getElementById('consignmentValue').value);
        const mode = document.getElementById('transportMode').value;
        const vehicleType = document.querySelector('input[name="vehicleType"]:checked').value;
        const movementType = document.querySelector('input[name="movementType"]:checked').value;
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const genDate = new Date(document.getElementById('ewayGenDate').value);

        // Check if E-way bill is required
        const threshold = 50000;
        const required = value >= threshold;

        // Calculate validity
        let validityDays;
        if (mode === 'road') {
            if (vehicleType === 'odc') {
                validityDays = Math.ceil(distance / 20);
            } else {
                validityDays = Math.ceil(distance / 200);
            }
        } else if (mode === 'rail' || mode === 'air') {
            validityDays = 3;
        } else {
            validityDays = 15;
        }

        validityDays = Math.max(1, validityDays);

        // Calculate expiry
        const expiryDate = new Date(genDate);
        expiryDate.setDate(expiryDate.getDate() + validityDays);
        expiryDate.setHours(23, 59, 59);

        const resultDiv = document.getElementById('ewayResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="eway-summary">
                <h4><i class="fas fa-truck"></i> E-way Bill Validity</h4>
                <div class="result-grid">
                    <div class="result-item"><span>Consignment Value</span><span>${formatINR(value)}</span></div>
                    <div class="result-item"><span>Transport Mode</span><span>${mode.toUpperCase()}</span></div>
                    <div class="result-item"><span>Distance</span><span>${distance} KM</span></div>
                    <div class="result-item ${required ? 'result-total' : ''}">
                        <span>E-way Bill Required</span>
                        <span>${required ? '✅ YES' : '❌ NO (Below ₹50,000)'}</span>
                    </div>
                    ${required ? `
                    <div class="result-item"><span>Validity Period</span><span>${validityDays} Day(s)</span></div>
                    <div class="result-item"><span>Generated On</span><span>${genDate.toLocaleString()}</span></div>
                    <div class="result-item result-grand"><span>Valid Until</span><span>${expiryDate.toLocaleString()}</span></div>
                    ` : ''}
                </div>
            </div>`;
    });
}

// ==================== COMPOSITION SCHEME CHECKER ====================
function initCompositionChecker() {
    document.getElementById('checkComposition').addEventListener('click', () => {
        const businessNature = document.getElementById('businessNature').value;
        const stateReg = document.getElementById('stateReg').value;
        const prevTurnover = parseAmount(document.getElementById('prevTurnover').value);
        const currentTurnover = parseAmount(document.getElementById('currentTurnover').value);

        const exclusions = ['exc1', 'exc2', 'exc3', 'exc4', 'exc5'];
        let hasExclusion = false;
        let exclusionReasons = [];

        exclusions.forEach((id, idx) => {
            if (document.getElementById(id).checked) {
                hasExclusion = true;
                const labels = [
                    'Making inter-state outward supplies',
                    'Supplying through e-commerce operators',
                    'Manufacturing ice cream, pan masala, tobacco',
                    'Casual or non-resident taxable person',
                    'Input Service Distributor'
                ];
                exclusionReasons.push(labels[idx]);
            }
        });

        // Turnover limits
        let limit;
        if (businessNature === 'service') {
            limit = 5000000; // 50 Lakh
        } else if (stateReg === 'special') {
            limit = 7500000; // 75 Lakh
        } else {
            limit = 15000000; // 1.5 Cr
        }

        const turnoverExceeds = prevTurnover > limit || currentTurnover > limit;
        const eligible = !hasExclusion && !turnoverExceeds;

        // Tax rates
        let rate;
        if (businessNature === 'manufacturer' || businessNature === 'trader') rate = 1;
        else if (businessNature === 'restaurant') rate = 5;
        else rate = 6;

        const resultDiv = document.getElementById('compositionResult');
        resultDiv.classList.remove('hidden');

        if (eligible) {
            resultDiv.innerHTML = `
                <div class="result-success">
                    <i class="fas fa-check-circle"></i>
                    <h4>✅ ELIGIBLE for Composition Scheme</h4>
                    <p>Applicable Tax Rate: <strong>${rate}%</strong> (${rate / 2}% CGST + ${rate / 2}% SGST)</p>
                    <ul>
                        <li>Turnover: ${formatINR(prevTurnover)} (Below ${formatINR(limit)} limit)</li>
                        <li>Business Type: ${businessNature.charAt(0).toUpperCase() + businessNature.slice(1)}</li>
                        <li>No exclusion criteria applicable</li>
                    </ul>
                </div>`;
        } else {
            let html = `
                <div class="result-error">
                    <i class="fas fa-times-circle"></i>
                    <h4>❌ NOT ELIGIBLE for Composition Scheme</h4>
                    <ul>`;
            if (turnoverExceeds) {
                html += `<li>Turnover exceeds ${formatINR(limit)} limit</li>`;
            }
            exclusionReasons.forEach(r => html += `<li>${r}</li>`);
            html += `</ul><p>Recommendation: Continue under Regular Scheme</p></div>`;
            resultDiv.innerHTML = html;
        }
    });
}

// ==================== 2A VS 3B RECONCILIATION ====================
function initReconciliation() {
    document.getElementById('reconcileGSTR').addEventListener('click', () => {
        const r2aIGST = parseAmount(document.getElementById('r2aIGST').value);
        const r2aCGST = parseAmount(document.getElementById('r2aCGST').value);
        const r2aSGST = parseAmount(document.getElementById('r2aSGST').value);
        const r2aCess = parseAmount(document.getElementById('r2aCess').value);

        const r3bIGST = parseAmount(document.getElementById('r3bIGST').value);
        const r3bCGST = parseAmount(document.getElementById('r3bCGST').value);
        const r3bSGST = parseAmount(document.getElementById('r3bSGST').value);
        const r3bCess = parseAmount(document.getElementById('r3bCess').value);

        const total2A = r2aIGST + r2aCGST + r2aSGST + r2aCess;
        const total3B = r3bIGST + r3bCGST + r3bSGST + r3bCess;
        const totalDiff = total3B - total2A;

        const matchPercent = total2A > 0 ? ((Math.min(total2A, total3B) / Math.max(total2A, total3B)) * 100).toFixed(1) : 0;

        const resultDiv = document.getElementById('reconResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="recon-summary">
                <h4><i class="fas fa-balance-scale"></i> Reconciliation Summary</h4>
                <div class="recon-stats">
                    <div class="stat-box">
                        <span class="stat-label">GSTR-2A Total</span>
                        <span class="stat-value">${formatINR(total2A)}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">GSTR-3B Claimed</span>
                        <span class="stat-value">${formatINR(total3B)}</span>
                    </div>
                    <div class="stat-box ${totalDiff > 0 ? 'stat-warning' : 'stat-success'}">
                        <span class="stat-label">Difference</span>
                        <span class="stat-value">${formatINR(Math.abs(totalDiff))}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Match %</span>
                        <span class="stat-value">${matchPercent}%</span>
                    </div>
                </div>
                <div class="result-grid">
                    <div class="result-item"><span>IGST Difference</span><span>${formatINR(r3bIGST - r2aIGST)}</span></div>
                    <div class="result-item"><span>CGST Difference</span><span>${formatINR(r3bCGST - r2aCGST)}</span></div>
                    <div class="result-item"><span>SGST Difference</span><span>${formatINR(r3bSGST - r2aSGST)}</span></div>
                    <div class="result-item"><span>Cess Difference</span><span>${formatINR(r3bCess - r2aCess)}</span></div>
                </div>
                ${totalDiff > 0 ? `
                <div class="recon-alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>ITC claimed in GSTR-3B exceeds GSTR-2A by ${formatINR(totalDiff)}. Review invoices not reflected in GSTR-2A.</p>
                </div>` : ''}
            </div>`;
    });
}

// ==================== ANNUAL RETURN ====================
function initAnnualReturn() {
    document.getElementById('compileAnnual').addEventListener('click', () => {
        const fy = document.getElementById('fyYear').value;
        const category = document.querySelector('input[name="turnoverCat"]:checked').value;

        // Collect all monthly data
        const rows = document.querySelectorAll('.monthly-data-table tbody tr');
        let totals = { taxable: 0, igst: 0, cgst: 0, sgst: 0, itc: 0 };

        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            totals.taxable += parseAmount(inputs[0].value);
            totals.igst += parseAmount(inputs[1].value);
            totals.cgst += parseAmount(inputs[2].value);
            totals.sgst += parseAmount(inputs[3].value);
            totals.itc += parseAmount(inputs[4].value);
        });

        // Update footer
        document.getElementById('totalTaxable').textContent = formatINR(totals.taxable);
        document.getElementById('totalIGSTAnn').textContent = formatINR(totals.igst);
        document.getElementById('totalCGSTAnn').textContent = formatINR(totals.cgst);
        document.getElementById('totalSGSTAnn').textContent = formatINR(totals.sgst);
        document.getElementById('totalITCAnn').textContent = formatINR(totals.itc);

        const totalTax = totals.igst + totals.cgst + totals.sgst;

        const resultDiv = document.getElementById('annualResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="annual-summary">
                <h4><i class="fas fa-file-alt"></i> GSTR-9 Data Summary - FY ${fy}</h4>
                <div class="result-grid">
                    <div class="result-item"><span>Total Taxable Turnover</span><span>${formatINR(totals.taxable)}</span></div>
                    <div class="result-item highlight-igst"><span>Total IGST</span><span>${formatINR(totals.igst)}</span></div>
                    <div class="result-item highlight-cgst"><span>Total CGST</span><span>${formatINR(totals.cgst)}</span></div>
                    <div class="result-item highlight-sgst"><span>Total SGST</span><span>${formatINR(totals.sgst)}</span></div>
                    <div class="result-item result-total"><span>Total Tax Paid</span><span>${formatINR(totalTax)}</span></div>
                    <div class="result-item result-grand"><span>Total ITC Claimed</span><span>${formatINR(totals.itc)}</span></div>
                </div>
            </div>`;
    });
}

// ==================== ANTI-PROFITEERING ====================
function initAntiProfiteering() {
    document.getElementById('calculateAP').addEventListener('click', () => {
        const product = document.getElementById('apProduct').value || 'Product';
        const oldRate = parseFloat(document.getElementById('oldRate').value) || 0;
        const newRate = parseFloat(document.getElementById('newRate').value) || 0;
        const oldPrice = parseAmount(document.getElementById('oldPrice').value);
        const unitsSold = parseInt(document.getElementById('unitsSold').value) || 0;

        if (oldRate <= newRate) {
            alert('New rate should be lower than old rate for anti-profiteering calculation');
            return;
        }

        // Calculate base price from old inclusive price
        const basePrice = oldPrice / (1 + oldRate / 100);
        const oldGST = oldPrice - basePrice;

        // Calculate new price with new rate
        const newGST = basePrice * (newRate / 100);
        const newPrice = basePrice + newGST;

        // Price reduction required
        const priceReduction = oldPrice - newPrice;
        const reductionPercent = (priceReduction / oldPrice * 100).toFixed(2);

        // Profiteering amount if not passed
        const profiteering = priceReduction * unitsSold;

        const resultDiv = document.getElementById('apResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="ap-summary">
                <h4><i class="fas fa-shield-alt"></i> Anti-Profiteering Calculation</h4>
                <p class="ap-product">Product: <strong>${product}</strong></p>
                <div class="result-grid">
                    <div class="result-item"><span>Old Price (Inc. GST @ ${oldRate}%)</span><span>${formatINR(oldPrice)}</span></div>
                    <div class="result-item"><span>Base Price</span><span>${formatINR(basePrice)}</span></div>
                    <div class="result-item"><span>Old GST Amount</span><span>${formatINR(oldGST)}</span></div>
                    <div class="result-item highlight-igst"><span>New GST @ ${newRate}%</span><span>${formatINR(newGST)}</span></div>
                    <div class="result-item result-total"><span>Required New Price</span><span>${formatINR(newPrice)}</span></div>
                    <div class="result-item"><span>Price Reduction Required</span><span>${formatINR(priceReduction)} (${reductionPercent}%)</span></div>
                    ${unitsSold > 0 ? `
                    <div class="result-item result-grand"><span>Total Profiteering (if not passed)</span><span>${formatINR(profiteering)}</span></div>
                    <div class="result-item"><span>For ${unitsSold.toLocaleString()} units sold</span><span></span></div>
                    ` : ''}
                </div>
            </div>`;
    });
}

// Additional CSS for dynamic results (inject into page)
const dynamicStyles = `
<style>
.hsn-results-list { display: flex; flex-direction: column; gap: 1rem; }
.hsn-result-item { background: var(--bg-secondary); border-radius: var(--radius-md); padding: 1rem; border-left: 4px solid var(--gst-green); }
.hsn-result-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
.hsn-result-code { font-family: 'Roboto Mono', monospace; font-weight: 700; font-size: 1.1rem; color: var(--gst-blue); }
.hsn-result-type { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
.hsn-result-type.hsn { background: #dbeafe; color: #1e40af; }
.hsn-result-type.sac { background: #dcfce7; color: #166534; }
.hsn-result-rate { margin-left: auto; font-weight: 700; color: var(--gst-green); font-size: 1.1rem; }
.hsn-result-desc { font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.5rem; }
.hsn-result-details { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted); }
.result-success { background: var(--gst-green-light); border: 2px solid var(--gst-green); border-radius: var(--radius-md); padding: 1.5rem; }
.result-success i { color: var(--gst-green); font-size: 2rem; margin-bottom: 0.5rem; }
.result-success h4 { color: var(--gst-green-dark); margin-bottom: 0.5rem; }
.result-error { background: #fef2f2; border: 2px solid var(--gst-red); border-radius: var(--radius-md); padding: 1.5rem; }
.result-error i { color: var(--gst-red); font-size: 2rem; margin-bottom: 0.5rem; }
.result-error h4 { color: var(--gst-red); margin-bottom: 0.5rem; }
.result-error ul { margin-top: 1rem; padding-left: 1.5rem; }
.result-error li { color: var(--text-primary); margin-bottom: 0.5rem; }
.itc-util-summary, .reversal-summary, .interest-summary, .eway-summary, .recon-summary, .annual-summary, .ap-summary { background: var(--gst-green-light); border: 2px solid var(--gst-green); border-radius: var(--radius-md); padding: 1.5rem; }
[data-theme="dark"] .itc-util-summary, [data-theme="dark"] .reversal-summary, [data-theme="dark"] .interest-summary, [data-theme="dark"] .eway-summary, [data-theme="dark"] .recon-summary, [data-theme="dark"] .annual-summary, [data-theme="dark"] .ap-summary { background: rgba(34, 197, 94, 0.1); }
.util-steps { display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0; }
.util-step { background: var(--bg-card); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.9rem; }
.util-result { display: flex; gap: 1rem; margin-top: 1rem; }
.util-item { flex: 1; background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); text-align: center; }
.util-item span { display: block; font-size: 0.875rem; color: var(--text-muted); }
.util-item strong { font-size: 1.25rem; color: var(--gst-green); }
.recon-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1rem 0; }
.stat-box { background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); text-align: center; }
.stat-label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; }
.stat-value { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
.stat-box.stat-warning { border: 2px solid var(--gst-orange); }
.stat-box.stat-warning .stat-value { color: var(--gst-orange); }
.stat-box.stat-success { border: 2px solid var(--gst-green); }
.stat-box.stat-success .stat-value { color: var(--gst-green); }
.recon-alert { display: flex; align-items: flex-start; gap: 0.75rem; background: #fef3c7; border: 1px solid #f59e0b; border-radius: var(--radius-sm); padding: 1rem; margin-top: 1rem; }
.recon-alert i { color: #f59e0b; }
.recon-alert p { margin: 0; font-size: 0.9rem; color: #92400e; }
.ap-product { font-size: 1rem; margin-bottom: 1rem; }
@media (max-width: 768px) { .recon-stats { grid-template-columns: repeat(2, 1fr); } }
</style>`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);
