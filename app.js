// ----- Multipliers and Data -----

const usageTypes = {
  dataServices: [
    {
      id: 'batch-pipeline',
      name: 'Batch Data Pipeline',
      description: 'Ingesting data through Data Streams to Data Cloud',
      multiplier: 2000,
      unit: '1M rows'
    },
    {
      id: 'streaming-pipeline',
      name: 'Streaming Data Pipeline',
      description: 'Real-time data ingestion from web, mobile, APIs',
      multiplier: 5000,
      unit: '1M rows'
    },
    {
      id: 'batch-transforms',
      name: 'Batch Data Transforms',
      description: 'Data transformation during batch processing',
      multiplier: 400,
      unit: '1M rows'
    },
    {
      id: 'streaming-transforms',
      name: 'Streaming Data Transforms',
      description: 'Real-time data transformation',
      multiplier: 5000,
      unit: '1M rows'
    },
    {
      id: 'profile-unification',
      name: 'Batch Profile Unification',
      description: 'Identity resolution and profile merging',
      multiplier: 100000,
      unit: '1M profiles'
    },
    {
      id: 'data-federation',
      name: 'Data Federation (Zero-Copy)',
      description: 'Querying external data without copying',
      multiplier: 70,
      unit: '1M rows accessed'
    },
    {
      id: 'data-queries',
      name: 'Data Queries',
      description: 'Standard data queries and reports',
      multiplier: 2,
      unit: '1M rows processed'
    },
    {
      id: 'accelerated-queries',
      name: 'Accelerated Data Queries',
      description: 'High-performance data queries',
      multiplier: 2,
      unit: '1M rows processed'
    },
    {
      id: 'batch-insights',
      name: 'Batch Calculated Insights',
      description: 'Batch calculation of derived metrics',
      multiplier: 15,
      unit: '1M rows processed'
    },
    {
      id: 'streaming-insights',
      name: 'Streaming Calculated Insights',
      description: 'Real-time calculated insights',
      multiplier: 800,
      unit: '1M rows processed'
    },
    {
      id: 'realtime-events',
      name: 'Sub-Second Real-Time Events',
      description: 'High-frequency real-time event processing',
      multiplier: 70000,
      unit: '1M events'
    },
    {
      id: 'unstructured-data',
      name: 'Unstructured Data',
      description: 'Processing PDFs, images, documents',
      multiplier: 60,
      unit: '1MB processed'
    },
    {
      id: 'profile-api',
      name: 'Real-Time Profile API',
      description: 'Real-time profile API requests',
      multiplier: 900,
      unit: '1M API calls'
    },
    {
      id: 'ai-inferences',
      name: 'Inferences (AI/ML)',
      description: 'Einstein predictions and AI processing',
      multiplier: 3500,
      unit: '1M inferences'
    }
  ],

  segmentationActivation: [
    {
      id: 'segment-processing',
      name: 'Segment Processing',
      description: 'Creating and updating audience segments',
      multiplier: 20,
      unit: '1M rows processed'
    },
    {
      id: 'batch-activation',
      name: 'Batch Activation',
      description: 'Batch activation to target systems',
      multiplier: 10,
      unit: '1M rows activated'
    },
    {
      id: 'streaming-activation',
      name: 'Streaming Activation',
      description: 'Real-time activation and personalization',
      multiplier: 1600,
      unit: '1M rows activated'
    }
  ]
};

const frequencyMultipliers = {
  'onetime': 1,
  'daily': 365,
  'weekly': 52,
  'monthly': 12
};

const pricing = {
  creditsPerPackage: 100000,
  costPerPackage: 1000
};

const optimizationTips = [
  { category: 'Data Ingestion', tip: 'Use batch processing over streaming when real-time isn\'t required - it\'s 2.5x cheaper.' },
  { category: 'Profile Unification', tip: 'Profile unification is the most expensive operation - only unify necessary data.' },
  { category: 'Data Quality', tip: 'Clean and deduplicate data before ingestion to avoid unnecessary processing.' },
  { category: 'Query Optimization', tip: 'Use data federation (zero-copy) for occasional queries instead of full ingestion.' },
  { category: 'Scheduling', tip: 'Schedule calculated insights and segments based on business needs.' },
  { category: 'Development', tip: 'Test with small samples before processing full datasets.' }
];

// --- Helper functions ---
function formatNumber(n) {
  if (isNaN(n)) return '0';
  return n.toLocaleString();
}

// --- UI Rendering ---

