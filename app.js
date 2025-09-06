// Salesforce Data Cloud Credit Calculator - JavaScript

// Multipliers for calculation
const usageMultipliers = {
    'batch-pipeline': 2000,
    'streaming-pipeline': 5000,
    'batch-transforms': 400,
    'streaming-transforms': 5000,
    'profile-unification': 100000,
    'data-federation': 70,
    'data-queries': 2,
    'accelerated-queries': 2,
    'batch-insights': 15,
    'streaming-insights': 800,
    'realtime-events': 70000,
    'unstructured-data': 60,
    'profile-api': 900,
    'ai-inferences': 3500,
    'segment-processing': 20,
    'batch-activation': 10,
    'streaming-activation': 1600
};

const frequencyMultipliers = {
    'daily': 365,
    'weekly': 52,
    'monthly': 12,
    'onetime': 1
};

const pricing = {
    creditsPerPackage: 100000,
    costPerPackage: 1000,
    costPerCredit: 0.01
};

const optimizationTips = [
    {
        category: "Data Ingestion",
        tip: "Use batch processing over streaming when real-time isn't required - it's 2.5x cheaper",
        impact: "High"
    },
    {
        category: "Profile Unification",
        tip: "Profile unification is the most expensive operation - only unify necessary data",
        impact: "Critical"
    },
    {
        category: "Data Quality",
        tip: "Clean and deduplicate data before ingestion to avoid processing unnecessary records",
        impact: "High"
    },
    {
        category: "Query Optimization",
        tip: "Use data federation (zero-copy) for occasional queries instead of full ingestion",
        impact: "Medium"
    },
    {
        category: "Scheduling",
        tip: "Schedule calculated insights and segments based on business needs, not default frequencies",
        impact: "Medium"
    },
    {
        category: "Development",
        tip: "Test with small data samples before processing full datasets",
        impact: "High"
    }
];

// --- Rendering logic (simplified for brevity, replicate sections as in your last working version) ---

document.addEventListener('DOMContentLoaded', function() {
    // Add main calculator sections and logic here
    // For each usage type, render section, input field, frequency dropdown
    // Multipliers will be used for calculation as per above

    // Example rendering (you can further expand as previously implemented)
    const sectionContainer = document.getElementById('calculator-sections');
    if (!sectionContainer) return; // abort if not the calculator page

    // Example list of data services:
    const dataServices = [
        { id: 'batch-pipeline', label: 'Batch Data Pipeline', desc:'Ingesting data through Data Streams to Data Cloud', multiplier: usageMultipliers['batch-pipeline'] },
        { id: 'streaming-pipeline', label: 'Streaming Data Pipeline', desc:'Real-time data ingestion from web, mobile, APIs', multiplier: usageMultipliers['streaming-pipeline'] },
        { id: 'batch-transforms', label: 'Batch Data Transforms', desc:'Data transformation during batch processing', multiplier: usageMultipliers['batch-transforms'] }
        // ... Add remaining usage items
    ];

    dataServices.forEach(item => {
        const card = document.createElement('div');
        card.className = 'section-card';
        card.innerHTML = `
            <div class="usage-item">
                <div class="usage-info">
                    <label>${item.label}</label>
                    <p class="usage-description">${item.desc}</p>
                    <span class="multiplier-info">${item.multiplier.toLocaleString()} credits per 1M rows</span>
                </div>
                <div class="input-group">
                    <input type="number" id="input-${item.id}" class="form-control" placeholder="Volume (M rows)" min="0" step="1">
                    <select id="freq-${item.id}" class="form-control">
                        <option value="onetime">One-time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <span class="credits-output" id="credits-${item.id}">0 credits</span>
                </div>
            </div>
        `;
        sectionContainer.appendChild(card);

        // Add calculation logic
        const inputField = card.querySelector(`#input-${item.id}`);
        const freqDropdown = card.querySelector(`#freq-${item.id}`);
        const creditOutput = card.querySelector(`#credits-${item.id}`);

        function updateCredits() {
            const qty = parseFloat(inputField.value) || 0;
            const freq = freqDropdown.value;
            const credits = qty * item.multiplier * frequencyMultipliers[freq];
            creditOutput.textContent = credits.toLocaleString() + ' credits';
        }

        inputField.addEventListener('input', updateCredits);
        freqDropdown.addEventListener('change', updateCredits);
    });
    // ... Add results dashboard and optimization tips rendering as per previous implementation
});
