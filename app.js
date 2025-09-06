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
