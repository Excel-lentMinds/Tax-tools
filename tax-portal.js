/* ===================================================
   TAX PORTAL - JAVASCRIPT
   Complete functionality for all 44 calculators
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTaxRegimeComparison();
    initIncomeTaxCalculator();
    initHRACalculator();
    initSection80CPlanner();
    initAdvanceTaxCalculator();
    initGSTCalculator();
    initHSNFinder();
    initITCCalculator();
    initLateFeeCalculator();
    initEwayCalculator();
    initCompositionChecker();
    initReconciliation();
    initAnnualReturn();
    initAntiProfiteering();
    // Financial Calculators
    initSIPCalculator();
    initCAGRCalculator();
    initXIRRCalculator();
    initEMICalculator();
    initLoanComparison();
    initRetirementPlanner();
    initEducationPlanner();
    initGoalPlanner();
    initInflationCalculator();
    initRealReturnCalculator();
    initPPFCalculator();
    initFDComparison();
    // Business & Valuation Calculators
    initDCFCalculator();
    initWACCCalculator();
    initBusinessValuation();
    initRevenueMultiple();
    initNPVIRRCalculator();
    initPaybackCalculator();
    initLBOModel();
    initBreakevenCalculator();
    initWorkingCapitalCalculator();
    initCashConversionCycle();
    initDilutionCalculator();
    initESOPCalculator();
    initSynergyCalculator();
    // Accounting Calculators
    initDepreciationCalculator();
    initLeaseAccounting();
    initDeferredTaxCalculator();
    initForexCalculator();
    initInventoryValuation();
    // NEW Phase 1 Calculators
    initCryptoTaxCalculator();
    initAgriculturalTaxCalculator();
    initFreelancerTaxCalculator();
    initRCMCalculator();
    initGSTRefundCalculator();
    initFIRECalculator();
    initNetWorthCalculator();
    initBudgetPlanner();
    initEmergencyFundCalculator();
    initDebtPayoffCalculator();
    initInvoiceGenerator();
    initReceiptGenerator();
    initFinancialGlossary();
    // Investment Tools (Phase 2)
    initSIPCalculator();
    initLumpsumCalculator();
    initPPFCalculator();
    initAIAssistant();
    // Enhanced Features
    initCalculatorSearch();
    initFavoritesSystem();
    initHistoryPanel();
    initExportFeatures();
    // Utility Calculators
    initSalaryCalculator();
    initTaxCalendar();
    initCapitalGainsCalculator();
    initRentVsBuyCalculator();
    initWhatsAppShare();
    // Interactive Features
    initVoiceInput();
    initPWAInstall();
    initFinancialHealthQuiz();
    initTaxQuizGame();
    initFeedbackWidget();
    setDefaultDates();
});

// ==================== UTILITIES ====================
function formatINR(num) {
    if (isNaN(num)) return '₹0';
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function parseNum(val) {
    return parseFloat(val) || 0;
}

function setDefaultDates() {
    const today = new Date();
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) input.value = today.toISOString().slice(0, 10);
    });
    document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
        if (!input.value) input.value = today.toISOString().slice(0, 16);
    });
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const links = document.querySelectorAll('.sidebar-link');
    const panels = document.querySelectorAll('.tool-panel');
    const promoCards = document.querySelectorAll('.promo-card[data-tool]');

    function navigateToTool(toolId, linkElement) {
        links.forEach(l => l.classList.remove('active'));
        promoCards.forEach(p => p.classList.remove('active'));
        if (linkElement) linkElement.classList.add('active');

        panels.forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById(toolId);
        if (targetPanel) {
            targetPanel.classList.add('active');
            window.scrollTo({ top: 250, behavior: 'smooth' });
        }
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const toolId = link.getAttribute('data-tool');
            navigateToTool(toolId, link);
        });
    });

    // Promo cards (Health Score, Tax Quiz, etc.)
    promoCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const toolId = card.getAttribute('data-tool');
            navigateToTool(toolId, null);
        });
    });
}

// ==================== 1. TAX REGIME COMPARISON ====================
function initTaxRegimeComparison() {
    const btn = document.getElementById('compareRegimes');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const income = parseNum(document.getElementById('regimeIncome').value);
        const age = document.getElementById('regimeAge').value;

        // Deductions for Old Regime
        const ded80c = Math.min(parseNum(document.getElementById('ded80c').value), 150000);
        const ded80d = parseNum(document.getElementById('ded80d').value);
        const dedHRA = parseNum(document.getElementById('dedHRA').value);
        const ded80eea = Math.min(parseNum(document.getElementById('ded80eea').value), 200000);
        const ded80ccd = Math.min(parseNum(document.getElementById('ded80ccd').value), 50000);
        const dedOther = parseNum(document.getElementById('dedOther').value);

        const totalDeductions = ded80c + ded80d + dedHRA + ded80eea + ded80ccd + dedOther;

        // New Regime Calculation (FY 2024-25)
        const newStdDed = 75000;
        const newTaxableIncome = Math.max(0, income - newStdDed);
        const newTax = calculateNewRegimeTax(newTaxableIncome);
        const newTaxWithCess = newTax * 1.04;

        // Old Regime Calculation
        const oldStdDed = 50000;
        const oldTaxableIncome = Math.max(0, income - oldStdDed - totalDeductions);
        const oldTax = calculateOldRegimeTax(oldTaxableIncome, age);
        const oldTaxWithCess = oldTax * 1.04;

        const savings = Math.abs(newTaxWithCess - oldTaxWithCess);
        const betterRegime = newTaxWithCess <= oldTaxWithCess ? 'New' : 'Old';

        const result = document.getElementById('regimeResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-chart-bar"></i>
                <h3>Tax Comparison Results</h3>
            </div>
            <div class="comparison-grid">
                <div class="comparison-card new-regime">
                    <h4>New Regime</h4>
                    <div class="tax-amount">${formatINR(newTaxWithCess)}</div>
                    <p>Standard Deduction: ${formatINR(newStdDed)}</p>
                    <p>Taxable Income: ${formatINR(newTaxableIncome)}</p>
                </div>
                <div class="comparison-card old-regime">
                    <h4>Old Regime</h4>
                    <div class="tax-amount">${formatINR(oldTaxWithCess)}</div>
                    <p>Total Deductions: ${formatINR(totalDeductions + oldStdDed)}</p>
                    <p>Taxable Income: ${formatINR(oldTaxableIncome)}</p>
                </div>
            </div>
            <div class="recommendation-box">
                <i class="fas fa-trophy"></i>
                <h4>${betterRegime} Regime Saves ${formatINR(savings)}</h4>
                <p>Based on your income and deductions, ${betterRegime} Tax Regime is better for you.</p>
            </div>`;
    });
}

function calculateNewRegimeTax(income) {
    // FY 2024-25 New Regime Slabs
    if (income <= 300000) return 0;
    if (income <= 700000) return (income - 300000) * 0.05;
    if (income <= 1000000) return 20000 + (income - 700000) * 0.10;
    if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
    if (income <= 1500000) return 80000 + (income - 1200000) * 0.20;
    return 140000 + (income - 1500000) * 0.30;
}

function calculateOldRegimeTax(income, age) {
    let exemption = age === 'senior' ? 300000 : age === 'supersenior' ? 500000 : 250000;
    if (income <= exemption) return 0;
    if (income <= 500000) return (income - exemption) * 0.05;
    if (income <= 1000000) return (500000 - exemption) * 0.05 + (income - 500000) * 0.20;
    return (500000 - exemption) * 0.05 + 100000 + (income - 1000000) * 0.30;
}

// ==================== 2. INCOME TAX CALCULATOR ====================
function initIncomeTaxCalculator() {
    const regimeBtns = document.querySelectorAll('.regime-btn');
    let currentRegime = 'new';

    regimeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            regimeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRegime = btn.getAttribute('data-regime');
        });
    });

    const btn = document.getElementById('calculateIncomeTax');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const income = parseNum(document.getElementById('taxableIncome').value);
        const age = document.getElementById('taxAge').value;
        const includeSurcharge = document.getElementById('includeSurcharge').checked;

        let baseTax;
        if (currentRegime === 'new') {
            baseTax = calculateNewRegimeTax(income);
        } else {
            baseTax = calculateOldRegimeTax(income, age);
        }

        let surcharge = 0;
        if (includeSurcharge) {
            if (income > 50000000) surcharge = baseTax * 0.37;
            else if (income > 20000000) surcharge = baseTax * 0.25;
            else if (income > 10000000) surcharge = baseTax * 0.15;
            else if (income > 5000000) surcharge = baseTax * 0.10;
        }

        const cess = (baseTax + surcharge) * 0.04;
        const totalTax = baseTax + surcharge + cess;

        const result = document.getElementById('incomeTaxResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-check-circle"></i>
                <h3>Tax Calculation (${currentRegime === 'new' ? 'New' : 'Old'} Regime)</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Taxable Income</span><span class="result-value">${formatINR(income)}</span></div>
                <div class="result-row"><span class="result-label">Base Tax</span><span class="result-value">${formatINR(baseTax)}</span></div>
                ${surcharge > 0 ? `<div class="result-row"><span class="result-label">Surcharge</span><span class="result-value">${formatINR(surcharge)}</span></div>` : ''}
                <div class="result-row"><span class="result-label">Health & Education Cess (4%)</span><span class="result-value">${formatINR(cess)}</span></div>
                <div class="result-row grand-total"><span class="result-label">Total Tax Payable</span><span class="result-value">${formatINR(totalTax)}</span></div>
            </div>`;
    });
}

// ==================== 3. HRA CALCULATOR ====================
function initHRACalculator() {
    const btn = document.getElementById('calculateHRA');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const basic = parseNum(document.getElementById('hraBasic').value);
        const da = parseNum(document.getElementById('hraDA').value);
        const hraReceived = parseNum(document.getElementById('hraReceived').value);
        const rentPaid = parseNum(document.getElementById('hraRent').value);
        const isMetro = document.querySelector('input[name="cityType"]:checked').value === 'metro';

        const salary = basic + da;
        const metroPercent = isMetro ? 0.50 : 0.40;

        const option1 = hraReceived;
        const option2 = rentPaid - (salary * 0.10);
        const option3 = salary * metroPercent;

        const exemption = Math.max(0, Math.min(option1, option2, option3));
        const taxableHRA = hraReceived - exemption;

        const result = document.getElementById('hraResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-home"></i>
                <h3>HRA Exemption Calculation</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Actual HRA Received</span><span class="result-value">${formatINR(option1)}</span></div>
                <div class="result-row"><span class="result-label">Rent - 10% of Salary</span><span class="result-value">${formatINR(option2)}</span></div>
                <div class="result-row"><span class="result-label">${isMetro ? '50%' : '40%'} of Salary</span><span class="result-value">${formatINR(option3)}</span></div>
                <div class="result-row highlight"><span class="result-label">HRA Exemption (Minimum)</span><span class="result-value">${formatINR(exemption)}</span></div>
                <div class="result-row"><span class="result-label">Taxable HRA</span><span class="result-value">${formatINR(taxableHRA)}</span></div>
            </div>`;
    });
}

// ==================== 4. SECTION 80C PLANNER ====================
function initSection80CPlanner() {
    const inputs = document.querySelectorAll('.investment-item input');
    const totalDisplay = document.getElementById('total80c');
    const progressBar = document.getElementById('progress80c');
    const MAX_80C = 150000;

    function updateProgress() {
        let total = 0;
        inputs.forEach(input => total += parseNum(input.value));
        total = Math.min(total, MAX_80C);

        totalDisplay.textContent = `${formatINR(total)} / ${formatINR(MAX_80C)}`;
        progressBar.style.width = `${(total / MAX_80C) * 100}%`;
    }

    inputs.forEach(input => input.addEventListener('input', updateProgress));

    const btn = document.getElementById('calculate80C');
    if (!btn) return;

    btn.addEventListener('click', () => {
        let total = 0;
        inputs.forEach(input => total += parseNum(input.value));
        const eligible = Math.min(total, MAX_80C);
        const taxSaved30 = eligible * 0.30;
        const taxSaved20 = eligible * 0.20;

        const result = document.getElementById('section80cResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-piggy-bank"></i>
                <h3>80C Tax Savings</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Total Investments</span><span class="result-value">${formatINR(total)}</span></div>
                <div class="result-row"><span class="result-label">Eligible under 80C</span><span class="result-value">${formatINR(eligible)}</span></div>
                <div class="result-row highlight"><span class="result-label">Tax Saved (30% slab)</span><span class="result-value">${formatINR(taxSaved30)}</span></div>
                <div class="result-row"><span class="result-label">Tax Saved (20% slab)</span><span class="result-value">${formatINR(taxSaved20)}</span></div>
                ${total > MAX_80C ? `<div class="result-row" style="color: #f97316;"><span>⚠️ Excess investment: ${formatINR(total - MAX_80C)} (not eligible)</span></div>` : ''}
            </div>`;
    });
}

// ==================== 5. ADVANCE TAX CALCULATOR ====================
function initAdvanceTaxCalculator() {
    const btn = document.getElementById('calculateAdvanceTax');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const totalTax = parseNum(document.getElementById('advanceTotalTax').value);
        const tds = parseNum(document.getElementById('advanceTDS').value);

        const netTax = Math.max(0, totalTax - tds);

        const q1 = netTax * 0.15;
        const q2 = netTax * 0.45 - q1;
        const q3 = netTax * 0.75 - q1 - q2;
        const q4 = netTax - q1 - q2 - q3;

        const result = document.getElementById('advanceTaxResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-calendar-check"></i>
                <h3>Advance Tax Installments</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Total Tax Liability</span><span class="result-value">${formatINR(totalTax)}</span></div>
                <div class="result-row"><span class="result-label">Less: TDS</span><span class="result-value">${formatINR(tds)}</span></div>
                <div class="result-row highlight"><span class="result-label">Net Tax for Advance Tax</span><span class="result-value">${formatINR(netTax)}</span></div>
            </div>
            <table class="installment-table" style="width:100%; margin-top:1rem; border-collapse:collapse;">
                <tr style="background:var(--income-tax-primary); color:white;">
                    <th style="padding:0.75rem; text-align:left;">Quarter</th>
                    <th style="padding:0.75rem;">Due Date</th>
                    <th style="padding:0.75rem;">Cumulative %</th>
                    <th style="padding:0.75rem; text-align:right;">Amount</th>
                </tr>
                <tr><td style="padding:0.75rem;">Q1</td><td style="text-align:center;">15 Jun</td><td style="text-align:center;">15%</td><td style="text-align:right; font-weight:600;">${formatINR(q1)}</td></tr>
                <tr><td style="padding:0.75rem;">Q2</td><td style="text-align:center;">15 Sep</td><td style="text-align:center;">45%</td><td style="text-align:right; font-weight:600;">${formatINR(q2)}</td></tr>
                <tr><td style="padding:0.75rem;">Q3</td><td style="text-align:center;">15 Dec</td><td style="text-align:center;">75%</td><td style="text-align:right; font-weight:600;">${formatINR(q3)}</td></tr>
                <tr><td style="padding:0.75rem;">Q4</td><td style="text-align:center;">15 Mar</td><td style="text-align:center;">100%</td><td style="text-align:right; font-weight:600;">${formatINR(q4)}</td></tr>
            </table>`;
    });
}

// ==================== 6. GST CALCULATOR ====================
function initGSTCalculator() {
    const modeBtns = document.querySelectorAll('.mode-btn[data-gst-mode]');
    const rateBtns = document.querySelectorAll('.rate-btn');
    let mode = 'add';
    let rate = 12;

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mode = btn.getAttribute('data-gst-mode');
            document.getElementById('gstAmountLabel').textContent =
                mode === 'add' ? 'Amount (Excluding GST) ₹' : 'Amount (Including GST) ₹';
        });
    });

    rateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            rate = parseNum(btn.getAttribute('data-rate'));
        });
    });

    const btn = document.getElementById('calculateGST');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const amount = parseNum(document.getElementById('gstAmount').value);
        const taxType = document.getElementById('gstTaxType').value;
        const cess = parseNum(document.getElementById('gstCess').value);

        let base, gstAmt, cessAmt, total;

        if (mode === 'add') {
            base = amount;
            gstAmt = base * (rate / 100);
            cessAmt = base * (cess / 100);
            total = base + gstAmt + cessAmt;
        } else {
            total = amount;
            base = amount / (1 + (rate / 100) + (cess / 100));
            gstAmt = base * (rate / 100);
            cessAmt = base * (cess / 100);
        }

        const result = document.getElementById('gstResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-check-circle"></i>
                <h3>GST Calculation</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Base Amount</span><span class="result-value">${formatINR(base)}</span></div>
                ${taxType === 'igst'
                ? `<div class="result-row"><span class="result-label">IGST @ ${rate}%</span><span class="result-value">${formatINR(gstAmt)}</span></div>`
                : `<div class="result-row"><span class="result-label">CGST @ ${rate / 2}%</span><span class="result-value">${formatINR(gstAmt / 2)}</span></div>
                       <div class="result-row"><span class="result-label">SGST @ ${rate / 2}%</span><span class="result-value">${formatINR(gstAmt / 2)}</span></div>`
            }
                ${cess > 0 ? `<div class="result-row"><span class="result-label">Cess @ ${cess}%</span><span class="result-value">${formatINR(cessAmt)}</span></div>` : ''}
                <div class="result-row highlight-green"><span class="result-label">Total GST</span><span class="result-value">${formatINR(gstAmt + cessAmt)}</span></div>
                <div class="result-row grand-total"><span class="result-label">Final Amount</span><span class="result-value">${formatINR(total)}</span></div>
            </div>`;
    });
}

// ==================== 7. HSN FINDER ====================
function initHSNFinder() {
    const hsnData = [
        { code: '8471', desc: 'Computers, Laptops', rate: 18 },
        { code: '8517', desc: 'Mobile Phones', rate: 12 },
        { code: '9963', desc: 'Restaurant Services', rate: 5 },
        { code: '9983', desc: 'Professional Services', rate: 18 },
        { code: '8703', desc: 'Motor Vehicles', rate: 28 },
        { code: '3004', desc: 'Pharmaceuticals', rate: 12 },
        { code: '6109', desc: 'T-shirts, Garments', rate: 12 },
        { code: '8415', desc: 'Air Conditioners', rate: 28 },
        { code: '9954', desc: 'Construction Services', rate: 18 },
        { code: '7113', desc: 'Jewellery', rate: 3 }
    ];

    const searchBtn = document.getElementById('searchHSNBtn');
    const searchInput = document.getElementById('hsnSearchInput');
    const resultsDiv = document.getElementById('hsnResults');

    function search(query) {
        query = query.toLowerCase();
        const results = hsnData.filter(h =>
            h.code.includes(query) || h.desc.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            resultsDiv.innerHTML = `<div class="hsn-placeholder"><i class="fas fa-times-circle"></i><p>No results found</p></div>`;
            return;
        }

        resultsDiv.innerHTML = results.map(r => `
            <div class="hsn-result-item" style="padding:1rem; background:var(--bg-secondary); border-radius:8px; margin-bottom:0.75rem; border-left:4px solid var(--gst-primary);">
                <strong style="color:var(--gst-primary); font-family:monospace;">${r.code}</strong>
                <span style="margin-left:1rem;">${r.desc}</span>
                <span style="float:right; font-weight:700; color:var(--gst-dark);">GST: ${r.rate}%</span>
            </div>
        `).join('');
    }

    if (searchBtn) searchBtn.addEventListener('click', () => search(searchInput.value));
    if (searchInput) searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') search(searchInput.value); });

    document.querySelectorAll('.popular-item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.getAttribute('data-code');
            searchInput.value = code;
            search(code);
        });
    });
}

// ==================== 8. ITC CALCULATOR ====================
function initITCCalculator() {
    const btn = document.getElementById('calculateITC');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const igstC = parseNum(document.getElementById('itcIGST').value);
        const cgstC = parseNum(document.getElementById('itcCGST').value);
        const sgstC = parseNum(document.getElementById('itcSGST').value);

        let igstP = parseNum(document.getElementById('itcIGSTPayable').value);
        let cgstP = parseNum(document.getElementById('itcCGSTPayable').value);
        let sgstP = parseNum(document.getElementById('itcSGSTPayable').value);

        let rI = igstC, rC = cgstC, rS = sgstC;

        // IGST liability
        let used = Math.min(rI, igstP); rI -= used; igstP -= used;
        used = Math.min(rC, igstP); rC -= used; igstP -= used;
        used = Math.min(rS, igstP); rS -= used; igstP -= used;

        // CGST liability
        used = Math.min(rC, cgstP); rC -= used; cgstP -= used;
        used = Math.min(rI, cgstP); rI -= used; cgstP -= used;

        // SGST liability
        used = Math.min(rS, sgstP); rS -= used; sgstP -= used;
        used = Math.min(rI, sgstP); rI -= used; sgstP -= used;

        const cashPayment = igstP + cgstP + sgstP;
        const carryForward = rI + rC + rS;

        const result = document.getElementById('itcResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-hand-holding-usd"></i>
                <h3>ITC Utilization Summary</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Total ITC Available</span><span class="result-value">${formatINR(igstC + cgstC + sgstC)}</span></div>
                <div class="result-row"><span class="result-label">Total Liability</span><span class="result-value">${formatINR(parseNum(document.getElementById('itcIGSTPayable').value) + parseNum(document.getElementById('itcCGSTPayable').value) + parseNum(document.getElementById('itcSGSTPayable').value))}</span></div>
                <div class="result-row highlight-green"><span class="result-label">Cash Payment Required</span><span class="result-value">${formatINR(cashPayment)}</span></div>
                <div class="result-row"><span class="result-label">Credit Carried Forward</span><span class="result-value">${formatINR(carryForward)}</span></div>
            </div>`;
    });
}

// ==================== 9. LATE FEE CALCULATOR ====================
function initLateFeeCalculator() {
    const btn = document.getElementById('calculateLateFee');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const dueDate = new Date(document.getElementById('dueDate').value);
        const filingDate = new Date(document.getElementById('filingDate').value);
        const taxPayable = parseNum(document.getElementById('taxPayable').value);
        const isNil = document.getElementById('returnNature').value === 'nil';

        const delay = Math.max(0, Math.floor((filingDate - dueDate) / (1000 * 60 * 60 * 24)));
        const interest = (taxPayable * 0.18 * delay) / 365;
        const lateFee = isNil ? Math.min(delay * 20, 500) : Math.min(delay * 50, 10000);

        const result = document.getElementById('lateFeeResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-clock"></i>
                <h3>Interest & Late Fee</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Delay</span><span class="result-value">${delay} days</span></div>
                <div class="result-row"><span class="result-label">Interest @ 18%</span><span class="result-value">${formatINR(interest)}</span></div>
                <div class="result-row"><span class="result-label">Late Fee</span><span class="result-value">${formatINR(lateFee)}</span></div>
                <div class="result-row grand-total"><span class="result-label">Total Penalty</span><span class="result-value">${formatINR(interest + lateFee)}</span></div>
            </div>`;
    });
}

// ==================== 10. E-WAY BILL ====================
function initEwayCalculator() {
    const btn = document.getElementById('calculateEway');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const value = parseNum(document.getElementById('ewayValue').value);
        const distance = parseNum(document.getElementById('ewayDistance').value);
        const mode = document.getElementById('ewayMode').value;
        const genDate = new Date(document.getElementById('ewayGenDate').value);

        const required = value >= 50000;
        let validityDays = mode === 'road' ? Math.max(1, Math.ceil(distance / 200)) : mode === 'ship' ? 15 : 3;

        const expiry = new Date(genDate);
        expiry.setDate(expiry.getDate() + validityDays);

        const result = document.getElementById('ewayResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-truck"></i>
                <h3>E-way Bill Validity</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">E-way Bill Required</span><span class="result-value">${required ? '✅ Yes' : '❌ No (Below ₹50K)'}</span></div>
                ${required ? `
                <div class="result-row"><span class="result-label">Validity Period</span><span class="result-value">${validityDays} day(s)</span></div>
                <div class="result-row highlight-green"><span class="result-label">Valid Until</span><span class="result-value">${expiry.toLocaleDateString()}</span></div>
                ` : ''}
            </div>`;
    });
}

// ==================== 11. COMPOSITION SCHEME ====================
function initCompositionChecker() {
    const btn = document.getElementById('checkComposition');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const businessType = document.getElementById('compBusinessType').value;
        const turnover = parseNum(document.getElementById('compTurnover').value);
        const ex1 = document.getElementById('compEx1').checked;
        const ex2 = document.getElementById('compEx2').checked;
        const ex3 = document.getElementById('compEx3').checked;

        const limit = businessType === 'service' ? 5000000 : 15000000;
        const hasExclusion = ex1 || ex2 || ex3;
        const eligible = !hasExclusion && turnover <= limit;

        const rates = { manufacturer: 1, trader: 1, restaurant: 5, service: 6 };
        const rate = rates[businessType];

        const result = document.getElementById('compositionResult');
        result.classList.remove('hidden');
        result.innerHTML = eligible
            ? `<div style="text-align:center; padding:1.5rem;">
                <i class="fas fa-check-circle" style="font-size:3rem; color:var(--gst-primary);"></i>
                <h3 style="margin:1rem 0;">✅ Eligible for Composition Scheme</h3>
                <p>Tax Rate: <strong>${rate}%</strong> on turnover</p>
               </div>`
            : `<div style="text-align:center; padding:1.5rem;">
                <i class="fas fa-times-circle" style="font-size:3rem; color:#ef4444;"></i>
                <h3 style="margin:1rem 0;">❌ Not Eligible</h3>
                <p>${turnover > limit ? `Turnover exceeds ${formatINR(limit)} limit` : 'Exclusion criteria applies'}</p>
               </div>`;
    });
}

// ==================== 12. RECONCILIATION ====================
function initReconciliation() {
    const btn = document.getElementById('reconcileGSTR');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const r2a = parseNum(document.getElementById('r2aIGST').value) + parseNum(document.getElementById('r2aCGST').value) + parseNum(document.getElementById('r2aSGST').value);
        const r3b = parseNum(document.getElementById('r3bIGST').value) + parseNum(document.getElementById('r3bCGST').value) + parseNum(document.getElementById('r3bSGST').value);
        const diff = r3b - r2a;

        const result = document.getElementById('reconResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-balance-scale"></i>
                <h3>Reconciliation Result</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">GSTR-2A Total</span><span class="result-value">${formatINR(r2a)}</span></div>
                <div class="result-row"><span class="result-label">GSTR-3B Claimed</span><span class="result-value">${formatINR(r3b)}</span></div>
                <div class="result-row ${diff > 0 ? 'highlight-green' : 'highlight'}"><span class="result-label">Difference</span><span class="result-value">${formatINR(Math.abs(diff))} ${diff > 0 ? '(Excess)' : diff < 0 ? '(Less)' : '(Matched)'}</span></div>
            </div>
            ${diff > 0 ? `<p style="margin-top:1rem; color:#f97316;">⚠️ ITC claimed exceeds 2A. Review pending invoices.</p>` : ''}`;
    });
}

// ==================== 13. ANNUAL RETURN ====================
function initAnnualReturn() {
    const btn = document.getElementById('compileAnnual');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const turnover = parseNum(document.getElementById('annualTurnover').value);
        const igst = parseNum(document.getElementById('annualIGST').value);
        const cgst = parseNum(document.getElementById('annualCGST').value);
        const sgst = parseNum(document.getElementById('annualSGST').value);
        const itc = parseNum(document.getElementById('annualITC').value);

        const result = document.getElementById('annualResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-file-alt"></i>
                <h3>GSTR-9 Data Summary</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Total Turnover</span><span class="result-value">${formatINR(turnover)}</span></div>
                <div class="result-row"><span class="result-label">Total Tax Paid</span><span class="result-value">${formatINR(igst + cgst + sgst)}</span></div>
                <div class="result-row"><span class="result-label">Total ITC Claimed</span><span class="result-value">${formatINR(itc)}</span></div>
                <div class="result-row highlight-green"><span class="result-label">Net Tax Liability</span><span class="result-value">${formatINR((igst + cgst + sgst) - itc)}</span></div>
            </div>`;
    });
}

// ==================== 14. ANTI-PROFITEERING ====================
function initAntiProfiteering() {
    const btn = document.getElementById('calculateAP');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const oldRate = parseNum(document.getElementById('apOldRate').value);
        const newRate = parseNum(document.getElementById('apNewRate').value);
        const oldPrice = parseNum(document.getElementById('apOldPrice').value);
        const units = parseNum(document.getElementById('apUnits').value);

        const basePrice = oldPrice / (1 + oldRate / 100);
        const newPrice = basePrice * (1 + newRate / 100);
        const reduction = oldPrice - newPrice;
        const profiteering = reduction * units;

        const result = document.getElementById('apResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-shield-alt"></i>
                <h3>Price Reduction Required</h3>
            </div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Old MRP</span><span class="result-value">${formatINR(oldPrice)}</span></div>
                <div class="result-row"><span class="result-label">Base Price</span><span class="result-value">${formatINR(basePrice)}</span></div>
                <div class="result-row highlight-green"><span class="result-label">New MRP</span><span class="result-value">${formatINR(newPrice)}</span></div>
                <div class="result-row"><span class="result-label">Price Reduction</span><span class="result-value">${formatINR(reduction)}</span></div>
                ${units > 0 ? `<div class="result-row grand-total"><span class="result-label">Total Profiteering (if not passed)</span><span class="result-value">${formatINR(profiteering)}</span></div>` : ''}
            </div>`;
    });
}

// Inject comparison grid styles
const styles = `
<style>
.comparison-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem}
.comparison-card{padding:1.5rem;border-radius:var(--radius-lg);text-align:center}
.comparison-card.new-regime{background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:2px solid var(--income-tax-primary)}
.comparison-card.old-regime{background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b}
.comparison-card h4{margin-bottom:0.5rem;font-size:1rem}
.comparison-card .tax-amount{font-size:1.75rem;font-weight:800;color:var(--text-primary);margin-bottom:0.5rem}
.comparison-card p{font-size:0.85rem;color:var(--text-muted);margin:0.25rem 0}
[data-theme="dark"] .comparison-card.new-regime{background:rgba(99,102,241,0.15)}
[data-theme="dark"] .comparison-card.old-regime{background:rgba(245,158,11,0.15)}
</style>`;
document.head.insertAdjacentHTML('beforeend', styles);

// ==================== FINANCIAL CALCULATORS ====================

// ==================== 15. SIP CALCULATOR ====================
function initSIPCalculator() {
    const modeBtns = document.querySelectorAll('.mode-btn[data-sip-mode]');
    const sipAmountSlider = document.getElementById('sipAmountSlider');
    const sipYearsSlider = document.getElementById('sipYearsSlider');
    const sipAmount = document.getElementById('sipAmount');
    const sipYears = document.getElementById('sipYears');
    const quickBtns = document.querySelectorAll('#sip-calculator .quick-btn[data-value]');
    let sipMode = 'basic';

    // Slider sync
    if (sipAmountSlider && sipAmount) {
        sipAmountSlider.addEventListener('input', () => sipAmount.value = sipAmountSlider.value);
        sipAmount.addEventListener('input', () => sipAmountSlider.value = sipAmount.value);
    }
    if (sipYearsSlider && sipYears) {
        sipYearsSlider.addEventListener('input', () => sipYears.value = sipYearsSlider.value);
        sipYears.addEventListener('input', () => sipYearsSlider.value = sipYears.value);
    }

    // Quick buttons for return rate
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quickBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('sipReturn').value = btn.getAttribute('data-value');
        });
    });

    // Mode switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sipMode = btn.getAttribute('data-sip-mode');
            document.querySelectorAll('.stepup-field').forEach(el => el.classList.toggle('hidden', sipMode !== 'stepup'));
            document.querySelectorAll('.goal-field').forEach(el => el.classList.toggle('hidden', sipMode !== 'goal'));
            document.getElementById('sipAmountGroup').classList.toggle('hidden', sipMode === 'goal');
        });
    });

    const btn = document.getElementById('calculateSIP');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const monthly = parseNum(document.getElementById('sipAmount').value);
        const years = parseNum(document.getElementById('sipYears').value);
        const rate = parseNum(document.getElementById('sipReturn').value);
        const stepUp = parseNum(document.getElementById('sipStepUp')?.value || 0);
        const goal = parseNum(document.getElementById('sipGoal')?.value || 0);
        const n = years * 12;
        const r = rate / 100 / 12;

        let futureValue, invested;

        if (sipMode === 'goal') {
            // Calculate required SIP for goal
            const fvFactor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
            const requiredSIP = goal / fvFactor;
            futureValue = goal;
            invested = requiredSIP * n;

            const result = document.getElementById('sipResult');
            result.classList.remove('hidden');
            result.innerHTML = `
                <div class="result-header"><i class="fas fa-bullseye"></i><h3>Goal-Based SIP</h3></div>
                <div class="result-grid">
                    <div class="result-row highlight-blue"><span class="result-label">Required Monthly SIP</span><span class="result-value">${formatINR(requiredSIP)}</span></div>
                    <div class="result-row"><span class="result-label">Target Amount</span><span class="result-value">${formatINR(goal)}</span></div>
                    <div class="result-row"><span class="result-label">Total Investment</span><span class="result-value">${formatINR(invested)}</span></div>
                    <div class="result-row"><span class="result-label">Expected Returns</span><span class="result-value">${formatINR(goal - invested)}</span></div>
                </div>`;
            return;
        }

        if (sipMode === 'stepup') {
            // Step-up SIP calculation
            let total = 0;
            let currentSIP = monthly;
            invested = 0;
            for (let y = 0; y < years; y++) {
                for (let m = 0; m < 12; m++) {
                    invested += currentSIP;
                    total = (total + currentSIP) * (1 + r);
                }
                currentSIP *= (1 + stepUp / 100);
            }
            futureValue = total;
        } else {
            // Basic SIP
            invested = monthly * n;
            futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        }

        const wealth = futureValue - invested;

        const result = document.getElementById('sipResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-coins"></i><h3>${sipMode === 'stepup' ? 'Step-Up' : 'Basic'} SIP Results</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Total Investment</span><span class="result-value">${formatINR(invested)}</span></div>
                <div class="result-row"><span class="result-label">Wealth Gained</span><span class="result-value">${formatINR(wealth)}</span></div>
                <div class="result-row highlight-blue"><span class="result-label">Maturity Value</span><span class="result-value">${formatINR(futureValue)}</span></div>
            </div>`;
    });
}

// ==================== 16. CAGR CALCULATOR ====================
function initCAGRCalculator() {
    const modeBtns = document.querySelectorAll('.mode-btn[data-cagr-mode]');
    const quickBtns = document.querySelectorAll('#cagr-calculator .quick-btn[data-years]');
    let cagrMode = 'calculate';

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cagrMode = btn.getAttribute('data-cagr-mode');
            document.getElementById('cagrEndGroup').classList.toggle('hidden', cagrMode === 'future');
            document.querySelectorAll('.cagr-rate-field').forEach(el => el.classList.toggle('hidden', cagrMode !== 'future'));
        });
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quickBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('cagrYears').value = btn.getAttribute('data-years');
        });
    });

    const btn = document.getElementById('calculateCAGR');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const begin = parseNum(document.getElementById('cagrBegin').value);
        const end = parseNum(document.getElementById('cagrEnd').value);
        const years = parseNum(document.getElementById('cagrYears').value);
        const rate = parseNum(document.getElementById('cagrRate')?.value || 0);

        let cagr, futureVal;
        if (cagrMode === 'future') {
            futureVal = begin * Math.pow(1 + rate / 100, years);
            cagr = rate;
        } else {
            cagr = (Math.pow(end / begin, 1 / years) - 1) * 100;
            futureVal = end;
        }

        const absoluteReturn = ((futureVal - begin) / begin) * 100;

        const result = document.getElementById('cagrResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-chart-bar"></i><h3>CAGR Results</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Beginning Value</span><span class="result-value">${formatINR(begin)}</span></div>
                <div class="result-row"><span class="result-label">Ending Value</span><span class="result-value">${formatINR(futureVal)}</span></div>
                <div class="result-row"><span class="result-label">Time Period</span><span class="result-value">${years} Years</span></div>
                <div class="result-row highlight-blue"><span class="result-label">CAGR</span><span class="result-value">${cagr.toFixed(2)}%</span></div>
                <div class="result-row"><span class="result-label">Absolute Return</span><span class="result-value">${absoluteReturn.toFixed(2)}%</span></div>
            </div>`;
    });
}

// ==================== 17. XIRR CALCULATOR ====================
function initXIRRCalculator() {
    const addBtn = document.getElementById('addCashflow');
    const clearBtn = document.getElementById('clearCashflows');
    const rowsContainer = document.getElementById('cashflowRows');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const row = document.createElement('div');
            row.className = 'cashflow-row';
            row.innerHTML = `
                <input type="date" class="cf-date">
                <input type="number" class="cf-amount" placeholder="e.g., -10000">
                <select class="cf-type"><option value="invest">Investment</option><option value="redeem">Redemption</option></select>
                <button class="cf-remove"><i class="fas fa-times"></i></button>`;
            rowsContainer.appendChild(row);
            row.querySelector('.cf-remove').addEventListener('click', () => row.remove());
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            rowsContainer.innerHTML = `
                <div class="cashflow-row">
                    <input type="date" class="cf-date">
                    <input type="number" class="cf-amount" placeholder="e.g., -10000">
                    <select class="cf-type"><option value="invest">Investment</option><option value="redeem">Redemption</option></select>
                    <button class="cf-remove"><i class="fas fa-times"></i></button>
                </div>`;
        });
    }

    rowsContainer?.querySelectorAll('.cf-remove').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.cashflow-row').remove());
    });

    const btn = document.getElementById('calculateXIRR');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const rows = document.querySelectorAll('.cashflow-row');
        const currentValue = parseNum(document.getElementById('xirrCurrentValue').value);
        const cashflows = [];
        const dates = [];

        rows.forEach(row => {
            const date = row.querySelector('.cf-date').value;
            let amount = parseNum(row.querySelector('.cf-amount').value);
            const type = row.querySelector('.cf-type').value;
            if (date && amount) {
                if (type === 'invest') amount = -Math.abs(amount);
                else amount = Math.abs(amount);
                cashflows.push(amount);
                dates.push(new Date(date));
            }
        });

        // Add current value as final redemption
        if (currentValue > 0) {
            cashflows.push(currentValue);
            dates.push(new Date());
        }

        const xirr = calculateXIRR(cashflows, dates);
        const totalInvested = cashflows.filter(c => c < 0).reduce((a, b) => a + Math.abs(b), 0);
        const totalRedeemed = cashflows.filter(c => c > 0).reduce((a, b) => a + b, 0);

        const result = document.getElementById('xirrResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-random"></i><h3>XIRR Results</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Total Invested</span><span class="result-value">${formatINR(totalInvested)}</span></div>
                <div class="result-row"><span class="result-label">Current Value</span><span class="result-value">${formatINR(totalRedeemed)}</span></div>
                <div class="result-row"><span class="result-label">Gain/Loss</span><span class="result-value">${formatINR(totalRedeemed - totalInvested)}</span></div>
                <div class="result-row highlight-blue"><span class="result-label">XIRR (Annualized)</span><span class="result-value">${xirr !== null ? xirr.toFixed(2) + '%' : 'N/A'}</span></div>
            </div>`;
    });
}

function calculateXIRR(cashflows, dates) {
    if (cashflows.length < 2) return null;
    const daysBetween = (d1, d2) => (d2 - d1) / (1000 * 60 * 60 * 24);
    const f = (rate) => {
        let sum = 0;
        for (let i = 0; i < cashflows.length; i++) {
            const days = daysBetween(dates[0], dates[i]);
            sum += cashflows[i] / Math.pow(1 + rate, days / 365);
        }
        return sum;
    };
    // Newton-Raphson method
    let rate = 0.1;
    for (let i = 0; i < 100; i++) {
        const fval = f(rate);
        const fvalPlus = f(rate + 0.0001);
        const derivative = (fvalPlus - fval) / 0.0001;
        if (Math.abs(derivative) < 1e-10) break;
        const newRate = rate - fval / derivative;
        if (Math.abs(newRate - rate) < 1e-7) { rate = newRate; break; }
        rate = newRate;
    }
    return rate * 100;
}

// ==================== 18. EMI CALCULATOR ====================
function initEMICalculator() {
    const loanTypeBtns = document.querySelectorAll('.loan-type-btn');
    const emiAmountSlider = document.getElementById('emiAmountSlider');
    const emiTenureSlider = document.getElementById('emiTenureSlider');
    const emiLoanAmount = document.getElementById('emiLoanAmount');
    const emiTenure = document.getElementById('emiTenure');

    loanTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loanTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.getAttribute('data-type');
            const rates = { home: 8.5, car: 9.5, personal: 12, education: 8.5 };
            document.getElementById('emiInterestRate').value = rates[type];
        });
    });

    if (emiAmountSlider && emiLoanAmount) {
        emiAmountSlider.addEventListener('input', () => emiLoanAmount.value = emiAmountSlider.value);
        emiLoanAmount.addEventListener('input', () => emiAmountSlider.value = emiLoanAmount.value);
    }
    if (emiTenureSlider && emiTenure) {
        emiTenureSlider.addEventListener('input', () => emiTenure.value = emiTenureSlider.value);
        emiTenure.addEventListener('input', () => emiTenureSlider.value = emiTenure.value);
    }

    const btn = document.getElementById('calculateEMI');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const principal = parseNum(document.getElementById('emiLoanAmount').value);
        const rate = parseNum(document.getElementById('emiInterestRate').value);
        const tenure = parseNum(document.getElementById('emiTenure').value);
        const prepayment = parseNum(document.getElementById('emiPrepayment')?.value || 0);
        const extraMonthly = parseNum(document.getElementById('emiExtraMonthly')?.value || 0);

        const r = rate / 100 / 12;
        const n = tenure * 12;
        const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - principal;

        // With prepayment
        let savingsInterest = 0, monthsSaved = 0;
        if (prepayment > 0 || extraMonthly > 0) {
            let balance = principal;
            let months = 0;
            let interestPaid = 0;
            while (balance > 0 && months < n) {
                const monthInterest = balance * r;
                interestPaid += monthInterest;
                balance = balance + monthInterest - emi - extraMonthly;
                months++;
                if (months === parseNum(document.getElementById('emiPrepayMonth')?.value || 0)) {
                    balance -= prepayment;
                }
                if (balance < 0) balance = 0;
            }
            savingsInterest = totalInterest - interestPaid;
            monthsSaved = n - months;
        }

        const result = document.getElementById('emiResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-money-check-alt"></i><h3>EMI Calculation</h3></div>
            <div class="result-grid">
                <div class="result-row highlight-blue"><span class="result-label">Monthly EMI</span><span class="result-value">${formatINR(emi)}</span></div>
                <div class="result-row"><span class="result-label">Principal Amount</span><span class="result-value">${formatINR(principal)}</span></div>
                <div class="result-row"><span class="result-label">Total Interest</span><span class="result-value">${formatINR(totalInterest)}</span></div>
                <div class="result-row grand-total"><span class="result-label">Total Payment</span><span class="result-value">${formatINR(totalPayment)}</span></div>
                ${savingsInterest > 0 ? `
                <div class="result-row" style="margin-top:1rem; background:#dcfce7;"><span class="result-label">💰 Interest Saved (Prepayment)</span><span class="result-value">${formatINR(savingsInterest)}</span></div>
                <div class="result-row" style="background:#dcfce7;"><span class="result-label">⏱️ Months Saved</span><span class="result-value">${monthsSaved} months</span></div>
                ` : ''}
            </div>`;
    });
}

// ==================== 19. LOAN COMPARISON ====================
function initLoanComparison() {
    const addBtn = document.getElementById('addLoanOffer');
    const offersContainer = document.getElementById('loanOffers');
    let offerCount = 2;

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            offerCount++;
            const card = document.createElement('div');
            card.className = 'loan-offer-card';
            card.innerHTML = `
                <h4>Offer ${offerCount}</h4>
                <div class="form-group"><label>Bank Name</label><input type="text" class="offer-bank" placeholder="Bank Name"></div>
                <div class="form-group"><label>Interest Rate (%)</label><input type="number" class="offer-rate" step="0.01"></div>
                <div class="form-group"><label>Tenure (Years)</label><input type="number" class="offer-tenure"></div>
                <div class="form-group"><label>Processing Fee (%)</label><input type="number" class="offer-fee" step="0.01"></div>`;
            offersContainer.appendChild(card);
        });
    }

    const btn = document.getElementById('compareLoan');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const loanAmount = parseNum(document.getElementById('loanCompAmount').value);
        const offers = [];
        document.querySelectorAll('.loan-offer-card').forEach(card => {
            const bank = card.querySelector('.offer-bank').value || 'Bank';
            const rate = parseNum(card.querySelector('.offer-rate').value);
            const tenure = parseNum(card.querySelector('.offer-tenure').value);
            const fee = parseNum(card.querySelector('.offer-fee').value);
            if (rate && tenure) {
                const r = rate / 100 / 12;
                const n = tenure * 12;
                const emi = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
                const totalPayment = emi * n;
                const processingFee = loanAmount * fee / 100;
                const totalCost = totalPayment + processingFee;
                offers.push({ bank, rate, tenure, emi, totalPayment, processingFee, totalCost });
            }
        });

        offers.sort((a, b) => a.totalCost - b.totalCost);

        const result = document.getElementById('loanCompResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-balance-scale"></i><h3>Loan Comparison</h3></div>
            <table style="width:100%; border-collapse:collapse; margin-top:1rem;">
                <tr style="background:var(--finance-primary); color:white;">
                    <th style="padding:0.75rem;">Bank</th>
                    <th>Rate</th>
                    <th>Tenure</th>
                    <th>EMI</th>
                    <th>Total Cost</th>
                    <th>Rank</th>
                </tr>
                ${offers.map((o, i) => `
                <tr style="${i === 0 ? 'background:#dcfce7;' : ''}">
                    <td style="padding:0.75rem; font-weight:600;">${o.bank}</td>
                    <td style="text-align:center;">${o.rate}%</td>
                    <td style="text-align:center;">${o.tenure}Y</td>
                    <td style="text-align:right;">${formatINR(o.emi)}</td>
                    <td style="text-align:right; font-weight:600;">${formatINR(o.totalCost)}</td>
                    <td style="text-align:center; font-weight:700;">${i === 0 ? '🏆 Best' : i + 1}</td>
                </tr>`).join('')}
            </table>`;
    });
}

// ==================== 20. RETIREMENT PLANNER ====================
function initRetirementPlanner() {
    const btn = document.getElementById('calculateRetirement');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const currentAge = parseNum(document.getElementById('retCurrentAge').value);
        const retireAge = parseNum(document.getElementById('retRetireAge').value);
        const lifeExpect = parseNum(document.getElementById('retLifeExpect').value);
        const monthlyExp = parseNum(document.getElementById('retMonthlyExp').value);
        const inflation = parseNum(document.getElementById('retInflation').value) / 100;
        const preReturn = parseNum(document.getElementById('retPreReturn').value) / 100;
        const postReturn = parseNum(document.getElementById('retPostReturn').value) / 100;
        const currentSavings = parseNum(document.getElementById('retCurrentSavings').value);

        const yearsToRetire = retireAge - currentAge;
        const retirementYears = lifeExpect - retireAge;

        // Expenses at retirement (adjusted for inflation)
        const expAtRetire = monthlyExp * 12 * Math.pow(1 + inflation, yearsToRetire);

        // Corpus needed at retirement (present value of annuity with inflation)
        const realRate = (1 + postReturn) / (1 + inflation) - 1;
        const corpusNeeded = expAtRetire * ((1 - Math.pow(1 + realRate, -retirementYears)) / realRate);

        // Future value of current savings
        const fvCurrentSavings = currentSavings * Math.pow(1 + preReturn, yearsToRetire);

        // Additional corpus needed
        const additionalNeeded = Math.max(0, corpusNeeded - fvCurrentSavings);

        // Monthly SIP required
        const r = preReturn / 12;
        const n = yearsToRetire * 12;
        const sipRequired = additionalNeeded / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

        const result = document.getElementById('retirementResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-umbrella-beach"></i><h3>Retirement Plan</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Years to Retirement</span><span class="result-value">${yearsToRetire} years</span></div>
                <div class="result-row"><span class="result-label">Annual Expenses at Retirement</span><span class="result-value">${formatINR(expAtRetire)}</span></div>
                <div class="result-row highlight-blue"><span class="result-label">Corpus Needed at 60</span><span class="result-value">${formatINR(corpusNeeded)}</span></div>
                <div class="result-row"><span class="result-label">Current Savings Growth</span><span class="result-value">${formatINR(fvCurrentSavings)}</span></div>
                <div class="result-row"><span class="result-label">Gap to Fill</span><span class="result-value">${formatINR(additionalNeeded)}</span></div>
                <div class="result-row grand-total"><span class="result-label">Monthly SIP Needed</span><span class="result-value">${formatINR(sipRequired)}</span></div>
            </div>`;
    });
}

// ==================== 21. EDUCATION PLANNER ====================
function initEducationPlanner() {
    const btn = document.getElementById('calculateEducation');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const childAge = parseNum(document.getElementById('eduChildAge').value);
        const startAge = parseNum(document.getElementById('eduStartAge').value);
        const currentCost = parseNum(document.getElementById('eduCurrentCost').value);
        const inflation = parseNum(document.getElementById('eduInflation').value) / 100;
        const returnRate = parseNum(document.getElementById('eduReturn').value) / 100;
        const currentSaving = parseNum(document.getElementById('eduCurrentSaving').value);

        const yearsToEducation = startAge - childAge;
        const futureCost = currentCost * Math.pow(1 + inflation, yearsToEducation);
        const fvSavings = currentSaving * Math.pow(1 + returnRate, yearsToEducation);
        const gap = Math.max(0, futureCost - fvSavings);

        const r = returnRate / 12;
        const n = yearsToEducation * 12;
        const sipRequired = gap / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

        const result = document.getElementById('educationResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-graduation-cap"></i><h3>Education Fund Plan</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Years to Higher Education</span><span class="result-value">${yearsToEducation} years</span></div>
                <div class="result-row highlight-blue"><span class="result-label">Future Education Cost</span><span class="result-value">${formatINR(futureCost)}</span></div>
                <div class="result-row"><span class="result-label">Current Savings Growth</span><span class="result-value">${formatINR(fvSavings)}</span></div>
                <div class="result-row"><span class="result-label">Gap to Fill</span><span class="result-value">${formatINR(gap)}</span></div>
                <div class="result-row grand-total"><span class="result-label">Monthly SIP Needed</span><span class="result-value">${formatINR(sipRequired)}</span></div>
            </div>`;
    });
}

// ==================== 22. GOAL PLANNER ====================
function initGoalPlanner() {
    const presets = document.querySelectorAll('.goal-preset');
    presets.forEach(btn => {
        btn.addEventListener('click', () => {
            presets.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const goal = btn.getAttribute('data-goal');
            const defaults = {
                car: { name: 'New Car', target: 1000000, years: 3 },
                home: { name: 'Dream Home Down Payment', target: 2500000, years: 5 },
                wedding: { name: 'Wedding Fund', target: 1500000, years: 4 },
                travel: { name: 'Dream Vacation', target: 500000, years: 2 }
            };
            if (defaults[goal]) {
                document.getElementById('goalName').value = defaults[goal].name;
                document.getElementById('goalTarget').value = defaults[goal].target;
                document.getElementById('goalYears').value = defaults[goal].years;
            }
        });
    });

    const btn = document.getElementById('calculateGoal');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const goalName = document.getElementById('goalName').value || 'Your Goal';
        const target = parseNum(document.getElementById('goalTarget').value);
        const years = parseNum(document.getElementById('goalYears').value);
        const returnRate = parseNum(document.getElementById('goalReturn').value) / 100;
        const currentSaving = parseNum(document.getElementById('goalCurrentSaving').value);

        const fvSavings = currentSaving * Math.pow(1 + returnRate, years);
        const gap = Math.max(0, target - fvSavings);

        const r = returnRate / 12;
        const n = years * 12;
        const sipRequired = gap / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        const lumpsum = gap / Math.pow(1 + returnRate, years);

        const result = document.getElementById('goalResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-bullseye"></i><h3>${goalName}</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Target Amount</span><span class="result-value">${formatINR(target)}</span></div>
                <div class="result-row"><span class="result-label">Time Period</span><span class="result-value">${years} years</span></div>
                <div class="result-row"><span class="result-label">Current Savings Growth</span><span class="result-value">${formatINR(fvSavings)}</span></div>
                <div class="result-row highlight-blue"><span class="result-label">Monthly SIP Needed</span><span class="result-value">${formatINR(sipRequired)}</span></div>
                <div class="result-row"><span class="result-label">OR Lumpsum Today</span><span class="result-value">${formatINR(lumpsum)}</span></div>
            </div>`;
    });
}

// ==================== 23. INFLATION CALCULATOR ====================
function initInflationCalculator() {
    const modeBtns = document.querySelectorAll('.mode-btn[data-inf-mode]');
    const quickBtns = document.querySelectorAll('#inflation-calc .quick-btn[data-rate]');
    let infMode = 'future';

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            infMode = btn.getAttribute('data-inf-mode');
            document.getElementById('infAmountLabel').textContent = infMode === 'future' ? 'Current Cost (₹)' : 'Future Cost (₹)';
        });
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quickBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('infRate').value = btn.getAttribute('data-rate');
        });
    });

    const btn = document.getElementById('calculateInflation');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const amount = parseNum(document.getElementById('infAmount').value);
        const years = parseNum(document.getElementById('infYears').value);
        const rate = parseNum(document.getElementById('infRate').value) / 100;

        let futureValue, presentValue;
        if (infMode === 'future') {
            futureValue = amount * Math.pow(1 + rate, years);
            presentValue = amount;
        } else {
            presentValue = amount / Math.pow(1 + rate, years);
            futureValue = amount;
        }

        const lossInValue = ((futureValue - presentValue) / presentValue) * 100;

        const result = document.getElementById('inflationResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-chart-area"></i><h3>Inflation Impact</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Present Value</span><span class="result-value">${formatINR(presentValue)}</span></div>
                <div class="result-row highlight-blue"><span class="result-label">Future Value (after ${years} years)</span><span class="result-value">${formatINR(futureValue)}</span></div>
                <div class="result-row"><span class="result-label">Price Increase</span><span class="result-value">${lossInValue.toFixed(1)}%</span></div>
            </div>
            <p style="margin-top:1rem; color:var(--text-secondary);">💡 What costs ${formatINR(presentValue)} today will cost ${formatINR(futureValue)} in ${years} years at ${(rate * 100).toFixed(1)}% inflation.</p>`;
    });
}

// ==================== 24. REAL vs NOMINAL RETURN ====================
function initRealReturnCalculator() {
    const btn = document.getElementById('calculateRealReturn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const nominalRate = parseNum(document.getElementById('nominalReturn').value);
        const inflationRate = parseNum(document.getElementById('inflationRateRR').value);
        const investment = parseNum(document.getElementById('rrInvestment').value);
        const years = parseNum(document.getElementById('rrYears').value);

        const realReturn = ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;

        let nominalValue = investment, realValue = investment;
        if (investment && years) {
            nominalValue = investment * Math.pow(1 + nominalRate / 100, years);
            realValue = investment * Math.pow(1 + realReturn / 100, years);
        }

        const result = document.getElementById('realReturnResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-percentage"></i><h3>Real Return Analysis</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Nominal Return</span><span class="result-value">${nominalRate.toFixed(2)}%</span></div>
                <div class="result-row"><span class="result-label">Inflation Rate</span><span class="result-value">${inflationRate.toFixed(2)}%</span></div>
                <div class="result-row highlight-blue"><span class="result-label">Real Return</span><span class="result-value">${realReturn.toFixed(2)}%</span></div>
                ${investment && years ? `
                <div class="result-row"><span class="result-label">Nominal Value (after ${years}Y)</span><span class="result-value">${formatINR(nominalValue)}</span></div>
                <div class="result-row"><span class="result-label">Real Value (Purchasing Power)</span><span class="result-value">${formatINR(realValue)}</span></div>
                ` : ''}
            </div>
            <p style="margin-top:1rem; color:var(--text-secondary);">💡 Your real purchasing power grows by only ${realReturn.toFixed(2)}% after accounting for inflation.</p>`;
    });
}

// ==================== 25. PPF/NPS CALCULATOR ====================
function initPPFCalculator() {
    const modeBtns = document.querySelectorAll('.mode-btn[data-ppf-mode]');
    let ppfMode = 'ppf';

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            ppfMode = btn.getAttribute('data-ppf-mode');
            document.querySelectorAll('.nps-field').forEach(el => el.classList.toggle('hidden', ppfMode !== 'nps'));
            document.getElementById('ppfRate').value = ppfMode === 'ppf' ? 7.1 : 9;
            document.getElementById('ppfYears').min = ppfMode === 'ppf' ? 15 : 1;
        });
    });

    const btn = document.getElementById('calculatePPF');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const annual = parseNum(document.getElementById('ppfAmount').value);
        const years = parseNum(document.getElementById('ppfYears').value);
        const rate = parseNum(document.getElementById('ppfRate').value) / 100;
        const annuityPercent = parseNum(document.getElementById('npsAnnuity')?.value || 40) / 100;

        const totalInvested = annual * years;
        let maturityValue = 0;
        for (let i = 0; i < years; i++) {
            maturityValue = (maturityValue + annual) * (1 + rate);
        }
        const interestEarned = maturityValue - totalInvested;

        let resultHTML = `
            <div class="result-header"><i class="fas fa-landmark"></i><h3>${ppfMode.toUpperCase()} Projection</h3></div>
            <div class="result-grid">
                <div class="result-row"><span class="result-label">Annual Investment</span><span class="result-value">${formatINR(annual)}</span></div>
                <div class="result-row"><span class="result-label">Investment Period</span><span class="result-value">${years} years</span></div>
                <div class="result-row"><span class="result-label">Total Invested</span><span class="result-value">${formatINR(totalInvested)}</span></div>
                <div class="result-row"><span class="result-label">Interest Earned</span><span class="result-value">${formatINR(interestEarned)}</span></div>
                <div class="result-row highlight-blue"><span class="result-label">Maturity Value</span><span class="result-value">${formatINR(maturityValue)}</span></div>`;

        if (ppfMode === 'nps') {
            const lumpsum = maturityValue * (1 - annuityPercent);
            const annuityCorpus = maturityValue * annuityPercent;
            const monthlyPension = (annuityCorpus * 0.06) / 12; // Assuming 6% annuity rate
            resultHTML += `
                <div class="result-row" style="margin-top:1rem;"><span class="result-label">Lumpsum (Tax-Free)</span><span class="result-value">${formatINR(lumpsum)}</span></div>
                <div class="result-row"><span class="result-label">Annuity Corpus (${(annuityPercent * 100)}%)</span><span class="result-value">${formatINR(annuityCorpus)}</span></div>
                <div class="result-row grand-total"><span class="result-label">Est. Monthly Pension</span><span class="result-value">${formatINR(monthlyPension)}</span></div>`;
        }

        resultHTML += '</div>';
        const result = document.getElementById('ppfResult');
        result.classList.remove('hidden');
        result.innerHTML = resultHTML;
    });
}

// ==================== 26. FD vs DEBT FUND ====================
function initFDComparison() {
    const btn = document.getElementById('compareFD');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const amount = parseNum(document.getElementById('fdAmount').value);
        const years = parseNum(document.getElementById('fdYears').value);
        const fdRate = parseNum(document.getElementById('fdRate').value) / 100;
        const debtRate = parseNum(document.getElementById('debtFundRate').value) / 100;
        const taxSlab = parseNum(document.getElementById('fdTaxSlab').value) / 100;

        // FD calculation (interest taxed annually)
        let fdValue = amount;
        for (let i = 0; i < years; i++) {
            const interest = fdValue * fdRate;
            const tax = interest * taxSlab;
            fdValue = fdValue + interest - tax;
        }
        const fdPostTaxReturn = (Math.pow(fdValue / amount, 1 / years) - 1) * 100;

        // Debt Fund (LTCG after 3 years at slab rate)
        const debtValue = amount * Math.pow(1 + debtRate, years);
        const debtGain = debtValue - amount;
        const debtTax = debtGain * taxSlab; // Taxed at slab rate now
        const debtPostTaxValue = debtValue - debtTax;
        const debtPostTaxReturn = (Math.pow(debtPostTaxValue / amount, 1 / years) - 1) * 100;

        const better = fdValue > debtPostTaxValue ? 'FD' : 'Debt Fund';
        const diff = Math.abs(fdValue - debtPostTaxValue);

        const result = document.getElementById('fdResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header"><i class="fas fa-university"></i><h3>FD vs Debt Fund (Post-Tax)</h3></div>
            <div class="comparison-grid">
                <div class="comparison-card" style="background:${fdValue >= debtPostTaxValue ? '#dcfce7' : 'var(--bg-secondary)'}; border:2px solid ${fdValue >= debtPostTaxValue ? '#22c55e' : 'transparent'}; border-radius:12px; padding:1.5rem; text-align:center;">
                    <h4>Fixed Deposit</h4>
                    <div class="tax-amount" style="font-size:1.5rem; font-weight:700;">${formatINR(fdValue)}</div>
                    <p style="font-size:0.85rem;">Post-Tax Return: ${fdPostTaxReturn.toFixed(2)}% p.a.</p>
                </div>
                <div class="comparison-card" style="background:${debtPostTaxValue > fdValue ? '#dbeafe' : 'var(--bg-secondary)'}; border:2px solid ${debtPostTaxValue > fdValue ? '#3b82f6' : 'transparent'}; border-radius:12px; padding:1.5rem; text-align:center;">
                    <h4>Debt Mutual Fund</h4>
                    <div class="tax-amount" style="font-size:1.5rem; font-weight:700;">${formatINR(debtPostTaxValue)}</div>
                    <p style="font-size:0.85rem;">Post-Tax Return: ${debtPostTaxReturn.toFixed(2)}% p.a.</p>
                </div>
            </div>
            <div class="recommendation-box" style="margin-top:1rem;">
                <i class="fas fa-trophy"></i>
                <h4>${better} is Better by ${formatINR(diff)}</h4>
                <p>Based on your tax slab of ${(taxSlab * 100)}% and holding period of ${years} years</p>
            </div>`;
    });
}

// ==================== BUSINESS & VALUATION CALCULATORS ====================

// DCF Valuation Model
function initDCFCalculator() {
    const btn = document.getElementById('calculateDCF');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const revenue = parseNum(document.getElementById('dcfRevenue').value);
        const growth1 = parseNum(document.getElementById('dcfGrowth1').value) / 100;
        const terminalGrowth = parseNum(document.getElementById('dcfTerminalGrowth').value) / 100;
        const ebitdaMargin = parseNum(document.getElementById('dcfEbitdaMargin').value) / 100;
        const wacc = parseNum(document.getElementById('dcfWacc').value) / 100;
        const years = parseNum(document.getElementById('dcfYears').value);
        const taxRate = parseNum(document.getElementById('dcfTax').value) / 100;
        const capexPct = parseNum(document.getElementById('dcfCapex').value) / 100;
        const netDebt = parseNum(document.getElementById('dcfDebt').value);
        const shares = parseNum(document.getElementById('dcfShares').value);

        if (!revenue || !shares) return alert('Please enter revenue and shares');

        // Project revenues with declining growth
        let projections = [];
        let currentRev = revenue;
        let totalPVFCF = 0;

        for (let i = 1; i <= years; i++) {
            const growthRate = growth1 - ((growth1 - terminalGrowth) * (i - 1) / (years - 1));
            currentRev = currentRev * (1 + growthRate);
            const ebitda = currentRev * ebitdaMargin;
            const depreciation = currentRev * 0.04;
            const ebit = ebitda - depreciation;
            const nopat = ebit * (1 - taxRate);
            const capex = currentRev * capexPct;
            const fcf = nopat + depreciation - capex - (currentRev * 0.05);
            const discountFactor = Math.pow(1 + wacc, i);
            const pvFCF = fcf / discountFactor;
            totalPVFCF += pvFCF;
            projections.push({ year: i, revenue: currentRev, fcf, pvFCF, discountFactor });
        }

        // Terminal Value (Gordon Growth)
        const terminalFCF = projections[years - 1].fcf * (1 + terminalGrowth);
        const terminalValue = terminalFCF / (wacc - terminalGrowth);
        const pvTerminal = terminalValue / Math.pow(1 + wacc, years);

        const enterpriseValue = totalPVFCF + pvTerminal;
        const equityValue = enterpriseValue - netDebt;
        const sharePrice = equityValue / shares;
        const terminalPct = (pvTerminal / enterpriseValue * 100).toFixed(1);

        const result = document.getElementById('dcfResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-chart-line"></i> DCF Valuation Summary</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">PV of FCFs (Yr 1-${years})</span>
                    <span class="result-value">${formatINR(totalPVFCF)} L</span>
                </div>
                <div class="result-row">
                    <span class="result-label">PV of Terminal Value</span>
                    <span class="result-value">${formatINR(pvTerminal)} L</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Enterprise Value</span>
                    <span class="result-value">${formatINR(enterpriseValue)} L</span>
                </div>
                <div class="result-row">
                    <span class="result-label">(-) Net Debt</span>
                    <span class="result-value">${formatINR(netDebt)} L</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Equity Value</span>
                    <span class="result-value">${formatINR(equityValue)} L</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Fair Value per Share</span>
                    <span class="result-value">₹${(sharePrice * 100000 / shares).toFixed(2)}</span>
                </div>
            </div>
            <div class="info-box" style="margin-top:1rem;">
                <p>⚠️ Terminal Value = ${terminalPct}% of Enterprise Value</p>
            </div>`;
    });
}

// WACC Calculator
function initWACCCalculator() {
    const btn = document.getElementById('calculateWACC');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const rf = parseNum(document.getElementById('waccRf').value) / 100;
        const mrp = parseNum(document.getElementById('waccMrp').value) / 100;
        const beta = parseNum(document.getElementById('waccBeta').value);
        const sizePrem = parseNum(document.getElementById('waccSizePrem').value) / 100;
        const kd = parseNum(document.getElementById('waccKd').value) / 100;
        const taxRate = parseNum(document.getElementById('waccTax').value) / 100;
        const eWeight = parseNum(document.getElementById('waccEquityWeight').value) / 100;
        const dWeight = parseNum(document.getElementById('waccDebtWeight').value) / 100;

        // CAPM Cost of Equity
        const ke = rf + (beta * mrp) + sizePrem;

        // After-tax Cost of Debt
        const kdAfterTax = kd * (1 - taxRate);

        // WACC
        const wacc = (eWeight * ke) + (dWeight * kdAfterTax);

        const result = document.getElementById('waccResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-percentage"></i> WACC Calculation</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Cost of Equity (Ke)</span>
                    <span class="result-value">${(ke * 100).toFixed(2)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">After-tax Cost of Debt (Kd)</span>
                    <span class="result-value">${(kdAfterTax * 100).toFixed(2)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Equity Contribution</span>
                    <span class="result-value">${(eWeight * ke * 100).toFixed(2)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Debt Contribution</span>
                    <span class="result-value">${(dWeight * kdAfterTax * 100).toFixed(2)}%</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">WACC</span>
                    <span class="result-value">${(wacc * 100).toFixed(2)}%</span>
                </div>
            </div>`;
    });
}

// Business Valuation Multi-Method
function initBusinessValuation() {
    const btn = document.getElementById('calculateBV');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const revenue = parseNum(document.getElementById('bvRevenue').value);
        const ebitda = parseNum(document.getElementById('bvEbitda').value);
        const netProfit = parseNum(document.getElementById('bvNetProfit').value);
        const assets = parseNum(document.getElementById('bvAssets').value);
        const liabilities = parseNum(document.getElementById('bvLiabilities').value);
        const industry = document.getElementById('bvIndustry').value;

        // Industry multiples
        const multiples = {
            technology: { revenue: 3, ebitda: 12, pe: 25 },
            manufacturing: { revenue: 1, ebitda: 6, pe: 12 },
            services: { revenue: 1.5, ebitda: 8, pe: 15 },
            retail: { revenue: 0.5, ebitda: 5, pe: 10 },
            healthcare: { revenue: 2, ebitda: 10, pe: 18 }
        };

        const m = multiples[industry];
        const revenueVal = revenue * m.revenue;
        const ebitdaVal = ebitda * m.ebitda;
        const peVal = netProfit * m.pe;
        const bookVal = assets - liabilities;
        const avgVal = (revenueVal + ebitdaVal + peVal + bookVal) / 4;

        const result = document.getElementById('bvResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-building"></i> Valuation Summary</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Revenue Multiple (${m.revenue}x)</span>
                    <span class="result-value">${formatINR(revenueVal)} L</span>
                </div>
                <div class="result-row">
                    <span class="result-label">EBITDA Multiple (${m.ebitda}x)</span>
                    <span class="result-value">${formatINR(ebitdaVal)} L</span>
                </div>
                <div class="result-row">
                    <span class="result-label">P/E Multiple (${m.pe}x)</span>
                    <span class="result-value">${formatINR(peVal)} L</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Book Value</span>
                    <span class="result-value">${formatINR(bookVal)} L</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Average Valuation</span>
                    <span class="result-value">${formatINR(avgVal)} L</span>
                </div>
            </div>`;
    });
}

// Revenue Multiple Finder
function initRevenueMultiple() {
    const btn = document.getElementById('findMultiples');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const industry = document.getElementById('rmIndustry').value;
        const growth = document.getElementById('rmGrowth').value;
        const revenue = parseNum(document.getElementById('rmRevenue').value);
        const ebitda = parseNum(document.getElementById('rmEbitda').value);

        const industryData = {
            saas: { name: 'SaaS', revLow: 4, revMid: 8, revHigh: 15, evEbitda: 20 },
            fintech: { name: 'Fintech', revLow: 3, revMid: 6, revHigh: 12, evEbitda: 15 },
            ecommerce: { name: 'E-commerce', revLow: 0.5, revMid: 1.5, revHigh: 3, evEbitda: 10 },
            healthcare: { name: 'Healthcare', revLow: 1.5, revMid: 3, revHigh: 5, evEbitda: 12 },
            manufacturing: { name: 'Manufacturing', revLow: 0.5, revMid: 1, revHigh: 2, evEbitda: 6 },
            retail: { name: 'Retail', revLow: 0.3, revMid: 0.6, revHigh: 1.2, evEbitda: 5 },
            banking: { name: 'Banking', revLow: 1, revMid: 2, revHigh: 3, evEbitda: 8 }
        };

        const data = industryData[industry];
        let revMultiple = growth === 'low' ? data.revLow : growth === 'high' ? data.revHigh : data.revMid;

        const revValue = revenue * revMultiple;
        const ebitdaValue = ebitda * data.evEbitda;

        const result = document.getElementById('rmResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-search"></i> ${data.name} Multiples</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Revenue Multiple Range</span>
                    <span class="result-value">${data.revLow}x - ${data.revHigh}x</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Your Multiple (${growth} growth)</span>
                    <span class="result-value">${revMultiple}x</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Revenue Valuation</span>
                    <span class="result-value">${formatINR(revValue)} L</span>
                </div>
                <div class="result-row">
                    <span class="result-label">EV/EBITDA Multiple</span>
                    <span class="result-value">${data.evEbitda}x</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">EBITDA Valuation</span>
                    <span class="result-value">${formatINR(ebitdaValue)} L</span>
                </div>
            </div>`;
    });
}

// NPV & IRR Calculator
function initNPVIRRCalculator() {
    const btn = document.getElementById('calculateNPV');
    const addBtn = document.getElementById('addNpvYear');
    if (!btn) return;

    let yearCount = 3;

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            yearCount++;
            const container = document.getElementById('npvCashflowRows');
            const row = document.createElement('div');
            row.className = 'cashflow-row';
            row.innerHTML = `<span>Year ${yearCount}</span><input type="number" class="npv-cf" placeholder="e.g., 2000000">`;
            container.appendChild(row);
        });
    }

    btn.addEventListener('click', () => {
        const initial = parseNum(document.getElementById('npvInitial').value);
        const rate = parseNum(document.getElementById('npvRate').value) / 100;
        const cfInputs = document.querySelectorAll('.npv-cf');

        if (!initial) return alert('Please enter initial investment');

        const cashflows = [-initial];
        cfInputs.forEach(input => {
            cashflows.push(parseNum(input.value));
        });

        // Calculate NPV
        let npv = 0;
        cashflows.forEach((cf, i) => {
            npv += cf / Math.pow(1 + rate, i);
        });

        // Calculate IRR using Newton-Raphson
        let irr = 0.1;
        for (let iter = 0; iter < 100; iter++) {
            let npvCalc = 0, derivative = 0;
            cashflows.forEach((cf, i) => {
                npvCalc += cf / Math.pow(1 + irr, i);
                if (i > 0) derivative -= i * cf / Math.pow(1 + irr, i + 1);
            });
            if (Math.abs(derivative) < 1e-10) break;
            const newIrr = irr - npvCalc / derivative;
            if (Math.abs(newIrr - irr) < 1e-7) break;
            irr = newIrr;
        }

        // Profitability Index
        const pvInflows = npv + initial;
        const pi = pvInflows / initial;

        const isAcceptable = npv > 0;

        const result = document.getElementById('npvResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-project-diagram"></i> Investment Analysis</h4>
            <div class="result-grid">
                <div class="result-row highlight-purple">
                    <span class="result-label">NPV</span>
                    <span class="result-value">${formatINR(npv)}</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">IRR</span>
                    <span class="result-value">${(irr * 100).toFixed(2)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Profitability Index</span>
                    <span class="result-value">${pi.toFixed(2)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Hurdle Rate (WACC)</span>
                    <span class="result-value">${(rate * 100).toFixed(1)}%</span>
                </div>
            </div>
            <div class="recommendation-box" style="margin-top:1rem;">
                <i class="fas ${isAcceptable ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <h4>${isAcceptable ? 'PROJECT IS ACCEPTABLE ✅' : 'PROJECT SHOULD BE REJECTED ❌'}</h4>
                <p>IRR (${(irr * 100).toFixed(2)}%) ${irr > rate ? '>' : '<'} Hurdle Rate (${(rate * 100)}%)</p>
            </div>`;
    });
}

// Payback Period Calculator
function initPaybackCalculator() {
    const btn = document.getElementById('calculatePayback');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const initial = parseNum(document.getElementById('pbInitial').value);
        const rate = parseNum(document.getElementById('pbRate').value) / 100;
        const annualCF = parseNum(document.getElementById('pbAnnualCF').value);
        const life = parseNum(document.getElementById('pbLife').value);

        // Simple Payback
        const simplePayback = initial / annualCF;

        // Discounted Payback
        let cumulative = 0;
        let discPayback = life;
        for (let i = 1; i <= life; i++) {
            const pvCF = annualCF / Math.pow(1 + rate, i);
            cumulative += pvCF;
            if (cumulative >= initial && discPayback === life) {
                const prevCum = cumulative - pvCF;
                discPayback = (i - 1) + (initial - prevCum) / pvCF;
            }
        }

        const result = document.getElementById('paybackResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-history"></i> Payback Analysis</h4>
            <div class="result-grid">
                <div class="result-row highlight-purple">
                    <span class="result-label">Simple Payback Period</span>
                    <span class="result-value">${simplePayback.toFixed(2)} years</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Discounted Payback Period</span>
                    <span class="result-value">${discPayback.toFixed(2)} years</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Project Life</span>
                    <span class="result-value">${life} years</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Post-Payback Period</span>
                    <span class="result-value">${(life - simplePayback).toFixed(2)} years</span>
                </div>
            </div>`;
    });
}

// LBO Model Simulator
function initLBOModel() {
    const btn = document.getElementById('calculateLBO');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const ev = parseNum(document.getElementById('lboEV').value);
        const debtPct = parseNum(document.getElementById('lboDebtPct').value) / 100;
        const ebitda = parseNum(document.getElementById('lboEbitda').value);
        const growth = parseNum(document.getElementById('lboGrowth').value) / 100;
        const exitMultiple = parseNum(document.getElementById('lboExitMultiple').value);
        const years = parseNum(document.getElementById('lboYears').value);
        const interest = parseNum(document.getElementById('lboInterest').value) / 100;
        const debtRepay = parseNum(document.getElementById('lboDebtRepay').value);

        const initialDebt = ev * debtPct;
        const initialEquity = ev - initialDebt;

        // Exit EBITDA
        const exitEbitda = ebitda * Math.pow(1 + growth, years);
        const exitEV = exitEbitda * exitMultiple;

        // Remaining debt
        const remainingDebt = Math.max(0, initialDebt - (debtRepay * years));

        // Exit equity value
        const exitEquity = exitEV - remainingDebt;

        // IRR
        const moic = exitEquity / initialEquity;
        const irr = Math.pow(moic, 1 / years) - 1;

        const result = document.getElementById('lboResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-layer-group"></i> LBO Returns</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Initial Equity</span>
                    <span class="result-value">${formatINR(initialEquity)} Cr</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Exit EBITDA</span>
                    <span class="result-value">${formatINR(exitEbitda)} Cr</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Exit Enterprise Value</span>
                    <span class="result-value">${formatINR(exitEV)} Cr</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Exit Equity Value</span>
                    <span class="result-value">${formatINR(exitEquity)} Cr</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">MOIC (Multiple)</span>
                    <span class="result-value">${moic.toFixed(2)}x</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">IRR</span>
                    <span class="result-value">${(irr * 100).toFixed(1)}%</span>
                </div>
            </div>`;
    });
}

// Break-Even Analysis
function initBreakevenCalculator() {
    const btn = document.getElementById('calculateBreakeven');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const fixed = parseNum(document.getElementById('beFixed').value);
        const price = parseNum(document.getElementById('bePrice').value);
        const variable = parseNum(document.getElementById('beVariable').value);
        const currentSales = parseNum(document.getElementById('beCurrentSales').value);
        const targetProfit = parseNum(document.getElementById('beTargetProfit').value);

        const contribution = price - variable;
        const contributionRatio = contribution / price;

        // Break-even units
        const beUnits = fixed / contribution;
        const beRevenue = beUnits * price;

        // For target profit
        const targetUnits = (fixed + targetProfit) / contribution;

        // Margin of Safety
        const mos = ((currentSales - beUnits) / currentSales * 100);

        // Operating Leverage
        const opLeverage = (currentSales * contribution) / ((currentSales * contribution) - fixed);

        const result = document.getElementById('breakevenResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-equals"></i> Break-Even Analysis</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Contribution per Unit</span>
                    <span class="result-value">${formatINR(contribution)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Contribution Margin</span>
                    <span class="result-value">${(contributionRatio * 100).toFixed(1)}%</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Break-Even (Units)</span>
                    <span class="result-value">${Math.ceil(beUnits).toLocaleString()}</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Break-Even (Revenue)</span>
                    <span class="result-value">${formatINR(beRevenue)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Units for Target Profit</span>
                    <span class="result-value">${Math.ceil(targetUnits).toLocaleString()}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Margin of Safety</span>
                    <span class="result-value">${mos.toFixed(1)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Operating Leverage</span>
                    <span class="result-value">${opLeverage.toFixed(2)}x</span>
                </div>
            </div>`;
    });
}

// Working Capital Calculator
function initWorkingCapitalCalculator() {
    const btn = document.getElementById('calculateWC');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const ca = parseNum(document.getElementById('wcCurrentAssets').value);
        const cl = parseNum(document.getElementById('wcCurrentLiab').value);
        const inventory = parseNum(document.getElementById('wcInventory').value);
        const receivables = parseNum(document.getElementById('wcReceivables').value);
        const payables = parseNum(document.getElementById('wcPayables').value);
        const revenue = parseNum(document.getElementById('wcRevenue').value);

        const nwc = ca - cl;
        const currentRatio = ca / cl;
        const quickRatio = (ca - inventory) / cl;
        const wcTurnover = revenue / nwc;

        const result = document.getElementById('wcResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-sync-alt"></i> Working Capital Analysis</h4>
            <div class="result-grid">
                <div class="result-row highlight-purple">
                    <span class="result-label">Net Working Capital</span>
                    <span class="result-value">${formatINR(nwc)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Current Ratio</span>
                    <span class="result-value">${currentRatio.toFixed(2)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Quick Ratio</span>
                    <span class="result-value">${quickRatio.toFixed(2)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Working Capital Turnover</span>
                    <span class="result-value">${wcTurnover.toFixed(2)}x</span>
                </div>
            </div>`;
    });
}

// Cash Conversion Cycle
function initCashConversionCycle() {
    const btn = document.getElementById('calculateCCC');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const inventory = parseNum(document.getElementById('cccInventory').value);
        const cogs = parseNum(document.getElementById('cccCOGS').value);
        const receivables = parseNum(document.getElementById('cccReceivables').value);
        const revenue = parseNum(document.getElementById('cccRevenue').value);
        const payables = parseNum(document.getElementById('cccPayables').value);

        const dio = (inventory / cogs) * 365;
        const dso = (receivables / revenue) * 365;
        const dpo = (payables / cogs) * 365;
        const ccc = dio + dso - dpo;

        const result = document.getElementById('cccResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-clock"></i> Cash Conversion Cycle</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Days Inventory Outstanding (DIO)</span>
                    <span class="result-value">${dio.toFixed(0)} days</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Days Sales Outstanding (DSO)</span>
                    <span class="result-value">${dso.toFixed(0)} days</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Days Payables Outstanding (DPO)</span>
                    <span class="result-value">${dpo.toFixed(0)} days</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Cash Conversion Cycle</span>
                    <span class="result-value">${ccc.toFixed(0)} days</span>
                </div>
            </div>
            <div class="info-box" style="margin-top:1rem;">
                <p>CCC = DIO + DSO - DPO = ${dio.toFixed(0)} + ${dso.toFixed(0)} - ${dpo.toFixed(0)} = ${ccc.toFixed(0)} days</p>
            </div>`;
    });
}

// Dilution Calculator
function initDilutionCalculator() {
    const btn = document.getElementById('calculateDilution');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const currentOwn = parseNum(document.getElementById('dilCurrentOwn').value);
        const preMoney = parseNum(document.getElementById('dilPreMoney').value);
        const investment = parseNum(document.getElementById('dilInvestment').value);
        const esopPool = parseNum(document.getElementById('dilEsop').value);

        const postMoney = preMoney + investment;
        const investorOwn = (investment / postMoney) * 100;
        const founderPostInvestor = currentOwn - (currentOwn * investorOwn / 100);
        const founderFinal = founderPostInvestor * (100 - esopPool) / 100;
        const dilution = currentOwn - founderFinal;

        const result = document.getElementById('dilutionResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-compress-arrows-alt"></i> Dilution Analysis</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Post-Money Valuation</span>
                    <span class="result-value">${formatINR(postMoney)} Cr</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Investor Ownership</span>
                    <span class="result-value">${investorOwn.toFixed(2)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">ESOP Pool</span>
                    <span class="result-value">${esopPool}%</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Founder Final Ownership</span>
                    <span class="result-value">${founderFinal.toFixed(2)}%</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Total Dilution</span>
                    <span class="result-value">${dilution.toFixed(2)}%</span>
                </div>
            </div>`;
    });
}

// ESOP Value Calculator
function initESOPCalculator() {
    const btn = document.getElementById('calculateESOP');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const options = parseNum(document.getElementById('esopOptions').value);
        const strike = parseNum(document.getElementById('esopStrike').value);
        const fmv = parseNum(document.getElementById('esopFMV').value);
        const vesting = parseNum(document.getElementById('esopVesting').value);
        const taxRate = parseNum(document.getElementById('esopTax').value) / 100;

        const intrinsicValue = (fmv - strike) * options;
        const taxOnExercise = (fmv - strike) * options * taxRate;
        const netValue = intrinsicValue - taxOnExercise;
        const valuePerYear = netValue / vesting;

        const result = document.getElementById('esopResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-users"></i> ESOP Value</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Number of Options</span>
                    <span class="result-value">${options.toLocaleString()}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Gain per Option</span>
                    <span class="result-value">₹${(fmv - strike).toLocaleString()}</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Total Intrinsic Value</span>
                    <span class="result-value">${formatINR(intrinsicValue)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Tax on Exercise (${(taxRate * 100)}%)</span>
                    <span class="result-value">${formatINR(taxOnExercise)}</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Net Value After Tax</span>
                    <span class="result-value">${formatINR(netValue)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Value Per Year (Vested)</span>
                    <span class="result-value">${formatINR(valuePerYear)}</span>
                </div>
            </div>`;
    });
}

// Merger Synergy Calculator
function initSynergyCalculator() {
    const btn = document.getElementById('calculateSynergy');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const acqRev = parseNum(document.getElementById('synAcqRev').value);
        const targetRev = parseNum(document.getElementById('synTargetRev').value);
        const revSynergy = parseNum(document.getElementById('synRevSynergy').value) / 100;
        const costSaving = parseNum(document.getElementById('synCostSaving').value);
        const integration = parseNum(document.getElementById('synIntegration').value);
        const years = parseNum(document.getElementById('synYears').value);

        const combinedRev = acqRev + targetRev;
        const revSynergyVal = combinedRev * revSynergy;
        const totalSynergy = revSynergyVal + costSaving;
        const netSynergy = totalSynergy - integration;
        const annualSynergy = netSynergy / years;

        const result = document.getElementById('synergyResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-handshake"></i> Synergy Analysis</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Combined Revenue</span>
                    <span class="result-value">${formatINR(combinedRev)} Cr</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Revenue Synergy (${(revSynergy * 100)}%)</span>
                    <span class="result-value">${formatINR(revSynergyVal)} Cr</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Cost Synergy</span>
                    <span class="result-value">${formatINR(costSaving)} Cr</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Integration Costs</span>
                    <span class="result-value">(${formatINR(integration)}) Cr</span>
                </div>
                <div class="result-row highlight-purple">
                    <span class="result-label">Net Synergy Value</span>
                    <span class="result-value">${formatINR(netSynergy)} Cr</span>
                </div>
            </div>`;
    });
}

// ==================== ACCOUNTING CALCULATORS ====================

// Depreciation Calculator
function initDepreciationCalculator() {
    const btn = document.getElementById('calculateDepreciation');
    const modeButtons = document.querySelectorAll('#depreciation-calc .mode-btn');
    if (!btn) return;

    let currentMode = 'slm';

    modeButtons.forEach(modeBtn => {
        modeBtn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            modeBtn.classList.add('active');
            currentMode = modeBtn.dataset.mode;

            document.querySelectorAll('.wdv-field').forEach(el => el.classList.toggle('hidden', currentMode !== 'wdv'));
            document.querySelectorAll('.units-field').forEach(el => el.classList.toggle('hidden', currentMode !== 'units'));
        });
    });

    btn.addEventListener('click', () => {
        const cost = parseNum(document.getElementById('depCost').value);
        const salvage = parseNum(document.getElementById('depSalvage').value);
        const life = parseNum(document.getElementById('depLife').value);

        let depreciation, method;

        if (currentMode === 'slm') {
            depreciation = (cost - salvage) / life;
            method = 'Straight Line Method';
        } else if (currentMode === 'wdv') {
            const rate = parseNum(document.getElementById('depWdvRate').value) / 100;
            depreciation = cost * rate;
            method = 'Written Down Value';
        } else {
            const totalUnits = parseNum(document.getElementById('depTotalUnits').value);
            const unitsYear = parseNum(document.getElementById('depUnitsYear').value);
            depreciation = ((cost - salvage) / totalUnits) * unitsYear;
            method = 'Units of Production';
        }

        const bookValue = cost - depreciation;

        const result = document.getElementById('depResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-chart-line"></i> Depreciation (${method})</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Asset Cost</span>
                    <span class="result-value">${formatINR(cost)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Salvage Value</span>
                    <span class="result-value">${formatINR(salvage)}</span>
                </div>
                <div class="result-row highlight-teal">
                    <span class="result-label">Annual Depreciation</span>
                    <span class="result-value">${formatINR(depreciation)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Book Value (After Year 1)</span>
                    <span class="result-value">${formatINR(bookValue)}</span>
                </div>
            </div>`;
    });
}

// Lease Accounting (Ind AS 116)
function initLeaseAccounting() {
    const btn = document.getElementById('calculateLease');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const payment = parseNum(document.getElementById('leasePayment').value);
        const term = parseNum(document.getElementById('leaseTerm').value);
        const ibr = parseNum(document.getElementById('leaseIBR').value) / 100 / 12;
        const idc = parseNum(document.getElementById('leaseIDC').value);

        // PV of lease payments
        let pvLeasePayments = 0;
        for (let i = 1; i <= term; i++) {
            pvLeasePayments += payment / Math.pow(1 + ibr, i);
        }

        const rouAsset = pvLeasePayments + idc;
        const leaseLiability = pvLeasePayments;
        const monthlyDepreciation = rouAsset / term;
        const firstMonthInterest = leaseLiability * ibr;

        const result = document.getElementById('leaseResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-file-contract"></i> Ind AS 116 Calculation</h4>
            <div class="result-grid">
                <div class="result-row highlight-teal">
                    <span class="result-label">ROU Asset</span>
                    <span class="result-value">${formatINR(rouAsset)}</span>
                </div>
                <div class="result-row highlight-teal">
                    <span class="result-label">Lease Liability</span>
                    <span class="result-value">${formatINR(leaseLiability)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Monthly Depreciation</span>
                    <span class="result-value">${formatINR(monthlyDepreciation)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">First Month Interest</span>
                    <span class="result-value">${formatINR(firstMonthInterest)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Total Payments</span>
                    <span class="result-value">${formatINR(payment * term)}</span>
                </div>
            </div>`;
    });
}

// Deferred Tax Calculator
function initDeferredTaxCalculator() {
    const btn = document.getElementById('calculateDTA');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const bookValue = parseNum(document.getElementById('dtaBookValue').value);
        const taxBase = parseNum(document.getElementById('dtaTaxBase').value);
        const taxRate = parseNum(document.getElementById('dtaTaxRate').value) / 100;
        const type = document.getElementById('dtaType').value;

        const difference = bookValue - taxBase;
        const deferredTax = Math.abs(difference) * taxRate;

        let dtaOrDtl, explanation;
        if (type === 'asset') {
            // For assets: Book > Tax = DTL, Book < Tax = DTA
            dtaOrDtl = difference > 0 ? 'Deferred Tax Liability (DTL)' : 'Deferred Tax Asset (DTA)';
            explanation = difference > 0 ? 'Book depreciation < Tax depreciation' : 'Book depreciation > Tax depreciation';
        } else {
            dtaOrDtl = difference > 0 ? 'Deferred Tax Asset (DTA)' : 'Deferred Tax Liability (DTL)';
            explanation = 'Provision recognized in books but not for tax';
        }

        const result = document.getElementById('dtaResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-hourglass-half"></i> Deferred Tax</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Book Value</span>
                    <span class="result-value">${formatINR(bookValue)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Tax Base</span>
                    <span class="result-value">${formatINR(taxBase)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Temporary Difference</span>
                    <span class="result-value">${formatINR(Math.abs(difference))}</span>
                </div>
                <div class="result-row highlight-teal">
                    <span class="result-label">${dtaOrDtl}</span>
                    <span class="result-value">${formatINR(deferredTax)}</span>
                </div>
            </div>
            <div class="info-box" style="margin-top:1rem;">
                <p>${explanation}</p>
            </div>`;
    });
}

// Forex Gain/Loss Calculator
function initForexCalculator() {
    const btn = document.getElementById('calculateForex');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const amount = parseNum(document.getElementById('forexAmount').value);
        const currency = document.getElementById('forexCurrency').value;
        const txnRate = parseNum(document.getElementById('forexTxnRate').value);
        const settleRate = parseNum(document.getElementById('forexSettleRate').value);
        const txnType = document.getElementById('forexTxnType').value;

        const txnValue = amount * txnRate;
        const settleValue = amount * settleRate;
        let gainLoss = settleValue - txnValue;

        // For receivables: higher rate = gain, for payables: higher rate = loss
        if (txnType === 'payable') gainLoss = -gainLoss;

        const isGain = gainLoss > 0;

        const result = document.getElementById('forexResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-exchange-alt"></i> Forex Impact</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">${currency} Amount</span>
                    <span class="result-value">${amount.toLocaleString()} ${currency}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Value at Transaction Rate</span>
                    <span class="result-value">${formatINR(txnValue)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Value at Settlement Rate</span>
                    <span class="result-value">${formatINR(settleValue)}</span>
                </div>
                <div class="result-row highlight-teal">
                    <span class="result-label">Forex ${isGain ? 'Gain' : 'Loss'}</span>
                    <span class="result-value">${isGain ? '+' : ''}${formatINR(gainLoss)}</span>
                </div>
            </div>`;
    });
}

// Inventory Valuation
function initInventoryValuation() {
    const btn = document.getElementById('calculateInventory');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const openUnits = parseNum(document.getElementById('invOpenUnits').value);
        const openPrice = parseNum(document.getElementById('invOpenPrice').value);
        const p1Units = parseNum(document.getElementById('invPurch1Units').value);
        const p1Price = parseNum(document.getElementById('invPurch1Price').value);
        const p2Units = parseNum(document.getElementById('invPurch2Units').value);
        const p2Price = parseNum(document.getElementById('invPurch2Price').value);
        const soldUnits = parseNum(document.getElementById('invSoldUnits').value);
        const sellPrice = parseNum(document.getElementById('invSellPrice').value);

        const totalUnits = openUnits + p1Units + p2Units;
        const totalCost = (openUnits * openPrice) + (p1Units * p1Price) + (p2Units * p2Price);
        const closingUnits = totalUnits - soldUnits;

        // FIFO COGS
        let fifoCogsUnits = soldUnits;
        let fifoCogs = 0;
        const layers = [
            { units: openUnits, price: openPrice },
            { units: p1Units, price: p1Price },
            { units: p2Units, price: p2Price }
        ];
        for (let layer of layers) {
            if (fifoCogsUnits <= 0) break;
            const used = Math.min(fifoCogsUnits, layer.units);
            fifoCogs += used * layer.price;
            fifoCogsUnits -= used;
        }
        const fifoClosing = totalCost - fifoCogs;
        const fifoProfit = (soldUnits * sellPrice) - fifoCogs;

        // Weighted Average
        const avgPrice = totalCost / totalUnits;
        const avgCogs = soldUnits * avgPrice;
        const avgClosing = closingUnits * avgPrice;
        const avgProfit = (soldUnits * sellPrice) - avgCogs;

        // LIFO COGS
        let lifoCogsUnits = soldUnits;
        let lifoCogs = 0;
        const lifoLayers = [...layers].reverse();
        for (let layer of lifoLayers) {
            if (lifoCogsUnits <= 0) break;
            const used = Math.min(lifoCogsUnits, layer.units);
            lifoCogs += used * layer.price;
            lifoCogsUnits -= used;
        }
        const lifoClosing = totalCost - lifoCogs;
        const lifoProfit = (soldUnits * sellPrice) - lifoCogs;

        const result = document.getElementById('inventoryResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-boxes"></i> Inventory Valuation Comparison</h4>
            <table class="projection-table" style="margin-top:1rem;">
                <thead>
                    <tr><th>Method</th><th>COGS</th><th>Closing Stock</th><th>Gross Profit</th></tr>
                </thead>
                <tbody>
                    <tr><td>FIFO</td><td>${formatINR(fifoCogs)}</td><td>${formatINR(fifoClosing)}</td><td>${formatINR(fifoProfit)}</td></tr>
                    <tr><td>Weighted Avg</td><td>${formatINR(avgCogs)}</td><td>${formatINR(avgClosing)}</td><td>${formatINR(avgProfit)}</td></tr>
                    <tr><td>LIFO</td><td>${formatINR(lifoCogs)}</td><td>${formatINR(lifoClosing)}</td><td>${formatINR(lifoProfit)}</td></tr>
                </tbody>
            </table>
            <div class="info-box" style="margin-top:1rem;">
                <p>Note: LIFO is not permitted under Ind AS. FIFO and Weighted Average are commonly used.</p>
            </div>`;
    });
}

// ==================== PHASE 1 NEW CALCULATORS ====================

// Crypto/VDA Tax Calculator
function initCryptoTaxCalculator() {
    const btn = document.getElementById('calculateCryptoTax');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const txnType = document.getElementById('cryptoTxnType').value;
        const buyPrice = parseNum(document.getElementById('cryptoBuyPrice').value);
        const sellPrice = parseNum(document.getElementById('cryptoSellPrice').value);
        const qty = parseNum(document.getElementById('cryptoQty').value) || 1;

        const totalBuy = buyPrice * qty;
        const totalSell = sellPrice * qty;

        // For mining/staking/airdrop, cost is 0
        let costOfAcquisition = totalBuy;
        if (['mining', 'staking', 'airdrop'].includes(txnType)) {
            costOfAcquisition = 0;
        }

        const gain = totalSell - costOfAcquisition;
        const taxableGain = Math.max(0, gain);
        const taxAmount = taxableGain * 0.30; // 30% flat tax
        const surcharge = taxableGain > 5000000 ? taxAmount * 0.10 : 0;
        const cess = (taxAmount + surcharge) * 0.04;
        const totalTax = taxAmount + surcharge + cess;

        // TDS (1% if > 10000)
        const tds = totalSell > 10000 ? totalSell * 0.01 : 0;

        const result = document.getElementById('cryptoResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fab fa-bitcoin"></i>
                <h3>Crypto Tax Calculation</h3>
            </div>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Sale Value</span>
                    <span class="result-value">${formatINR(totalSell)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Cost of Acquisition</span>
                    <span class="result-value">${formatINR(costOfAcquisition)}</span>
                </div>
                <div class="result-row ${gain >= 0 ? 'highlight-green' : 'highlight'}">
                    <span class="result-label">${gain >= 0 ? 'Gain' : 'Loss'}</span>
                    <span class="result-value">${formatINR(Math.abs(gain))}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Tax @ 30%</span>
                    <span class="result-value">${formatINR(taxAmount)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Surcharge + Cess</span>
                    <span class="result-value">${formatINR(surcharge + cess)}</span>
                </div>
                <div class="result-row grand-total">
                    <span class="result-label">Total Tax Payable</span>
                    <span class="result-value">${formatINR(totalTax)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">TDS Deducted (1%)</span>
                    <span class="result-value">${formatINR(tds)}</span>
                </div>
            </div>
            <div class="info-box" style="margin-top:1rem;">
                <p><strong>Note:</strong> Losses from crypto cannot be set off against other income or carried forward. No deductions allowed except cost of acquisition.</p>
            </div>`;
    });
}

// Agricultural Income Tax Calculator
function initAgriculturalTaxCalculator() {
    const btn = document.getElementById('calculateAgriTax');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const agriIncome = parseNum(document.getElementById('agriIncome').value);
        const nonAgriIncome = parseNum(document.getElementById('nonAgriIncome').value);
        const ageGroup = document.getElementById('agriAge').value;
        const regime = document.getElementById('agriRegime').value;
        const agriType = document.getElementById('agriType').value;

        // Adjust for composite income (tea, coffee, rubber)
        let effectiveAgriIncome = agriIncome;
        const agriPercentages = {
            'general': 1.0,
            'tea': 0.6,
            'coffee-cured': 0.25,
            'coffee-grown': 0.6,
            'rubber': 0.65
        };
        effectiveAgriIncome = agriIncome * (agriPercentages[agriType] || 1.0);
        const businessIncome = agriIncome - effectiveAgriIncome;

        // Get basic exemption
        const exemptions = {
            'general': 250000,
            'senior': 300000,
            'supersenior': 500000
        };
        const basicExemption = exemptions[ageGroup] || 250000;

        // Partial Integration Method
        // Step 1: Tax on (Agricultural + Non-Agricultural)
        const totalIncome = effectiveAgriIncome + nonAgriIncome + businessIncome;
        const taxOnTotal = calculateTaxOld(totalIncome, ageGroup);

        // Step 2: Tax on (Agricultural + Basic Exemption)
        const agriPlusExemption = effectiveAgriIncome + basicExemption;
        const taxOnAgriExemption = calculateTaxOld(agriPlusExemption, ageGroup);

        // Step 3: Tax Payable
        const taxPayable = Math.max(0, taxOnTotal - taxOnAgriExemption);
        const cess = taxPayable * 0.04;
        const totalTax = taxPayable + cess;

        const result = document.getElementById('agriResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-seedling"></i>
                <h3>Agricultural Income Tax Calculation</h3>
            </div>
            <div class="info-box">
                <h4><i class="fas fa-calculator"></i> Partial Integration Method</h4>
            </div>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Step 1: Total Income (Agri + Non-Agri)</span>
                    <span class="result-value">${formatINR(totalIncome)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Step 2: Tax on Total Income</span>
                    <span class="result-value">${formatINR(taxOnTotal)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Step 3: Agri Income + Exemption</span>
                    <span class="result-value">${formatINR(agriPlusExemption)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Step 4: Tax on Step 3</span>
                    <span class="result-value">${formatINR(taxOnAgriExemption)}</span>
                </div>
                <div class="result-row highlight">
                    <span class="result-label">Step 5: Tax Payable (Step 2 - Step 4)</span>
                    <span class="result-value">${formatINR(taxPayable)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Health & Education Cess (4%)</span>
                    <span class="result-value">${formatINR(cess)}</span>
                </div>
                <div class="result-row grand-total">
                    <span class="result-label">Total Tax Payable</span>
                    <span class="result-value">${formatINR(totalTax)}</span>
                </div>
            </div>`;
    });

    function calculateTaxOld(income, ageGroup) {
        const exemptions = { 'general': 250000, 'senior': 300000, 'supersenior': 500000 };
        const exempt = exemptions[ageGroup] || 250000;
        if (income <= exempt) return 0;

        let tax = 0;
        if (income > 1000000) tax += (income - 1000000) * 0.30;
        if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.20;
        if (income > exempt) tax += Math.min(income - exempt, 500000 - exempt) * 0.05;
        return tax;
    }
}

// Freelancer Tax Calculator
function initFreelancerTaxCalculator() {
    const btn = document.getElementById('calculateFreelanceTax');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const revenue = parseNum(document.getElementById('freelanceRevenue').value);
        const expenses = parseNum(document.getElementById('freelanceExpenses').value);
        const depreciation = parseNum(document.getElementById('freelanceDepreciation').value);
        const sec80c = Math.min(parseNum(document.getElementById('freelance80c').value), 150000);
        const sec80d = parseNum(document.getElementById('freelance80d').value);
        const regime = document.getElementById('freelanceRegime').value;

        let taxableIncome, businessIncome;

        if (regime === 'presumptive') {
            // 44ADA - 50% of gross receipts
            businessIncome = revenue * 0.5;
            taxableIncome = businessIncome - sec80c - sec80d;
        } else if (regime === 'old') {
            businessIncome = revenue - expenses - depreciation;
            taxableIncome = businessIncome - sec80c - sec80d - 50000; // Std deduction
        } else {
            // New regime - no deductions
            businessIncome = revenue - expenses - depreciation;
            taxableIncome = businessIncome;
        }

        taxableIncome = Math.max(0, taxableIncome);

        // Calculate tax based on regime
        let tax;
        if (regime === 'new') {
            tax = calculateTaxNew(taxableIncome);
        } else {
            tax = calculateTaxOld(taxableIncome);
        }

        const cess = tax * 0.04;
        const totalTax = tax + cess;
        const effectiveRate = revenue > 0 ? (totalTax / revenue * 100).toFixed(2) : 0;

        const result = document.getElementById('freelanceResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-laptop-code"></i>
                <h3>Freelancer Tax Calculation</h3>
            </div>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Gross Revenue</span>
                    <span class="result-value">${formatINR(revenue)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Business Income ${regime === 'presumptive' ? '(50% Presumptive)' : ''}</span>
                    <span class="result-value">${formatINR(businessIncome)}</span>
                </div>
                <div class="result-row highlight">
                    <span class="result-label">Taxable Income</span>
                    <span class="result-value">${formatINR(taxableIncome)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Income Tax</span>
                    <span class="result-value">${formatINR(tax)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Cess (4%)</span>
                    <span class="result-value">${formatINR(cess)}</span>
                </div>
                <div class="result-row grand-total">
                    <span class="result-label">Total Tax Payable</span>
                    <span class="result-value">${formatINR(totalTax)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Effective Tax Rate</span>
                    <span class="result-value">${effectiveRate}%</span>
                </div>
            </div>`;
    });

    function calculateTaxOld(income) {
        if (income <= 250000) return 0;
        let tax = 0;
        if (income > 1000000) tax += (income - 1000000) * 0.30;
        if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.20;
        if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
        return tax;
    }

    function calculateTaxNew(income) {
        if (income <= 300000) return 0;
        let tax = 0;
        const slabs = [
            [1500000, Infinity, 0.30],
            [1200000, 1500000, 0.20],
            [900000, 1200000, 0.15],
            [600000, 900000, 0.10],
            [300000, 600000, 0.05]
        ];
        for (let [lower, upper, rate] of slabs) {
            if (income > lower) tax += (Math.min(income, upper) - lower) * rate;
        }
        return tax;
    }
}

// RCM Calculator
function initRCMCalculator() {
    const btn = document.getElementById('calculateRCM');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const category = document.getElementById('rcmCategory').value;
        const value = parseNum(document.getElementById('rcmValue').value);
        const supplyType = document.getElementById('rcmSupplyType').value;

        // Get GST rate based on category
        const rates = {
            'gta-5': 5, 'gta-12': 12, 'legal': 18, 'director': 18,
            'security': 18, 'rent-vehicle': 5, 'govt': 18, 'sponsor': 18, 'recovery': 18
        };
        const itcEligible = !['gta-5', 'rent-vehicle'].includes(category);
        const rate = rates[category] || 18;

        const gstAmount = value * rate / 100;
        let cgst = 0, sgst = 0, igst = 0;

        if (supplyType === 'intra') {
            cgst = gstAmount / 2;
            sgst = gstAmount / 2;
        } else {
            igst = gstAmount;
        }

        const totalValue = value + gstAmount;

        const result = document.getElementById('rcmResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-undo-alt"></i>
                <h3>RCM Liability Calculation</h3>
            </div>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Invoice Value (Excl. GST)</span>
                    <span class="result-value">${formatINR(value)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">GST Rate</span>
                    <span class="result-value">${rate}%</span>
                </div>
                ${supplyType === 'intra' ? `
                <div class="result-row">
                    <span class="result-label">CGST @ ${rate / 2}%</span>
                    <span class="result-value">${formatINR(cgst)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">SGST @ ${rate / 2}%</span>
                    <span class="result-value">${formatINR(sgst)}</span>
                </div>
                ` : `
                <div class="result-row">
                    <span class="result-label">IGST @ ${rate}%</span>
                    <span class="result-value">${formatINR(igst)}</span>
                </div>
                `}
                <div class="result-row highlight-green">
                    <span class="result-label">Total RCM Liability</span>
                    <span class="result-value">${formatINR(gstAmount)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">ITC Eligible</span>
                    <span class="result-value">${itcEligible ? '✅ Yes' : '❌ No'}</span>
                </div>
            </div>
            <div class="info-box" style="margin-top:1rem;">
                <p><strong>GSTR-3B:</strong> Report in Table 3.1(d) for RCM liability and Table 4(A)(3) for ITC claim.</p>
            </div>`;
    });
}

// GST Refund Calculator
function initGSTRefundCalculator() {
    const modeBtns = document.querySelectorAll('[data-refund-mode]');
    const btn = document.getElementById('calculateRefund');
    if (!btn) return;

    let currentMode = 'export';

    modeBtns.forEach(b => {
        b.addEventListener('click', () => {
            modeBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            currentMode = b.dataset.refundMode;

            document.querySelectorAll('.export-field').forEach(f => f.classList.toggle('hidden', currentMode !== 'export'));
            document.querySelectorAll('.inverted-field').forEach(f => f.classList.toggle('hidden', currentMode !== 'inverted'));
        });
    });

    btn.addEventListener('click', () => {
        let refundAmount = 0;
        let formula = '';

        if (currentMode === 'export') {
            const exportTO = parseNum(document.getElementById('refundExportTurnover').value);
            const inputITC = parseNum(document.getElementById('refundInputITC').value);
            const totalTO = parseNum(document.getElementById('refundTotalTurnover').value);

            // Refund = (Export TO / Total TO) * ITC on Inputs
            refundAmount = totalTO > 0 ? (exportTO / totalTO) * inputITC : 0;
            formula = `(${formatINR(exportTO)} / ${formatINR(totalTO)}) × ${formatINR(inputITC)}`;
        } else if (currentMode === 'inverted') {
            const itcAvailed = parseNum(document.getElementById('refundInvertedITC').value);
            const outputTax = parseNum(document.getElementById('refundOutputTax').value);

            // Refund = ITC Availed - Output Tax
            refundAmount = Math.max(0, itcAvailed - outputTax);
            formula = `${formatINR(itcAvailed)} - ${formatINR(outputTax)}`;
        }

        const result = document.getElementById('refundResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-money-bill-wave"></i>
                <h3>GST Refund Calculation</h3>
            </div>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Refund Type</span>
                    <span class="result-value">${currentMode === 'export' ? 'Export Refund' : 'Inverted Duty'}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Formula</span>
                    <span class="result-value" style="font-size:0.85rem;">${formula}</span>
                </div>
                <div class="result-row grand-total">
                    <span class="result-label">Eligible Refund</span>
                    <span class="result-value">${formatINR(refundAmount)}</span>
                </div>
            </div>`;
    });
}

// FIRE Calculator
function initFIRECalculator() {
    const btn = document.getElementById('calculateFIRE');
    const fireTypeBtns = document.querySelectorAll('.fire-btn');
    if (!btn) return;

    let fireType = 'regular';
    fireTypeBtns.forEach(b => {
        b.addEventListener('click', () => {
            fireTypeBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            fireType = b.dataset.fire;
        });
    });

    btn.addEventListener('click', () => {
        const currentAge = parseNum(document.getElementById('fireCurrentAge').value);
        const targetAge = parseNum(document.getElementById('fireTargetAge').value);
        const lifeExpectancy = parseNum(document.getElementById('fireLifeExpectancy').value);
        const currentExpenses = parseNum(document.getElementById('fireCurrentExpenses').value);
        const postExpenses = parseNum(document.getElementById('firePostExpenses').value);
        const portfolio = parseNum(document.getElementById('firePortfolio').value);
        const savings = parseNum(document.getElementById('fireSavings').value);
        const preReturn = parseNum(document.getElementById('firePreReturn').value) / 100;
        const postReturn = parseNum(document.getElementById('firePostReturn').value) / 100;
        const inflation = parseNum(document.getElementById('fireInflation').value) / 100;
        const swr = parseNum(document.getElementById('fireSWR').value) / 100;

        const yearsToFIRE = targetAge - currentAge;
        const retirementYears = lifeExpectancy - targetAge;

        // Inflation adjusted expenses at FIRE
        const annualExpensesAtFIRE = postExpenses * 12 * Math.pow(1 + inflation, yearsToFIRE);

        // FIRE Number (corpus needed)
        const fireNumber = annualExpensesAtFIRE / swr;

        // Project portfolio growth
        let projectedPortfolio = portfolio;
        const monthlyReturn = preReturn / 12;
        for (let m = 0; m < yearsToFIRE * 12; m++) {
            projectedPortfolio = projectedPortfolio * (1 + monthlyReturn) + savings;
        }

        const gap = fireNumber - projectedPortfolio;
        const onTrack = projectedPortfolio >= fireNumber;

        // Find when FIRE is achieved
        let fireAchievedAge = targetAge;
        let testPortfolio = portfolio;
        for (let y = 0; y <= 50; y++) {
            const annualExp = postExpenses * 12 * Math.pow(1 + inflation, y);
            const neededCorpus = annualExp / swr;
            if (testPortfolio >= neededCorpus) {
                fireAchievedAge = currentAge + y;
                break;
            }
            testPortfolio = testPortfolio * (1 + preReturn) + savings * 12;
        }

        const result = document.getElementById('fireResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-fire-alt"></i>
                <h3>🔥 Your FIRE Analysis</h3>
            </div>
            <div class="big-number fire">${formatINR(fireNumber)}</div>
            <p style="text-align:center;color:var(--text-secondary);margin-bottom:1.5rem;">This is your FIRE Number - the corpus you need</p>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Annual Expenses at FIRE (Inflation Adjusted)</span>
                    <span class="result-value">${formatINR(annualExpensesAtFIRE)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Projected Portfolio at Age ${targetAge}</span>
                    <span class="result-value">${formatINR(projectedPortfolio)}</span>
                </div>
                <div class="result-row ${onTrack ? 'highlight-green' : 'highlight'}">
                    <span class="result-label">${onTrack ? '✅ Surplus' : '⚠️ Gap'}</span>
                    <span class="result-value">${formatINR(Math.abs(gap))}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">FIRE Achievable At</span>
                    <span class="result-value">Age ${fireAchievedAge} 🎉</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Years to FIRE</span>
                    <span class="result-value">${fireAchievedAge - currentAge} years</span>
                </div>
            </div>
            <div class="recommendation-box" style="margin-top:1.5rem;">
                <i class="fas fa-lightbulb"></i>
                <h4>${onTrack ? 'You\'re on track! 🚀' : 'Increase savings or reduce expenses'}</h4>
                <p>${onTrack ?
                `At your current pace, you'll reach FIRE by age ${fireAchievedAge}!` :
                `To reach FIRE by ${targetAge}, save ${formatINR((gap / yearsToFIRE / 12).toFixed(0))} more per month.`}</p>
            </div>`;
    });
}

// Net Worth Calculator
function initNetWorthCalculator() {
    const btn = document.getElementById('calculateNetWorth');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Assets
        const cash = parseNum(document.getElementById('nwCash').value);
        const investments = parseNum(document.getElementById('nwInvestments').value);
        const retirement = parseNum(document.getElementById('nwRetirement').value);
        const realEstate = parseNum(document.getElementById('nwRealEstate').value);
        const vehicles = parseNum(document.getElementById('nwVehicles').value);
        const gold = parseNum(document.getElementById('nwGold').value);
        const otherAssets = parseNum(document.getElementById('nwOtherAssets').value);

        // Liabilities
        const homeLoan = parseNum(document.getElementById('nwHomeLoan').value);
        const carLoan = parseNum(document.getElementById('nwCarLoan').value);
        const personalLoan = parseNum(document.getElementById('nwPersonalLoan').value);
        const creditCard = parseNum(document.getElementById('nwCreditCard').value);
        const otherLiab = parseNum(document.getElementById('nwOtherLiab').value);

        const totalAssets = cash + investments + retirement + realEstate + vehicles + gold + otherAssets;
        const totalLiabilities = homeLoan + carLoan + personalLoan + creditCard + otherLiab;
        const netWorth = totalAssets - totalLiabilities;

        const liquidAssets = cash + investments;
        const illiquidAssets = retirement + realEstate + vehicles + gold + otherAssets;

        const result = document.getElementById('networthResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-chart-pie"></i>
                <h3>Your Net Worth</h3>
            </div>
            <div class="big-number ${netWorth >= 0 ? 'success' : 'warning'}">${formatINR(netWorth)}</div>
            <div class="result-grid">
                <div class="result-row highlight-green">
                    <span class="result-label">Total Assets</span>
                    <span class="result-value">${formatINR(totalAssets)}</span>
                </div>
                <div class="result-row highlight">
                    <span class="result-label">Total Liabilities</span>
                    <span class="result-value">${formatINR(totalLiabilities)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Liquid Assets</span>
                    <span class="result-value">${formatINR(liquidAssets)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Illiquid Assets</span>
                    <span class="result-value">${formatINR(illiquidAssets)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Debt-to-Asset Ratio</span>
                    <span class="result-value">${totalAssets > 0 ? (totalLiabilities / totalAssets * 100).toFixed(1) : 0}%</span>
                </div>
            </div>`;
    });
}

// Budget Planner (50-30-20)
function initBudgetPlanner() {
    const btn = document.getElementById('calculateBudget');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const income = parseNum(document.getElementById('budgetIncome').value);

        const needs = income * 0.5;
        const wants = income * 0.3;
        const savings = income * 0.2;

        const result = document.getElementById('budgetResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-tasks"></i>
                <h3>Your 50-30-20 Budget</h3>
            </div>
            <div class="result-grid">
                <div class="result-row" style="background: #dcfce7;">
                    <span class="result-label">💰 Needs (50%) - Rent, Bills, Groceries</span>
                    <span class="result-value">${formatINR(needs)}</span>
                </div>
                <div class="result-row" style="background: #fef3c7;">
                    <span class="result-label">🎉 Wants (30%) - Entertainment, Dining</span>
                    <span class="result-value">${formatINR(wants)}</span>
                </div>
                <div class="result-row" style="background: #dbeafe;">
                    <span class="result-label">📈 Savings (20%) - Investments, Emergency</span>
                    <span class="result-value">${formatINR(savings)}</span>
                </div>
            </div>
            <div class="info-box" style="margin-top:1rem;">
                <h4>Suggested Breakdown</h4>
                <p><strong>Needs:</strong> Housing ${formatINR(needs * 0.5)}, Utilities ${formatINR(needs * 0.15)}, Groceries ${formatINR(needs * 0.2)}, Transport ${formatINR(needs * 0.15)}</p>
                <p><strong>Savings:</strong> Emergency Fund ${formatINR(savings * 0.25)}, Investments ${formatINR(savings * 0.75)}</p>
            </div>`;
    });
}

// Emergency Fund Calculator
function initEmergencyFundCalculator() {
    const btn = document.getElementById('calculateEmergencyFund');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const expenses = parseNum(document.getElementById('efExpenses').value);
        const emis = parseNum(document.getElementById('efEMIs').value);
        const insurance = parseNum(document.getElementById('efInsurance').value);
        const stability = document.getElementById('efJobStability').value;
        const current = parseNum(document.getElementById('efCurrent').value);
        const monthlySavings = parseNum(document.getElementById('efSavings').value);

        const months = { 'stable': 3, 'moderate': 6, 'unstable': 9, 'business': 12 };
        const targetMonths = months[stability] || 6;

        const monthlyNeed = expenses + emis + insurance;
        const targetFund = monthlyNeed * targetMonths;
        const gap = targetFund - current;
        const monthsToGoal = monthlySavings > 0 ? Math.ceil(gap / monthlySavings) : 0;

        const progress = Math.min(100, (current / targetFund * 100));

        const result = document.getElementById('efResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-first-aid"></i>
                <h3>Emergency Fund Analysis</h3>
            </div>
            <div class="big-number warning">${formatINR(targetFund)}</div>
            <p style="text-align:center;margin-bottom:1rem;">Target Emergency Fund (${targetMonths} months)</p>
            <div class="progress-section" style="margin-bottom:1.5rem;">
                <div class="progress-header">
                    <span>Progress</span>
                    <span>${progress.toFixed(0)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${progress}%"></div>
                </div>
            </div>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Monthly Expenses Covered</span>
                    <span class="result-value">${formatINR(monthlyNeed)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Current Fund</span>
                    <span class="result-value">${formatINR(current)}</span>
                </div>
                <div class="result-row ${gap > 0 ? 'highlight' : 'highlight-green'}">
                    <span class="result-label">${gap > 0 ? 'Gap to Fill' : 'Surplus'}</span>
                    <span class="result-value">${formatINR(Math.abs(gap))}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Months to Goal</span>
                    <span class="result-value">${gap > 0 ? monthsToGoal + ' months' : '✅ Achieved!'}</span>
                </div>
            </div>`;
    });
}

// Debt Payoff Calculator
function initDebtPayoffCalculator() {
    const addBtn = document.getElementById('addDebt');
    const calcBtn = document.getElementById('calculateDebtPayoff');
    const modeBtns = document.querySelectorAll('[data-debt-mode]');
    if (!calcBtn) return;

    let debtMode = 'avalanche';

    modeBtns.forEach(b => {
        b.addEventListener('click', () => {
            modeBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            debtMode = b.dataset.debtMode;
        });
    });

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const container = document.getElementById('debtEntries');
            const entry = document.createElement('div');
            entry.className = 'debt-entry form-grid';
            entry.innerHTML = `
                <div class="form-group">
                    <label>Debt Name</label>
                    <input type="text" class="debt-name" placeholder="e.g., Personal Loan">
                </div>
                <div class="form-group">
                    <label>Balance (₹)</label>
                    <input type="number" class="debt-balance" placeholder="e.g., 100000">
                </div>
                <div class="form-group">
                    <label>Interest Rate (%)</label>
                    <input type="number" class="debt-rate" placeholder="e.g., 15" step="0.1">
                </div>
                <div class="form-group">
                    <label>Min Payment (₹)</label>
                    <input type="number" class="debt-min" placeholder="e.g., 5000">
                </div>`;
            container.appendChild(entry);
        });
    }

    calcBtn.addEventListener('click', () => {
        const entries = document.querySelectorAll('.debt-entry');
        const extra = parseNum(document.getElementById('debtExtra').value);

        let debts = [];
        entries.forEach(entry => {
            const name = entry.querySelector('.debt-name').value || 'Debt';
            const balance = parseNum(entry.querySelector('.debt-balance').value);
            const rate = parseNum(entry.querySelector('.debt-rate').value);
            const minPay = parseNum(entry.querySelector('.debt-min').value);
            if (balance > 0) {
                debts.push({ name, balance, rate, minPay });
            }
        });

        if (debts.length === 0) return;

        // Sort based on strategy
        if (debtMode === 'avalanche') {
            debts.sort((a, b) => b.rate - a.rate); // Highest interest first
        } else {
            debts.sort((a, b) => a.balance - b.balance); // Smallest balance first
        }

        const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
        const totalMinPayment = debts.reduce((sum, d) => sum + d.minPay, 0);
        const totalPayment = totalMinPayment + extra;

        // Simple payoff estimation
        let months = 0;
        let totalInterest = 0;
        let debtsCopy = debts.map(d => ({ ...d }));

        while (debtsCopy.some(d => d.balance > 0) && months < 360) {
            months++;
            let availableExtra = extra;

            for (let d of debtsCopy) {
                if (d.balance <= 0) continue;
                const interest = d.balance * (d.rate / 100 / 12);
                totalInterest += interest;
                d.balance += interest;

                let payment = d.minPay;
                if (d === debtsCopy.find(x => x.balance > 0)) {
                    payment += availableExtra;
                    availableExtra = 0;
                }
                d.balance = Math.max(0, d.balance - payment);
            }
        }

        const result = document.getElementById('debtResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <i class="fas fa-credit-card"></i>
                <h3>Debt Payoff Plan (${debtMode === 'avalanche' ? 'Avalanche' : 'Snowball'})</h3>
            </div>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Total Debt</span>
                    <span class="result-value">${formatINR(totalDebt)}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Monthly Payment</span>
                    <span class="result-value">${formatINR(totalPayment)}</span>
                </div>
                <div class="result-row highlight">
                    <span class="result-label">Payoff Time</span>
                    <span class="result-value">${Math.floor(months / 12)} yrs ${months % 12} mo</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Total Interest Paid</span>
                    <span class="result-value">${formatINR(totalInterest)}</span>
                </div>
            </div>
            <div class="info-box" style="margin-top:1rem;">
                <h4>Payoff Order</h4>
                <p>${debts.map((d, i) => `${i + 1}. ${d.name} (${d.rate}%)`).join(' → ')}</p>
            </div>`;
    });
}

// Invoice Generator
function initInvoiceGenerator() {
    const addBtn = document.getElementById('addInvoiceItem');
    const genBtn = document.getElementById('generateInvoice');
    const downloadBtn = document.getElementById('downloadInvoice');
    if (!genBtn) return;

    // Store invoice data for PDF generation
    let invoiceData = null;

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const container = document.getElementById('invoiceItems');
            const item = document.createElement('div');
            item.className = 'invoice-item form-grid';
            item.innerHTML = `
                <div class="form-group"><label>Description</label><input type="text" class="item-desc" placeholder="Product/Service"></div>
                <div class="form-group"><label>HSN/SAC</label><input type="text" class="item-hsn" placeholder="e.g., 8471"></div>
                <div class="form-group"><label>Qty</label><input type="number" class="item-qty" placeholder="1" value="1"></div>
                <div class="form-group"><label>Rate (₹)</label><input type="number" class="item-rate" placeholder="0"></div>
                <div class="form-group"><label>GST %</label>
                    <select class="item-gst">
                        <option value="0">0%</option><option value="5">5%</option><option value="12">12%</option>
                        <option value="18" selected>18%</option><option value="28">28%</option>
                    </select>
                </div>`;
            container.appendChild(item);
        });
    }

    genBtn.addEventListener('click', () => {
        const sellerName = document.getElementById('invSellerName').value || 'Your Company';
        const sellerGSTIN = document.getElementById('invSellerGSTIN').value || '';
        const sellerAddress = document.getElementById('invSellerAddress').value || '';
        const buyerName = document.getElementById('invBuyerName').value || 'Customer';
        const buyerGSTIN = document.getElementById('invBuyerGSTIN').value || '';
        const buyerAddress = document.getElementById('invBuyerAddress').value || '';
        const invNumber = document.getElementById('invNumber').value || 'INV/001';
        const invDate = document.getElementById('invDate').value || new Date().toISOString().split('T')[0];
        const pos = document.getElementById('invPOS').value;

        const items = [];
        document.querySelectorAll('.invoice-item').forEach(item => {
            const desc = item.querySelector('.item-desc').value;
            const hsn = item.querySelector('.item-hsn').value;
            const qty = parseNum(item.querySelector('.item-qty').value) || 1;
            const rate = parseNum(item.querySelector('.item-rate').value);
            const gst = parseNum(item.querySelector('.item-gst').value);
            if (desc && rate > 0) {
                const taxable = qty * rate;
                const gstAmt = taxable * gst / 100;
                items.push({ desc, hsn, qty, rate, gst, taxable, gstAmt, total: taxable + gstAmt });
            }
        });

        const totalTaxable = items.reduce((s, i) => s + i.taxable, 0);
        const totalGST = items.reduce((s, i) => s + i.gstAmt, 0);
        const grandTotal = totalTaxable + totalGST;

        // Store for PDF
        invoiceData = { sellerName, sellerGSTIN, sellerAddress, buyerName, buyerGSTIN, buyerAddress, invNumber, invDate, pos, items, totalTaxable, totalGST, grandTotal };

        const preview = document.getElementById('invoicePreview');
        preview.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');

        preview.innerHTML = `
            <div style="background:white;padding:2rem;border-radius:8px;color:#333;">
                <div style="display:flex;justify-content:space-between;border-bottom:2px solid #1a237e;padding-bottom:1rem;margin-bottom:1rem;">
                    <div>
                        <h2 style="color:#1a237e;margin:0;">${sellerName}</h2>
                        <p style="margin:0.25rem 0;font-size:0.9rem;">${sellerAddress}</p>
                        <p style="margin:0;font-size:0.9rem;"><strong>GSTIN:</strong> ${sellerGSTIN}</p>
                    </div>
                    <div style="text-align:right;">
                        <h3 style="color:#1a237e;margin:0;">TAX INVOICE</h3>
                        <p style="margin:0.25rem 0;"><strong>Invoice #:</strong> ${invNumber}</p>
                        <p style="margin:0;"><strong>Date:</strong> ${invDate}</p>
                    </div>
                </div>
                <div style="margin-bottom:1rem;">
                    <strong>Bill To:</strong><br>
                    ${buyerName}<br>
                    ${buyerAddress}<br>
                    ${buyerGSTIN ? `GSTIN: ${buyerGSTIN}` : 'B2C Invoice'}
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                    <thead style="background:#1a237e;color:white;">
                        <tr><th style="padding:8px;text-align:left;">Description</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>GST</th><th style="text-align:right;">Total</th></tr>
                    </thead>
                    <tbody>
                        ${items.map(i => `<tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:8px;">${i.desc}</td><td style="text-align:center;">${i.hsn}</td>
                            <td style="text-align:center;">${i.qty}</td><td style="text-align:right;">${formatINR(i.rate)}</td>
                            <td style="text-align:right;">${formatINR(i.taxable)}</td><td style="text-align:center;">${i.gst}%</td>
                            <td style="text-align:right;">${formatINR(i.total)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                <div style="display:flex;justify-content:flex-end;margin-top:1rem;">
                    <table style="width:250px;">
                        <tr><td>Taxable Value</td><td style="text-align:right;">${formatINR(totalTaxable)}</td></tr>
                        ${pos === 'same' ? `
                            <tr><td>CGST</td><td style="text-align:right;">${formatINR(totalGST / 2)}</td></tr>
                            <tr><td>SGST</td><td style="text-align:right;">${formatINR(totalGST / 2)}</td></tr>
                        ` : `<tr><td>IGST</td><td style="text-align:right;">${formatINR(totalGST)}</td></tr>`}
                        <tr style="font-weight:bold;font-size:1.1rem;border-top:2px solid #1a237e;">
                            <td style="padding-top:8px;">Grand Total</td><td style="text-align:right;padding-top:8px;">${formatINR(grandTotal)}</td>
                        </tr>
                    </table>
                </div>
            </div>`;
    });

    // PDF Download for Invoice
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!invoiceData || typeof jspdf === 'undefined') {
                alert('Please generate the invoice first!');
                return;
            }
            const { jsPDF } = jspdf;
            const doc = new jsPDF();
            const d = invoiceData;

            // Header
            doc.setFillColor(26, 35, 126);
            doc.rect(0, 0, 210, 35, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('TAX INVOICE', 105, 20, { align: 'center' });

            // Seller Info
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(d.sellerName, 15, 50);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(d.sellerAddress, 15, 57);
            doc.text(`GSTIN: ${d.sellerGSTIN}`, 15, 64);

            // Invoice Details
            doc.setFontSize(10);
            doc.text(`Invoice #: ${d.invNumber}`, 150, 50);
            doc.text(`Date: ${d.invDate}`, 150, 57);

            // Buyer Info
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Bill To:', 15, 78);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(d.buyerName, 15, 85);
            doc.text(d.buyerAddress, 15, 92);
            doc.text(d.buyerGSTIN ? `GSTIN: ${d.buyerGSTIN}` : 'B2C Invoice', 15, 99);

            // Table Header
            let y = 115;
            doc.setFillColor(26, 35, 126);
            doc.rect(15, y - 6, 180, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.text('Description', 17, y);
            doc.text('HSN', 80, y);
            doc.text('Qty', 100, y);
            doc.text('Rate', 115, y);
            doc.text('Taxable', 135, y);
            doc.text('GST%', 160, y);
            doc.text('Total', 180, y);

            // Table Rows
            doc.setTextColor(0, 0, 0);
            y += 10;
            d.items.forEach(item => {
                doc.text(item.desc.substring(0, 25), 17, y);
                doc.text(item.hsn, 80, y);
                doc.text(String(item.qty), 100, y);
                doc.text(formatINR(item.rate).replace('₹', ''), 115, y);
                doc.text(formatINR(item.taxable).replace('₹', ''), 135, y);
                doc.text(`${item.gst}%`, 162, y);
                doc.text(formatINR(item.total).replace('₹', ''), 178, y);
                y += 8;
            });

            // Totals
            y += 10;
            doc.setFont('helvetica', 'bold');
            doc.text('Taxable Value:', 130, y);
            doc.text(formatINR(d.totalTaxable).replace('₹', 'Rs '), 170, y);
            y += 7;
            if (d.pos === 'same') {
                doc.text('CGST:', 130, y);
                doc.text(formatINR(d.totalGST / 2).replace('₹', 'Rs '), 170, y);
                y += 7;
                doc.text('SGST:', 130, y);
                doc.text(formatINR(d.totalGST / 2).replace('₹', 'Rs '), 170, y);
            } else {
                doc.text('IGST:', 130, y);
                doc.text(formatINR(d.totalGST).replace('₹', 'Rs '), 170, y);
            }
            y += 10;
            doc.setFillColor(26, 35, 126);
            doc.rect(125, y - 5, 70, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text('Grand Total:', 130, y + 2);
            doc.text(formatINR(d.grandTotal).replace('₹', 'Rs '), 170, y + 2);

            // Footer
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.text('This is a computer generated invoice.', 105, 280, { align: 'center' });

            doc.save(`Invoice_${d.invNumber.replace(/\//g, '-')}.pdf`);
        });
    }
}

// Receipt Generator
function initReceiptGenerator() {
    const modeBtns = document.querySelectorAll('[data-receipt-mode]');
    const genBtn = document.getElementById('generateReceipt');
    const downloadBtn = document.getElementById('downloadReceipt');
    if (!genBtn) return;

    let receiptMode = 'payment';
    let receiptData = null;

    modeBtns.forEach(b => {
        b.addEventListener('click', () => {
            modeBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            receiptMode = b.dataset.receiptMode;
            document.querySelectorAll('.rent-field').forEach(f => f.classList.toggle('hidden', receiptMode !== 'rent'));
        });
    });

    genBtn.addEventListener('click', () => {
        const from = document.getElementById('receiptFrom').value || 'Payer';
        const amount = parseNum(document.getElementById('receiptAmount').value);
        const date = document.getElementById('receiptDate').value || new Date().toISOString().split('T')[0];
        const number = document.getElementById('receiptNumber').value || 'REC/001';
        const purpose = document.getElementById('receiptPurpose').value || 'Payment';
        const property = document.getElementById('receiptProperty')?.value || '';
        const landlordPAN = document.getElementById('receiptLandlordPAN')?.value || '';

        // Store for PDF
        receiptData = { from, amount, date, number, purpose, property, landlordPAN, mode: receiptMode };

        const result = document.getElementById('receiptResult');
        result.classList.remove('hidden');
        if (downloadBtn) downloadBtn.classList.remove('hidden');

        result.innerHTML = `
            <div style="background:white;padding:2rem;border-radius:8px;color:#333;text-align:center;">
                <h2 style="color:#8b5cf6;border-bottom:2px solid #8b5cf6;padding-bottom:0.5rem;">${receiptMode === 'rent' ? 'RENT RECEIPT' : 'PAYMENT RECEIPT'}</h2>
                <p><strong>Receipt No:</strong> ${number} &nbsp;&nbsp; <strong>Date:</strong> ${date}</p>
                <p style="font-size:1.5rem;margin:1.5rem 0;">Received from <strong>${from}</strong></p>
                <p style="font-size:2rem;font-weight:bold;color:#8b5cf6;">${formatINR(amount)}</p>
                <p style="margin:1rem 0;">For: <strong>${purpose}</strong></p>
                ${receiptMode === 'rent' && property ? `<p style="font-size:0.9rem;color:#666;">Property: ${property}</p>` : ''}
                ${receiptMode === 'rent' && landlordPAN ? `<p style="font-size:0.9rem;color:#666;">Landlord PAN: ${landlordPAN}</p>` : ''}
                <div style="margin-top:2rem;text-align:right;">
                    <p>_______________________</p>
                    <p>Authorized Signature</p>
                </div>
            </div>`;
    });

    // PDF Download for Receipt
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!receiptData || typeof jspdf === 'undefined') {
                alert('Please generate the receipt first!');
                return;
            }
            const { jsPDF } = jspdf;
            const doc = new jsPDF();
            const r = receiptData;

            // Header
            doc.setFillColor(139, 92, 246);
            doc.rect(0, 0, 210, 35, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text(r.mode === 'rent' ? 'RENT RECEIPT' : 'PAYMENT RECEIPT', 105, 22, { align: 'center' });

            // Receipt Details
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Receipt No: ${r.number}`, 15, 50);
            doc.text(`Date: ${r.date}`, 150, 50);

            // Main Content
            doc.setFontSize(14);
            doc.text('Received from:', 15, 75);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(r.from, 15, 85);

            // Amount Box
            doc.setFillColor(139, 92, 246);
            doc.roundedRect(55, 100, 100, 30, 5, 5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text(formatINR(r.amount).replace('₹', 'Rs '), 105, 120, { align: 'center' });

            // Purpose
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('For:', 15, 150);
            doc.setFont('helvetica', 'bold');
            doc.text(r.purpose, 30, 150);

            // Rent details if applicable
            let y = 165;
            if (r.mode === 'rent') {
                doc.setFont('helvetica', 'normal');
                if (r.property) {
                    doc.text(`Property Address: ${r.property}`, 15, y);
                    y += 10;
                }
                if (r.landlordPAN) {
                    doc.text(`Landlord PAN: ${r.landlordPAN}`, 15, y);
                    y += 10;
                }
            }

            // Signature
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text('_______________________', 140, 230);
            doc.text('Authorized Signature', 145, 238);

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text('This is a computer generated receipt.', 105, 280, { align: 'center' });

            doc.save(`Receipt_${r.number.replace(/\//g, '-')}.pdf`);
        });
    }
}

// Financial Glossary
function initFinancialGlossary() {
    const searchInput = document.getElementById('glossarySearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const resultsDiv = document.getElementById('glossaryResults');
    if (!searchInput) return;

    const glossary = [
        { term: 'TDS', category: 'tax', definition: 'Tax Deducted at Source - tax collected at the source of income by the payer.' },
        { term: 'WACC', category: 'finance', definition: 'Weighted Average Cost of Capital - the average rate a company pays to finance its assets.' },
        { term: 'NPV', category: 'finance', definition: 'Net Present Value - the difference between present value of cash inflows and outflows.' },
        { term: 'IRR', category: 'finance', definition: 'Internal Rate of Return - the discount rate that makes NPV of all cash flows zero.' },
        { term: 'CAGR', category: 'investment', definition: 'Compound Annual Growth Rate - the rate of return for an investment to grow from beginning to end.' },
        { term: 'P/E Ratio', category: 'investment', definition: 'Price-to-Earnings Ratio - company\'s stock price divided by earnings per share.' },
        { term: 'ROE', category: 'finance', definition: 'Return on Equity - net income divided by shareholders\' equity, measuring profitability.' },
        { term: 'ITC', category: 'gst', definition: 'Input Tax Credit - GST paid on purchases that can be used to offset GST liability on sales.' },
        { term: 'RCM', category: 'gst', definition: 'Reverse Charge Mechanism - recipient pays GST instead of supplier for specified services.' },
        { term: 'HSN', category: 'gst', definition: 'Harmonized System of Nomenclature - international classification for goods used in GST.' },
        { term: 'EBITDA', category: 'accounting', definition: 'Earnings Before Interest, Taxes, Depreciation and Amortization - measure of operating performance.' },
        { term: 'Working Capital', category: 'finance', definition: 'Current assets minus current liabilities, measuring short-term financial health.' },
        { term: 'Depreciation', category: 'accounting', definition: 'Systematic allocation of asset cost over its useful life.' },
        { term: 'Amortization', category: 'accounting', definition: 'Spreading payments over multiple periods, or writing off intangible asset costs.' },
        { term: 'NPS', category: 'investment', definition: 'National Pension System - government-sponsored retirement savings scheme in India.' },
        { term: 'PPF', category: 'investment', definition: 'Public Provident Fund - long-term savings scheme with tax benefits under Section 80C.' },
        { term: 'SIP', category: 'investment', definition: 'Systematic Investment Plan - regular investment strategy in mutual funds.' },
        { term: 'NAV', category: 'investment', definition: 'Net Asset Value - per-unit value of a mutual fund scheme.' },
        { term: 'CRR', category: 'banking', definition: 'Cash Reserve Ratio - percentage of deposits banks must hold as reserves with RBI.' },
        { term: 'SLR', category: 'banking', definition: 'Statutory Liquidity Ratio - percentage of deposits banks must maintain in liquid assets.' },
        { term: 'Form 16', category: 'tax', definition: 'Certificate of TDS issued by employer showing salary and tax deducted.' },
        { term: 'Section 80C', category: 'tax', definition: 'Income Tax Act provision allowing deduction up to ₹1.5L for specified investments.' },
        { term: 'HRA', category: 'tax', definition: 'House Rent Allowance - salary component with tax exemption rules for rent paid.' },
        { term: 'AY', category: 'tax', definition: 'Assessment Year - year in which income of previous year is assessed and taxed.' },
        { term: 'PAN', category: 'tax', definition: 'Permanent Account Number - 10-character alphanumeric identifier for taxpayers.' }
    ];

    let activeCategory = 'all';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            search();
        });
    });

    function search() {
        const query = searchInput.value.toLowerCase();
        const filtered = glossary.filter(item => {
            const matchesSearch = item.term.toLowerCase().includes(query) || item.definition.toLowerCase().includes(query);
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });

        if (query.length === 0 && activeCategory === 'all') {
            resultsDiv.innerHTML = `<div class="glossary-placeholder"><i class="fas fa-book-open" style="font-size:3rem;color:var(--text-secondary);margin-bottom:1rem;"></i><p>Start typing to search 500+ financial terms</p></div>`;
            return;
        }

        if (filtered.length === 0) {
            resultsDiv.innerHTML = `<div class="glossary-placeholder"><p>No terms found matching "${query}"</p></div>`;
            return;
        }

        resultsDiv.innerHTML = filtered.map(item => `
            <div class="glossary-card">
                <span class="category-tag">${item.category}</span>
                <h4>${item.term}</h4>
                <p>${item.definition}</p>
            </div>
        `).join('');
    }

    searchInput.addEventListener('input', search);
}

// ==================== INVESTMENT TOOLS (PHASE 2) ====================

// SIP Calculator
function initSIPCalculator() {
    const btn = document.getElementById('calculateSIP');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const amount = parseNum(document.getElementById('sipAmount').value);
        const rate = parseFloat(document.getElementById('sipReturn').value) || 12;
        const years = parseInt(document.getElementById('sipYears').value) || 10;

        const totalMonths = years * 12;
        const monthlyRate = rate / 12 / 100;

        // SIP Formula: FV = P × ((1 + r)^n - 1) / r × (1 + r)
        const futureValue = amount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalInvested = amount * totalMonths;
        const wealthGained = futureValue - totalInvested;

        const result = document.getElementById('sipResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> SIP Returns Projection</h3>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Monthly SIP</span>
                    <span class="result-value">${formatINR(amount)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Investment Period</span>
                    <span class="result-value">${years} Years</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Invested</span>
                    <span class="result-value">${formatINR(totalInvested)}</span>
                </div>
                <div class="result-item highlight">
                    <span class="result-label">Expected Returns</span>
                    <span class="result-value highlight-value">${formatINR(wealthGained)}</span>
                </div>
                <div class="result-item total">
                    <span class="result-label">Total Future Value</span>
                    <span class="result-value total-value">${formatINR(futureValue)}</span>
                </div>
            </div>
            <div class="result-tip">
                <i class="fas fa-lightbulb"></i> At ${rate}% annual return, your ₹${amount.toLocaleString('en-IN')} monthly SIP grows to ${formatINR(futureValue)} in ${years} years!
            </div>
        `;
    });
}

// Lumpsum Calculator
function initLumpsumCalculator() {
    const btn = document.getElementById('calculateLumpsum');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const amount = parseNum(document.getElementById('lumpsumAmount').value);
        const rate = parseFloat(document.getElementById('lumpsumReturn').value) || 12;
        const years = parseInt(document.getElementById('lumpsumYears').value) || 10;

        // Compound Interest: FV = P × (1 + r)^n
        const futureValue = amount * Math.pow(1 + rate / 100, years);
        const wealthGained = futureValue - amount;
        const cagr = rate;

        const result = document.getElementById('lumpsumResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h3><i class="fas fa-coins"></i> Lumpsum Investment Projection</h3>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Initial Investment</span>
                    <span class="result-value">${formatINR(amount)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Investment Period</span>
                    <span class="result-value">${years} Years</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Expected Return Rate</span>
                    <span class="result-value">${rate}% p.a.</span>
                </div>
                <div class="result-item highlight">
                    <span class="result-label">Wealth Gained</span>
                    <span class="result-value highlight-value">${formatINR(wealthGained)}</span>
                </div>
                <div class="result-item total">
                    <span class="result-label">Maturity Value</span>
                    <span class="result-value total-value">${formatINR(futureValue)}</span>
                </div>
            </div>
            <div class="result-tip">
                <i class="fas fa-lightbulb"></i> Your investment grows ${(futureValue / amount).toFixed(1)}x in ${years} years with ${rate}% compounding!
            </div>
        `;
    });
}

// PPF Calculator
function initPPFCalculator() {
    const btn = document.getElementById('calculatePPF');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const yearlyContribution = Math.min(parseNum(document.getElementById('ppfAmount').value), 150000);
        const years = parseInt(document.getElementById('ppfYears').value) || 15;
        const rate = parseFloat(document.getElementById('ppfRate').value) || 7.1;

        // PPF calculation with yearly compounding
        let maturityAmount = 0;
        for (let i = 0; i < years; i++) {
            maturityAmount = (maturityAmount + yearlyContribution) * (1 + rate / 100);
        }

        const totalInvested = yearlyContribution * years;
        const interestEarned = maturityAmount - totalInvested;
        const taxSaved = yearlyContribution * 0.3; // Assuming 30% tax bracket

        const result = document.getElementById('ppfResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h3><i class="fas fa-landmark"></i> PPF Maturity Calculation</h3>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Yearly Investment</span>
                    <span class="result-value">${formatINR(yearlyContribution)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Investment Period</span>
                    <span class="result-value">${years} Years</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Invested</span>
                    <span class="result-value">${formatINR(totalInvested)}</span>
                </div>
                <div class="result-item highlight">
                    <span class="result-label">Interest Earned</span>
                    <span class="result-value highlight-value">${formatINR(interestEarned)}</span>
                </div>
                <div class="result-item total">
                    <span class="result-label">Maturity Amount</span>
                    <span class="result-value total-value">${formatINR(maturityAmount)}</span>
                </div>
            </div>
            <div class="result-tip">
                <i class="fas fa-shield-alt"></i> <strong>Tax Benefits:</strong> PPF offers EEE status - investment up to ₹1.5L deductible under 80C, interest tax-free, maturity tax-free!
            </div>
        `;
    });
}

// ==================== AI TAX ASSISTANT ====================
function initAIAssistant() {
    const messagesContainer = document.getElementById('aiChatMessages');
    const userInput = document.getElementById('aiUserInput');
    const sendBtn = document.getElementById('aiSendBtn');

    if (!messagesContainer || !userInput || !sendBtn) return;

    const GEMINI_API_KEY = 'AIzaSyB1bY1DOxG-viHZgVm_OZW-omJZe_B0UnE';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    let conversationHistory = [];

    const systemPrompt = `You are an expert Tax and Financial Assistant for Indian users. Your role is to help with:

1. Income Tax questions (slabs, deductions, exemptions, ITR filing)
2. GST (rates, registration, returns, compliance)
3. Tax saving strategies (80C, 80D, 80G, HRA, NPS, etc.)
4. Financial planning and investments
5. Business taxation and compliance

IMPORTANT GUIDELINES:
- Provide accurate, up-to-date information for Indian taxation (FY 2024-25)
- Use simple language with examples
- Include relevant section numbers when applicable
- If unsure, recommend consulting a CA/tax professional
- Be friendly and use emojis occasionally
- Keep responses concise but comprehensive`;

    function addMessage(text, isUser) {
        const div = document.createElement('div');
        div.className = 'ai-msg ' + (isUser ? 'user' : 'bot');
        div.style.cssText = isUser
            ? 'align-self: flex-end; max-width: 85%; background: linear-gradient(135deg, #E91E63, #9C27B0); color: white; padding: 12px 18px; border-radius: 20px 20px 5px 20px;'
            : 'align-self: flex-start; max-width: 85%; background: white; padding: 15px 20px; border-radius: 20px 20px 20px 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);';

        if (isUser) {
            div.innerHTML = text;
        } else {
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #E91E63, #9C27B0); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;"><i class="fas fa-robot"></i></div>
                    <strong style="color: #E91E63; font-size: 0.9rem;">AI Tax Assistant</strong>
                </div>
                <div style="line-height: 1.7;">${formatResponse(text)}</div>
            `;
        }
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function formatResponse(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '&bull; ')
            .replace(/₹/g, '₹');
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'ai-msg bot typing';
        div.id = 'typingIndicator';
        div.style.cssText = 'align-self: flex-start; background: white; padding: 15px 20px; border-radius: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);';
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #E91E63, #9C27B0); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;"><i class="fas fa-robot"></i></div>
                <span style="color: #666;">AI is thinking<span class="dots">...</span></span>
            </div>
        `;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    async function callGemini(userMessage) {
        // Build simple request - just user message
        const requestBody = {
            contents: [{
                parts: [{ text: systemPrompt + "\n\nUser Question: " + userMessage }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        try {
            console.log('Calling Gemini API...');
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log('Gemini Response:', data);

            if (!response.ok) {
                console.error('Gemini API Error:', data);
                // Show actual error to user for debugging
                const errorMsg = data.error?.message || 'Unknown error';
                return '❌ API Error: ' + errorMsg + '\n\nPlease check if the API key is valid.';
            }

            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!aiResponse) {
                console.error('No response in data:', data);
                return '⚠️ No response received. The API key may need to be enabled for Gemini API.';
            }

            return aiResponse;
        } catch (error) {
            console.error('Fetch Error:', error);
            return '😔 Connection error: ' + error.message + '\n\nPlease check your internet connection.';
        }
    }

    async function processMessage(text) {
        if (!text.trim()) return;

        addMessage(text, true);
        userInput.value = '';
        showTyping();
        sendBtn.disabled = true;

        try {
            const response = await callGemini(text);
            removeTyping();
            addMessage(response, false);
        } catch (error) {
            removeTyping();
            addMessage('Sorry, something went wrong. Please try again!', false);
        }

        sendBtn.disabled = false;
        userInput.focus();
    }

    // Make askAI globally available for quick buttons
    window.askAI = function (question) {
        processMessage(question);
    };

    sendBtn.addEventListener('click', () => processMessage(userInput.value));
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processMessage(userInput.value);
    });
}

// ==================== ENHANCED FEATURES ====================

// Calculator Search
function initCalculatorSearch() {
    const searchInput = document.getElementById('calculatorSearch');
    if (!searchInput) return;

    const allLinks = document.querySelectorAll('.sidebar-link[data-tool]');
    const allSections = document.querySelectorAll('.sidebar-section');

    // Keyboard shortcut Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            resetSearch();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
            resetSearch();
            return;
        }

        let hasMatches = {};

        allLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const toolId = link.dataset.tool.toLowerCase();
            const match = text.includes(query) || toolId.includes(query);

            link.classList.toggle('search-match', match);
            link.style.display = match ? '' : 'none';

            // Track which sections have matches
            const section = link.closest('.sidebar-section');
            if (section && match) {
                hasMatches[section.id || section.className] = true;
            }
        });

        // Hide sections with no matches
        allSections.forEach(section => {
            const hasLinks = Array.from(section.querySelectorAll('.sidebar-link')).some(l => l.style.display !== 'none');
            section.style.display = hasLinks ? '' : 'none';
        });
    });

    function resetSearch() {
        allLinks.forEach(link => {
            link.classList.remove('search-match');
            link.style.display = '';
        });
        allSections.forEach(section => {
            section.style.display = '';
        });
    }
}

// Favorites System
function initFavoritesSystem() {
    const favorites = JSON.parse(localStorage.getItem('calculatorFavorites') || '[]');
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesList = document.getElementById('favoritesList');
    const showFavBtn = document.getElementById('showFavorites');

    if (!showFavBtn || !favoritesSection) return;

    // Add favorite buttons to all sidebar links
    document.querySelectorAll('.sidebar-link[data-tool]').forEach(link => {
        const toolId = link.dataset.tool;
        const favBtn = document.createElement('button');
        favBtn.className = 'favorite-btn' + (favorites.includes(toolId) ? ' favorited' : '');
        favBtn.innerHTML = '<i class="far fa-star"></i>';
        favBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(toolId, favBtn, link);
        };
        link.appendChild(favBtn);
    });

    // Toggle favorites section
    showFavBtn.addEventListener('click', () => {
        showFavBtn.classList.toggle('active');
        favoritesSection.classList.toggle('hidden');
        updateFavoritesList();
    });

    function toggleFavorite(toolId, btn, link) {
        const idx = favorites.indexOf(toolId);
        if (idx > -1) {
            favorites.splice(idx, 1);
            btn.classList.remove('favorited');
            btn.innerHTML = '<i class="far fa-star"></i>';
        } else {
            favorites.push(toolId);
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-star"></i>';
        }
        localStorage.setItem('calculatorFavorites', JSON.stringify(favorites));
        showToast(idx > -1 ? 'Removed from favorites' : 'Added to favorites', 'success');
        updateFavoritesList();
    }

    function updateFavoritesList() {
        if (!favoritesList) return;

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p class="no-favorites">No favorites yet. Click ⭐ on any calculator to add.</p>';
            return;
        }

        favoritesList.innerHTML = '';
        favorites.forEach(toolId => {
            const originalLink = document.querySelector(`.sidebar-link[data-tool="${toolId}"]`);
            if (originalLink) {
                const clone = document.createElement('a');
                clone.href = '#' + toolId;
                clone.className = 'sidebar-link';
                clone.dataset.tool = toolId;
                clone.innerHTML = originalLink.innerHTML.replace(/<button.*<\/button>/g, '');
                clone.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
                    document.getElementById(toolId)?.classList.add('active');
                    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                    originalLink.classList.add('active');
                });
                favoritesList.appendChild(clone);
            }
        });
    }

    // Update favorites buttons on load
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const link = btn.closest('.sidebar-link');
        if (link && favorites.includes(link.dataset.tool)) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-star"></i>';
        }
    });
}

// History Panel
function initHistoryPanel() {
    const showHistoryBtn = document.getElementById('showHistory');
    if (!showHistoryBtn) return;

    // Create history panel
    const overlay = document.createElement('div');
    overlay.className = 'history-overlay';
    overlay.id = 'historyOverlay';

    const panel = document.createElement('div');
    panel.className = 'history-panel';
    panel.id = 'historyPanel';
    panel.innerHTML = `
        <div class="history-header">
            <h3><i class="fas fa-history"></i> Calculation History</h3>
            <button class="history-close" id="historyClose"><i class="fas fa-times"></i></button>
        </div>
        <div class="history-list" id="historyList">
            <p class="no-favorites">No calculations yet.</p>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    showHistoryBtn.addEventListener('click', () => {
        panel.classList.add('open');
        overlay.classList.add('open');
        updateHistoryList();
    });

    document.getElementById('historyClose').addEventListener('click', closeHistory);
    overlay.addEventListener('click', closeHistory);

    function closeHistory() {
        panel.classList.remove('open');
        overlay.classList.remove('open');
    }

    function updateHistoryList() {
        const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
        const historyList = document.getElementById('historyList');

        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-favorites">No calculations yet. Results will appear here.</p>';
            return;
        }

        historyList.innerHTML = history.slice(0, 20).map((item, i) => `
            <div class="history-item" data-index="${i}">
                <div class="history-item-title">${item.calculator}</div>
                <div class="history-item-time">${formatTimeAgo(item.timestamp)}</div>
                <div class="history-item-preview">${item.preview}</div>
            </div>
        `).join('');
    }
}

// Save to history helper
function saveToHistory(calculatorName, preview) {
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    history.unshift({
        calculator: calculatorName,
        preview: preview,
        timestamp: Date.now()
    });
    // Keep only last 50
    localStorage.setItem('calculationHistory', JSON.stringify(history.slice(0, 50)));
}

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString();
}

// Export Features
function initExportFeatures() {
    // Add action buttons to all result containers
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList &&
                    (node.classList.contains('result-grid') || node.querySelector?.('.result-grid'))) {
                    addResultActions(node.closest('[class*="-result"]'));
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function addResultActions(resultContainer) {
    if (!resultContainer || resultContainer.querySelector('.result-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'result-actions';
    actions.innerHTML = `
        <button class="result-action-btn copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <button class="result-action-btn pdf-btn"><i class="fas fa-file-pdf"></i> Export PDF</button>
    `;

    resultContainer.appendChild(actions);

    // Copy functionality
    actions.querySelector('.copy-btn').addEventListener('click', () => {
        const textContent = resultContainer.innerText
            .replace(/Copy|Export PDF/g, '')
            .trim();
        navigator.clipboard.writeText(textContent).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy', 'error');
        });
    });

    // PDF Export (simple print)
    actions.querySelector('.pdf-btn').addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        const content = resultContainer.cloneNode(true);
        content.querySelector('.result-actions')?.remove();

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>DS Financial - Calculation Result</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                    h4 { color: #10b981; margin-bottom: 1rem; }
                    .result-grid { display: flex; flex-direction: column; gap: 0.5rem; }
                    .result-row { display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
                    .result-label { color: #6b7280; }
                    .result-value { font-weight: 600; color: #111827; }
                    .highlight-green, .highlight-purple, .highlight-teal { background: #f3f4f6; border-radius: 8px; }
                    .info-box { background: #f0fdf4; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
                    .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 0.8rem; color: #9ca3af; }
                </style>
            </head>
            <body>
                <h2>DS Financial Solutions</h2>
                ${content.outerHTML}
                <div class="footer">Generated on ${new Date().toLocaleString()} | dsfinancial.surge.sh</div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    // Remove existing toast
    document.querySelector('.toast')?.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==================== UTILITY CALCULATORS ====================

// Salary Calculator (CTC to In-Hand)
function initSalaryCalculator() {
    const btn = document.getElementById('calculateSalary');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const ctc = parseNum(document.getElementById('salaryCTC').value);
        const basicPct = parseNum(document.getElementById('salaryBasicPct').value) / 100;
        const hraPct = parseNum(document.getElementById('salaryHRAPct').value) / 100;
        const regime = document.getElementById('salaryRegime').value;
        const pfPct = parseNum(document.getElementById('salaryPF').value) / 100;
        const pt = parseNum(document.getElementById('salaryPT').value);

        if (!ctc) return alert('Please enter CTC');

        const basic = ctc * basicPct;
        const hra = basic * hraPct;
        const specialAllowance = ctc - basic - hra - (basic * 0.12); // Employer PF
        const employerPF = basic * 0.12;
        const employeePF = basic * pfPct;
        const gratuity = basic * 0.0481; // 4.81% of basic

        // Gross Salary (before deductions)
        const grossMonthly = (ctc - employerPF - gratuity) / 12;

        // Calculate tax
        const taxableIncome = ctc - (employeePF + 50000); // Standard deduction
        let tax = 0;

        if (regime === 'new') {
            // New regime slabs FY 2024-25
            if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 300000) * 0.05;
            if (taxableIncome > 600000) tax += Math.min(taxableIncome - 600000, 300000) * 0.10;
            if (taxableIncome > 900000) tax += Math.min(taxableIncome - 900000, 300000) * 0.15;
            if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
            if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
            // Rebate u/s 87A for new regime
            if (taxableIncome <= 700000) tax = 0;
        } else {
            // Old regime
            if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
            if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
            if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
            if (taxableIncome <= 500000) tax = 0;
        }

        tax = tax * 1.04; // Add 4% cess
        const monthlyTax = tax / 12;
        const ptAnnual = pt * 12;

        const netMonthly = grossMonthly - employeePF / 12 - monthlyTax - pt;
        const netAnnual = netMonthly * 12;

        const result = document.getElementById('salaryResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-money-bill-wave"></i> Salary Breakdown</h4>
            <div class="salary-breakdown">
                <div class="salary-item">
                    <div class="label">Annual CTC</div>
                    <div class="value">${formatINR(ctc)}</div>
                </div>
                <div class="salary-item">
                    <div class="label">Basic Salary</div>
                    <div class="value">${formatINR(basic)}/yr</div>
                </div>
                <div class="salary-item">
                    <div class="label">HRA</div>
                    <div class="value">${formatINR(hra)}/yr</div>
                </div>
                <div class="salary-item">
                    <div class="label">Employee PF</div>
                    <div class="value">-${formatINR(employeePF)}/yr</div>
                </div>
                <div class="salary-item">
                    <div class="label">Income Tax (${regime})</div>
                    <div class="value">-${formatINR(tax)}/yr</div>
                </div>
                <div class="salary-item">
                    <div class="label">Professional Tax</div>
                    <div class="value">-${formatINR(ptAnnual)}/yr</div>
                </div>
                <div class="salary-item highlight">
                    <div class="label">Monthly In-Hand</div>
                    <div class="value">${formatINR(netMonthly)}</div>
                </div>
                <div class="salary-item highlight">
                    <div class="label">Annual Take-Home</div>
                    <div class="value">${formatINR(netAnnual)}</div>
                </div>
            </div>
            <div class="result-actions" style="margin-top:1rem;">
                <button class="whatsapp-share-btn" onclick="shareOnWhatsApp('Salary: CTC ${formatINR(ctc)} → In-Hand ${formatINR(netMonthly)}/month')">
                    <i class="fab fa-whatsapp"></i> Share on WhatsApp
                </button>
            </div>`;

        // Confetti celebration!
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    });
}

// Tax Calendar
function initTaxCalendar() {
    const calendarList = document.getElementById('taxCalendarList');
    if (!calendarList) return;

    const taxDates = [
        { date: '2024-06-15', title: 'Advance Tax - 1st Instalment', category: 'advance', pct: '15%' },
        { date: '2024-07-07', title: 'TDS Payment (June)', category: 'tds' },
        { date: '2024-07-31', title: 'ITR Filing Deadline (Non-Audit)', category: 'itr' },
        { date: '2024-09-15', title: 'Advance Tax - 2nd Instalment', category: 'advance', pct: '45%' },
        { date: '2024-10-31', title: 'ITR Filing (Audit Cases)', category: 'itr' },
        { date: '2024-11-30', title: 'ITR Filing (Transfer Pricing)', category: 'itr' },
        { date: '2024-12-15', title: 'Advance Tax - 3rd Instalment', category: 'advance', pct: '75%' },
        { date: '2024-12-31', title: 'Belated/Revised ITR', category: 'itr' },
        { date: '2025-01-07', title: 'TDS Payment (December)', category: 'tds' },
        { date: '2025-03-15', title: 'Advance Tax - 4th Instalment', category: 'advance', pct: '100%' },
        { date: '2025-03-31', title: 'Financial Year End', category: 'itr' },
        { date: '2025-04-20', title: 'GSTR-3B (March)', category: 'gst' },
        { date: '2025-05-31', title: 'TDS Return (Q4)', category: 'tds' },
        { date: '2025-07-31', title: 'ITR Filing FY24-25', category: 'itr' }
    ];

    function renderCalendar(filter = 'all') {
        const today = new Date();
        const filtered = filter === 'all' ? taxDates : taxDates.filter(d => d.category === filter);

        calendarList.innerHTML = filtered.map(item => {
            const date = new Date(item.date);
            const isPast = date < today;
            const daysUntil = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
            const isUrgent = daysUntil > 0 && daysUntil <= 7;
            const isUpcoming = daysUntil > 7 && daysUntil <= 30;

            return `
                <div class="calendar-item ${isPast ? 'past' : ''} ${isUrgent ? 'urgent' : ''} ${isUpcoming ? 'upcoming' : ''}">
                    <div class="calendar-date">
                        <div class="day">${date.getDate()}</div>
                        <div class="month">${date.toLocaleString('en', { month: 'short' })}</div>
                    </div>
                    <div class="calendar-info">
                        <div class="title">${item.title} ${item.pct ? `(${item.pct})` : ''}</div>
                        <span class="category">${item.category.toUpperCase()}</span>
                        ${!isPast ? `<span style="margin-left:0.5rem;font-size:0.75rem;color:${isUrgent ? '#dc2626' : '#6b7280'}">${daysUntil} days left</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Filter buttons
    document.querySelectorAll('.calendar-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.calendar-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCalendar(btn.dataset.filter);
        });
    });

    renderCalendar();
}

// Capital Gains Calculator
function initCapitalGainsCalculator() {
    const btn = document.getElementById('calculateCG');
    const modeButtons = document.querySelectorAll('#capital-gains .mode-btn');
    if (!btn) return;

    let currentMode = 'equity';

    modeButtons.forEach(modeBtn => {
        modeBtn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            modeBtn.classList.add('active');
            currentMode = modeBtn.dataset.mode;
            document.querySelectorAll('.property-field').forEach(el => {
                el.classList.toggle('hidden', currentMode !== 'property');
            });
        });
    });

    btn.addEventListener('click', () => {
        const purchase = parseNum(document.getElementById('cgPurchase').value);
        const sale = parseNum(document.getElementById('cgSale').value);
        const purchaseDate = new Date(document.getElementById('cgPurchaseDate').value);
        const saleDate = new Date(document.getElementById('cgSaleDate').value);

        if (!purchase || !sale) return alert('Please enter purchase and sale prices');

        const holdingDays = Math.ceil((saleDate - purchaseDate) / (1000 * 60 * 60 * 24));
        let gain = sale - purchase;
        let taxRate = 0;
        let isLTCG = false;
        let exemption = 0;

        if (currentMode === 'equity') {
            isLTCG = holdingDays > 365;
            if (isLTCG) {
                exemption = 125000; // LTCG exemption up to 1.25L
                const taxableGain = Math.max(0, gain - exemption);
                taxRate = 0.125; // 12.5% LTCG
            } else {
                taxRate = 0.20; // 20% STCG
            }
        } else if (currentMode === 'debt') {
            // All debt funds now taxed at slab rate
            taxRate = 0.30;
            isLTCG = false;
        } else if (currentMode === 'property') {
            isLTCG = holdingDays > 730; // 2 years
            const ciiPurchase = parseNum(document.getElementById('cgCIIPurchase').value);
            const ciiSale = parseNum(document.getElementById('cgCIISale').value);

            if (isLTCG) {
                const indexedCost = purchase * (ciiSale / ciiPurchase);
                gain = sale - indexedCost;
                taxRate = 0.125; // New LTCG rate
            } else {
                taxRate = 0.30; // STCG at slab rate
            }
        }

        const taxableGain = currentMode === 'equity' && isLTCG ? Math.max(0, gain - exemption) : gain;
        const tax = taxableGain * taxRate;
        const netGain = gain - tax;

        const result = document.getElementById('cgResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-chart-area"></i> Capital Gains (${currentMode.toUpperCase()})</h4>
            <div class="result-grid">
                <div class="result-row">
                    <span class="result-label">Holding Period</span>
                    <span class="result-value">${holdingDays} days (${isLTCG ? 'Long Term' : 'Short Term'})</span>
                </div>
                <div class="result-row">
                    <span class="result-label">Total Gain</span>
                    <span class="result-value">${formatINR(gain)}</span>
                </div>
                ${exemption > 0 ? `
                <div class="result-row">
                    <span class="result-label">LTCG Exemption</span>
                    <span class="result-value">-${formatINR(Math.min(exemption, gain))}</span>
                </div>` : ''}
                <div class="result-row">
                    <span class="result-label">Tax Rate</span>
                    <span class="result-value">${(taxRate * 100).toFixed(1)}%</span>
                </div>
                <div class="result-row highlight-green">
                    <span class="result-label">Tax Payable</span>
                    <span class="result-value">${formatINR(tax)}</span>
                </div>
                <div class="result-row highlight-green">
                    <span class="result-label">Net Gain (After Tax)</span>
                    <span class="result-value">${formatINR(netGain)}</span>
                </div>
            </div>`;
    });
}

// Rent vs Buy Calculator
function initRentVsBuyCalculator() {
    const btn = document.getElementById('calculateRVB');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const propertyValue = parseNum(document.getElementById('rvbPropertyValue').value);
        const monthlyRent = parseNum(document.getElementById('rvbRent').value);
        const downPaymentPct = parseNum(document.getElementById('rvbDownPayment').value) / 100;
        const interestRate = parseNum(document.getElementById('rvbInterest').value) / 100 / 12;
        const tenure = parseNum(document.getElementById('rvbTenure').value);
        const appreciation = parseNum(document.getElementById('rvbAppreciation').value) / 100;
        const rentIncrease = parseNum(document.getElementById('rvbRentIncrease').value) / 100;
        const investReturn = parseNum(document.getElementById('rvbInvestReturn').value) / 100;

        if (!propertyValue || !monthlyRent) return alert('Please enter property value and rent');

        const downPayment = propertyValue * downPaymentPct;
        const loanAmount = propertyValue - downPayment;
        const months = tenure * 12;

        // EMI Calculation
        const emi = loanAmount * interestRate * Math.pow(1 + interestRate, months) / (Math.pow(1 + interestRate, months) - 1);

        // Total buying cost over tenure
        const totalEMI = emi * months;
        const stampDuty = propertyValue * 0.06;
        const maintenance = propertyValue * 0.01 * tenure;
        const totalBuyCost = downPayment + totalEMI + stampDuty + maintenance;

        // Property value after tenure
        const futurePropertyValue = propertyValue * Math.pow(1 + appreciation, tenure);
        const netBuyWealth = futurePropertyValue - totalBuyCost + downPayment;

        // Renting scenario
        let totalRent = 0;
        let currentRent = monthlyRent;
        for (let y = 0; y < tenure; y++) {
            totalRent += currentRent * 12;
            currentRent *= (1 + rentIncrease);
        }

        // Investing the difference
        const downPaymentInvested = downPayment * Math.pow(1 + investReturn, tenure);
        const monthlySavings = emi - monthlyRent;
        let investedSaving = 0;
        if (monthlySavings > 0) {
            const monthlyReturn = investReturn / 12;
            investedSaving = monthlySavings * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
        }

        const netRentWealth = downPaymentInvested + investedSaving - totalRent;

        const buyIsBetter = netBuyWealth > netRentWealth;

        const result = document.getElementById('rvbResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <h4><i class="fas fa-home"></i> Rent vs Buy Analysis (${tenure} Years)</h4>
            <div class="comparison-cards">
                <div class="comparison-card ${buyIsBetter ? 'winner' : ''}">
                    <h4><i class="fas fa-building"></i> BUY</h4>
                    <div class="result-row"><span>Down Payment</span><span>${formatINR(downPayment)}</span></div>
                    <div class="result-row"><span>EMI (Monthly)</span><span>${formatINR(emi)}</span></div>
                    <div class="result-row"><span>Total EMI Paid</span><span>${formatINR(totalEMI)}</span></div>
                    <div class="result-row"><span>Property Value (${tenure}yr)</span><span>${formatINR(futurePropertyValue)}</span></div>
                    <div class="result-row highlight-green"><span>Net Wealth</span><span>${formatINR(netBuyWealth)}</span></div>
                </div>
                <div class="comparison-card ${!buyIsBetter ? 'winner' : ''}">
                    <h4><i class="fas fa-key"></i> RENT</h4>
                    <div class="result-row"><span>Initial Rent</span><span>${formatINR(monthlyRent)}/mo</span></div>
                    <div class="result-row"><span>Total Rent Paid</span><span>${formatINR(totalRent)}</span></div>
                    <div class="result-row"><span>Down Payment Invested</span><span>${formatINR(downPaymentInvested)}</span></div>
                    <div class="result-row"><span>Monthly Savings Invested</span><span>${formatINR(investedSaving)}</span></div>
                    <div class="result-row highlight-green"><span>Net Wealth</span><span>${formatINR(netRentWealth)}</span></div>
                </div>
            </div>
            <div class="recommendation-box" style="margin-top:1.5rem;">
                <i class="fas fa-trophy"></i>
                <h4>${buyIsBetter ? 'BUYING is Better!' : 'RENTING is Better!'}</h4>
                <p>Difference: ${formatINR(Math.abs(netBuyWealth - netRentWealth))} over ${tenure} years</p>
            </div>`;

        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }
    });
}

// WhatsApp Share
function initWhatsAppShare() {
    // Add share buttons to export actions
    document.querySelectorAll('.result-actions').forEach(container => {
        if (!container.querySelector('.whatsapp-share-btn')) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'result-action-btn';
            shareBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Share';
            shareBtn.style.background = '#25D366';
            shareBtn.style.color = 'white';
            shareBtn.onclick = () => {
                const text = container.closest('[class*="-result"]')?.innerText?.slice(0, 500) || 'Check out DS Financial Tax Calculator!';
                shareOnWhatsApp(text);
            };
            container.appendChild(shareBtn);
        }
    });
}

function shareOnWhatsApp(text) {
    const message = encodeURIComponent(`${text}\n\n🧮 Calculate yours at: https://dsfinancial.surge.sh`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
}

// ==================== INTERACTIVE FEATURES ====================

// Voice Input
function initVoiceInput() {
    const voiceBtn = document.getElementById('voiceSearchBtn');
    const searchInput = document.getElementById('calculatorSearch');
    if (!voiceBtn || !searchInput) return;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        voiceBtn.style.display = 'none';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;

    voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.add('listening');
        recognition.start();
        showToast('🎤 Listening... Speak now');
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        searchInput.dispatchEvent(new Event('input'));
        voiceBtn.classList.remove('listening');
        showToast('✅ Found: ' + transcript);
    };

    recognition.onerror = () => {
        voiceBtn.classList.remove('listening');
        showToast('❌ Voice not recognized');
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
    };
}

// PWA Install Prompt
let deferredPrompt;
function initPWAInstall() {
    const banner = document.getElementById('pwaInstallBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const closeBtn = document.getElementById('pwaCloseBtn');
    if (!banner) return;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        banner.classList.remove('hidden');
    });

    installBtn?.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('🎉 App installed successfully!');
            }
            deferredPrompt = null;
            banner.classList.add('hidden');
        }
    });

    closeBtn?.addEventListener('click', () => {
        banner.classList.add('hidden');
    });
}

// Financial Health Score Quiz
function initFinancialHealthQuiz() {
    const container = document.getElementById('healthQuizContainer');
    const resultDiv = document.getElementById('healthScoreResult');
    const restartBtn = document.getElementById('restartHealthQuiz');
    if (!container) return;

    const healthQuestions = [
        { q: 'Do you have an emergency fund covering 6 months of expenses?', options: ['Yes', 'Partially (3-6 months)', 'No'], scores: [10, 5, 0] },
        { q: 'Do you track your monthly income and expenses?', options: ['Yes, regularly', 'Sometimes', 'Never'], scores: [10, 5, 0] },
        { q: 'Do you have any outstanding credit card debt?', options: ['No debt', 'Yes, paying minimum', 'Yes, significant amount'], scores: [10, 3, 0] },
        { q: 'Are you investing regularly for retirement (NPS/PPF/MF)?', options: ['Yes, monthly SIP', 'Occasionally', 'Not yet'], scores: [10, 5, 0] },
        { q: 'Do you have adequate health insurance coverage?', options: ['Yes, comprehensive', 'Basic coverage', 'No insurance'], scores: [10, 5, 0] },
        { q: 'Do you have term life insurance?', options: ['Yes, 10x income', 'Yes, but less', 'No'], scores: [10, 5, 0] },
        { q: 'What percentage of income do you save monthly?', options: ['30%+', '10-30%', 'Less than 10%'], scores: [10, 6, 2] },
        { q: 'Do you have clear financial goals with timelines?', options: ['Yes, written down', 'Vague ideas', 'No goals'], scores: [10, 4, 0] },
        { q: 'Is your home loan EMI less than 40% of income?', options: ['Yes/No loan', 'Around 40%', 'More than 40%'], scores: [10, 5, 0] },
        { q: 'Do you review your investments quarterly?', options: ['Yes', 'Annually', 'Never'], scores: [10, 6, 0] }
    ];

    let currentQ = 0;
    let totalScore = 0;

    function renderQuestion() {
        const q = healthQuestions[currentQ];
        document.getElementById('healthProgress').style.width = ((currentQ + 1) / healthQuestions.length * 100) + '%';
        document.getElementById('healthQuestionNum').textContent = `Question ${currentQ + 1} of ${healthQuestions.length}`;
        document.getElementById('healthQuizQuestion').innerHTML = `<h3>${q.q}</h3>`;
        document.getElementById('healthQuizOptions').innerHTML = q.options.map((opt, i) =>
            `<div class="quiz-option" data-score="${q.scores[i]}">${opt}</div>`
        ).join('');

        document.querySelectorAll('#healthQuizOptions .quiz-option').forEach(opt => {
            opt.addEventListener('click', () => {
                totalScore += parseInt(opt.dataset.score);
                currentQ++;
                if (currentQ < healthQuestions.length) {
                    renderQuestion();
                } else {
                    showHealthResult();
                }
            });
        });
    }

    function showHealthResult() {
        container.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        restartBtn.classList.remove('hidden');

        let rating = 'Poor', color = '#ef4444', emoji = '😟';
        if (totalScore >= 80) { rating = 'Excellent'; color = '#10b981'; emoji = '🏆'; }
        else if (totalScore >= 60) { rating = 'Good'; color = '#22c55e'; emoji = '😊'; }
        else if (totalScore >= 40) { rating = 'Average'; color = '#f59e0b'; emoji = '😐'; }
        else if (totalScore >= 20) { rating = 'Needs Work'; color = '#f97316'; emoji = '😕'; }

        const circumference = 2 * Math.PI * 80;
        const offset = circumference - (totalScore / 100) * circumference;

        resultDiv.innerHTML = `
            <div class="health-score-circle">
                <svg width="200" height="200">
                    <circle cx="100" cy="100" r="80" stroke="#e5e7eb" stroke-width="12" fill="none"/>
                    <circle cx="100" cy="100" r="80" stroke="${color}" stroke-width="12" fill="none"
                            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
                </svg>
                <div class="health-score-value">
                    <div class="score" style="color:${color}">${totalScore}</div>
                    <div class="label">out of 100</div>
                </div>
            </div>
            <h3>${emoji} ${rating} Financial Health</h3>
            <p style="margin-bottom:1.5rem;color:var(--text-muted)">
                ${totalScore >= 80 ? 'Great job! You have strong financial habits.' :
                totalScore >= 60 ? 'Good progress! Focus on building emergency fund and investments.' :
                    totalScore >= 40 ? 'Room for improvement. Start with budgeting and small SIPs.' :
                        'Consider consulting a financial advisor to create a solid plan.'}
            </p>
            <button class="whatsapp-share-btn" onclick="shareOnWhatsApp('My Financial Health Score: ${totalScore}/100 - ${rating}! Take the quiz:')">
                <i class="fab fa-whatsapp"></i> Share Your Score
            </button>`;

        if (typeof confetti !== 'undefined' && totalScore >= 60) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }

    restartBtn?.addEventListener('click', () => {
        currentQ = 0;
        totalScore = 0;
        container.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        restartBtn.classList.add('hidden');
        renderQuestion();
    });

    renderQuestion();
}

// Tax Quiz Game
function initTaxQuizGame() {
    const startScreen = document.getElementById('taxQuizStart');
    const gameScreen = document.getElementById('taxQuizGame');
    const resultScreen = document.getElementById('taxQuizResult');
    const startBtn = document.getElementById('startTaxQuiz');
    if (!startScreen) return;

    const taxQuestions = [
        { q: 'What is the standard deduction for salaried employees in FY 2024-25?', opts: ['₹50,000', '₹75,000', '₹25,000', '₹1,00,000'], ans: 1 },
        { q: 'Under which section can you claim HRA exemption?', opts: ['Section 80C', 'Section 10(13A)', 'Section 80D', 'Section 24'], ans: 1 },
        { q: 'What is the maximum deduction allowed under Section 80C?', opts: ['₹1 Lakh', '₹1.5 Lakh', '₹2 Lakh', '₹2.5 Lakh'], ans: 1 },
        { q: 'What is the GST rate on health insurance premiums (after recent changes)?', opts: ['5%', '12%', '18%', '28%'], ans: 0 },
        { q: 'Who needs to file ITR mandatorily?', opts: ['Income > ₹2.5 Lakh', 'Income > ₹5 Lakh', 'Everyone above 18', 'Only businessmen'], ans: 0 },
        { q: 'What is the LTCG tax rate on equity shares (after Budget 2024)?', opts: ['10%', '12.5%', '15%', '20%'], ans: 1 },
        { q: 'Which form is used for salaried employees with income up to ₹50 Lakh?', opts: ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4'], ans: 0 },
        { q: 'What is the threshold for TDS on salary?', opts: ['₹2.5 Lakh', '₹3 Lakh (New Regime)', '₹5 Lakh', 'No threshold'], ans: 1 },
        { q: 'Section 80D provides deduction for?', opts: ['Life Insurance', 'Health Insurance', 'Home Loan', 'Education Loan'], ans: 1 },
        { q: 'What is the PAN requirement threshold for cash transactions?', opts: ['₹50,000', '₹2 Lakh', '₹10 Lakh', '₹1 Lakh'], ans: 1 }
    ];

    let currentQ = 0, score = 0, timer = null, seconds = 0;
    const stored = JSON.parse(localStorage.getItem('taxQuizStats') || '{"plays":0,"high":0}');
    document.getElementById('totalQuizPlays').textContent = stored.plays;
    document.getElementById('highScore').textContent = stored.high;

    function startTimer() {
        seconds = 0;
        timer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            document.getElementById('quizTimer').textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function renderTaxQuestion() {
        const q = taxQuestions[currentQ];
        document.getElementById('taxProgress').style.width = ((currentQ + 1) / taxQuestions.length * 100) + '%';
        document.getElementById('taxQuestionNum').textContent = `Question ${currentQ + 1} of ${taxQuestions.length}`;
        document.getElementById('taxQuizQuestion').innerHTML = `<h3>${q.q}</h3>`;

        const optionsContainer = document.getElementById('taxQuizOptions');
        optionsContainer.innerHTML = q.opts.map((opt, i) =>
            `<div class="quiz-option" data-idx="${i}" style="cursor:pointer"><span class="option-letter">${String.fromCharCode(65 + i)}</span> ${opt}</div>`
        ).join('');
    }

    // Event delegation for quiz options
    const optionsContainer = document.getElementById('taxQuizOptions');
    if (optionsContainer) {
        optionsContainer.addEventListener('click', function (e) {
            const option = e.target.closest('.quiz-option');
            if (!option || option.style.pointerEvents === 'none') return;

            const idx = parseInt(option.dataset.idx);
            const q = taxQuestions[currentQ];
            const isCorrect = idx === q.ans;

            // Mark all options
            optionsContainer.querySelectorAll('.quiz-option').forEach((o, i) => {
                if (i === q.ans) o.classList.add('correct');
                if (i === idx && !isCorrect) o.classList.add('incorrect');
                o.style.pointerEvents = 'none';
            });

            if (isCorrect) {
                score += 10;
                document.getElementById('quizScore').textContent = score;
            }

            setTimeout(() => {
                currentQ++;
                if (currentQ < taxQuestions.length) {
                    renderTaxQuestion();
                } else {
                    showTaxResult();
                }
            }, 1000);
        });
    }

    function showTaxResult() {
        clearInterval(timer);
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        stored.plays++;
        if (score > stored.high) stored.high = score;
        localStorage.setItem('taxQuizStats', JSON.stringify(stored));

        let emoji = '😢', title = 'Keep Learning!';
        if (score >= 90) { emoji = '🏆'; title = 'Tax Expert!'; }
        else if (score >= 70) { emoji = '🌟'; title = 'Great Job!'; }
        else if (score >= 50) { emoji = '👍'; title = 'Good Effort!'; }

        resultScreen.innerHTML = `
            <h3>${emoji} ${title}</h3>
            <div class="final-score">${score}/100</div>
            <div class="score-breakdown">
                <div><strong style="color:#10b981">${score / 10}</strong><span>Correct</span></div>
                <div><strong style="color:#ef4444">${10 - score / 10}</strong><span>Wrong</span></div>
                <div><strong style="color:#6366f1">${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}</strong><span>Time</span></div>
            </div>
            <div style="display:flex;gap:1rem;justify-content:center">
                <button class="btn-primary" onclick="location.reload()"><i class="fas fa-redo"></i> Play Again</button>
                <button class="whatsapp-share-btn" onclick="shareOnWhatsApp('I scored ${score}/100 on Tax Quiz! ${title}')">
                    <i class="fab fa-whatsapp"></i> Share
                </button>
            </div>`;

        if (typeof confetti !== 'undefined' && score >= 70) {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        }
    }

    startBtn?.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentQ = 0;
        score = 0;
        document.getElementById('quizScore').textContent = '0';
        startTimer();
        renderTaxQuestion();
    });
}

// Video Player
function playVideo(videoId) {
    const videoURLs = {
        'ITR-Filing': 'https://www.youtube.com/watch?v=ITR_demo',
        'GST-Return': 'https://www.youtube.com/watch?v=GST_demo',
        '80C-Guide': 'https://www.youtube.com/watch?v=80C_demo',
        'Tax-Regime': 'https://www.youtube.com/watch?v=regime_demo'
    };
    showToast('📹 Video tutorials coming soon!');
    // window.open(videoURLs[videoId], '_blank');
}

// Feedback Widget
function initFeedbackWidget() {
    const widget = document.createElement('div');
    widget.className = 'feedback-widget';
    widget.innerHTML = `<button class="feedback-btn" onclick="openFeedback()"><i class="fas fa-comment-alt"></i> Feedback</button>`;
    document.body.appendChild(widget);
}

function openFeedback() {
    const feedback = prompt('How can we improve? Share your feedback:');
    if (feedback) {
        showToast('🙏 Thank you for your feedback!');
        // In production, send to server
    }
}

// ==================== MEGA MENU & SEARCH ====================

// All Tools Database for Search
const allToolsDatabase = [
    // Tax Tools
    { name: 'Tax Regime Comparison', id: 'tax-regime', category: 'Tax', icon: 'fa-balance-scale' },
    { name: 'Salary Tax Calculator', id: 'salary-calculator', category: 'Tax', icon: 'fa-calculator' },
    { name: 'Advance Tax Calculator', id: 'advance-tax', category: 'Tax', icon: 'fa-calendar-check' },
    { name: 'Section 80C Optimizer', id: 'section-80c', category: 'Tax', icon: 'fa-hand-holding-usd' },
    { name: 'HRA Exemption Calculator', id: 'hra', category: 'Tax', icon: 'fa-home' },
    { name: 'TDS Calculator', id: 'tds', category: 'Tax', icon: 'fa-file-invoice-dollar' },
    { name: 'GST Calculator', id: 'gst-calculator', category: 'Tax', icon: 'fa-percent' },
    { name: 'GST Reverse Calculator', id: 'gst-reverse', category: 'Tax', icon: 'fa-undo' },
    { name: 'HSN Code Lookup', id: 'hsn-lookup', category: 'Tax', icon: 'fa-search' },
    { name: 'Tax Calendar 2025', id: 'tax-calendar', category: 'Tax', icon: 'fa-calendar-alt' },

    // Banking
    { name: 'EMI Calculator', id: 'emi-calculator', category: 'Banking', icon: 'fa-calculator' },
    { name: 'Loan Eligibility', id: 'loan-eligibility', category: 'Banking', icon: 'fa-check-circle' },
    { name: 'FD Calculator', id: 'fd-calculator', category: 'Banking', icon: 'fa-piggy-bank' },
    { name: 'RD Calculator', id: 'rd-calculator', category: 'Banking', icon: 'fa-coins' },
    { name: 'SIP Calculator', id: 'sip-calculator', category: 'Banking', icon: 'fa-chart-line' },
    { name: 'Compound Interest', id: 'compound-interest', category: 'Banking', icon: 'fa-percentage' },
    { name: 'CAGR Calculator', id: 'cagr', category: 'Banking', icon: 'fa-chart-area' },

    // Employee
    { name: 'Salary Slip Generator', id: 'salary-slip', category: 'Employee', icon: 'fa-file-alt' },
    { name: 'CTC to In-hand', id: 'ctc-calculator', category: 'Employee', icon: 'fa-money-bill-wave' },
    { name: 'PF/EPF Calculator', id: 'pf-calculator', category: 'Employee', icon: 'fa-umbrella' },
    { name: 'Gratuity Calculator', id: 'gratuity', category: 'Employee', icon: 'fa-gift' },
    { name: 'Leave Encashment', id: 'leave-encash', category: 'Employee', icon: 'fa-calendar-minus' },
    { name: 'NPS Calculator', id: 'nps', category: 'Employee', icon: 'fa-user-clock' },
    { name: 'Notice Period Buyout', id: 'notice-period', category: 'Employee', icon: 'fa-door-open' },

    // Business
    { name: 'Invoice Generator', id: 'invoice-generator', category: 'Business', icon: 'fa-file-invoice' },
    { name: 'Breakeven Calculator', id: 'breakeven', category: 'Business', icon: 'fa-balance-scale-right' },
    { name: 'Profit Margin Calculator', id: 'profit-margin', category: 'Business', icon: 'fa-chart-pie' },
    { name: 'ROI Calculator', id: 'roi', category: 'Business', icon: 'fa-chart-bar' },
    { name: 'Freelancer Tax', id: 'freelance-tax', category: 'Business', icon: 'fa-laptop-code' },

    // Legal
    { name: 'Rent Agreement Generator', id: 'rent-agreement', category: 'Legal', icon: 'fa-file-contract' },
    { name: 'Stamp Duty Calculator', id: 'stamp-duty', category: 'Legal', icon: 'fa-stamp' },
    { name: 'Court Fee Calculator', id: 'court-fee', category: 'Legal', icon: 'fa-gavel' },
    { name: 'Will Generator', id: 'will-generator', category: 'Legal', icon: 'fa-scroll' },

    // Real Estate
    { name: 'Rent vs Buy Calculator', id: 'rent-vs-buy', category: 'Real Estate', icon: 'fa-home' },
    { name: 'Home Affordability', id: 'affordability', category: 'Real Estate', icon: 'fa-house-user' },
    { name: 'Rental Yield Calculator', id: 'rental-yield', category: 'Real Estate', icon: 'fa-percentage' },
    { name: 'Property Capital Gains', id: 'property-gains', category: 'Real Estate', icon: 'fa-coins' },
];

// Open Search Dialog
function openSearchDialog() {
    const dialog = document.getElementById('searchDialog');
    if (dialog) {
        dialog.classList.remove('hidden');
        document.getElementById('globalSearchInput').focus();
        document.body.style.overflow = 'hidden';
    }
}

// Close Search Dialog
function closeSearchDialog() {
    const dialog = document.getElementById('searchDialog');
    if (dialog) {
        dialog.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Initialize Mega Menu & Search
function initMegaMenuSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('searchResults');
    const dialog = document.getElementById('searchDialog');

    // Ctrl+K to open search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearchDialog();
        }
        if (e.key === 'Escape') {
            closeSearchDialog();
        }
    });

    // Close on overlay click
    if (dialog) {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                closeSearchDialog();
            }
        });
    }

    // Real-time search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length === 0) {
                // Show popular tools
                searchResults.innerHTML = `
                    <div class="search-category">
                        <h4>Popular Tools</h4>
                        ${allToolsDatabase.slice(0, 6).map(tool => `
                            <a href="#" data-tool="${tool.id}" onclick="navigateToTool('${tool.id}')">
                                <i class="fas ${tool.icon}"></i> ${tool.name}
                            </a>
                        `).join('')}
                    </div>
                `;
                return;
            }

            // Filter tools
            const filtered = allToolsDatabase.filter(tool =>
                tool.name.toLowerCase().includes(query) ||
                tool.category.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-category">
                        <h4>No Results</h4>
                        <p style="color:#6b7280;padding:1rem;">No tools found for "${query}"</p>
                    </div>
                `;
                return;
            }

            // Group by category
            const grouped = {};
            filtered.forEach(tool => {
                if (!grouped[tool.category]) grouped[tool.category] = [];
                grouped[tool.category].push(tool);
            });

            searchResults.innerHTML = Object.entries(grouped).map(([cat, tools]) => `
                <div class="search-category">
                    <h4>${cat}</h4>
                    ${tools.map(tool => `
                        <a href="#" data-tool="${tool.id}" onclick="navigateToTool('${tool.id}')">
                            <i class="fas ${tool.icon}"></i> ${tool.name}
                        </a>
                    `).join('')}
                </div>
            `).join('');
        });
    }

    // Mega menu dropdown links
    document.querySelectorAll('.mega-dropdown a[data-tool]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const toolId = link.getAttribute('data-tool');
            navigateToTool(toolId);
        });
    });
}

// Navigate to a tool
function navigateToTool(toolId) {
    closeSearchDialog();

    // Try to find and show the tool panel
    const panel = document.getElementById(toolId);
    if (panel) {
        document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // Tool doesn't exist yet - show coming soon
        showToast(`🚧 ${toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Coming Soon!`);
    }
}

// ==================== PHASE 2: NEW CALCULATORS ====================

// EMI Calculator
function initEMICalculator() {
    const btn = document.getElementById('calculateEMI');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const P = parseFloat(document.getElementById('emiLoanAmount').value) || 0;
        const r = (parseFloat(document.getElementById('emiInterestRate').value) || 0) / 12 / 100;
        const n = (parseFloat(document.getElementById('emiTenure').value) || 0) * 12;

        if (P <= 0 || r <= 0 || n <= 0) {
            showToast('Please enter valid values');
            return;
        }

        // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
        const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        document.getElementById('emiMonthlyEMI').textContent = '₹' + formatIndianNumber(Math.round(emi));
        document.getElementById('emiTotalInterest').textContent = '₹' + formatIndianNumber(Math.round(totalInterest));
        document.getElementById('emiTotalPayment').textContent = '₹' + formatIndianNumber(Math.round(totalPayment));

        document.getElementById('emiResult').classList.remove('hidden');

        // Create Chart
        const ctx = document.getElementById('emiChart');
        if (ctx && typeof Chart !== 'undefined') {
            // Destroy existing chart
            if (window.emiChartInstance) window.emiChartInstance.destroy();

            window.emiChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Principal Amount', 'Total Interest'],
                    datasets: [{
                        data: [P, totalInterest],
                        backgroundColor: ['#0891b2', '#f97316'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }

        showToast('✅ EMI calculated!');
    });
}

// Gratuity Calculator
function initGratuityCalculator() {
    const btn = document.getElementById('calculateGratuity');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const salary = parseFloat(document.getElementById('gratuitySalary').value) || 0;
        const years = parseFloat(document.getElementById('gratuityYears').value) || 0;

        if (salary <= 0 || years < 5) {
            showToast('Minimum 5 years of service required');
            return;
        }

        // Gratuity Formula: (Salary × 15 × Years) / 26
        const gratuity = (salary * 15 * years) / 26;
        const taxFreeLimit = 2000000; // 20 lakhs
        const taxable = Math.max(0, gratuity - taxFreeLimit);

        document.getElementById('gratuityAmount').textContent = '₹' + formatIndianNumber(Math.round(gratuity));
        document.getElementById('gratuityTaxable').textContent = '₹' + formatIndianNumber(Math.round(taxable));

        document.getElementById('gratuityResult').classList.remove('hidden');
        showToast('✅ Gratuity calculated!');
    });
}

// PF/EPF Calculator
function initPFCalculator() {
    const btn = document.getElementById('calculatePF');
    if (!btn) return;

    btn.addEventListener('click', () => {
        let salary = parseFloat(document.getElementById('pfBasicSalary').value) || 0;
        const age = parseInt(document.getElementById('pfAge').value) || 30;
        const increment = parseFloat(document.getElementById('pfIncrement').value) || 5;
        let balance = parseFloat(document.getElementById('pfCurrentBalance').value) || 0;

        const retirementAge = 58;
        const yearsToRetire = retirementAge - age;
        const pfRate = 0.0825; // 8.25% annual interest
        const contributionRate = 0.24; // 12% employee + 12% employer (but 8.33% goes to EPS)

        if (yearsToRetire <= 0) {
            showToast('Invalid age for retirement calculation');
            return;
        }

        let totalContribution = 0;
        let corpus = balance;

        for (let i = 0; i < yearsToRetire; i++) {
            const yearlyContribution = salary * contributionRate * 12;
            totalContribution += yearlyContribution;
            corpus = (corpus + yearlyContribution) * (1 + pfRate);
            salary = salary * (1 + increment / 100);
        }

        const interestEarned = corpus - totalContribution - balance;

        document.getElementById('pfTotalCorpus').textContent = '₹' + formatIndianNumber(Math.round(corpus));
        document.getElementById('pfYourContribution').textContent = '₹' + formatIndianNumber(Math.round(totalContribution));
        document.getElementById('pfInterestEarned').textContent = '₹' + formatIndianNumber(Math.round(interestEarned));

        document.getElementById('pfResult').classList.remove('hidden');
        showToast('✅ PF corpus calculated!');
    });
}

// Leave Encashment Calculator
function initLeaveEncashmentCalculator() {
    const btn = document.getElementById('calculateLeave');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const salary = parseFloat(document.getElementById('leaveBasicSalary').value) || 0;
        const days = parseInt(document.getElementById('leaveDays').value) || 0;

        if (salary <= 0 || days <= 0) {
            showToast('Please enter valid values');
            return;
        }

        const perDay = salary / 30;
        const amount = perDay * days;

        document.getElementById('leaveAmount').textContent = '₹' + formatIndianNumber(Math.round(amount));
        document.getElementById('leavePerDay').textContent = '₹' + formatIndianNumber(Math.round(perDay));

        document.getElementById('leaveResult').classList.remove('hidden');
        showToast('✅ Leave encashment calculated!');
    });
}

// Salary Slip Generator
function initSalarySlipGenerator() {
    const btn = document.getElementById('generateSalarySlip');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const basic = parseFloat(document.getElementById('slipBasic').value) || 0;
        const hra = parseFloat(document.getElementById('slipHRA').value) || 0;
        const conveyance = parseFloat(document.getElementById('slipConveyance').value) || 0;
        const special = parseFloat(document.getElementById('slipSpecial').value) || 0;

        const pf = parseFloat(document.getElementById('slipPF').value) || 0;
        const pt = parseFloat(document.getElementById('slipPT').value) || 0;
        const tds = parseFloat(document.getElementById('slipTDS').value) || 0;
        const other = parseFloat(document.getElementById('slipOther').value) || 0;

        const gross = basic + hra + conveyance + special;
        const deductions = pf + pt + tds + other;
        const net = gross - deductions;

        document.getElementById('slipGross').textContent = '₹' + formatIndianNumber(gross);
        document.getElementById('slipDeductions').textContent = '₹' + formatIndianNumber(deductions);
        document.getElementById('slipNet').textContent = '₹' + formatIndianNumber(net);

        document.getElementById('salarySlipResult').classList.remove('hidden');
        showToast('✅ Salary slip generated!');
    });
}

// Download Salary Slip PDF
function downloadSalarySlipPDF() {
    if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
        showToast('PDF library loading...');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('slipEmployeeName').value || 'Employee';
    const empId = document.getElementById('slipEmployeeId').value || 'EMP001';
    const dept = document.getElementById('slipDepartment').value || 'Department';
    const designation = document.getElementById('slipDesignation').value || 'Designation';
    const month = document.getElementById('slipMonth').value || new Date().toISOString().slice(0, 7);

    // Header
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('DS Financial Solutions', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Salary Slip - ' + month, 105, 25, { align: 'center' });

    // Employee Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Employee Name: ${name}`, 15, 50);
    doc.text(`Employee ID: ${empId}`, 120, 50);
    doc.text(`Department: ${dept}`, 15, 60);
    doc.text(`Designation: ${designation}`, 120, 60);

    // Earnings Table
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 75, 85, 10, 'F');
    doc.rect(110, 75, 85, 10, 'F');
    doc.setFontSize(12);
    doc.text('EARNINGS', 57, 82, { align: 'center' });
    doc.text('DEDUCTIONS', 152, 82, { align: 'center' });

    const basic = document.getElementById('slipBasic').value || 0;
    const hra = document.getElementById('slipHRA').value || 0;
    const conv = document.getElementById('slipConveyance').value || 0;
    const special = document.getElementById('slipSpecial').value || 0;
    const pf = document.getElementById('slipPF').value || 0;
    const pt = document.getElementById('slipPT').value || 0;
    const tds = document.getElementById('slipTDS').value || 0;

    doc.setFontSize(10);
    doc.text(`Basic Salary: ₹${formatIndianNumber(basic)}`, 20, 95);
    doc.text(`HRA: ₹${formatIndianNumber(hra)}`, 20, 105);
    doc.text(`Conveyance: ₹${formatIndianNumber(conv)}`, 20, 115);
    doc.text(`Special Allowance: ₹${formatIndianNumber(special)}`, 20, 125);

    doc.text(`PF: ₹${formatIndianNumber(pf)}`, 115, 95);
    doc.text(`Professional Tax: ₹${formatIndianNumber(pt)}`, 115, 105);
    doc.text(`TDS: ₹${formatIndianNumber(tds)}`, 115, 115);

    // Totals
    const gross = parseFloat(basic) + parseFloat(hra) + parseFloat(conv) + parseFloat(special);
    const deductions = parseFloat(pf) + parseFloat(pt) + parseFloat(tds);
    const net = gross - deductions;

    doc.line(15, 140, 195, 140);
    doc.setFontSize(11);
    doc.text(`Gross Salary: ₹${formatIndianNumber(gross)}`, 20, 150);
    doc.text(`Total Deductions: ₹${formatIndianNumber(deductions)}`, 115, 150);

    doc.setFillColor(30, 100, 80);
    doc.rect(15, 160, 180, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`NET SALARY: ₹${formatIndianNumber(net)}`, 105, 170, { align: 'center' });

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.text('This is a computer-generated salary slip. Generated by DS Financial Solutions.', 105, 280, { align: 'center' });

    doc.save(`salary_slip_${name}_${month}.pdf`);
    showToast('✅ Salary slip PDF downloaded!');
}

// Format number in Indian notation
function formatIndianNumber(num) {
    if (num === undefined || num === null) return '0';
    const str = num.toString();
    const parts = str.split('.');
    let intPart = parts[0];
    const decPart = parts.length > 1 ? '.' + parts[1] : '';

    const lastThree = intPart.substring(intPart.length - 3);
    const remaining = intPart.substring(0, intPart.length - 3);

    if (remaining !== '') {
        intPart = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }

    return intPart + decPart;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initMegaMenuSearch();
    initEMICalculator();
    initGratuityCalculator();
    initPFCalculator();
    initLeaveEncashmentCalculator();
    initSalarySlipGenerator();
    initLoanEligibility();
    initFDCalculator();
    initRDCalculator();
    initCTCCalculator();
    initNoticePeriod();
    initInvoiceGenerator();
    initProfitMargin();
    initROICalculator();
    initBreakeven();
    initStampDuty();
    initRentVsBuy();
    initRentalYield();
});

// ==================== REMAINING CALCULATORS ====================

// Loan Eligibility Calculator
function initLoanEligibility() {
    const btn = document.getElementById('calculateLoanEligibility');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const salary = parseFloat(document.getElementById('loanMonthlySalary').value) || 0;
        const existingEMI = parseFloat(document.getElementById('loanExistingEMI').value) || 0;
        const rate = parseFloat(document.getElementById('loanInterestRate').value) || 8.5;
        const tenure = parseInt(document.getElementById('loanTenure').value) || 20;

        // Max 50% of salary can go to EMIs
        const affordableEMI = (salary * 0.5) - existingEMI;
        const r = rate / 12 / 100;
        const n = tenure * 12;

        // Reverse EMI formula to get loan amount
        const maxLoan = affordableEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

        document.getElementById('maxLoanAmount').textContent = '₹' + formatIndianNumber(Math.round(maxLoan));
        document.getElementById('affordableEMI').textContent = '₹' + formatIndianNumber(Math.round(affordableEMI));
        document.getElementById('loanEligibilityResult').classList.remove('hidden');
        showToast('✅ Loan eligibility calculated!');
    });
}

// FD Calculator
function initFDCalculator() {
    const btn = document.getElementById('calculateFD');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const P = parseFloat(document.getElementById('fdPrincipal').value) || 0;
        const r = parseFloat(document.getElementById('fdRate').value) || 7;
        const t = parseFloat(document.getElementById('fdTenure').value) || 5;
        const compounding = document.getElementById('fdCompounding').value;

        let n = 4; // quarterly
        if (compounding === 'monthly') n = 12;
        if (compounding === 'yearly') n = 1;

        // A = P(1 + r/n)^(nt)
        const maturity = P * Math.pow(1 + (r / 100) / n, n * t);
        const interest = maturity - P;

        document.getElementById('fdMaturity').textContent = '₹' + formatIndianNumber(Math.round(maturity));
        document.getElementById('fdInterest').textContent = '₹' + formatIndianNumber(Math.round(interest));
        document.getElementById('fdResult').classList.remove('hidden');
        showToast('✅ FD calculated!');
    });
}

// RD Calculator
function initRDCalculator() {
    const btn = document.getElementById('calculateRD');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const P = parseFloat(document.getElementById('rdMonthly').value) || 0;
        const r = parseFloat(document.getElementById('rdRate').value) / 100 / 4; // quarterly rate
        const n = parseInt(document.getElementById('rdTenure').value) || 60;

        const totalDeposited = P * n;
        // RD Formula for quarterly compounding
        let maturity = 0;
        for (let i = 1; i <= n; i++) {
            maturity += P * Math.pow(1 + r, (n - i + 1) / 3);
        }
        const interest = maturity - totalDeposited;

        document.getElementById('rdDeposited').textContent = '₹' + formatIndianNumber(Math.round(totalDeposited));
        document.getElementById('rdInterestEarned').textContent = '₹' + formatIndianNumber(Math.round(interest));
        document.getElementById('rdMaturity').textContent = '₹' + formatIndianNumber(Math.round(maturity));
        document.getElementById('rdResult').classList.remove('hidden');
        showToast('✅ RD calculated!');
    });
}

// CTC to In-hand Calculator
function initCTCCalculator() {
    const btn = document.getElementById('calculateCTC');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const ctc = parseFloat(document.getElementById('ctcAnnual').value) || 0;
        const basicPercent = parseFloat(document.getElementById('ctcBasicPercent').value) || 40;
        const variable = parseFloat(document.getElementById('ctcVariable').value) || 0;

        const fixedCTC = ctc - variable;
        const monthly = fixedCTC / 12;
        const basic = (ctc * basicPercent / 100) / 12;

        // Deductions: PF (12% of basic), PT (200), ESI if applicable
        const pf = basic * 0.12;
        const pt = 200;
        const deductions = pf + pt;

        const inHand = monthly - deductions;

        document.getElementById('ctcGrossMonthly').textContent = '₹' + formatIndianNumber(Math.round(monthly));
        document.getElementById('ctcDeductions').textContent = '₹' + formatIndianNumber(Math.round(deductions));
        document.getElementById('ctcInHand').textContent = '₹' + formatIndianNumber(Math.round(inHand));
        document.getElementById('ctcResult').classList.remove('hidden');
        showToast('✅ In-hand salary calculated!');
    });
}

// Notice Period Buyout
function initNoticePeriod() {
    const btn = document.getElementById('calculateNotice');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const salary = parseFloat(document.getElementById('noticeSalary').value) || 0;
        const totalDays = parseInt(document.getElementById('noticeTotalDays').value) || 90;
        const servedDays = parseInt(document.getElementById('noticeServedDays').value) || 0;

        const daysLeft = totalDays - servedDays;
        const perDay = salary / 30;
        const buyout = perDay * daysLeft;

        document.getElementById('noticeDaysLeft').textContent = daysLeft + ' days';
        document.getElementById('noticeBuyout').textContent = '₹' + formatIndianNumber(Math.round(buyout));
        document.getElementById('noticeResult').classList.remove('hidden');
        showToast('✅ Buyout amount calculated!');
    });
}

// Invoice Generator
function initInvoiceGenerator() {
    const btn = document.getElementById('generateInvoice');
    if (!btn) return;

    // Set default date
    document.getElementById('invDate').valueAsDate = new Date();

    btn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('invAmount').value) || 0;
        const gstRate = parseFloat(document.getElementById('invGST').value) || 18;

        const gstAmount = amount * gstRate / 100;
        const total = amount + gstAmount;

        document.getElementById('invBase').textContent = '₹' + formatIndianNumber(amount);
        document.getElementById('invGSTAmount').textContent = '₹' + formatIndianNumber(gstAmount);
        document.getElementById('invTotal').textContent = '₹' + formatIndianNumber(total);
        document.getElementById('invoiceResult').classList.remove('hidden');
        showToast('✅ Invoice generated!');
    });
}

// Download Invoice PDF
function downloadInvoicePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const invNo = document.getElementById('invNumber').value || 'INV-001';
    const invDate = document.getElementById('invDate').value || new Date().toISOString().slice(0, 10);
    const client = document.getElementById('invClient').value || 'Client Name';
    const desc = document.getElementById('invDescription').value || 'Services';
    const amount = document.getElementById('invAmount').value || 0;
    const gstRate = document.getElementById('invGST').value || 18;

    const gstAmount = parseFloat(amount) * parseFloat(gstRate) / 100;
    const total = parseFloat(amount) + gstAmount;

    // Header
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('TAX INVOICE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('DS Financial Solutions', 105, 30, { align: 'center' });

    // Invoice Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Invoice No: ${invNo}`, 15, 55);
    doc.text(`Date: ${invDate}`, 140, 55);
    doc.text(`Bill To: ${client}`, 15, 70);

    // Table
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 85, 180, 10, 'F');
    doc.text('Description', 20, 92);
    doc.text('Amount', 160, 92);

    doc.text(desc, 20, 110);
    doc.text('₹' + formatIndianNumber(amount), 160, 110);

    doc.line(15, 125, 195, 125);
    doc.text(`Subtotal: ₹${formatIndianNumber(amount)}`, 130, 135);
    doc.text(`GST (${gstRate}%): ₹${formatIndianNumber(gstAmount)}`, 130, 145);

    doc.setFillColor(30, 100, 80);
    doc.rect(120, 155, 75, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`TOTAL: ₹${formatIndianNumber(total)}`, 157, 165, { align: 'center' });

    doc.save(`invoice_${invNo}.pdf`);
    showToast('✅ Invoice PDF downloaded!');
}

// Profit Margin Calculator
function initProfitMargin() {
    const btn = document.getElementById('calculateProfit');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const revenue = parseFloat(document.getElementById('profitRevenue').value) || 0;
        const cogs = parseFloat(document.getElementById('profitCOGS').value) || 0;
        const opex = parseFloat(document.getElementById('profitOpEx').value) || 0;
        const tax = parseFloat(document.getElementById('profitTax').value) || 0;

        const grossProfit = revenue - cogs;
        const operatingProfit = grossProfit - opex;
        const netProfit = operatingProfit - tax;

        const grossMargin = (grossProfit / revenue * 100).toFixed(1);
        const operatingMargin = (operatingProfit / revenue * 100).toFixed(1);
        const netMargin = (netProfit / revenue * 100).toFixed(1);

        document.getElementById('grossMargin').textContent = grossMargin + '%';
        document.getElementById('operatingMargin').textContent = operatingMargin + '%';
        document.getElementById('netMargin').textContent = netMargin + '%';
        document.getElementById('profitResult').classList.remove('hidden');
        showToast('✅ Margins calculated!');
    });
}

// ROI Calculator
function initROICalculator() {
    const btn = document.getElementById('calculateROI');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const initial = parseFloat(document.getElementById('roiInitial').value) || 0;
        const final = parseFloat(document.getElementById('roiFinal').value) || 0;
        const years = parseFloat(document.getElementById('roiYears').value) || 1;

        const gain = final - initial;
        const roi = (gain / initial * 100).toFixed(1);
        const annualROI = (Math.pow(final / initial, 1 / years) - 1) * 100;

        document.getElementById('roiGain').textContent = '₹' + formatIndianNumber(Math.round(gain));
        document.getElementById('roiPercent').textContent = roi + '%';
        document.getElementById('roiAnnual').textContent = annualROI.toFixed(1) + '%';
        document.getElementById('roiResult').classList.remove('hidden');
        showToast('✅ ROI calculated!');
    });
}

// Breakeven Calculator
function initBreakeven() {
    const btn = document.getElementById('calculateBreakeven');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const fixedCosts = parseFloat(document.getElementById('beFixedCosts').value) || 0;
        const price = parseFloat(document.getElementById('bePrice').value) || 0;
        const variableCost = parseFloat(document.getElementById('beVariableCost').value) || 0;

        const contribution = price - variableCost;
        const units = Math.ceil(fixedCosts / contribution);
        const revenue = units * price;

        document.getElementById('beContribution').textContent = '₹' + formatIndianNumber(contribution);
        document.getElementById('beUnits').textContent = units + ' units';
        document.getElementById('beRevenue').textContent = '₹' + formatIndianNumber(revenue);
        document.getElementById('breakevenResult').classList.remove('hidden');
        showToast('✅ Breakeven calculated!');
    });
}

// Stamp Duty Calculator
function initStampDuty() {
    const btn = document.getElementById('calculateStamp');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const state = document.getElementById('stampState').value;
        const value = parseFloat(document.getElementById('stampValue').value) || 0;
        const gender = document.getElementById('stampGender').value;

        // State-wise stamp duty rates (approximate)
        const rates = {
            maharashtra: { male: 6, female: 5, registration: 1 },
            karnataka: { male: 5, female: 4, registration: 1 },
            delhi: { male: 6, female: 4, registration: 1 },
            tamilnadu: { male: 7, female: 7, registration: 1 },
            gujarat: { male: 4.9, female: 4.9, registration: 1 },
            rajasthan: { male: 6, female: 5, registration: 1 },
            up: { male: 7, female: 6, registration: 1 },
            telangana: { male: 6, female: 6, registration: 0.5 }
        };

        let stampRate = rates[state]?.male || 5;
        if (gender === 'female') stampRate = rates[state]?.female || 4;
        if (gender === 'joint') stampRate = (rates[state]?.male + rates[state]?.female) / 2 || 4.5;

        const regRate = rates[state]?.registration || 1;

        const stampDuty = value * stampRate / 100;
        const registration = value * regRate / 100;
        const total = stampDuty + registration;

        document.getElementById('stampDutyAmount').textContent = '₹' + formatIndianNumber(Math.round(stampDuty));
        document.getElementById('stampRegistration').textContent = '₹' + formatIndianNumber(Math.round(registration));
        document.getElementById('stampTotal').textContent = '₹' + formatIndianNumber(Math.round(total));
        document.getElementById('stampResult').classList.remove('hidden');
        showToast('✅ Stamp duty calculated!');
    });
}

// Rent vs Buy Calculator
function initRentVsBuy() {
    const btn = document.getElementById('calculateRentVsBuy');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const price = parseFloat(document.getElementById('rvbPrice').value) || 0;
        const rent = parseFloat(document.getElementById('rvbRent').value) || 0;
        const loanRate = parseFloat(document.getElementById('rvbLoanRate').value) || 8.5;
        const appreciation = parseFloat(document.getElementById('rvbAppreciation').value) || 5;

        // Calculate 20-year EMI for 80% loan
        const loanAmount = price * 0.8;
        const r = loanRate / 12 / 100;
        const n = 20 * 12;
        const emi = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

        const diff = emi - rent;

        // Simple recommendation based on rent multiplier
        const priceToRent = price / (rent * 12);
        let recommendation = 'Rent';
        if (priceToRent < 20) recommendation = 'Buy';
        if (priceToRent >= 20 && priceToRent < 25) recommendation = 'Either';

        document.getElementById('rvbEMI').textContent = '₹' + formatIndianNumber(Math.round(emi));
        document.getElementById('rvbDiff').textContent = (diff >= 0 ? '+' : '') + '₹' + formatIndianNumber(Math.round(diff));
        document.getElementById('rvbRecommend').textContent = recommendation;
        document.getElementById('rvbResult').classList.remove('hidden');
        showToast('✅ Comparison complete!');
    });
}

// Rental Yield Calculator
function initRentalYield() {
    const btn = document.getElementById('calculateRentalYield');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const propertyValue = parseFloat(document.getElementById('ryPropertyValue').value) || 0;
        const monthlyRent = parseFloat(document.getElementById('ryRent').value) || 0;
        const annualExpenses = parseFloat(document.getElementById('ryExpenses').value) || 0;

        const annualRent = monthlyRent * 12;
        const netIncome = annualRent - annualExpenses;
        const yield = (netIncome / propertyValue * 100).toFixed(2);

        document.getElementById('ryAnnualRent').textContent = '₹' + formatIndianNumber(annualRent);
        document.getElementById('ryNetIncome').textContent = '₹' + formatIndianNumber(netIncome);
        document.getElementById('ryYield').textContent = yield + '%';
        document.getElementById('ryResult').classList.remove('hidden');
        showToast('✅ Rental yield calculated!');
    });
}

// ==================== DASHBOARD & CALENDAR ====================

// Initialize Dashboard Charts
function initDashboardCharts() {
    // Pie Chart - Tax Savings Breakdown
    const pieCtx = document.getElementById('dashboardPieChart');
    if (pieCtx && typeof Chart !== 'undefined') {
        new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['80C (PPF, ELSS)', '80D (Health)', 'HRA Exemption', 'NPS (80CCD)', 'Other'],
                datasets: [{
                    data: [150000, 50000, 120000, 50000, 30000],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }

    // Bar Chart - Popular Tools
    const barCtx = document.getElementById('dashboardBarChart');
    if (barCtx && typeof Chart !== 'undefined') {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Tax Regime', 'EMI Calc', 'GST', 'Gratuity', 'SIP', 'PF'],
                datasets: [{
                    label: 'Usage Count',
                    data: [1250, 980, 850, 720, 680, 590],
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// Initialize Tax Calendar
function initTaxCalendar() {
    const deadlines = [
        { date: '2025-01-15', title: 'Advance Tax - 3rd Installment' },
        { date: '2025-01-31', title: 'TDS Return - Q3' },
        { date: '2025-03-15', title: 'Advance Tax - 4th Installment' },
        { date: '2025-03-31', title: 'Financial Year End' },
        { date: '2025-05-31', title: 'TDS Return - Q4' },
        { date: '2025-07-31', title: 'ITR Filing Deadline' },
        { date: '2025-10-31', title: 'ITR Filing (Audit Cases)' },
        { date: '2025-12-31', title: 'GSTR-9 Annual Return' }
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find next upcoming deadline
    let nextDeadline = null;
    for (const d of deadlines) {
        const dDate = new Date(d.date);
        if (dDate >= today) {
            nextDeadline = { ...d, dateObj: dDate };
            break;
        }
    }

    // Update next deadline alert
    if (nextDeadline) {
        const daysLeft = Math.ceil((nextDeadline.dateObj - today) / (1000 * 60 * 60 * 24));
        document.getElementById('nextDeadlineText').textContent = nextDeadline.title + ' - ' + nextDeadline.date;
        document.getElementById('deadlineCountdown').textContent = daysLeft + ' days remaining';

        if (daysLeft <= 7) {
            document.getElementById('deadlineCountdown').style.background = '#dc2626';
        } else if (daysLeft <= 30) {
            document.getElementById('deadlineCountdown').style.background = '#f59e0b';
        } else {
            document.getElementById('deadlineCountdown').style.background = '#10b981';
        }
    }

    // Update deadline item statuses
    document.querySelectorAll('.deadline-item[data-date]').forEach(item => {
        const dateStr = item.getAttribute('data-date');
        const deadlineDate = new Date(dateStr);
        const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        const statusEl = item.querySelector('.deadline-status');

        if (daysUntil < 0) {
            item.classList.add('passed-status');
            if (statusEl) {
                statusEl.textContent = 'Passed';
                statusEl.style.background = '#f1f5f9';
                statusEl.style.color = '#64748b';
            }
        } else if (daysUntil <= 7) {
            item.classList.add('critical-status');
            if (statusEl) {
                statusEl.textContent = daysUntil + ' days!';
                statusEl.style.background = '#fef2f2';
                statusEl.style.color = '#dc2626';
            }
        } else if (daysUntil <= 30) {
            item.classList.add('warning-status');
            if (statusEl) {
                statusEl.textContent = daysUntil + ' days';
                statusEl.style.background = '#fffbeb';
                statusEl.style.color = '#d97706';
            }
        } else {
            if (statusEl) {
                statusEl.textContent = daysUntil + ' days';
                statusEl.style.background = '#ecfdf5';
                statusEl.style.color = '#059669';
            }
        }
    });
}

// Download Calendar PDF
function downloadCalendarPDF() {
    if (typeof window.jspdf === 'undefined') {
        showToast('📥 Loading PDF library...');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Tax Deadline Calendar FY 2024-25', 105, 18, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    const deadlines = [
        ['15 Jan 2025', 'Advance Tax - 3rd Installment (75%)'],
        ['31 Jan 2025', 'TDS Return Q3 (Oct-Dec 2024)'],
        ['15 Mar 2025', 'Advance Tax - 4th Installment (100%)'],
        ['31 Mar 2025', 'Financial Year End - Complete 80C investments'],
        ['31 May 2025', 'TDS Return Q4 (Jan-Mar 2025)'],
        ['31 Jul 2025', 'ITR Filing Deadline (Non-audit)'],
        ['31 Oct 2025', 'ITR Filing (Audit cases)'],
        ['31 Dec 2025', 'GSTR-9 Annual Return']
    ];

    let y = 45;
    deadlines.forEach(([date, desc]) => {
        doc.setFillColor(99, 102, 241);
        doc.rect(15, y - 5, 40, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(date, 35, y + 2, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        doc.text(desc, 60, y + 2);
        y += 15;
    });

    // Monthly GST
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(139, 92, 246);
    doc.text('Monthly Recurring Deadlines:', 15, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('• 7th: TDS Payment', 20, y);
    doc.text('• 11th: GSTR-1 Filing', 20, y + 8);
    doc.text('• 20th: GSTR-3B Filing', 20, y + 16);

    doc.save('tax_calendar_fy2024-25.pdf');
    showToast('✅ Calendar PDF downloaded!');
}

// Add to Google Calendar
function addToGoogleCalendar() {
    const events = [
        { title: 'Advance Tax 3rd Installment', date: '20250115' },
        { title: 'TDS Return Q3', date: '20250131' },
        { title: 'Advance Tax 4th Installment', date: '20250315' },
        { title: 'FY End - Tax Investments', date: '20250331' },
        { title: 'ITR Filing Deadline', date: '20250731' }
    ];

    // Open first event in Google Calendar
    const e = events[0];
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.date}/${e.date}&details=Tax+deadline+reminder+from+DS+Financial+Portal`;
    window.open(url, '_blank');
    showToast('🗓️ Opening Google Calendar...');
}

// Add initialization calls
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initDashboardCharts();
        initTaxCalendar();
    }, 500);
});

// ==================== YEAR CALENDAR MODAL ====================

function openYearCalendar() {
    document.getElementById('yearCalendarModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeYearCalendar() {
    document.getElementById('yearCalendarModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeYearCalendar();
    }
});

// Close on overlay click
document.getElementById('yearCalendarModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'yearCalendarModal') {
        closeYearCalendar();
    }
});

// Download Full Year Calendar PDF
function downloadFullCalendarPDF() {
    if (typeof window.jspdf === 'undefined') {
        showToast('📥 Loading PDF library...');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Compliance Calendar 2025 - Tax, GST, ESIC, PF & TDS', 105, 15, { align: 'center' });

    let y = 35;

    // Legend
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52); doc.text('● Tax', 15, y);
    doc.setTextColor(30, 64, 175); doc.text('● GST', 35, y);
    doc.setTextColor(146, 64, 14); doc.text('● PF/ESIC', 55, y);
    doc.setTextColor(157, 23, 77); doc.text('● TDS', 85, y);

    y += 10;
    doc.setTextColor(0, 0, 0);

    const monthData = [
        { name: 'January', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '15: Advance Tax Q3', '20: GSTR-3B', '31: TDS Return Q3'] },
        { name: 'February', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '20: GSTR-3B'] },
        { name: 'March', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '15: Advance Tax Q4', '20: GSTR-3B', '31: FY End'] },
        { name: 'April', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '20: GSTR-3B', '25: ESIC Return', '30: TDS Return Q4'] },
        { name: 'May', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '20: GSTR-3B', '31: TDS Return (Govt)'] },
        { name: 'June', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '15: Advance Tax Q1', '20: GSTR-3B'] },
        { name: 'July', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '20: GSTR-3B', '31: TDS Return Q1', '31: ITR Deadline'] },
        { name: 'August', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '20: GSTR-3B'] },
        { name: 'September', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '15: Advance Tax Q2', '20: GSTR-3B'] },
        { name: 'October', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '20: GSTR-3B', '31: TDS Return Q2', '31: ITR (Audit)'] },
        { name: 'November', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '20: GSTR-3B', '25: ESIC Return'] },
        { name: 'December', dates: ['7: TDS Payment', '11: GSTR-1', '15: PF/ESIC', '15: Advance Tax Q3', '20: GSTR-3B', '31: GSTR-9 Annual'] }
    ];

    doc.setFontSize(8);
    let col = 0;
    let startY = y;

    monthData.forEach((month, idx) => {
        const x = 15 + (col * 65);
        let currentY = startY;

        doc.setFillColor(30, 58, 95);
        doc.rect(x - 2, currentY - 4, 60, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(month.name, x, currentY);

        currentY += 8;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(7);

        month.dates.forEach(d => {
            doc.text('• ' + d, x, currentY);
            currentY += 5;
        });

        col++;
        if (col === 3) {
            col = 0;
            startY += 55;
        }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by DS Financial Portal - dsfinancial.surge.sh', 105, 285, { align: 'center' });

    doc.save('compliance_calendar_2025.pdf');
    showToast('✅ Full calendar PDF downloaded!');
    closeYearCalendar();
}

// ==================== MOBILE BOTTOM NAVIGATION ====================

document.querySelectorAll('.mobile-nav-item[data-tool]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = item.getAttribute('data-tool');

        // Update active state
        document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Navigate to tool
        navigateToTool(toolId);
    });
});

// ==================== SHARE FUNCTIONALITY ====================

let currentShareText = '';

function openShareModal(title, content) {
    currentShareText = `📊 ${title}\n\n${content}\n\n🔗 Calculate yours at: dsfinancial.surge.sh`;
    document.getElementById('sharePreview').textContent = currentShareText;
    document.getElementById('shareModal').classList.remove('hidden');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.add('hidden');
}

function shareViaWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(currentShareText)}`;
    window.open(url, '_blank');
    showToast('📱 Opening WhatsApp...');
    closeShareModal();
}

function copyToClipboard() {
    navigator.clipboard.writeText(currentShareText).then(() => {
        showToast('✅ Copied to clipboard!');
        closeShareModal();
    }).catch(() => {
        showToast('❌ Failed to copy');
    });
}

function shareViaEmail() {
    const subject = encodeURIComponent('Calculation Results from DS Financial Portal');
    const body = encodeURIComponent(currentShareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    closeShareModal();
}

// Generic share function for calculators
function shareResults(toolName, resultData) {
    let content = '';
    for (const [key, value] of Object.entries(resultData)) {
        content += `${key}: ${value}\n`;
    }
    openShareModal(toolName, content);
}

// Share Receipt
function shareReceipt() {
    const receiptNum = document.getElementById('receiptNumber').value;
    const amount = document.getElementById('receiptAmount').value;
    const payer = document.getElementById('receiptPayer').value || 'N/A';
    const purpose = document.getElementById('receiptPurpose').value || 'N/A';

    openShareModal('Payment Receipt',
        `Receipt No: ${receiptNum}\nAmount: ₹${formatIndianNumber(amount)}\nReceived From: ${payer}\nPurpose: ${purpose}`
    );
}

// Close share modal on overlay click
document.getElementById('shareModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'shareModal') closeShareModal();
});

// ==================== PAYMENT RECEIPT GENERATOR ====================

function initPaymentReceipt() {
    // Set default date
    const dateInput = document.getElementById('receiptDate');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    const btn = document.getElementById('generateReceipt');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('receiptAmount').value) || 0;
        const receiptNum = document.getElementById('receiptNumber').value || 'REC-001';

        document.getElementById('receiptPreview').textContent = receiptNum;
        document.getElementById('receiptAmountDisplay').textContent = '₹' + formatIndianNumber(amount);
        document.getElementById('receiptResult').classList.remove('hidden');
        showToast('✅ Receipt generated!');
    });
}

function downloadReceiptPDF() {
    if (typeof window.jspdf === 'undefined') {
        showToast('📥 Loading PDF library...');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const receiptNum = document.getElementById('receiptNumber').value || 'REC-001';
    const receiptDate = document.getElementById('receiptDate').value || new Date().toISOString().slice(0, 10);
    const payer = document.getElementById('receiptPayer').value || 'N/A';
    const amount = parseFloat(document.getElementById('receiptAmount').value) || 0;
    const purpose = document.getElementById('receiptPurpose').value || 'Payment received';
    const mode = document.getElementById('receiptMode').value || 'Cash';
    const receiver = document.getElementById('receiptReceiver').value || 'DS Financial Solutions';

    // Header
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('PAYMENT RECEIPT', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text(receiver, 105, 28, { align: 'center' });

    // Receipt Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    doc.text(`Receipt No: ${receiptNum}`, 15, 50);
    doc.text(`Date: ${receiptDate}`, 140, 50);

    doc.setFillColor(240, 240, 240);
    doc.rect(15, 60, 180, 40, 'F');

    doc.setFontSize(12);
    doc.text('Received From:', 20, 72);
    doc.setFont(undefined, 'bold');
    doc.text(payer, 65, 72);

    doc.setFont(undefined, 'normal');
    doc.text('Purpose:', 20, 85);
    doc.text(purpose, 65, 85);

    // Amount Box
    doc.setFillColor(5, 150, 105);
    doc.rect(15, 110, 180, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Amount Received:', 25, 125);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('₹' + formatIndianNumber(amount), 100, 128);

    // Payment Mode
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Payment Mode: ${mode}`, 15, 155);

    // Amount in Words (simple conversion)
    const words = numberToWords(amount);
    doc.text(`Amount in Words: ${words} Rupees Only`, 15, 170);

    // Signature Line
    doc.line(130, 210, 190, 210);
    doc.setFontSize(10);
    doc.text('Authorized Signatory', 145, 218);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated receipt. Generated via dsfinancial.surge.sh', 105, 280, { align: 'center' });

    doc.save(`receipt_${receiptNum}.pdf`);
    showToast('✅ Receipt PDF downloaded!');
}

// Simple number to words (for amounts up to crores)
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';
    if (num < 0) return 'Negative ' + numberToWords(-num);

    let result = '';

    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const hundred = Math.floor(num / 100);
    num %= 100;

    if (crore > 0) result += numberToWords(crore) + ' Crore ';
    if (lakh > 0) result += numberToWords(lakh) + ' Lakh ';
    if (thousand > 0) result += numberToWords(thousand) + ' Thousand ';
    if (hundred > 0) result += ones[hundred] + ' Hundred ';

    if (num > 0) {
        if (num < 20) {
            result += ones[num];
        } else {
            result += tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
        }
    }

    return result.trim();
}

// Initialize payment receipt on load
document.addEventListener('DOMContentLoaded', () => {
    initPaymentReceipt();
});

// ==================== HTML TO PDF CONVERTER ====================

let uploadedHtmlContent = '';

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');

        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tab + 'Tab').classList.add('active');
    });
});

// File upload handling
const htmlFileInput = document.getElementById('htmlFileInput');
const htmlDropZone = document.getElementById('htmlDropZone');
const uploadedFileName = document.getElementById('uploadedFileName');

if (htmlFileInput) {
    htmlFileInput.addEventListener('change', (e) => {
        handleHtmlFile(e.target.files[0]);
    });
}

if (htmlDropZone) {
    htmlDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        htmlDropZone.classList.add('dragover');
    });

    htmlDropZone.addEventListener('dragleave', () => {
        htmlDropZone.classList.remove('dragover');
    });

    htmlDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        htmlDropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.html') || file.name.endsWith('.htm'))) {
            handleHtmlFile(file);
        } else {
            showToast('❌ Please upload an HTML file');
        }
    });

    htmlDropZone.addEventListener('click', () => {
        htmlFileInput?.click();
    });
}

function handleHtmlFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedHtmlContent = e.target.result;
        if (uploadedFileName) {
            uploadedFileName.classList.remove('hidden');
            uploadedFileName.querySelector('span').textContent = file.name;
        }
        showToast('✅ File uploaded: ' + file.name);
    };
    reader.readAsText(file);
}

// Preview button
const previewBtn = document.getElementById('previewHtml');
if (previewBtn) {
    previewBtn.addEventListener('click', () => {
        const pasteTab = document.querySelector('.tab-btn[data-tab="paste"]');
        const isPasteMode = pasteTab?.classList.contains('active');

        let htmlContent = '';
        if (isPasteMode) {
            htmlContent = document.getElementById('htmlCodeInput')?.value || '';
        } else {
            htmlContent = uploadedHtmlContent;
        }

        if (!htmlContent.trim()) {
            showToast('❌ Please upload a file or paste HTML code first');
            return;
        }

        // Show preview
        const previewFrame = document.getElementById('htmlPreviewFrame');
        const previewSection = document.getElementById('htmlPreviewSection');

        if (previewFrame && previewSection) {
            // Create sandboxed iframe for preview
            previewFrame.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width:100%; height:400px; border:none;';
            iframe.sandbox = 'allow-same-origin';
            previewFrame.appendChild(iframe);

            // Write content to iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(htmlContent);
            iframeDoc.close();

            previewSection.classList.remove('hidden');
            showToast('✅ Preview generated!');
        }
    });
}

// Convert HTML to PDF
function convertHtmlToPdf() {
    if (typeof window.jspdf === 'undefined') {
        showToast('📥 Loading PDF library...');
        return;
    }

    const pasteTab = document.querySelector('.tab-btn[data-tab="paste"]');
    const isPasteMode = pasteTab?.classList.contains('active');

    let htmlContent = '';
    if (isPasteMode) {
        htmlContent = document.getElementById('htmlCodeInput')?.value || '';
    } else {
        htmlContent = uploadedHtmlContent;
    }

    if (!htmlContent.trim()) {
        showToast('❌ No HTML content to convert');
        return;
    }

    const fileName = document.getElementById('pdfFileName')?.value || 'converted-document';
    const pageSize = document.getElementById('pdfPageSize')?.value || 'a4';

    showToast('⏳ Generating PDF...');

    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = 'position:absolute; left:-9999px; width:800px; padding:20px; background:white;';
    tempContainer.innerHTML = htmlContent;
    document.body.appendChild(tempContainer);

    // Use html2canvas if available, otherwise use jspdf directly
    if (typeof html2canvas !== 'undefined') {
        html2canvas(tempContainer, { scale: 2, useCORS: true }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', pageSize);

            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(fileName + '.pdf');
            showToast('✅ PDF downloaded: ' + fileName + '.pdf');
            document.body.removeChild(tempContainer);
        }).catch(err => {
            console.error('html2canvas error:', err);
            fallbackPdfGeneration(htmlContent, fileName, pageSize);
            document.body.removeChild(tempContainer);
        });
    } else {
        fallbackPdfGeneration(htmlContent, fileName, pageSize);
        document.body.removeChild(tempContainer);
    }
}

function fallbackPdfGeneration(htmlContent, fileName, pageSize) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', pageSize);

    // Strip HTML tags for basic text extraction
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    // Basic text PDF
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(textContent, 180);
    let y = 20;

    for (let i = 0; i < lines.length; i++) {
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        doc.text(lines[i], 15, y);
        y += 7;
    }

    doc.save(fileName + '.pdf');
    showToast('✅ PDF downloaded (text only): ' + fileName + '.pdf');
}

function printHtmlPreview() {
    const previewFrame = document.getElementById('htmlPreviewFrame');
    const iframe = previewFrame?.querySelector('iframe');

    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.print();
    } else {
        showToast('❌ Please preview the HTML first');
    }
}

// Enhanced HTML to PDF conversion with all options
function convertHtmlToPdfEnhanced() {
    // Get HTML content
    const pasteTab = document.querySelector('.tab-btn[data-tab="paste"]');
    const isPasteMode = pasteTab?.classList.contains('active');

    let htmlContent = '';
    if (isPasteMode) {
        htmlContent = document.getElementById('htmlCodeInput')?.value || '';
    } else {
        htmlContent = uploadedHtmlContent;
    }

    if (!htmlContent.trim()) {
        showToast('❌ Please upload a file or paste HTML code first');
        return;
    }

    // Get settings
    const fileName = document.getElementById('pdfFileName')?.value || 'converted-document';
    const pageSize = document.getElementById('pdfPageSize')?.value || 'a4';
    const orientation = document.getElementById('pdfOrientation')?.value || 'p';
    const marginVal = parseInt(document.getElementById('pdfMargins')?.value || '20');
    const addPageNumbers = document.getElementById('pdfPageNumbers')?.checked || false;
    const includeDate = document.getElementById('pdfIncludeDate')?.checked || false;

    // Show loading
    const loadingEl = document.getElementById('pdfLoading');
    if (loadingEl) loadingEl.classList.remove('hidden');
    showToast('⏳ Generating PDF...');

    // Create temp container
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = 'position:absolute; left:-9999px; width:' + (orientation === 'l' ? '1000px' : '800px') + '; padding:20px; background:white;';
    tempContainer.innerHTML = htmlContent;
    document.body.appendChild(tempContainer);

    // Wait for html2canvas to load
    const waitForHtml2Canvas = () => {
        if (typeof html2canvas === 'undefined') {
            setTimeout(waitForHtml2Canvas, 100);
            return;
        }

        html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF(orientation, 'mm', pageSize);

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pdfWidth - (marginVal * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                const imgData = canvas.toDataURL('image/jpeg', 0.95);

                let heightLeft = imgHeight;
                let position = marginVal;
                let pageNum = 1;

                // Add first page content
                pdf.addImage(imgData, 'JPEG', marginVal, position, imgWidth, imgHeight);

                // Add header/footer to first page
                addHeaderFooter(pdf, pageNum, addPageNumbers, includeDate, pdfWidth, pdfHeight);

                heightLeft -= (pdfHeight - marginVal * 2);

                // Add more pages if needed
                while (heightLeft > 0) {
                    pdf.addPage();
                    pageNum++;
                    position = marginVal - (imgHeight - heightLeft);
                    pdf.addImage(imgData, 'JPEG', marginVal, position, imgWidth, imgHeight);
                    addHeaderFooter(pdf, pageNum, addPageNumbers, includeDate, pdfWidth, pdfHeight);
                    heightLeft -= (pdfHeight - marginVal * 2);
                }

                pdf.save(fileName + '.pdf');
                showToast('✅ PDF downloaded successfully: ' + fileName + '.pdf');

            } catch (err) {
                console.error('PDF generation error:', err);
                showToast('❌ Error generating PDF. Try the Print option instead.');
            }

            document.body.removeChild(tempContainer);
            if (loadingEl) loadingEl.classList.add('hidden');

        }).catch(err => {
            console.error('html2canvas error:', err);
            showToast('❌ Error capturing HTML. Trying fallback method...');
            fallbackPdfGeneration(htmlContent, fileName, pageSize);
            document.body.removeChild(tempContainer);
            if (loadingEl) loadingEl.classList.add('hidden');
        });
    };

    waitForHtml2Canvas();
}

// Add header and footer to PDF page
function addHeaderFooter(pdf, pageNum, addPageNumbers, includeDate, pdfWidth, pdfHeight) {
    pdf.setFontSize(9);
    pdf.setTextColor(128, 128, 128);

    // Add date if enabled
    if (includeDate) {
        const today = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        pdf.text(today, 10, 8);
    }

    // Add page number if enabled
    if (addPageNumbers) {
        const pageText = 'Page ' + pageNum;
        const textWidth = pdf.getTextWidth(pageText);
        pdf.text(pageText, pdfWidth - textWidth - 10, pdfHeight - 5);
    }

    pdf.setTextColor(0, 0, 0);
}

// Open HTML in new window
function openInNewWindow() {
    const pasteTab = document.querySelector('.tab-btn[data-tab="paste"]');
    const isPasteMode = pasteTab?.classList.contains('active');

    let htmlContent = '';
    if (isPasteMode) {
        htmlContent = document.getElementById('htmlCodeInput')?.value || '';
    } else {
        htmlContent = uploadedHtmlContent;
    }

    if (!htmlContent.trim()) {
        showToast('❌ No HTML content to open');
        return;
    }

    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}


// Load html2canvas dynamically if not present
if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);
}

// ==================== BUSINESS TOOLS DROPDOWN ====================

function toggleBusinessTools() {
    const dropdown = document.getElementById('businessToolsDropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

function closeBusinessTools() {
    const dropdown = document.getElementById('businessToolsDropdown');
    if (dropdown) {
        dropdown.classList.remove('open');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('businessToolsDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

// Close dropdown on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBusinessTools();
    }
});
