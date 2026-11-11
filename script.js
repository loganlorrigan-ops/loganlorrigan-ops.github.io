document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Safe utility to escape plain text inputs
    function sanitizeText(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"']/g, function(match) {
            const mask = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return mask[match];
        });
    }

    // Safe localStorage wrapper
    function safeSetStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('LocalStorage unavailable:', e);
        }
    }

    function safeGetStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('LocalStorage unavailable:', e);
            return null;
        }
    }

    // 1. Game Logs Data & Rendering using safe DOM construction
    const gameLogs = [
        { date: "Nov 10, 2026", opp: "vs BOS", pts: 11, reb: 8, ast: 5, outcome: "W 112-108", type: "home" },
        { date: "Nov 08, 2026", opp: "@ CHI", pts: 22, reb: 5, ast: 5, outcome: "W 118-112", type: "away" },
        { date: "Nov 06, 2026", opp: "@ CLE", pts: 8, reb: 7, ast: 4, outcome: "L 98-105", type: "away" },
        { date: "Nov 04, 2026", opp: "@ DET", pts: 13, reb: 10, ast: 8, outcome: "W 109-101", type: "away" },
        { date: "Nov 02, 2026", opp: "vs CHI", pts: 15, reb: 7, ast: 9, outcome: "W 115-104", type: "home" }
    ];

    function renderGameLogs(filter = 'all') {
        const tbody = document.getElementById('gamelog-tbody');
        if (!tbody) return;
        tbody.textContent = ''; // Safe clear

        const filtered = gameLogs.filter(g => {
            if (filter === 'high-pts') return g.pts >= 15;
            if (filter === 'high-ast') return g.ast >= 7;
            return true;
        });

        filtered.forEach(game => {
            const isWin = typeof game.outcome === 'string' && game.outcome.startsWith('W');
            const row = document.createElement('tr');
            row.className = "hover:bg-slate-800/40 transition-colors";

            // Cell 1: Date
            const tdDate = document.createElement('td');
            tdDate.className = "py-4 px-6 font-semibold";
            tdDate.textContent = game.date;

            // Cell 2: Matchup
            const tdOpp = document.createElement('td');
            tdOpp.className = "py-4 px-6 text-white font-bold";
            tdOpp.textContent = game.opp;

            // Cell 3: PTS
            const tdPts = document.createElement('td');
            tdPts.className = "py-4 px-6 text-center text-king-gold font-extrabold text-base";
            tdPts.textContent = game.pts;

            // Cell 4: REB
            const tdReb = document.createElement('td');
            tdReb.className = "py-4 px-6 text-center font-semibold";
            tdReb.textContent = game.reb;

            // Cell 5: AST
            const tdAst = document.createElement('td');
            tdAst.className = "py-4 px-6 text-center font-semibold";
            tdAst.textContent = game.ast;

            // Cell 6: Outcome badge
            const tdOutcome = document.createElement('td');
            tdOutcome.className = "py-4 px-6 text-center";
            const badge = document.createElement('span');
            badge.className = `px-2.5 py-1 rounded-full text-xs font-bold ${isWin ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`;
            badge.textContent = game.outcome;
            tdOutcome.appendChild(badge);

            row.appendChild(tdDate);
            row.appendChild(tdOpp);
            row.appendChild(tdPts);
            row.appendChild(tdReb);
            row.appendChild(tdAst);
            row.appendChild(tdOutcome);

            tbody.appendChild(row);
        });
    }

    document.querySelectorAll('.stat-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.stat-filter-btn').forEach(b => {
                b.className = "stat-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all";
            });
            const target = e.currentTarget;
            target.className = "stat-filter-btn active px-4 py-1.5 rounded-lg text-xs font-bold bg-king-gold text-black transition-all";
            renderGameLogs(target.dataset.filter);
        });
    });

    // 2. Schedule Data & Safe Rendering
    const schedule = [
        { date: "Nov 14, 2026", opponent: "vs NYK", location: "home", status: "Upcoming", time: "7:30 PM ET" },
        { date: "Nov 17, 2026", opponent: "@ MIA", location: "away", status: "Upcoming", time: "8:00 PM ET" },
        { date: "Dec 25, 2026", opponent: "vs LAL (Xmas Showcase)", location: "home", status: "Featured Game", time: "5:00 PM ET" },
        { date: "Jan 12, 2027", opponent: "@ GSW", location: "away", status: "Upcoming", time: "10:00 PM ET" }
    ];

    function renderSchedule(filter = 'all') {
        const container = document.getElementById('schedule-container');
        if (!container) return;
        container.textContent = ''; // Safe clear

        const filtered = schedule.filter(s => filter === 'all' || s.location === filter);

        filtered.forEach(s => {
            const card = document.createElement('div');
            card.className = "p-5 rounded-2xl bg-king-card border border-slate-800 hover:border-slate-700 transition-all flex justify-between items-center";

            const leftDiv = document.createElement('div');
            
            const dateSpan = document.createElement('span');
            dateSpan.className = "text-xs text-king-gold font-bold uppercase tracking-wider block mb-1";
            dateSpan.textContent = s.date;

            const oppHeader = document.createElement('h4');
            oppHeader.className = "text-lg font-bold text-white";
            oppHeader.textContent = s.opponent;

            const timeSpan = document.createElement('span');
            timeSpan.className = "text-xs text-slate-400";
            timeSpan.textContent = s.time;

            leftDiv.appendChild(dateSpan);
            leftDiv.appendChild(oppHeader);
            leftDiv.appendChild(timeSpan);

            const statusBadge = document.createElement('span');
            const isFeatured = typeof s.status === 'string' && s.status.includes('Featured');
            statusBadge.className = `px-3 py-1 rounded-full text-xs font-bold ${isFeatured ? 'bg-king-gold text-black' : 'bg-slate-800 text-slate-300 border border-slate-700'}`;
            statusBadge.textContent = s.status;

            card.appendChild(leftDiv);
            card.appendChild(statusBadge);

            container.appendChild(card);
        });
    }

    document.querySelectorAll('.sched-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.sched-filter-btn').forEach(b => {
                b.className = "sched-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white";
            });
            const target = e.currentTarget;
            target.className = "sched-filter-btn active px-4 py-1.5 rounded-lg text-xs font-bold bg-king-gold text-black";
            renderSchedule(target.dataset.sched);
        });
    });

    // 3. Milestones
    const milestones = [
        { year: "2003", title: "1st Overall Draft Pick", desc: "Drafted by the Cleveland Cavaliers." },
        { year: "2012-2016", title: "4× Champion", desc: "Won Titles with Heat, Cavs, and Lakers." },
        { year: "2023", title: "All-Time Scoring Leader", desc: "Surpassed Kareem Abdul-Jabbar." },
        { year: "2024", title: "Olympic Gold Medal", desc: "Led Team USA to Paris Gold." },
        { year: "2026-27", title: "24th NBA Season", desc: "Continuing elite production in Year 24." }
    ];

    function renderMilestones() {
        const grid = document.getElementById('milestones-grid');
        if (!grid) return;
        grid.textContent = ''; // Safe clear

        milestones.forEach(m => {
            const card = document.createElement('div');
            card.className = "p-4 rounded-xl bg-king-card border border-slate-800 space-y-2 text-center";

            const yrSpan = document.createElement('span');
            yrSpan.className = "text-xs font-black text-king-gold block";
            yrSpan.textContent = m.year;

            const titleH4 = document.createElement('h4');
            titleH4.className = "font-bold text-white text-sm";
            titleH4.textContent = m.title;

            const descP = document.createElement('p');
            descP.className = "text-xs text-slate-400";
            descP.textContent = m.desc;

            card.appendChild(yrSpan);
            card.appendChild(titleH4);
            card.appendChild(descP);

            grid.appendChild(card);
        });
    }

    // 4. Trivia Quiz Logic with localStorage High Score Integration
    const questions = [
        { q: "In which year did LeBron James surpass Kareem Abdul-Jabbar as all-time scoring leader?", opts: ["2021", "2022", "2023", "2024"], ans: 2 },
        { q: "How many NBA MVP awards has LeBron James won?", opts: ["2", "3", "4", "5"], ans: 2 },
        { q: "Which team drafted LeBron James 1st overall in 2003?", opts: ["Heat", "Lakers", "Cavaliers", "Bulls"], ans: 2 }
    ];

    let currentQ = 0;
    let score = 0;
    let highscore = parseInt(safeGetStorage('lebron_quiz_highscore')) || 0;

    function updateScoreDisplay() {
        const scoreEl = document.getElementById('quiz-score');
        if (scoreEl) {
            scoreEl.textContent = `Score: ${score} | High Score: ${highscore}`;
        }
    }

    function loadQuestion() {
        const q = questions[currentQ];
        const qEl = document.getElementById('quiz-question');
        if (qEl) qEl.textContent = `${currentQ + 1}. ${q.q}`;
        const optsContainer = document.getElementById('quiz-options');
        if (!optsContainer) return;
        optsContainer.textContent = '';

        q.opts.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "w-full p-3 text-left rounded-xl bg-slate-900 border border-slate-700 hover:border-king-gold text-slate-200 font-semibold text-sm transition-all";
            btn.textContent = opt;
            btn.onclick = () => checkAnswer(idx);
            optsContainer.appendChild(btn);
        });
    }

    function checkAnswer(selected) {
        const feedback = document.getElementById('quiz-feedback');
        if (!feedback) return;
        feedback.classList.remove('hidden');

        if (selected === questions[currentQ].ans) {
            score += 10;
            feedback.className = "mt-4 p-3 text-xs rounded-xl font-bold bg-green-500/20 text-green-400 border border-green-500/30";
            feedback.textContent = "Correct! +10 Points";

            // Save to localStorage if a new high score is achieved
            if (score > highscore) {
                highscore = score;
                safeSetStorage('lebron_quiz_highscore', highscore);
            }
        } else {
            feedback.className = "mt-4 p-3 text-xs rounded-xl font-bold bg-red-500/20 text-red-400 border border-red-500/30";
            feedback.textContent = "Incorrect answer!";
        }

        updateScoreDisplay();

        setTimeout(() => {
            currentQ = (currentQ + 1) % questions.length;
            feedback.classList.add('hidden');
            loadQuestion();
        }, 1200);
    }

    // 5. Fantasy Calculator Input Bounds & Validation
    function clampInput(val, min, max) {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) return min;
        return Math.min(Math.max(parsed, min), max);
    }

    function updateFantasy() {
        const ptsInput = document.getElementById('calc-pts');
        const rebInput = document.getElementById('calc-reb');
        const astInput = document.getElementById('calc-ast');
        const resultEl = document.getElementById('fantasy-result');
        if (!ptsInput || !rebInput || !astInput || !resultEl) return;

        const pts = clampInput(ptsInput.value, 0, 100);
        const reb = clampInput(rebInput.value, 0, 50);
        const ast = clampInput(astInput.value, 0, 50);

        const total = (pts * 1.0) + (reb * 1.2) + (ast * 1.5);
        resultEl.textContent = `${total.toFixed(1)} FP`;
    }

    ['calc-pts', 'calc-reb', 'calc-ast'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateFantasy);
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Safe External Fetch Function with validation & fallback
    async function fetchEspnStatsSecurely() {
        try {
            const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            if (data && Array.isArray(data.articles)) {
                console.log('Successfully fetched news items:', data.articles.length);
            }
        } catch (err) {
            console.warn('ESPN Fetch fallback active. Using static high-integrity dataset.', err);
        }
    }

    // Initialize On Load
    renderGameLogs();
    renderSchedule();
    renderMilestones();
    updateScoreDisplay();
    loadQuestion();
    updateFantasy();
    fetchEspnStatsSecurely();
});