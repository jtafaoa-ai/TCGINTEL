class TCGApp {
    constructor() {
        this.data = JSON.parse(JSON.stringify(MOCK_DB)); // Load mock data
        this.currentView = 'dashboard';
        this.cameraStream = null;

        this.init();
    }

    init() {
        console.log('TCG App Initialized');
        this.renderDashboard();
        this.renderPortfolio();
        this.initMarket();
        this.setupNavigation();

        // Initial route
        this.navigate('dashboard');
    }

    /* --- Navigation --- */
    navigate(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Show target view
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.add('active');
            this.currentView = viewId;
        }

        // Update Nav State
        // This is a simple logic; in a real app, router would handle mapping
        if (viewId === 'dashboard') this.setActiveNav(0);
        if (viewId === 'portfolio') this.setActiveNav(1);
        if (viewId === 'scanner') this.setActiveNav(2);
        if (viewId === 'deal-mode') this.setActiveNav(3);

        // Handle market view (doesn't trigger a nav item highlight usually, but could)
        if (viewId === 'market') {
            // Logic when entering market view
            this.updateMarketGraph();
        }

        // View specific actions
        if (viewId === 'scanner') {
            this.startCamera();
        } else {
            this.stopCamera();
        }
    }

    setActiveNav(index) {
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems[index]) navItems[index].classList.add('active');
    }

    /* --- Dashboard Logic --- */
    renderDashboard() {
        // Update Total Value
        const totalValueEl = document.querySelector('.total-value');
        if (totalValueEl) {
            totalValueEl.innerHTML = `$${this.data.user.totalValue.toLocaleString()}.<sup>00</sup>`;
        }

        // Render Recent Scans
        const list = document.getElementById('recent-scans-list');
        if (!list) return;

        list.innerHTML = '';
        // Get last 3 cards from mock data
        const recentCards = this.data.cards.slice(0, 3);

        recentCards.forEach(card => {
            const li = document.createElement('li');
            li.className = 'activity-item';
            li.innerHTML = `
                <div class="card-thumb" style="background-image: url('${card.image}')"></div>
                <div class="card-info">
                    <span class="card-name">${card.name}</span>
                    <span class="card-meta">${card.set} • ${card.condition}</span>
                </div>
                <div class="card-price">$${card.marketPrice.toLocaleString()}</div>
            `;
            list.appendChild(li);
        });
    }

    /* --- Portfolio Logic --- */
    renderPortfolio() {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        grid.innerHTML = '';
        this.data.cards.forEach(card => {
            const el = document.createElement('div');
            el.className = 'card-item';
            el.innerHTML = `
                <img src="${card.image}" alt="${card.name}">
                <div class="card-details">
                    <h4>${card.name}</h4>
                    <div class="card-meta">${card.grade || card.condition}</div>
                    <div class="card-price">$${card.marketPrice}</div>
                </div>
            `;
            grid.appendChild(el);
        });
    }

    /* --- Scanner Logic --- */
    async startCamera() {
        const video = document.getElementById('camera-video');
        const status = document.querySelector('.camera-status');

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                this.cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                video.srcObject = this.cameraStream;
                status.style.display = 'none';
            } catch (err) {
                console.error("Camera Error: ", err);
                status.textContent = "Camera Access Denied";
            }
        } else {
            status.textContent = "Camera Not Supported";
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }

    scanCard() {
        // Simulate scanning process
        const status = document.querySelector('.camera-status');
        status.style.display = 'block';
        status.textContent = "Analyzing...";

        setTimeout(() => {
            status.textContent = "Found: Charizard!";
            setTimeout(() => {
                alert("Scanned: Charizard Base Set (Mock Action)");
                this.navigate('dashboard');
            }, 1000);
        }, 1500);
    }

    /* --- Market Logic --- */
    initMarket() {
        // Populate Select
        const select = document.getElementById('market-card-select');
        if (!select) return;

        select.innerHTML = '';
        this.data.cards.forEach(card => {
            const opt = document.createElement('option');
            opt.value = card.id;
            opt.text = card.name;
            select.appendChild(opt);
        });

        // Init Chart
        const ctx = document.getElementById('marketChart');
        if (ctx) {
            this.marketChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Mock dates
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: { labels: { color: 'white' } }
                    },
                    scales: {
                        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                    }
                }
            });
        }

        // Active grade filters
        this.activeGrades = ['raw', 'psa10']; // Default
        this.updateMarketGraph();
    }

    async updateMarketGraph() {
        const select = document.getElementById('market-card-select');
        const cardId = select.value;
        const card = this.data.cards.find(c => c.id === cardId);

        if (!card || !this.marketChart) return;

        // --- REAL API CONNECTION POINT ---
        // distinct from the mock data, here is where you would fetch live pricing
        // const liveData = await fetch(`https://api.tcg-intelligence.com/prices/${cardId}`);
        // const history = await liveData.json();
        // ---------------------------------

        const datasets = [];
        const colors = {
            raw: '#94a3b8',
            psa10: '#ef4444',
            bgs95: '#3b82f6',
            cgc10: '#eab308'
        };

        // Re-build datasets based on active toggle
        if (card.history) {
            Object.keys(card.history).forEach(grade => {
                if (this.activeGrades.includes(grade)) {
                    datasets.push({
                        label: grade.toUpperCase(),
                        data: card.history[grade],
                        borderColor: colors[grade],
                        backgroundColor: colors[grade],
                        tension: 0.4
                    });
                }
            });
        }

        this.marketChart.data.datasets = datasets;
        this.marketChart.update();

        // Update stats
        document.getElementById('market-last-sold').textContent = "2 hours ago";
    }

    toggleGrade(gradeType) {
        if (this.activeGrades.includes(gradeType)) {
            this.activeGrades = this.activeGrades.filter(g => g !== gradeType);
            document.querySelector(`button[onclick="app.toggleGrade('${gradeType}')"]`).classList.remove('active');
        } else {
            this.activeGrades.push(gradeType);
            document.querySelector(`button[onclick="app.toggleGrade('${gradeType}')"]`).classList.add('active');
        }
        this.updateMarketGraph();
    }

    setupNavigation() {
        // ...
    }
}

// Initialize App Global
const app = new TCGApp();