function renderSection(title, items, sectionId) {
  let html = `<h2>${title}</h2>`;
  items.forEach(item => {
    html += `
      <div class="section-card" id="card-${item.id}">
        <div class="usage-item">
          <div class="usage-info">
            <label for="input-${item.id}">${item.name}</label>
            <p class="usage-description">${item.description}</p>
            <span class="multiplier-info">${formatNumber(item.multiplier)} credits per ${item.unit}</span>
          </div>
          <div class="input-group">
            <input type="number" min="0" step="any" id="input-${item.id}"
              class="form-control" placeholder="Volume (${item.unit.split(' ')[1]})">
            <select id="freq-${item.id}" class="form-control">
              <option value="onetime">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <span class="credits-output" id="credits-${item.id}">0 credits</span>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById(sectionId).innerHTML = html;
}

// --- Calculation ---
function calculateCredits(qty, multiplier, freq) {
  if (!qty || isNaN(qty) || qty <= 0) return 0;
  const freqMult = frequencyMultipliers[freq] || 1;
  return qty * multiplier * freqMult;
}

// --- Export Functions ---
function exportToPDF() {
  const data = collectExportData();
  generatePDF(data);
}

function exportToHTML() {
  const data = collectExportData();
  const htmlContent = generateHTMLReport(data);
  const newWindow = window.open('', '_blank');
  newWindow.document.write(htmlContent);
  newWindow.document.close();
}

function collectExportData() {
  const exportData = {
    timestamp: new Date().toISOString(),
    calculator: 'Salesforce Data Cloud Credit Calculator',
    summary: {
      totalAnnualCredits: 0,
      totalMonthlyCredits: 0,
      totalDailyCredits: 0
    },
    services: []
  };

  let totalAnnual = 0, totalMonthly = 0, totalDaily = 0;

  [...usageTypes.dataServices, ...usageTypes.segmentationActivation].forEach(item => {
    const input = document.getElementById('input-' + item.id);
    const freqSel = document.getElementById('freq-' + item.id);
    const qty = parseFloat(input.value) || 0;
    const freq = freqSel.value;
    const credits = calculateCredits(qty, item.multiplier, freq);

    if (qty > 0) {
      const serviceData = {
        name: item.name,
        description: item.description,
        volume: qty,
        unit: item.unit,
        frequency: freq,
        multiplier: item.multiplier,
        totalCredits: credits
      };

      // Calculate for summary
      if (freq === 'onetime') {
        totalAnnual += credits;
      } else if (freq === 'daily') {
        totalAnnual += credits;
        totalDaily += credits / 365;
        totalMonthly += credits / 12;
      } else if (freq === 'weekly') {
        totalAnnual += credits;
        totalDaily += credits / 365;
        totalMonthly += credits / 12;
      } else if (freq === 'monthly') {
        totalAnnual += credits;
        totalMonthly += credits;
        totalDaily += credits / 30;
      }

      exportData.services.push(serviceData);
    }
  });

  exportData.summary.totalAnnualCredits = totalAnnual;
  exportData.summary.totalMonthlyCredits = totalMonthly;
  exportData.summary.totalDailyCredits = totalDaily;

  return exportData;
}

function generatePDF(data) {
  const htmlContent = generateHTMLReport(data);
  
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print dialog
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

function generateHTMLReport(data) {
  const currentDate = new Date(data.timestamp).toLocaleDateString();
  const currentTime = new Date(data.timestamp).toLocaleTimeString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Salesforce Data Cloud Credit Calculation Report</title>
      <style>
        @media print {
          @page { margin: 1in; }
          body { font-family: Arial, sans-serif; }
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0176d3;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0176d3;
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .summary h2 {
          color: #0176d3;
          margin-top: 0;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-top: 15px;
        }
        .summary-item {
          text-align: center;
          padding: 15px;
          background: white;
          border-radius: 6px;
          border: 1px solid #ddd;
        }
        .summary-item .label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .summary-item .value {
          font-size: 18px;
          font-weight: bold;
          color: #0176d3;
        }
        .services {
          margin-bottom: 30px;
        }
        .services h2 {
          color: #0176d3;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .service-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .service-name {
          font-weight: bold;
          color: #333;
          font-size: 16px;
        }
        .service-credits {
          font-weight: bold;
          color: #0176d3;
          font-size: 16px;
        }
        .service-details {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          font-size: 14px;
          color: #666;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        @media print {
          .summary-grid { grid-template-columns: 1fr; }
          .service-details { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Salesforce Data Cloud Credit Calculation Report</h1>
        <p>Generated on ${currentDate} at ${currentTime}</p>
      </div>
      
      <div class="summary">
        <h2>Credit Usage Summary</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="label">Annual Credits</div>
            <div class="value">${formatNumber(data.summary.totalAnnualCredits)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Monthly Credits</div>
            <div class="value">${formatNumber(data.summary.totalMonthlyCredits)}</div>
          </div>
          <div class="summary-item">
            <div class="label">Daily Credits</div>
            <div class="value">${formatNumber(data.summary.totalDailyCredits)}</div>
          </div>
        </div>
      </div>
      
      <div class="services">
        <h2>Service Details</h2>
        ${data.services.map(service => `
          <div class="service-item">
            <div class="service-header">
              <div class="service-name">${service.name}</div>
              <div class="service-credits">${formatNumber(service.totalCredits)} credits</div>
            </div>
            <div class="service-details">
              <div><strong>Volume:</strong> ${formatNumber(service.volume)} ${service.unit}</div>
              <div><strong>Frequency:</strong> ${service.frequency}</div>
              <div><strong>Multiplier:</strong> ${service.multiplier}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="footer">
        <p>This report was generated by the Salesforce Data Cloud Credit Calculator</p>
        <p>For more information, visit your Salesforce Data Cloud documentation</p>
      </div>
    </body>
    </html>
  `;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Main rendering ---
document.addEventListener('DOMContentLoaded', function () {
  // Sections in your .html
  let main = document.getElementById('calculator-sections');
  if (!main) return;

  // Create main sections
  let dsSection = document.createElement('div');
  dsSection.id = "data-services-sections";
  main.appendChild(dsSection);

  let saSection = document.createElement('div');
  saSection.id = "segmentation-sections";
  main.appendChild(saSection);

  renderSection('Data Services Credits', usageTypes.dataServices, 'data-services-sections');
  renderSection('Segmentation & Activation Credits', usageTypes.segmentationActivation, 'segmentation-sections');

  // Setup event listeners and dashboard calc
  let allItems = [...usageTypes.dataServices, ...usageTypes.segmentationActivation];

  function updateTotals() {
    let totalDaily = 0, totalMonthly = 0, totalAnnual = 0;
    let totalCredits = 0;
    let details = [];
    allItems.forEach(item => {
      let qty = parseFloat(document.getElementById('input-' + item.id).value) || 0;
      let freq = document.getElementById('freq-' + item.id).value;
      let credits = calculateCredits(qty, item.multiplier, freq);
      document.getElementById('credits-' + item.id).textContent = formatNumber(credits) + ' credits';
      // Calculate for summary (annual, monthly, daily)
      if (freq === 'onetime') {
        totalAnnual += credits;
      } else if (freq === 'daily') {
        totalAnnual += credits;
        totalDaily += credits / 365;
        totalMonthly += credits / 12;
      } else if (freq === 'weekly') {
        totalAnnual += credits;
        totalDaily += credits / 365;
        totalMonthly += credits / 12;
      } else if (freq === 'monthly') {
        totalAnnual += credits;
        totalMonthly += credits;
        totalDaily += credits / 30;
      }
      details.push({ label: item.name, credits });
      totalCredits += credits;
    });

    let totalUSD = (totalAnnual / pricing.creditsPerPackage) * pricing.costPerPackage;
    document.getElementById('results-dashboard').innerHTML = `
      <div class="dashboard-card">
        <h3>Results Dashboard</h3>
        <div class="content-wrapper">
          <p><strong>Total Annual Credits Used:</strong> ${formatNumber(totalAnnual)}</p>
          <p><strong>Total Monthly Credits Used:</strong> ${formatNumber(totalMonthly)}</p>
          <p><strong>Total Daily Credits Used:</strong> ${formatNumber(totalDaily)}</p>
        </div>
        <div class="export-buttons">
          <button onclick="exportToPDF()" class="export-btn export-pdf">Export PDF</button>
          <button onclick="exportToHTML()" class="export-btn export-html">View Report</button>
        </div>
      </div>
    `;
  }

  allItems.forEach(item => {
    let input = document.getElementById('input-' + item.id);
    let freqSel = document.getElementById('freq-' + item.id);
    input.addEventListener('input', updateTotals);
    freqSel.addEventListener('change', updateTotals);
  });

  updateTotals();

  // Render optimization tips
  let tips = `<div class="tips-card"><h3>Optimization Recommendations</h3><ul>`;
  optimizationTips.forEach(tip => {
    tips += `<li><strong>${tip.category}:</strong> ${tip.tip}</li>`;
  });
  tips += "</ul></div>";
  document.getElementById('optimization-tips').innerHTML = tips;
});
