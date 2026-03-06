        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const statsDisplay = document.getElementById("stats-display");

        const screens = {
            main: document.getElementById("main-screen"),
            skinShop: document.getElementById("skin-shop-screen"),
            powerShop: document.getElementById("power-shop-screen"),
            settings: document.getElementById("settings-screen"),
            game: document.getElementById("game-container")
        };

        const menuStatus = document.getElementById("menu-status");
        const victoryBackBtn = document.getElementById("victory-back-btn");
        const continueBtn = document.getElementById("continue-btn");
        const shopNavBtn = document.getElementById("shop-nav-btn");
        const powerNavBtn = document.getElementById("power-nav-btn");
        const skinShopPoints = document.getElementById("skin-shop-points");
        const powerShopPoints = document.getElementById("power-shop-points");
        const skinShopList = document.getElementById("shop-skins");
        const powerShopList = document.getElementById("shop-powerups");
        const menuBtn = document.getElementById("menu-btn");
        const gameMenuPanel = document.getElementById("game-menu-panel");
        const gameMenuNewBtn = document.getElementById("game-menu-new-btn");
        const gameMenuContinueBtn = document.getElementById("game-menu-continue-btn");
        const gameMenuPowerBtn = document.getElementById("game-menu-power-btn");
        const gameMenuTimeBtn = document.getElementById("game-menu-time-btn");
        const gameMenuBackBtn = document.getElementById("game-menu-back-btn");
        const powerBtn = document.getElementById("power-btn");

        const MAX_LEVELS = 15;
        const BOSS_LEVELS = [5, 10, 15];
        const GROUND_Y = canvas.height - 110;
        const GRAVITY = 0.72;
        const JUMP_FORCE = -15;
        const MAX_FALL_SPEED = 18;
        const MAX_RUN_SPEED = 6.4;
        const ACCEL = 0.75;
        const FRICTION = 0.82;

        let keys = {};
        let currentLevel = 1;
        let health = 3;
        let points = 0;
        let timeLeft = 90;
        let timerCounter = 0;
        let gameOver = false;
        let gameWon = false;
        let gamePaused = true;
        let hasStartedRun = false;
        let cameraX = 0;
        let invulnerable = 0;
        let effectShield = 0;
        let effectSpeed = 0;
        let effectJump = 0;
        let effectImmortal = 0;
        let effectFreezeTime = 0;
        let playerFrozenFrames = 0;
        let trapContactCooldownFrames = 0;
        let shieldCooldownFrames = 0;
        let speedCooldownFrames = 0;
        let jumpCooldownFrames = 0;
        let runElapsedFrames = 0;
        let bestTimeFrames = Number(localStorage.getItem("mrp_best_time_frames") || 0);
        let lastRunTimeFrames = 0;
        const TERRAIN_PALETTES = [
            {
                id: "grassland",
                name: "Grassland",
                skyTop: "#8ed1ff",
                skyBottom: "#e9f8ff",
                hill: "#73bd63",
                platformRoute: "#6c9d4a",
                platformSide: "#3d5b2b",
                sunColor: "rgba(255, 233, 140, 0.95)",
                mountainFar: "rgba(185, 198, 210, 0.92)",
                mountainMid: "rgba(150, 166, 182, 0.8)",
                waterTop: "rgba(92, 194, 242, 0.95)",
                waterMid: "rgba(58, 156, 208, 0.95)",
                waterBottom: "rgba(25, 108, 168, 0.95)",
                waveBright: "rgba(230, 248, 255, 0.62)",
                waveDim: "rgba(151, 220, 255, 0.4)",
                cloudAlpha: 0.65
            },
            {
                id: "water",
                name: "Water",
                skyTop: "#65b7ff",
                skyBottom: "#d8eeff",
                hill: "#4e89a8",
                platformRoute: "#4e7ea0",
                platformSide: "#2f546d",
                sunColor: "rgba(236, 247, 255, 0.9)",
                mountainFar: "rgba(142, 176, 201, 0.88)",
                mountainMid: "rgba(106, 142, 170, 0.8)",
                waterTop: "rgba(107, 207, 255, 0.96)",
                waterMid: "rgba(64, 164, 221, 0.94)",
                waterBottom: "rgba(29, 102, 158, 0.96)",
                waveBright: "rgba(231, 251, 255, 0.66)",
                waveDim: "rgba(160, 229, 255, 0.46)",
                cloudAlpha: 0.58
            },
            {
                id: "forest",
                name: "Forest",
                skyTop: "#6ea47b",
                skyBottom: "#cde0b7",
                hill: "#4d7a45",
                platformRoute: "#6f5e3d",
                platformSide: "#3f331f",
                sunColor: "rgba(255, 223, 132, 0.86)",
                mountainFar: "rgba(93, 122, 95, 0.9)",
                mountainMid: "rgba(70, 93, 70, 0.84)",
                waterTop: "rgba(90, 169, 136, 0.92)",
                waterMid: "rgba(57, 123, 101, 0.92)",
                waterBottom: "rgba(35, 86, 72, 0.94)",
                waveBright: "rgba(204, 246, 222, 0.55)",
                waveDim: "rgba(125, 208, 171, 0.35)",
                cloudAlpha: 0.45
            },
            {
                id: "cave",
                name: "Cave",
                skyTop: "#2b2d41",
                skyBottom: "#686f8c",
                hill: "#4e556f",
                platformRoute: "#7b828f",
                platformSide: "#515866",
                sunColor: "rgba(214, 229, 255, 0.7)",
                mountainFar: "rgba(66, 70, 88, 0.92)",
                mountainMid: "rgba(48, 52, 68, 0.88)",
                waterTop: "rgba(114, 144, 188, 0.86)",
                waterMid: "rgba(79, 106, 150, 0.86)",
                waterBottom: "rgba(46, 66, 105, 0.9)",
                waveBright: "rgba(196, 217, 249, 0.44)",
                waveDim: "rgba(128, 157, 204, 0.28)",
                cloudAlpha: 0.3
            },
            {
                id: "mountains_hills",
                name: "Mountains and Hills",
                skyTop: "#77b9ea",
                skyBottom: "#e6f2ff",
                hill: "#6aa870",
                platformRoute: "#8f7956",
                platformSide: "#59452b",
                sunColor: "rgba(255, 241, 171, 0.92)",
                mountainFar: "rgba(163, 172, 189, 0.92)",
                mountainMid: "rgba(123, 136, 157, 0.84)",
                waterTop: "rgba(117, 200, 240, 0.94)",
                waterMid: "rgba(76, 165, 214, 0.93)",
                waterBottom: "rgba(39, 113, 170, 0.95)",
                waveBright: "rgba(234, 248, 255, 0.61)",
                waveDim: "rgba(158, 222, 249, 0.42)",
                cloudAlpha: 0.62
            },
            {
                id: "volcano",
                name: "Volcano",
                skyTop: "#4b1b18",
                skyBottom: "#be5132",
                hill: "#5f3b32",
                platformRoute: "#8a5a2f",
                platformSide: "#4f2e19",
                sunColor: "rgba(255, 161, 88, 0.92)",
                mountainFar: "rgba(114, 58, 50, 0.9)",
                mountainMid: "rgba(79, 37, 34, 0.86)",
                waterTop: "rgba(233, 118, 48, 0.9)",
                waterMid: "rgba(191, 72, 26, 0.88)",
                waterBottom: "rgba(128, 38, 15, 0.9)",
                waveBright: "rgba(255, 203, 135, 0.5)",
                waveDim: "rgba(255, 140, 87, 0.35)",
                cloudAlpha: 0.2
            },
            {
                id: "space",
                name: "Space",
                skyTop: "#090a1f",
                skyBottom: "#1e2250",
                hill: "#2d3168",
                platformRoute: "#6f78c1",
                platformSide: "#434b8c",
                sunColor: "rgba(246, 248, 255, 0.92)",
                mountainFar: "rgba(68, 75, 130, 0.78)",
                mountainMid: "rgba(45, 52, 97, 0.84)",
                waterTop: "rgba(96, 118, 224, 0.9)",
                waterMid: "rgba(62, 83, 185, 0.9)",
                waterBottom: "rgba(38, 57, 144, 0.92)",
                waveBright: "rgba(214, 223, 255, 0.52)",
                waveDim: "rgba(132, 148, 245, 0.35)",
                cloudAlpha: 0.12,
                stars: true
            }
        ];
        let runTerrainOrder = [];
        let levelTheme = { ...TERRAIN_PALETTES[0] };
        let dashFxFrames = 0;
        let dashFxFromX = 0;
        let dashFxToX = 0;
        let dashFxY = 0;
        let dashState = null;

        let worldWidth = 2600;
        let solids = [];
        let enemies = [];
        let enemyProjectiles = [];
        let playerProjectiles = [];
        let coins = [];
        let spikes = [];
        let levelTemplates = {};
        let levelSpawn = { x: 80, y: GROUND_Y - 42 };
        let jumpQueued = false;
        let goal = { x: 2400, y: GROUND_Y - 440, w: 26, h: 440 };
        let standingPlatform = null;

        const skins = [
            { id: "classic", name: "Classic", cost: 0, body: "#ff5533", pants: "#2f2fbb" },
            { id: "forest", name: "Forest", cost: 1200, body: "#2f9e44", pants: "#14532d" },
            { id: "sunset", name: "Sunset", cost: 1800, body: "#f97316", pants: "#7c2d12" },
            { id: "shadow", name: "Shadow", cost: 2600, body: "#94a3b8", pants: "#0f172a" },
            { id: "royal", name: "Royal", cost: 3600, body: "#c084fc", pants: "#4c1d95" },
            { id: "ocean", name: "Ocean", cost: 4200, body: "#38bdf8", pants: "#0c4a6e" },
            { id: "ember", name: "Ember", cost: 4500, body: "#fb7185", pants: "#7f1d1d" },
            { id: "nebula", name: "Nebula", cost: 5200, body: "#a78bfa", pants: "#312e81" }
        ];

        const shopPowerUps = [
            { id: "dash_boost", name: "Dash", cost: 200 },
            { id: "shield_boost", name: "Shield (10s)", cost: 450 },
            { id: "speed_boost", name: "Speed (10s)", cost: 400 },
            { id: "jump_boost", name: "Flight (10s)", cost: 520 },
            { id: "freeze_boost", name: "Freeze Time (10s)", cost: 350 },
            { id: "hp_boost", name: "+1 Health", cost: 500 },
            { id: "tracker_boost", name: "Tracker Shot", cost: 300 }
        ];

        let unlockedSkins = ["classic"];
        let equippedSkin = "classic";
        let unlockedPowerUps = [];
        let selectedPowerUpId = localStorage.getItem("mrp_selected_powerup") || "";
        let dashUsesRemaining = 0;
        let trackerUsesRemaining = 0;
        let shieldUsedThisRun = false;
        let speedUsedThisRun = false;

        const player = {
            x: 80,
            y: GROUND_Y - 42,
            w: 34,
            h: 42,
            vx: 0,
            vy: 0,
            onGround: false,
            jumpsUsed: 0,
            maxJumps: 2
        };
        let playerFacing = 1;

        function rectCollision(a, b) {
            return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        }

        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        function getTerrainById(id) {
            return TERRAIN_PALETTES.find(t => t.id === id) || TERRAIN_PALETTES[0] || null;
        }
        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        function clampInt(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }
        function mutateHexColor(hex, delta) {
            const clean = String(hex || "").replace("#", "");
            if (clean.length !== 6) return hex;
            const r = clampInt(parseInt(clean.slice(0, 2), 16) + delta, 0, 255);
            const g = clampInt(parseInt(clean.slice(2, 4), 16) + delta, 0, 255);
            const b = clampInt(parseInt(clean.slice(4, 6), 16) + delta, 0, 255);
            return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        }
        function mutateRgbaColor(color, deltaRgb, deltaAlpha) {
            const m = String(color || "").match(/rgba?\(([^)]+)\)/i);
            if (!m) return color;
            const parts = m[1].split(",").map(v => Number(v.trim()));
            if (parts.length < 3) return color;
            const r = clampInt((parts[0] || 0) + deltaRgb, 0, 255);
            const g = clampInt((parts[1] || 0) + deltaRgb, 0, 255);
            const b = clampInt((parts[2] || 0) + deltaRgb, 0, 255);
            const a = clamp((parts.length > 3 ? parts[3] : 1) + deltaAlpha, 0.05, 1);
            return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
        }
        function createProceduralTerrain(levelIndex = 0) {
            if (!TERRAIN_PALETTES.length) {
                return {
                    id: `fallback_${Date.now()}_${levelIndex}`,
                    name: "Fallback",
                    skyTop: "#8ed1ff",
                    skyBottom: "#e9f8ff",
                    hill: "#73bd63",
                    platformRoute: "#6c9d4a",
                    platformSide: "#3d5b2b",
                    sunColor: "rgba(255, 233, 140, 0.95)",
                    mountainFar: "rgba(185, 198, 210, 0.92)",
                    mountainMid: "rgba(150, 166, 182, 0.8)",
                    waterTop: "rgba(92, 194, 242, 0.95)",
                    waterMid: "rgba(58, 156, 208, 0.95)",
                    waterBottom: "rgba(25, 108, 168, 0.95)",
                    waveBright: "rgba(230, 248, 255, 0.62)",
                    waveDim: "rgba(151, 220, 255, 0.4)",
                    cloudAlpha: 0.65
                };
            }
            const base = TERRAIN_PALETTES[Math.floor(Math.random() * TERRAIN_PALETTES.length)];
            const shade = randomInt(-26, 26);
            const skyShade = randomInt(-16, 16);
            const waterShade = randomInt(-20, 20);
            const cloudAlpha = clamp((base.cloudAlpha || 0.65) + (Math.random() * 0.2 - 0.1), 0.05, 0.9);
            const terrain = {
                ...base,
                id: `${base.id}_v_${Date.now()}_${levelIndex}_${Math.floor(Math.random() * 10000)}`,
                name: `${base.name} Variant`,
                skyTop: mutateHexColor(base.skyTop, skyShade),
                skyBottom: mutateHexColor(base.skyBottom, skyShade + randomInt(-8, 8)),
                hill: mutateHexColor(base.hill, shade),
                platformRoute: mutateHexColor(base.platformRoute, shade + randomInt(-10, 10)),
                platformSide: mutateHexColor(base.platformSide, shade + randomInt(-10, 10)),
                cloudAlpha,
                sunColor: mutateRgbaColor(base.sunColor, randomInt(-15, 15), Math.random() * 0.12 - 0.06),
                mountainFar: mutateRgbaColor(base.mountainFar, randomInt(-12, 12), Math.random() * 0.12 - 0.06),
                mountainMid: mutateRgbaColor(base.mountainMid, randomInt(-12, 12), Math.random() * 0.12 - 0.06),
                waterTop: mutateRgbaColor(base.waterTop, waterShade, Math.random() * 0.1 - 0.05),
                waterMid: mutateRgbaColor(base.waterMid, waterShade, Math.random() * 0.1 - 0.05),
                waterBottom: mutateRgbaColor(base.waterBottom, waterShade, Math.random() * 0.1 - 0.05),
                waveBright: mutateRgbaColor(base.waveBright, randomInt(-12, 12), Math.random() * 0.1 - 0.05),
                waveDim: mutateRgbaColor(base.waveDim, randomInt(-12, 12), Math.random() * 0.1 - 0.05)
            };
            if (!base.stars && Math.random() < 0.08) terrain.stars = true;
            return terrain;
        }
        function generateTerrainSequence(count) {
            const result = [];
            while (result.length < count) {
                result.push(createProceduralTerrain(result.length));
            }
            return result;
        }
        function getTerrainForLevel(level) {
            const item = runTerrainOrder[level - 1];
            if (!item) return createProceduralTerrain(level - 1);
            if (typeof item === "string") return { ...getTerrainById(item) };
            return { ...item };
        }
        function getTerrainKey() {
            return String(levelTheme.id || "").split("_v_")[0] || "grassland";
        }
        function buildMenuTerrainBackground() {
            const t = createProceduralTerrain(Math.floor(Math.random() * 9999));
            const svg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
  <defs>
    <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='${t.skyTop}'/>
      <stop offset='1' stop-color='${t.skyBottom}'/>
    </linearGradient>
    <linearGradient id='water' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='${t.waterTop}'/>
      <stop offset='0.5' stop-color='${t.waterMid}'/>
      <stop offset='1' stop-color='${t.waterBottom}'/>
    </linearGradient>
  </defs>
  <rect width='1600' height='900' fill='url(#sky)'/>
  <circle cx='1320' cy='118' r='68' fill='${t.sunColor}'/>
  <g fill='${t.mountainFar}'>
    <path d='M-70 650 L160 390 L390 650 Z'/>
    <path d='M230 650 L470 330 L720 650 Z'/>
    <path d='M610 650 L860 300 L1120 650 Z'/>
    <path d='M980 650 L1240 340 L1510 650 Z'/>
  </g>
  <g fill='${t.mountainMid}'>
    <path d='M70 650 L220 474 L380 650 Z'/>
    <path d='M670 650 L812 468 L948 650 Z'/>
    <path d='M1170 650 L1330 476 L1490 650 Z'/>
  </g>
  <path d='M-40 720 C200 650 380 730 620 706 C840 684 1020 756 1260 724 C1400 705 1500 736 1640 724 L1640 900 L-40 900 Z' fill='${t.hill}'/>
  <rect y='770' width='1600' height='130' fill='url(#water)'/>
  <path d='M0 806 C90 788 150 824 240 806 C330 788 390 824 480 806 C570 788 630 824 720 806 C810 788 870 824 960 806 C1050 788 1110 824 1200 806 C1290 788 1360 824 1600 806' fill='none' stroke='${t.waveBright}' stroke-width='8'/>
</svg>`;
            return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
        }
        function applyRandomMenuBackground() {
            const bg = buildMenuTerrainBackground();
            ["main", "skinShop", "powerShop", "settings"].forEach(key => {
                const el = screens[key];
                if (!el) return;
                el.style.backgroundImage = `${bg}, radial-gradient(circle at 14% 18%, rgba(255,238,175,0.24), transparent 32%), radial-gradient(circle at 84% 10%, rgba(188,236,255,0.2), transparent 30%), linear-gradient(135deg, #69b6e2 0%, #9ad6ef 46%, #4da2d2 100%)`;
                el.style.backgroundSize = "cover, auto, auto, auto";
                el.style.backgroundPosition = "center, center, center, center";
                el.style.backgroundRepeat = "no-repeat, no-repeat, no-repeat, no-repeat";
            });
        }

        function getSkinById(id) {
            return skins.find(s => s.id === id) || skins[0];
        }
        function getPowerUpById(id) {
            return shopPowerUps.find(p => p.id === id) || null;
        }
        function hasOwnedPowerUp(id) {
            return unlockedPowerUps.includes(id);
        }
        function addOwnedPowerUp(id) {
            if (!hasOwnedPowerUp(id)) unlockedPowerUps.push(id);
        }
        function consumeOwnedPowerUp(id) {
            unlockedPowerUps = unlockedPowerUps.filter(p => p !== id);
            if (selectedPowerUpId === id) selectedPowerUpId = "";
        }
        function getMaxHealth() {
            return 5;
        }
        function getHeartIcons() {
            return health > 0 ? "\u2764\uFE0F".repeat(health) : "NONE";
        }
        function isBossLevel(level) {
            return BOSS_LEVELS.includes(level);
        }
        function getBossForLevel(level) {
            return enemies.find(e => e.type === "boss" && !e.dead && e.level === level) || null;
        }
        function getBossConfig(level) {
            if (level === 5) {
                return {
                    label: "Goomba Boss",
                    archetype: "goomba",
                    maxHealth: 4,
                    speed: 1.8,
                    jumpForce: 8.2,
                    jumpEveryMin: 78,
                    jumpEveryMax: 112,
                    shootEveryMin: 9999,
                    shootEveryMax: 9999,
                    projectileSpeed: 0,
                    reward: 900,
                    body: "#8b5cf6",
                    belly: "#c4b5fd",
                    eye: "#f8fafc"
                };
            }
            if (level === 10) {
                return {
                    label: "Bowser Boss",
                    archetype: "bowser",
                    maxHealth: 7,
                    speed: 2.25,
                    jumpForce: 8.9,
                    jumpEveryMin: 64,
                    jumpEveryMax: 92,
                    shootEveryMin: 120,
                    shootEveryMax: 168,
                    projectileSpeed: 4.2,
                    reward: 1800,
                    body: "#ef4444",
                    belly: "#fca5a5",
                    eye: "#fff7ed"
                };
            }
            return {
                label: "Evil Runner Boss",
                archetype: "evil_runner",
                maxHealth: 11,
                speed: 2.9,
                jumpForce: 9.8,
                jumpEveryMin: 48,
                jumpEveryMax: 74,
                shootEveryMin: 76,
                shootEveryMax: 118,
                projectileSpeed: 5.2,
                reward: 3000,
                body: "#0f172a",
                belly: "#64748b",
                eye: "#f8fafc"
            };
        }
        function addLevelBoss(level, routePlatforms) {
            if (!isBossLevel(level)) return;
            const cfg = getBossConfig(level);
            const arenaW = level === 5 ? 420 : (level === 10 ? 520 : 620);
            const arenaH = 24;
            const bossW = level === 5 ? 54 : (level === 10 ? 60 : 66);
            const bossH = level === 5 ? 52 : (level === 10 ? 58 : 64);
            const nearGoal = goal.x;
            const arenaX = clamp(nearGoal - arenaW - 120, 320, Math.max(420, worldWidth - arenaW - 220));
            const fallbackY = routePlatforms.length ? routePlatforms[routePlatforms.length - 1].y : (GROUND_Y - 170);
            const arenaY = clamp(fallbackY + randomInt(-12, 12), 170, GROUND_Y - 108);

            addPlatform(arenaX, arenaY, arenaW, arenaH, true);
            const arena = solids[solids.length - 1];
            routePlatforms.push(arena);

            goal.x = clamp(arenaX + arenaW + randomInt(86, 116), arenaX + arenaW + 70, worldWidth - 72);
            levelSpawn = routePlatforms.length > 1
                ? { x: routePlatforms[0].x + 12, y: routePlatforms[0].y - player.h }
                : levelSpawn;

            const minX = arenaX + 14;
            const maxX = arenaX + arenaW - bossW - 14;
            const boss = {
                type: "boss",
                level,
                label: cfg.label,
                archetype: cfg.archetype,
                x: minX + Math.max(0, (maxX - minX) * 0.55),
                y: arenaY - bossH,
                w: bossW,
                h: bossH,
                minX,
                maxX,
                vx: cfg.speed * (Math.random() > 0.5 ? 1 : -1),
                speed: cfg.speed,
                baseY: arenaY - bossH,
                vy: 0,
                jumpForce: cfg.jumpForce,
                jumpTimer: randomInt(cfg.jumpEveryMin, cfg.jumpEveryMax),
                jumpEveryMin: cfg.jumpEveryMin,
                jumpEveryMax: cfg.jumpEveryMax,
                shootTimer: randomInt(cfg.shootEveryMin, cfg.shootEveryMax),
                shootEveryMin: cfg.shootEveryMin,
                shootEveryMax: cfg.shootEveryMax,
                projectileSpeed: cfg.projectileSpeed,
                health: cfg.maxHealth,
                maxHealth: cfg.maxHealth,
                reward: cfg.reward,
                hitFlash: 0,
                bodyColor: cfg.body,
                bellyColor: cfg.belly,
                eyeColor: cfg.eye
            };
            enemies.push(boss);
        }

        function showScreen(name) {
            Object.keys(screens).forEach(key => {
                const isActive = key === name;
                screens[key].classList.toggle("hidden", !isActive);
                screens[key].style.pointerEvents = isActive ? "auto" : "none";
                screens[key].setAttribute("aria-hidden", isActive ? "false" : "true");
            });
        }
        function closeGameQuickMenu() {
            if (!gameMenuPanel || !menuBtn) return;
            gameMenuPanel.classList.add("hidden");
            gameMenuPanel.setAttribute("aria-hidden", "true");
            menuBtn.setAttribute("aria-expanded", "false");
        }
        function refreshGameQuickMenuState() {
            if (!gameMenuContinueBtn) return;
            gameMenuContinueBtn.disabled = !canContinue();
        }
        function toggleGameQuickMenu() {
            if (!gameMenuPanel || !menuBtn) return;
            const opening = gameMenuPanel.classList.contains("hidden");
            if (opening) {
                refreshGameQuickMenuState();
                gameMenuPanel.classList.remove("hidden");
                gameMenuPanel.setAttribute("aria-hidden", "false");
                menuBtn.setAttribute("aria-expanded", "true");
            } else {
                closeGameQuickMenu();
            }
        }

        function openMainMenu(message = "Welcome", showVictoryBack = false) {
            gamePaused = true;
            saveGameState();
            applyRandomMenuBackground();
            menuStatus.textContent = message;
            shopNavBtn.disabled = false;
            if (powerNavBtn) powerNavBtn.disabled = false;
            continueBtn.disabled = !hasStartedRun || !canContinue();
            if (victoryBackBtn) {
                victoryBackBtn.classList.toggle("hidden", !showVictoryBack);
            }
            closeGameQuickMenu();
            showScreen("main");
        }

        function openGameScreen() {
            showScreen("game");
            gamePaused = false;
            closeGameQuickMenu();
            refreshGameQuickMenuState();
            refreshPowerButtonVisibility();
            updateUI();
        }

        function openSkinShopScreen() {
            closeGameQuickMenu();
            showScreen("skinShop");
            renderShop();
        }

        function openPowerShopScreen() {
            closeGameQuickMenu();
            showScreen("powerShop");
            renderShop();
        }

        function openSettingsScreen() {
            closeGameQuickMenu();
            showScreen("settings");
        }

        function resetPlayerPosition() {
            player.x = levelSpawn.x;
            player.y = levelSpawn.y;
            player.vx = 0;
            player.vy = 0;
            playerFrozenFrames = 0;
            trapContactCooldownFrames = 0;
            dashState = null;
            player.onGround = false;
            player.jumpsUsed = 0;
            standingPlatform = null;
            playerFacing = 1;
            cameraX = 0;
        }

        function addPlatform(x, y, w, h = 24, route = false) {
            solids.push({ x, y, w, h, kind: "platform", route });
        }
        function addMovingPlatform(x, y, w, h = 20, route = true, axis = "x", distance = 120, speed = 1.2) {
            solids.push({
                x,
                y,
                w,
                h,
                kind: "moving_platform",
                route,
                axis,
                originX: x,
                originY: y,
                distance,
                speed,
                t: Math.random() * Math.PI * 2,
                dx: 0,
                dy: 0
            });
        }

        function addGround(x, w) {
            solids.push({ x, y: GROUND_Y, w, h: canvas.height - GROUND_Y, kind: "ground", route: false });
        }

        function addEnemyOnPlatform(platform, speed, level, tier) {
            const roll = Math.random();
            let type = "walker";
            const terrainKey = getTerrainKey();
            const prefersFlyer = terrainKey === "water" || terrainKey === "space" || terrainKey === "mountains_hills";
            const prefersShooter = terrainKey === "forest" || terrainKey === "cave" || terrainKey === "volcano";
            const prefersBomb = terrainKey === "volcano" || terrainKey === "cave";
            const prefersPiranha = terrainKey === "forest" || terrainKey === "grassland" || terrainKey === "water";
            if (prefersFlyer && roll > 0.62) type = "flyer";
            if (prefersShooter && roll > 0.68) type = "shooter";
            if (prefersBomb && roll > 0.74) type = "bomb";
            if (prefersPiranha && roll > 0.8) type = "piranha";
            if (tier !== "easy" && roll > 0.7) type = "beetle";
            if (tier === "hard" && roll > 0.82) type = "hopper";
            if (tier === "hard" && prefersFlyer && roll > 0.9) type = "flyer";
            if (tier === "hard" && prefersShooter && roll > 0.9) type = "shooter";
            if (tier === "hard" && prefersBomb && roll > 0.92) type = "bomb";

            const eW =
                type === "beetle" ? 32 :
                (type === "flyer" ? 28 :
                    (type === "piranha" ? 26 :
                        (type === "bomb" ? 24 :
                            (type === "shooter" ? 30 : 30))));
            const eH =
                type === "beetle" ? 24 :
                (type === "flyer" ? 24 :
                    (type === "piranha" ? 30 :
                        (type === "bomb" ? 24 :
                            (type === "shooter" ? 30 : 30))));
            const minX = platform.x + 6;
            const maxX = platform.x + platform.w - eW - 6;
            if (maxX <= minX) return;

            const baseY = platform.y - eH;
            const enemy = {
                type,
                x: minX + Math.random() * (maxX - minX),
                y: baseY,
                w: eW,
                h: eH,
                vx: speed * (Math.random() > 0.5 ? 1 : -1),
                minX,
                maxX
            };
            if (type === "beetle") {
                enemy.vx *= 1.22;
            }
            if (type === "hopper") {
                enemy.baseY = baseY;
                enemy.vy = 0;
                enemy.jumpTimer = randomInt(35, 85) - Math.min(20, level);
                enemy.vx *= 0.78;
            }
            if (type === "flyer") {
                enemy.baseY = Math.max(96, baseY - randomInt(72, 140));
                enemy.y = enemy.baseY;
                enemy.floatAmp = randomInt(10, 20);
                enemy.floatSpeed = 0.08 + Math.random() * 0.07;
                enemy.phase = Math.random() * Math.PI * 2;
                enemy.vx *= 0.92;
            }
            if (type === "shooter") {
                enemy.vx = 0;
                enemy.shootTimer = randomInt(88, 150) - Math.min(30, level);
                enemy.projectileSpeed = 3 + Math.min(3, level * 0.08);
            }
            if (type === "bomb") {
                enemy.vx *= 0.62;
                enemy.armed = false;
                enemy.fuse = randomInt(80, 130);
                enemy.explodingFrames = 0;
                enemy.explosionRadius = 72;
            }
            if (type === "piranha") {
                enemy.vx = 0;
                enemy.baseY = platform.y - eH;
                enemy.topY = Math.max(78, enemy.baseY - randomInt(56, 96));
                enemy.hiddenY = platform.y - 6;
                enemy.y = enemy.hiddenY;
                enemy.aggroRange = randomInt(180, 260);
                enemy.seeHeight = randomInt(130, 190);
            }
            enemies.push(enemy);
        }
        function addHazardOnPlatform(platform, level, tier, hazardIndex) {
            if (!platform || platform.w < 64) return;
            const roll = Math.random();
            const terrainKey = getTerrainKey();
            let type = "spike";
            const terrainTrap =
                (terrainKey === "volcano" || terrainKey === "cave" || terrainKey === "desert") ? "burn" :
                (terrainKey === "forest" || terrainKey === "grassland" || terrainKey === "water") ? "poison" :
                (terrainKey === "space" || terrainKey === "mountains_hills") ? "freeze" :
                "";
            if (terrainTrap && Math.random() < 0.72) {
                type = terrainTrap;
            } else {
                if (tier !== "easy" && roll > 0.62) type = "saw";
                if (tier === "hard" && roll > 0.84) type = "flame";
            }

            if (type === "spike") {
                const hx = platform.x + 14 + Math.floor(Math.random() * Math.max(1, platform.w - 42));
                if (!spikes.some(s => Math.abs((s.x + s.w / 2) - (hx + 13)) < 58 && Math.abs(s.y - (platform.y - 16)) < 40)) {
                    spikes.push({ type: "spike", x: hx, y: platform.y - 16, w: 26, h: 16 });
                }
                return;
            }
            if (type === "saw") {
                const size = 22;
                const minX = platform.x + 10;
                const maxX = platform.x + platform.w - size - 10;
                if (maxX <= minX) return;
                const startX = minX + Math.random() * (maxX - minX);
                spikes.push({
                    type: "saw",
                    x: startX,
                    y: platform.y - size,
                    w: size,
                    h: size,
                    minX,
                    maxX,
                    vx: (1.3 + Math.min(2.2, level * 0.06) + hazardIndex * 0.01) * (Math.random() > 0.5 ? 1 : -1)
                });
                return;
            }
            if (type === "poison") {
                const pw = 28;
                const ph = 12;
                const px = platform.x + 12 + Math.floor(Math.random() * Math.max(1, platform.w - pw - 20));
                spikes.push({
                    type: "poison",
                    x: px,
                    y: platform.y - ph,
                    w: pw,
                    h: ph
                });
                return;
            }
            if (type === "freeze") {
                const fw = 22;
                const fh = 20;
                const fx = platform.x + 12 + Math.floor(Math.random() * Math.max(1, platform.w - fw - 20));
                spikes.push({
                    type: "freeze",
                    x: fx,
                    y: platform.y - fh,
                    w: fw,
                    h: fh
                });
                return;
            }
            if (type === "burn") {
                const bw = 18;
                const bh = 22;
                const bx = platform.x + 12 + Math.floor(Math.random() * Math.max(1, platform.w - bw - 20));
                spikes.push({
                    type: "burn",
                    x: bx,
                    y: platform.y - bh,
                    w: bw,
                    h: bh
                });
                return;
            }
            const fw = 18;
            const fh = 22;
            const fx = platform.x + 12 + Math.floor(Math.random() * Math.max(1, platform.w - fw - 20));
            spikes.push({
                type: "flame",
                x: fx,
                y: platform.y - fh,
                w: fw,
                h: fh,
                period: randomInt(84, 132),
                phase: randomInt(0, 80)
            });
        }

        function addCoinRow(x, y, count, spacing = 28) {
            for (let i = 0; i < count; i++) {
                coins.push({ x: x + i * spacing, y, w: 16, h: 16, taken: false });
            }
        }
        function canPlacePlatformWithSpacing(x, y, w, h, padX = 28, padY = 30) {
            const probe = { x: x - padX, y: y - padY, w: w + padX * 2, h: h + padY * 2 };
            return solids.every(s => !rectCollision(probe, { x: s.x, y: s.y, w: s.w, h: s.h }));
        }
        function formatFrames(frames) {
            const totalCentiseconds = Math.floor((frames * 100) / 60);
            const minutes = Math.floor(totalCentiseconds / 6000);
            const seconds = Math.floor((totalCentiseconds % 6000) / 100);
            const cs = totalCentiseconds % 100;
            return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
        }
        function formatSecondsFromFrames(frames) {
            const safeFrames = Math.max(0, Number(frames) || 0);
            return `${(safeFrames / 60).toFixed(1)}s`;
        }
        function getActiveEffectTimers() {
            const timers = [];
            if (effectShield > 0) timers.push(`SHIELD ${formatSecondsFromFrames(effectShield)}`);
            if (effectSpeed > 0) timers.push(`SPEED ${formatSecondsFromFrames(effectSpeed)}`);
            if (effectJump > 0) timers.push(`FLIGHT ${formatSecondsFromFrames(effectJump)}`);
            if (effectFreezeTime > 0) timers.push(`FREEZE ${formatSecondsFromFrames(effectFreezeTime)}`);
            if (effectImmortal > 0) timers.push(`IMMORTAL ${formatSecondsFromFrames(effectImmortal)}`);
            return timers;
        }
        function showTimeStats() {
            const best = bestTimeFrames > 0 ? formatFrames(bestTimeFrames) : "No clear time yet";
            const last = lastRunTimeFrames > 0 ? formatFrames(lastRunTimeFrames) : "No finished run yet";
            alert(`Best: ${best}\nLast: ${last}`);
        }
        function refreshPowerButtonVisibility() {
            const shouldShow =
                selectedPowerUpId === "shield_boost" ||
                selectedPowerUpId === "speed_boost" ||
                selectedPowerUpId === "dash_boost" ||
                selectedPowerUpId === "jump_boost" ||
                selectedPowerUpId === "freeze_boost" ||
                selectedPowerUpId === "tracker_boost";
            powerBtn.classList.toggle("hidden", !shouldShow);
            powerBtn.disabled = !shouldShow;
            if (!shouldShow) {
                powerBtn.textContent = "Use Power (E)";
                return;
            }
            if (selectedPowerUpId === "dash_boost") {
                powerBtn.textContent = `Dash (${dashUsesRemaining}) [E]`;
            } else if (selectedPowerUpId === "shield_boost") {
                const on = effectShield > 0 ? ` ON:${formatSecondsFromFrames(effectShield)}` : "";
                const cd = shieldCooldownFrames > 0 ? ` CD:${(shieldCooldownFrames / 60).toFixed(1)}s` : "";
                powerBtn.textContent = `Shield${on}${cd} [E]`;
            } else if (selectedPowerUpId === "speed_boost") {
                const on = effectSpeed > 0 ? ` ON:${formatSecondsFromFrames(effectSpeed)}` : "";
                const cd = speedCooldownFrames > 0 ? ` CD:${(speedCooldownFrames / 60).toFixed(1)}s` : "";
                powerBtn.textContent = `Speed${on}${cd} [E]`;
            } else if (selectedPowerUpId === "jump_boost") {
                const on = effectJump > 0 ? ` ON:${formatSecondsFromFrames(effectJump)}` : "";
                const cd = jumpCooldownFrames > 0 ? ` CD:${(jumpCooldownFrames / 60).toFixed(1)}s` : "";
                powerBtn.textContent = `Flight${on}${cd} [E]`;
            } else if (selectedPowerUpId === "freeze_boost") {
                const on = effectFreezeTime > 0 ? ` ON:${formatSecondsFromFrames(effectFreezeTime)}` : "";
                powerBtn.textContent = `Freeze Time${on} [E]`;
            } else if (selectedPowerUpId === "tracker_boost") {
                powerBtn.textContent = `Tracker Shot (${trackerUsesRemaining}) [E]`;
            } else {
                powerBtn.textContent = "Use Power (E)";
            }
        }
        function useSelectedPowerUpInGame() {
            if (!hasStartedRun || gameOver || gameWon || screens.game.classList.contains("hidden")) {
                return;
            }
            if (!selectedPowerUpId) {
                menuStatus.textContent = "Select a power-up in the Shop first.";
                return;
            }
            if (!hasOwnedPowerUp(selectedPowerUpId)) {
                menuStatus.textContent = "Buy this power-up first in the shop.";
                selectedPowerUpId = "";
                updateUI();
                saveShopState();
                return;
            }
            if (selectedPowerUpId === "tracker_boost") {
                if (trackerUsesRemaining <= 0) {
                    menuStatus.textContent = "No tracker charges left. Buy Tracker Shot again.";
                    trackerUsesRemaining = 0;
                    consumeOwnedPowerUp("tracker_boost");
                    updateUI();
                    saveShopState();
                    return;
                }
                fireTrackerShot();
                trackerUsesRemaining -= 1;
                if (trackerUsesRemaining <= 0) {
                    trackerUsesRemaining = 0;
                    consumeOwnedPowerUp("tracker_boost");
                }
                updateUI();
                saveShopState();
                saveGameState();
                return;
            }
            if (selectedPowerUpId === "hp_boost") {
                if (health >= getMaxHealth()) {
                    menuStatus.textContent = "Health is already at max.";
                    return;
                }
                health = Math.min(getMaxHealth(), health + 1);
                consumeOwnedPowerUp("hp_boost");
                updateUI();
                saveShopState();
                return;
            }
            if (selectedPowerUpId === "shield_boost") {
                if (shieldCooldownFrames > 0) {
                    menuStatus.textContent = `Shield cooldown: ${(shieldCooldownFrames / 60).toFixed(1)}s`;
                    return;
                }
                effectShield = Math.max(effectShield, 600);
                shieldCooldownFrames = 600;
                consumeOwnedPowerUp("shield_boost");
            }
            if (selectedPowerUpId === "speed_boost") {
                if (speedCooldownFrames > 0) {
                    menuStatus.textContent = `Speed cooldown: ${(speedCooldownFrames / 60).toFixed(1)}s`;
                    return;
                }
                effectSpeed = Math.max(effectSpeed, 600);
                speedCooldownFrames = 600;
                consumeOwnedPowerUp("speed_boost");
            }
            if (selectedPowerUpId === "jump_boost") {
                if (jumpCooldownFrames > 0) {
                    menuStatus.textContent = `Flight cooldown: ${(jumpCooldownFrames / 60).toFixed(1)}s`;
                    return;
                }
                effectJump = Math.max(effectJump, 600);
                jumpCooldownFrames = 600;
                consumeOwnedPowerUp("jump_boost");
            }
            if (selectedPowerUpId === "freeze_boost") {
                effectFreezeTime = Math.max(effectFreezeTime, 600);
                consumeOwnedPowerUp("freeze_boost");
            }
            if (selectedPowerUpId === "dash_boost") {
                if (dashUsesRemaining <= 0) {
                    menuStatus.textContent = "No dash charges left. Buy Dash again.";
                    consumeOwnedPowerUp("dash_boost");
                    updateUI();
                    saveShopState();
                    return;
                }
                dashForward(220);
                dashUsesRemaining -= 1;
                if (dashUsesRemaining <= 0) {
                    dashUsesRemaining = 0;
                    consumeOwnedPowerUp("dash_boost");
                }
            }
            updateUI();
            saveShopState();
            saveGameState();
        }
        function dashForward(distance = 220) {
            const startX = player.x;
            const startY = player.y;
            let targetX = clamp(player.x + distance, 0, worldWidth - player.w);
            const playerCenter = () => targetX + player.w / 2;
            let attempts = 0;
            while (attempts < 6 && spikes.some(sp => Math.abs((sp.x + sp.w / 2) - playerCenter()) < 26)) {
                targetX = Math.max(0, targetX - 42);
                attempts++;
            }
            const xCenter = targetX + player.w / 2;
            const candidates = solids.filter(s => xCenter >= s.x && xCenter <= (s.x + s.w));
            const stand = candidates.length ? candidates.reduce((acc, cur) => (cur.y > acc.y ? cur : acc), candidates[0]) : null;
            const targetY = stand ? stand.y - player.h : GROUND_Y - player.h;
            dashState = {
                fromX: startX,
                toX: targetX,
                fromY: startY,
                toY: targetY,
                frame: 0,
                total: 10
            };
            dashFxFrames = 14;
            dashFxFromX = startX + (player.w * 0.4);
            dashFxToX = targetX + (player.w * 0.6);
            dashFxY = Math.max(20, startY + (player.h * 0.6));
        }
        function getNearestEnemyTarget(fromX, fromY) {
            let nearest = null;
            let bestDistSq = Infinity;
            enemies.forEach(e => {
                if (!e || e.dead) return;
                const tx = e.x + e.w / 2;
                const ty = e.y + e.h / 2;
                const dx = tx - fromX;
                const dy = ty - fromY;
                const d2 = dx * dx + dy * dy;
                if (d2 < bestDistSq) {
                    bestDistSq = d2;
                    nearest = e;
                }
            });
            return nearest;
        }
        function fireTrackerShot() {
            const startX = player.x + player.w / 2 + playerFacing * 10;
            const startY = player.y + player.h * 0.42;
            const target = getNearestEnemyTarget(startX, startY);
            const speed = 7.2;
            let vx = playerFacing * speed;
            let vy = 0;
            if (target) {
                const dx = (target.x + target.w / 2) - startX;
                const dy = (target.y + target.h / 2) - startY;
                const mag = Math.hypot(dx, dy) || 1;
                vx = (dx / mag) * speed;
                vy = (dy / mag) * speed;
            }
            playerProjectiles.push({
                x: startX - 5,
                y: startY - 5,
                w: 10,
                h: 10,
                vx,
                vy,
                speed,
                turnRate: 0.2,
                life: 150,
                target
            });
        }
        function deepCopy(value) {
            return JSON.parse(JSON.stringify(value));
        }
        function buildLevel(level) {
            solids = [];
            enemies = [];
            enemyProjectiles = [];
            playerProjectiles = [];
            coins = [];
            spikes = [];
            invulnerable = 0;
            effectShield = 0;
            effectSpeed = 0;
            effectJump = 0;
            effectImmortal = 0;
            effectFreezeTime = 0;
            playerFrozenFrames = 0;
            trapContactCooldownFrames = 0;

            const tier = level <= 5 ? "easy" : (level <= 10 ? "medium" : "hard");
            const cfg = tier === "easy"
                ? {
                    timeBase: 120, timeDecay: 3, timeMin: 80,
                    widthBase: 3200, widthPerLevel: 380,
                    gapBase: 58, gapRange: 24,
                    stepBase: 250, stepRange: 56, verticalSwing: 32,
                    platformHazBase: 1, platformHazScale: 0.8,
                    groundHazBase: 1, groundHazScale: 0.4,
                    enemySpeedBase: 0.9, enemySpeedScale: 0.1
                }
                : tier === "medium"
                    ? {
                        timeBase: 105, timeDecay: 4, timeMin: 65,
                        widthBase: 3800, widthPerLevel: 430,
                        gapBase: 72, gapRange: 32,
                        stepBase: 220, stepRange: 64, verticalSwing: 46,
                        platformHazBase: 2, platformHazScale: 1.0,
                        groundHazBase: 2, groundHazScale: 0.6,
                        enemySpeedBase: 1.05, enemySpeedScale: 0.13
                    }
                    : {
                        timeBase: 95, timeDecay: 5, timeMin: 50,
                        widthBase: 4400, widthPerLevel: 470,
                        gapBase: 84, gapRange: 38,
                        stepBase: 198, stepRange: 60, verticalSwing: 58,
                        platformHazBase: 3, platformHazScale: 1.2,
                        groundHazBase: 3, groundHazScale: 0.75,
                        enemySpeedBase: 1.15, enemySpeedScale: 0.16
                    };

            timeLeft = Math.max(cfg.timeMin, cfg.timeBase - (level - 1) * cfg.timeDecay);

            // Keep level layout consistent so dying/restarting does not create a new terrain.
            if (levelTemplates[level]) {
                const t = deepCopy(levelTemplates[level]);
                worldWidth = t.worldWidth;
                goal = t.goal;
                levelTheme = t.levelTheme;
                levelSpawn = t.levelSpawn;
                solids = t.solids;
                enemies = t.enemies;
                enemyProjectiles = t.enemyProjectiles || [];
                coins = t.coins;
                spikes = t.spikes;
                resetPlayerPosition();
                updateUI();
                return;
            }

            worldWidth = cfg.widthBase + level * cfg.widthPerLevel;
            goal = { x: worldWidth - 124, y: GROUND_Y - 440, w: 26, h: 440 };

            levelTheme = getTerrainForLevel(level);

            // No solid ground. The bottom area is water (hazard zone).

            // Structured route generator with fixed lanes and controlled gaps.
            const routePlatforms = [];
            const laneYs = tier === "easy"
                ? [GROUND_Y - 130, GROUND_Y - 180, GROUND_Y - 230]
                : tier === "medium"
                    ? [GROUND_Y - 125, GROUND_Y - 185, GROUND_Y - 245]
                    : [GROUND_Y - 120, GROUND_Y - 190, GROUND_Y - 260];
            const minGap = tier === "easy" ? 54 : (tier === "medium" ? 64 : 72);
            const maxGap = tier === "easy" ? 98 : (tier === "medium" ? 116 : 132);
            const minW = tier === "easy" ? 130 : (tier === "medium" ? 115 : 102);
            const maxW = tier === "easy" ? 230 : (tier === "medium" ? 210 : 190);
            const laneShiftChance = tier === "easy" ? 0.2 : (tier === "medium" ? 0.32 : 0.45);
            const sideChance = tier === "easy" ? 0.22 : (tier === "medium" ? 0.3 : 0.36);
            const splitChance = tier === "easy" ? 0.2 : (tier === "medium" ? 0.28 : 0.38);

            let px = 160;
            let laneIndex = 0;
            let prevLaneIndex = laneIndex;
            let chunkIndex = 0;
            while (px < worldWidth - 620) {
                const shouldShiftLane = Math.random() < laneShiftChance;
                if (shouldShiftLane) {
                    const dir = Math.random() > 0.5 ? 1 : -1;
                    prevLaneIndex = laneIndex;
                    laneIndex = clamp(laneIndex + dir, 0, laneYs.length - 1);
                } else {
                    prevLaneIndex = laneIndex;
                }

                const py = clamp(laneYs[laneIndex] + randomInt(-10, 10), 176, GROUND_Y - 112);
                const mainW = randomInt(minW, maxW);
                if (canPlacePlatformWithSpacing(px, py, mainW, 22, 16, 18)) {
                    addPlatform(px, py, mainW, 22, true);
                    routePlatforms.push(solids[solids.length - 1]);
                }

                // Add a short connector on some lane transitions for readability.
                if (prevLaneIndex !== laneIndex && Math.random() > 0.35) {
                    const bridgeY = clamp((laneYs[prevLaneIndex] + laneYs[laneIndex]) / 2 + randomInt(-8, 8), 176, GROUND_Y - 110);
                    const bridgeX = px + mainW + 14;
                    const bridgeW = randomInt(72, 104);
                    if (canPlacePlatformWithSpacing(bridgeX, bridgeY, bridgeW, 20, 14, 16)) {
                        addPlatform(bridgeX, bridgeY, bridgeW, 20, true);
                        routePlatforms.push(solids[solids.length - 1]);
                    }
                    px = bridgeX + bridgeW;
                } else {
                    px += mainW;
                }

                // Alternating rhythm: some close chunks, some far jumps.
                const rhythmSlot = chunkIndex % 6;
                let gap;
                if (rhythmSlot === 2 || rhythmSlot === 5) {
                    gap = randomInt(maxGap + 30, maxGap + 96);
                } else {
                    gap = randomInt(Math.max(40, minGap - 12), minGap + 30);
                }
                px += gap;

                // Optional same-lane split platform to keep rhythm without clumping.
                const dynamicSplitChance = (rhythmSlot === 2 || rhythmSlot === 5) ? splitChance * 0.45 : splitChance * 1.15;
                if (Math.random() < dynamicSplitChance && px < worldWidth - 700) {
                    const splitW = randomInt(88, 142);
                    const splitY = clamp(py + randomInt(-22, 22), 176, GROUND_Y - 112);
                    if (canPlacePlatformWithSpacing(px, splitY, splitW, 20, 14, 16)) {
                        addPlatform(px, splitY, splitW, 20, true);
                        routePlatforms.push(solids[solids.length - 1]);
                    }
                    px += splitW + randomInt(Math.max(36, minGap - 14), maxGap - 10);
                }

                // Optional side platform for bonus path.
                if (Math.random() < sideChance) {
                    const sideW = randomInt(90, 150);
                    const sideDir = Math.random() > 0.5 ? 1 : -1;
                    const sideY = clamp(py + sideDir * randomInt(62, 92), 168, GROUND_Y - 108);
                    const sideX = px - randomInt(130, 220);
                    if (canPlacePlatformWithSpacing(sideX, sideY, sideW, 20, 18, 20)) {
                        addPlatform(sideX, sideY, sideW, 20, false);
                    }
                }
                chunkIndex++;
            }

            // Ensure a clean finish approach near the goal.
            const finishY = laneYs[Math.min(laneIndex, laneYs.length - 1)];
            if (canPlacePlatformWithSpacing(worldWidth - 420, finishY, 170, 22, 12, 12)) {
                addPlatform(worldWidth - 420, finishY, 170, 22, true);
                routePlatforms.push(solids[solids.length - 1]);
            }
            if (canPlacePlatformWithSpacing(worldWidth - 240, finishY - 12, 110, 22, 12, 12)) {
                addPlatform(worldWidth - 240, finishY - 12, 110, 22, true);
                routePlatforms.push(solids[solids.length - 1]);
            }

            // Sky platforms: high bonus islands across the level.
            const skyCount = tier === "easy" ? 4 : (tier === "medium" ? 6 : 8);
            const skyMinY = GROUND_Y - 300;
            const skyMaxY = GROUND_Y - 210;
            let skyX = 280;
            for (let i = 0; i < skyCount && skyX < worldWidth - 320; i++) {
                const sw = randomInt(90, 170);
                const sy = randomInt(skyMinY, skyMaxY);
                if (canPlacePlatformWithSpacing(skyX, sy, sw, 18, 24, 24)) {
                    addPlatform(skyX, sy, sw, 18, false);
                    if (Math.random() > 0.35) {
                        const coinCount = Math.max(2, Math.floor(sw / 46));
                        addCoinRow(skyX + 8, sy - 24, coinCount);
                    }
                }
                skyX += randomInt(260, 420);
            }

            // Moving platforms: more as levels get harder.
            const moveCandidates = shuffle(routePlatforms.slice(3, Math.max(4, routePlatforms.length - 3)));
            const movingCount = tier === "easy" ? Math.min(2, moveCandidates.length) : (tier === "medium" ? Math.min(4, moveCandidates.length) : Math.min(6, moveCandidates.length));
            function canPlaceAirMovingPlatform(x, y, w, h) {
                const probe = { x: x - 62, y: y - 48, w: w + 124, h: h + 96 };
                const cx = x + w / 2;
                const cy = y + h / 2;
                return solids.every(s => {
                    if (rectCollision(probe, s)) return false;
                    const sx = s.x + s.w / 2;
                    const sy = s.y + s.h / 2;
                    const dx = cx - sx;
                    const dy = cy - sy;
                    return (dx * dx + dy * dy) > (190 * 190);
                });
            }
            for (let i = 0; i < movingCount; i++) {
                const base = moveCandidates[i];
                if (!base || base.w < 90) continue;
                const mw = randomInt(70, Math.min(130, Math.floor(base.w * 0.78)));
                const axis = Math.random() > 0.38 ? "x" : "y";
                const distance = axis === "x" ? randomInt(70, 140) : randomInt(30, 62);
                const speed = axis === "x" ? (0.9 + level * 0.03) : (0.75 + level * 0.025);
                let placed = false;
                for (let tries = 0; tries < 7 && !placed; tries++) {
                    const mx = base.x + randomInt(-60, Math.max(30, base.w - mw + 60));
                    const my = clamp(base.y - randomInt(86, 170), 90, GROUND_Y - 210);
                    if (!canPlaceAirMovingPlatform(mx, my, mw, 18)) continue;
                    if (!canPlacePlatformWithSpacing(mx, my, mw, 18, 22, 24)) continue;
                    addMovingPlatform(mx, my, mw, 18, true, axis, distance, speed);
                    placed = true;
                }
            }

            // Safety fallback: guarantee a playable route if spacing checks remove too many platforms.
            if (routePlatforms.length < 4) {
                solids = solids.filter(s => s.kind !== "platform" && s.kind !== "moving_platform");
                routePlatforms.length = 0;
                const fallbackY = laneYs[1] || (GROUND_Y - 180);
                let fx = 120;
                while (fx < worldWidth - 260) {
                    const fw = randomInt(150, 200);
                    addPlatform(fx, fallbackY + randomInt(-10, 10), fw, 22, true);
                    routePlatforms.push(solids[solids.length - 1]);
                    fx += fw + randomInt(90, 120);
                }
                addPlatform(worldWidth - 210, fallbackY - 8, 130, 22, true);
                routePlatforms.push(solids[solids.length - 1]);
            }

            if (routePlatforms.length) {
                const firstPlatform = routePlatforms[0];
                levelSpawn = { x: firstPlatform.x + 12, y: firstPlatform.y - player.h };
                const furthestRouteEnd = routePlatforms.reduce((maxEnd, p) => Math.max(maxEnd, p.x + p.w), 0);
                const goalGap = tier === "easy" ? randomInt(56, 76) : (tier === "medium" ? randomInt(68, 90) : randomInt(76, 102));
                goal = {
                    x: clamp(furthestRouteEnd + goalGap, 260, worldWidth - 72),
                    y: GROUND_Y - 440,
                    w: 26,
                    h: 440
                };
            } else {
                levelSpawn = { x: 80, y: GROUND_Y - player.h - 100 };
                goal = { x: worldWidth - 124, y: GROUND_Y - 440, w: 26, h: 440 };
            }

            // Coins on route + extras.
            routePlatforms.forEach((p, i) => {
                if (i < 2 || Math.random() > 0.25) {
                    const count = Math.max(2, Math.floor(p.w / 42));
                    addCoinRow(p.x + 8, p.y - 24, count);
                }
            });

            // Hazards on platforms.
            const platformHazards = shuffle(routePlatforms.slice(3, Math.max(4, routePlatforms.length - 2)));
            const hazardCount = Math.min(platformHazards.length, 2 + Math.floor(level * 1.4));
            for (let i = 0; i < hazardCount; i++) {
                const p = platformHazards[i];
                addHazardOnPlatform(p, level, tier, i);
            }

            // Keep coins clear of hazards.
            coins = coins.filter(c => {
                const safeRect = { x: c.x + 2, y: c.y + 2, w: c.w - 4, h: c.h - 4 };
                return !spikes.some(h => rectCollision(safeRect, {
                    x: h.x - 4,
                    y: h.y - 4,
                    w: h.w + 8,
                    h: h.h + 8
                }));
            });

            function targetEnemyCount(lvl) {
                if (lvl <= 3) return 2;
                if (lvl <= 6) return 4;
                if (lvl <= 9) return 6;
                if (lvl <= 12) return 8;
                return 10;
            }
            // Structured enemy placement on route.
            const enemyPads = shuffle(routePlatforms.slice(4, Math.max(5, routePlatforms.length - 3)));
            const enemyCount = Math.min(enemyPads.length, targetEnemyCount(level));
            for (let i = 0; i < enemyCount; i++) {
                addEnemyOnPlatform(enemyPads[i], cfg.enemySpeedBase + level * cfg.enemySpeedScale, level, tier);
            }

            addLevelBoss(level, routePlatforms);

            levelTemplates[level] = deepCopy({
                worldWidth,
                goal,
                levelTheme,
                levelSpawn,
                solids,
                enemies,
                enemyProjectiles,
                coins,
                spikes
            });

            resetPlayerPosition();
            updateUI();
        }

        function hurtPlayer() {
            if (invulnerable > 0) return;
            if (effectImmortal > 0) {
                invulnerable = 18;
                return;
            }
            if (effectShield > 0) {
                effectShield = 0;
                invulnerable = 45;
                return;
            }
            health -= 1;
            invulnerable = 90;
            if (health <= 0) {
                health = 0;
                unlockedPowerUps = [];
                selectedPowerUpId = "";
                dashUsesRemaining = 0;
                trackerUsesRemaining = 0;
                effectShield = 0;
                effectSpeed = 0;
                effectJump = 0;
                effectImmortal = 0;
                effectFreezeTime = 0;
                shieldCooldownFrames = 0;
                speedCooldownFrames = 0;
                jumpCooldownFrames = 0;
                saveShopState();
                gameOver = true;
                gamePaused = true;
                clearSavedRun();
                openMainMenu("Game Over. Press New Game for a new run.");
            } else {
                resetPlayerPosition();
            }
        }

        function resolveHorizontalCollisions(prevX) {
            for (const block of solids) {
                if (!rectCollision(player, block)) continue;
                if (player.vx > 0 && prevX + player.w <= block.x) {
                    player.x = block.x - player.w;
                    player.vx = 0;
                } else if (player.vx < 0 && prevX >= block.x + block.w) {
                    player.x = block.x + block.w;
                    player.vx = 0;
                }
            }
        }

        function resolveVerticalCollisions(prevY) {
            player.onGround = false;
            standingPlatform = null;
            for (const block of solids) {
                if (!rectCollision(player, block)) continue;
                if (player.vy > 0 && prevY + player.h <= block.y) {
                    player.y = block.y - player.h;
                    player.vy = 0;
                    player.onGround = true;
                    player.jumpsUsed = 0;
                    if (block.kind === "moving_platform") {
                        standingPlatform = block;
                    }
                } else if (player.vy < 0 && prevY >= block.y + block.h) {
                    player.y = block.y + block.h;
                    player.vy = 0;
                }
            }
        }

        function updateMovingPlatforms() {
            solids.forEach(s => {
                if (s.kind !== "moving_platform") return;
                const oldX = s.x;
                const oldY = s.y;
                s.t += s.speed * 0.02;
                let nextX = s.x;
                let nextY = s.y;
                if (s.axis === "x") {
                    nextX = s.originX + Math.sin(s.t) * s.distance;
                } else {
                    nextY = s.originY + Math.sin(s.t) * s.distance;
                }
                const blocked = solids.some(o => o !== s && rectCollision(
                    { x: nextX, y: nextY, w: s.w, h: s.h },
                    { x: o.x, y: o.y, w: o.w, h: o.h }
                ));
                if (blocked) {
                    s.t -= s.speed * 0.04;
                    s.dx = 0;
                    s.dy = 0;
                    return;
                }
                s.x = nextX;
                s.y = nextY;
                s.dx = s.x - oldX;
                s.dy = s.y - oldY;
            });
        }

        function updateEnemies() {
            enemies.forEach(e => {
                if (e.type === "boss") {
                    const playerCenter = player.x + player.w / 2;
                    const bossCenter = e.x + e.w / 2;
                    const chaseDir = playerCenter >= bossCenter ? 1 : -1;
                    const targetSpeed = e.speed * (Math.abs(playerCenter - bossCenter) < 420 ? 1 : 0.55);
                    e.vx = chaseDir * targetSpeed;
                    e.x += e.vx;
                    if (e.x <= e.minX) {
                        e.x = e.minX;
                        e.vx = Math.abs(e.vx);
                    }
                    if (e.x >= e.maxX) {
                        e.x = e.maxX;
                        e.vx = -Math.abs(e.vx);
                    }

                    e.jumpTimer -= 1;
                    if (e.jumpTimer <= 0 && Math.abs(e.y - e.baseY) < 0.8) {
                        e.vy = -e.jumpForce;
                        e.jumpTimer = randomInt(e.jumpEveryMin, e.jumpEveryMax);
                    }
                    e.vy = clamp((e.vy || 0) + 0.5, -24, 13);
                    e.y += e.vy;
                    if (e.y >= e.baseY) {
                        e.y = e.baseY;
                        e.vy = 0;
                    }

                    e.shootTimer -= 1;
                    const canShoot = e.projectileSpeed > 0 && e.shootEveryMax < 9000;
                    if (canShoot && e.shootTimer <= 0) {
                        const dir = playerCenter >= bossCenter ? 1 : -1;
                        enemyProjectiles.push({
                            x: e.x + e.w / 2 - 6,
                            y: e.y + e.h * 0.44,
                            w: 12,
                            h: 12,
                            vx: dir * e.projectileSpeed,
                            vy: 0
                        });
                        e.shootTimer = randomInt(e.shootEveryMin, e.shootEveryMax);
                    }
                    if (e.hitFlash > 0) e.hitFlash -= 1;
                    return;
                }
                if (e.type === "piranha") {
                    const ex = e.x - cameraX;
                    const onScreen = ex + e.w > 0 && ex < canvas.width;
                    const playerDx = Math.abs((player.x + player.w / 2) - (e.x + e.w / 2));
                    const playerDy = Math.abs((player.y + player.h / 2) - (e.y + e.h / 2));
                    const seesPlayer = onScreen && playerDx < (e.aggroRange || 220) && playerDy < (e.seeHeight || 170);
                    if (seesPlayer) {
                        e.y = Math.max(e.topY ?? e.baseY, e.y - 1.35);
                    } else {
                        e.y = Math.min(e.hiddenY, e.y + 1.05);
                    }
                    return;
                }
                if (e.type === "bomb") {
                    if (e.explodingFrames > 0) {
                        e.explodingFrames -= 1;
                        if (e.explodingFrames <= 0) {
                            e.dead = true;
                        }
                        return;
                    }
                    const nearPlayer = Math.abs((player.x + player.w / 2) - (e.x + e.w / 2)) < 130;
                    if (!e.armed && nearPlayer) {
                        e.armed = true;
                        e.fuse = randomInt(14, 28);
                    }
                    if (e.armed) {
                        e.fuse -= 1;
                        if (e.fuse <= 0) {
                            e.explodingFrames = 32;
                            e.vx = 0;
                        }
                    } else {
                        e.x += e.vx;
                        if (e.x <= e.minX) {
                            e.x = e.minX;
                            e.vx = Math.abs(e.vx);
                        }
                        if (e.x >= e.maxX) {
                            e.x = e.maxX;
                            e.vx = -Math.abs(e.vx);
                        }
                    }
                    return;
                }
                if (e.type === "shooter") {
                    e.shootTimer -= 1;
                    const ex = e.x - cameraX;
                    const onScreen = ex + e.w > 0 && ex < canvas.width;
                    const playerScreenX = player.x - cameraX;
                    const playerOnScreen = playerScreenX + player.w > 0 && playerScreenX < canvas.width;
                    const playerDx = Math.abs((player.x + player.w / 2) - (e.x + e.w / 2));
                    const playerDy = Math.abs((player.y + player.h / 2) - (e.y + e.h / 2));
                    const hasLine = playerDx < 520 && playerDy < 170;
                    if (e.shootTimer <= 0 && onScreen && playerOnScreen && hasLine) {
                        const dir = player.x + player.w / 2 >= e.x + e.w / 2 ? 1 : -1;
                        enemyProjectiles.push({
                            x: e.x + e.w / 2 - 4,
                            y: e.y + e.h * 0.42,
                            w: 8,
                            h: 8,
                            vx: dir * (e.projectileSpeed || 3.8),
                            vy: 0
                        });
                        e.shootTimer = randomInt(90, 160);
                    } else if (e.shootTimer <= 0 && !onScreen) {
                        e.shootTimer = randomInt(35, 70);
                    }
                    return;
                }
                if (e.type === "flyer") {
                    e.x += e.vx;
                    if (e.x <= e.minX) {
                        e.x = e.minX;
                        e.vx = Math.abs(e.vx);
                    }
                    if (e.x >= e.maxX) {
                        e.x = e.maxX;
                        e.vx = -Math.abs(e.vx);
                    }
                    e.y = e.baseY + Math.sin(runElapsedFrames * e.floatSpeed + e.phase) * e.floatAmp;
                    return;
                }
                if (e.type === "hopper") {
                    e.x += e.vx;
                    if (e.x <= e.minX) {
                        e.x = e.minX;
                        e.vx = Math.abs(e.vx);
                    }
                    if (e.x >= e.maxX) {
                        e.x = e.maxX;
                        e.vx = -Math.abs(e.vx);
                    }
                    e.jumpTimer -= 1;
                    if (e.jumpTimer <= 0 && Math.abs(e.y - e.baseY) < 0.5) {
                        e.vy = -7.4;
                    }
                    e.vy = clamp((e.vy || 0) + 0.42, -20, 11);
                    e.y += e.vy;
                    if (e.y >= e.baseY) {
                        e.y = e.baseY;
                        e.vy = 0;
                        e.jumpTimer = randomInt(36, 88);
                    }
                    return;
                }

                e.x += e.vx;
                if (e.x <= e.minX) {
                    e.x = e.minX;
                    e.vx = Math.abs(e.vx);
                }
                if (e.x >= e.maxX) {
                    e.x = e.maxX;
                    e.vx = -Math.abs(e.vx);
                }
            });
            enemies = enemies.filter(e => !e.dead);
        }
        function updateEnemyProjectiles() {
            enemyProjectiles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
            });
            enemyProjectiles = enemyProjectiles.filter(p =>
                p.x + p.w > 0 && p.x < worldWidth && p.y + p.h > -40 && p.y < canvas.height + 40
            );
        }
        function updatePlayerProjectiles() {
            playerProjectiles.forEach(p => {
                p.life -= 1;
                if (!p.target || p.target.dead || !enemies.includes(p.target)) {
                    p.target = getNearestEnemyTarget(p.x + p.w / 2, p.y + p.h / 2);
                }
                if (p.target) {
                    const dx = (p.target.x + p.target.w / 2) - (p.x + p.w / 2);
                    const dy = (p.target.y + p.target.h / 2) - (p.y + p.h / 2);
                    const mag = Math.hypot(dx, dy) || 1;
                    const desiredVx = (dx / mag) * p.speed;
                    const desiredVy = (dy / mag) * p.speed;
                    p.vx += (desiredVx - p.vx) * p.turnRate;
                    p.vy += (desiredVy - p.vy) * p.turnRate;
                    const newMag = Math.hypot(p.vx, p.vy) || 1;
                    p.vx = (p.vx / newMag) * p.speed;
                    p.vy = (p.vy / newMag) * p.speed;
                }
                p.x += p.vx;
                p.y += p.vy;
            });
            playerProjectiles = playerProjectiles.filter(p =>
                p.life > 0 &&
                p.x + p.w > -30 &&
                p.x < worldWidth + 30 &&
                p.y + p.h > -50 &&
                p.y < canvas.height + 50
            );
        }
        function updateHazards() {
            spikes.forEach(h => {
                if (h.type === "saw") {
                    h.x += h.vx;
                    if (h.x <= h.minX) {
                        h.x = h.minX;
                        h.vx = Math.abs(h.vx);
                    }
                    if (h.x >= h.maxX) {
                        h.x = h.maxX;
                        h.vx = -Math.abs(h.vx);
                    }
                }
            });
        }

        function handleEnemyCollisions(prevY) {
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                if (enemy.type === "bomb" && enemy.explodingFrames > 0) {
                    const dx = (player.x + player.w / 2) - (enemy.x + enemy.w / 2);
                    const dy = (player.y + player.h / 2) - (enemy.y + enemy.h / 2);
                    const r = enemy.explosionRadius || 72;
                    if ((dx * dx + dy * dy) <= (r * r)) {
                        hurtPlayer();
                    }
                    continue;
                }
                if (!rectCollision(player, enemy)) continue;
                const stomping = player.vy > 0 && prevY + player.h <= enemy.y + 10;
                if (enemy.type === "bomb") {
                    if (enemy.explodingFrames <= 0) {
                        enemy.armed = true;
                        enemy.fuse = 1;
                    }
                    continue;
                }
                if (enemy.type === "boss") {
                    if (stomping) {
                        enemy.health -= 1;
                        enemy.hitFlash = 10;
                        player.vy = -11.5;
                        if (enemy.health <= 0) {
                            enemy.dead = true;
                            points += enemy.reward || 1200;
                        }
                    } else {
                        hurtPlayer();
                    }
                    continue;
                }
                if (stomping && enemy.type !== "piranha") {
                    enemies.splice(i, 1);
                    player.vy = -10.5;
                    points += 150;
                } else {
                    hurtPlayer();
                }
            }
        }
        function handleEnemyProjectileCollisions() {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const p = enemyProjectiles[i];
                if (!rectCollision(player, p)) continue;
                enemyProjectiles.splice(i, 1);
                hurtPlayer();
                if (effectImmortal <= 0) break;
            }
        }
        function handlePlayerProjectileHits() {
            for (let i = playerProjectiles.length - 1; i >= 0; i--) {
                const shot = playerProjectiles[i];
                let hit = false;
                for (let j = enemies.length - 1; j >= 0; j--) {
                    const enemy = enemies[j];
                    if (!enemy || enemy.dead) continue;
                    if (!rectCollision(shot, enemy)) continue;
                    hit = true;
                    if (enemy.type === "boss") {
                        enemy.health -= 1;
                        enemy.hitFlash = 10;
                        if (enemy.health <= 0) {
                            enemy.dead = true;
                            points += enemy.reward || 1200;
                        }
                    } else {
                        enemies.splice(j, 1);
                        points += 140;
                    }
                    break;
                }
                if (hit) {
                    playerProjectiles.splice(i, 1);
                }
            }
        }

        function handleSpikeCollisions() {
            for (let i = spikes.length - 1; i >= 0; i--) {
                const hazard = spikes[i];
                if (hazard.type === "flame") {
                    const phase = ((runElapsedFrames + hazard.phase) % hazard.period);
                    const active = phase < hazard.period * 0.56;
                    if (!active) continue;
                }
                if (rectCollision(player, hazard)) {
                    if (trapContactCooldownFrames > 0) break;
                    if (hazard.type === "freeze") {
                        playerFrozenFrames = Math.max(playerFrozenFrames, 180);
                        trapContactCooldownFrames = 45;
                        spikes.splice(i, 1);
                    } else if (hazard.type === "poison" || hazard.type === "burn") {
                        trapContactCooldownFrames = 45;
                        hurtPlayer();
                    } else {
                        hurtPlayer();
                    }
                    break;
                }
            }
        }

        function collectCoins() {
            for (let i = coins.length - 1; i >= 0; i--) {
                const coin = coins[i];
                if (coin.taken) continue;
                if (rectCollision(player, coin)) {
                    coin.taken = true;
                    points += 10;
                }
            }
            coins = coins.filter(c => !c.taken);
        }
        function checkGoal() {
            if (!rectCollision(player, goal)) return;
            if (isBossLevel(currentLevel) && getBossForLevel(currentLevel)) {
                menuStatus.textContent = "Defeat the boss first!";
                return;
            }
            points += timeLeft * 8;
            if (currentLevel < MAX_LEVELS) {
                currentLevel += 1;
                buildLevel(currentLevel);
                saveGameState();
            } else {
                points += 1000000;
                gameWon = true;
                gamePaused = true;
                lastRunTimeFrames = runElapsedFrames;
                if (bestTimeFrames === 0 || runElapsedFrames < bestTimeFrames) {
                    bestTimeFrames = runElapsedFrames;
                    localStorage.setItem("mrp_best_time_frames", String(bestTimeFrames));
                }
                clearSavedRun();
                updateUI();
                openMainMenu("Victory!", true);
            }
        }

        function updatePlayer() {
            if (standingPlatform && player.onGround) {
                player.x += standingPlatform.dx || 0;
                player.y += standingPlatform.dy || 0;
            }
            if (playerFrozenFrames > 0) {
                player.vx = 0;
                const prevY = player.y;
                player.vy = clamp(player.vy + GRAVITY, -99, MAX_FALL_SPEED);
                player.y += player.vy;
                resolveVerticalCollisions(prevY);
                player.x = clamp(player.x, 0, worldWidth - player.w);
                return;
            }
            if (dashState) {
                const nextFrame = dashState.frame + 1;
                const t = clamp(nextFrame / dashState.total, 0, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                const prevX = player.x;
                const prevY = player.y;
                player.x = dashState.fromX + (dashState.toX - dashState.fromX) * eased;
                player.y = dashState.fromY + (dashState.toY - dashState.fromY) * eased;
                resolveHorizontalCollisions(prevX);
                resolveVerticalCollisions(prevY);
                player.vx = 0;
                player.vy = 0;
                player.onGround = true;
                player.jumpsUsed = 0;
                dashState.frame = nextFrame;
                if (dashState.frame >= dashState.total) {
                    dashState = null;
                }
                player.x = clamp(player.x, 0, worldWidth - player.w);
                return;
            }

            const moveLeft = keys["ArrowLeft"] || keys["KeyA"];
            const moveRight = keys["ArrowRight"] || keys["KeyD"];

            if (moveLeft) player.vx -= ACCEL;
            if (moveRight) player.vx += ACCEL;
            if (moveLeft && !moveRight) playerFacing = -1;
            if (moveRight && !moveLeft) playerFacing = 1;
            if (!moveLeft && !moveRight) player.vx *= FRICTION;
            const speedCap = effectSpeed > 0 ? MAX_RUN_SPEED + 2.1 : MAX_RUN_SPEED;
            player.vx = clamp(player.vx, -speedCap, speedCap);
            if (Math.abs(player.vx) < 0.05) player.vx = 0;
            if (player.vx > 0.15) playerFacing = 1;
            if (player.vx < -0.15) playerFacing = -1;

            if (effectJump > 0) {
                const wantsUp = keys["ArrowUp"] || keys["KeyW"] || keys["Space"];
                const wantsDown = keys["ArrowDown"] || keys["KeyS"];
                if (wantsUp) {
                    player.vy = -4.8;
                } else if (wantsDown) {
                    player.vy = Math.min(MAX_FALL_SPEED, player.vy + 1.4);
                } else {
                    player.vy *= 0.9;
                }
                player.jumpsUsed = 0;
                jumpQueued = false;
            } else {
                const jumpForce = JUMP_FORCE;
                if (jumpQueued && player.jumpsUsed < player.maxJumps) {
                    player.vy = jumpForce;
                    player.onGround = false;
                    player.jumpsUsed += 1;
                    standingPlatform = null;
                    jumpQueued = false;
                }
                player.vy = clamp(player.vy + GRAVITY, -99, MAX_FALL_SPEED);
            }

            const prevX = player.x;
            const prevY = player.y;
            player.x += player.vx;
            resolveHorizontalCollisions(prevX);

            player.y += player.vy;
            resolveVerticalCollisions(prevY);

            player.x = clamp(player.x, 0, worldWidth - player.w);
        }

        function updateCamera() {
            const target = player.x - canvas.width * 0.35;
            cameraX = clamp(target, 0, Math.max(0, worldWidth - canvas.width));
        }

        function updateTimer() {
            if (effectFreezeTime > 0) return;
            timerCounter += 1;
            if (timerCounter >= 60) {
                timerCounter = 0;
                timeLeft -= 1;
                if (timeLeft <= 0) {
                    timeLeft = 0;
                    hurtPlayer();
                }
            }
        }

        function update() {
            if (gamePaused || gameOver || gameWon || screens.game.classList.contains("hidden")) return;
            const freezeActive = effectFreezeTime > 0;
            if (invulnerable > 0) invulnerable -= 1;
            if (playerFrozenFrames > 0) playerFrozenFrames -= 1;
            if (trapContactCooldownFrames > 0) trapContactCooldownFrames -= 1;
            if (effectShield > 0) effectShield -= 1;
            if (effectSpeed > 0) effectSpeed -= 1;
            if (effectJump > 0) effectJump -= 1;
            if (effectImmortal > 0) effectImmortal -= 1;
            if (effectFreezeTime > 0) effectFreezeTime -= 1;
            if (shieldCooldownFrames > 0) shieldCooldownFrames -= 1;
            if (speedCooldownFrames > 0) speedCooldownFrames -= 1;
            if (jumpCooldownFrames > 0) jumpCooldownFrames -= 1;
            if (dashFxFrames > 0) dashFxFrames -= 1;

            const prevY = player.y;
            updateMovingPlatforms();
            updatePlayer();
            if (!freezeActive) {
                updateEnemies();
                updateEnemyProjectiles();
            }
            updatePlayerProjectiles();
            updateHazards();
            handleEnemyCollisions(prevY);
            handleEnemyProjectileCollisions();
            handlePlayerProjectileHits();
            handleSpikeCollisions();
            collectCoins();
            checkGoal();

            if (player.y + player.h >= GROUND_Y + 14 || player.y > canvas.height + 220) {
                hurtPlayer();
            }

            updateCamera();
            if (!freezeActive) updateTimer();
            runElapsedFrames++;
            updateUI();
        }

        function drawBackground() {
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, levelTheme.skyTop);
            grad.addColorStop(1, levelTheme.skyBottom);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Sun
            const sunX = canvas.width - 170 - (cameraX * 0.03 % 80);
            const sunY = 110;
            if (levelTheme.stars) {
                ctx.fillStyle = "rgba(220, 234, 255, 0.92)";
                for (let i = 0; i < 90; i++) {
                    const sx = ((i * 170) - cameraX * 0.02) % (canvas.width + 200) - 80;
                    const sy = 28 + ((i * 67) % (GROUND_Y - 210));
                    const r = (i % 3 === 0) ? 1.7 : 1.1;
                    ctx.beginPath();
                    ctx.arc(sx, sy, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.fillStyle = levelTheme.sunColor || "rgba(255,233,153,0.9)";
            ctx.beginPath();
            ctx.arc(sunX, sunY, levelTheme.stars ? 34 : 46, 0, Math.PI * 2);
            ctx.fill();

            // Clouds
            for (let i = 0; i < 6; i++) {
                const cx = ((i * 280) - cameraX * 0.16) % (canvas.width + 260) - 130;
                const cy = 90 + (i % 3) * 42;
                ctx.fillStyle = `rgba(255,255,255,${levelTheme.cloudAlpha || 0.65})`;
                ctx.beginPath();
                ctx.arc(cx, cy, 22, 0, Math.PI * 2);
                ctx.arc(cx + 24, cy - 8, 26, 0, Math.PI * 2);
                ctx.arc(cx + 50, cy, 22, 0, Math.PI * 2);
                ctx.fill();
            }

            // Far mountain band.
            ctx.fillStyle = levelTheme.mountainFar || "rgba(61, 95, 126, 0.45)";
            for (let i = 0; i < 7; i++) {
                const mx = ((i * 320) - cameraX * 0.1) % (canvas.width + 520) - 260;
                const my = GROUND_Y - 86;
                ctx.beginPath();
                ctx.moveTo(mx, my);
                ctx.lineTo(mx + 96, my - 110);
                ctx.lineTo(mx + 200, my);
                ctx.closePath();
                ctx.fill();
            }

            // Mid mountain band for depth.
            ctx.fillStyle = levelTheme.mountainMid || "rgba(52, 84, 112, 0.62)";
            for (let i = 0; i < 6; i++) {
                const mx = ((i * 390) - cameraX * 0.16) % (canvas.width + 620) - 280;
                const my = GROUND_Y - 54;
                ctx.beginPath();
                ctx.moveTo(mx, my);
                ctx.lineTo(mx + 132, my - 156);
                ctx.lineTo(mx + 260, my);
                ctx.closePath();
                ctx.fill();
            }

            // Rolling hills in front of mountains.
            ctx.fillStyle = levelTheme.hill;
            for (let i = 0; i < 9; i++) {
                const x = ((i * 280) - cameraX * 0.24) % (canvas.width + 460) - 230;
                const y = GROUND_Y - 26 - (i % 2) * 16;
                ctx.beginPath();
                ctx.arc(x, y, 165, Math.PI, Math.PI * 2);
                ctx.fill();
            }

        }

        function drawWorldRect(rect, color) {
            const sx = rect.x - cameraX;
            if (sx + rect.w < -50 || sx > canvas.width + 50) return;
            ctx.fillStyle = color;
            ctx.fillRect(sx, rect.y, rect.w, rect.h);
        }
        function drawEnemySprite(enemy) {
            const ex = enemy.x - cameraX;
            if (ex + enemy.w < -40 || ex > canvas.width + 40) return;
            const facing = enemy.vx < 0 ? -1 : 1;
            const step = Math.sin(runElapsedFrames * 0.3 + enemy.x * 0.09);
            const bob = Math.abs(step) * 1.4;
            const footSwing = step * 2.6;
            const cx = ex + enemy.w / 2;
            const cy = enemy.y + enemy.h / 2;
            const isBoss = enemy.type === "boss";
            const isBeetle = enemy.type === "beetle";
            const isHopper = enemy.type === "hopper";
            const isFlyer = enemy.type === "flyer";
            const isShooter = enemy.type === "shooter";
            const isBomb = enemy.type === "bomb";
            const isPiranha = enemy.type === "piranha";

            if (isBoss) {
                const pulse = 0.6 + 0.4 * Math.sin(runElapsedFrames * 0.25);
                const healthRatio = clamp((enemy.health || 0) / Math.max(1, enemy.maxHealth || 1), 0, 1);
                const flashOn = enemy.hitFlash > 0;
                const archetype = enemy.archetype || (enemy.level === 5 ? "goomba" : (enemy.level === 10 ? "bowser" : "evil_runner"));

                ctx.save();
                ctx.translate(cx, cy - bob * 0.35);
                ctx.scale(facing, 1);

                if (archetype === "goomba") {
                    ctx.fillStyle = "#5b3718";
                    ctx.fillRect(-enemy.w * 0.36, enemy.h * 0.28, enemy.w * 0.28, enemy.h * 0.16);
                    ctx.fillRect(enemy.w * 0.08, enemy.h * 0.28, enemy.w * 0.28, enemy.h * 0.16);
                    ctx.fillStyle = flashOn ? "#ffffff" : "#8b4d24";
                    ctx.beginPath();
                    ctx.ellipse(0, 0, enemy.w * 0.46, enemy.h * 0.42, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#f1c27d";
                    ctx.beginPath();
                    ctx.ellipse(0, enemy.h * 0.11, enemy.w * 0.24, enemy.h * 0.18, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#fffaf0";
                    ctx.fillRect(-enemy.w * 0.18, -enemy.h * 0.14, enemy.w * 0.12, enemy.h * 0.14);
                    ctx.fillRect(enemy.w * 0.06, -enemy.h * 0.14, enemy.w * 0.12, enemy.h * 0.14);
                    ctx.fillStyle = "#111827";
                    ctx.fillRect(-enemy.w * 0.13, -enemy.h * 0.1, enemy.w * 0.05, enemy.h * 0.08);
                    ctx.fillRect(enemy.w * 0.1, -enemy.h * 0.1, enemy.w * 0.05, enemy.h * 0.08);
                    ctx.strokeStyle = "#2f1608";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(-enemy.w * 0.2, -enemy.h * 0.16);
                    ctx.lineTo(-enemy.w * 0.05, -enemy.h * 0.2);
                    ctx.moveTo(enemy.w * 0.05, -enemy.h * 0.2);
                    ctx.lineTo(enemy.w * 0.2, -enemy.h * 0.16);
                    ctx.stroke();
                } else if (archetype === "bowser") {
                    ctx.fillStyle = "#2f7d32";
                    ctx.beginPath();
                    ctx.ellipse(0, 0, enemy.w * 0.46, enemy.h * 0.42, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = flashOn ? "#ffffff" : "#5e3a1f";
                    ctx.fillRect(-enemy.w * 0.23, enemy.h * 0.05, enemy.w * 0.46, enemy.h * 0.22);
                    ctx.fillStyle = "#f8e28b";
                    ctx.fillRect(-enemy.w * 0.17, enemy.h * 0.09, enemy.w * 0.34, enemy.h * 0.14);
                    ctx.fillStyle = "#3f3f46";
                    ctx.fillRect(-enemy.w * 0.34, enemy.h * 0.28, enemy.w * 0.24, enemy.h * 0.15);
                    ctx.fillRect(enemy.w * 0.1, enemy.h * 0.28, enemy.w * 0.24, enemy.h * 0.15);
                    ctx.fillStyle = "#f8fafc";
                    for (let i = 0; i < 4; i++) {
                        const sx = -enemy.w * 0.25 + i * enemy.w * 0.16;
                        ctx.beginPath();
                        ctx.moveTo(sx, -enemy.h * 0.28);
                        ctx.lineTo(sx + 5, -enemy.h * 0.44);
                        ctx.lineTo(sx + 10, -enemy.h * 0.28);
                        ctx.closePath();
                        ctx.fill();
                    }
                    ctx.fillStyle = "#fffaf0";
                    ctx.fillRect(-enemy.w * 0.2, -enemy.h * 0.14, enemy.w * 0.12, enemy.h * 0.14);
                    ctx.fillRect(enemy.w * 0.08, -enemy.h * 0.14, enemy.w * 0.12, enemy.h * 0.14);
                    ctx.fillStyle = "#111827";
                    ctx.fillRect(-enemy.w * 0.15, -enemy.h * 0.1, enemy.w * 0.05, enemy.h * 0.08);
                    ctx.fillRect(enemy.w * 0.12, -enemy.h * 0.1, enemy.w * 0.05, enemy.h * 0.08);
                } else {
                    // Evil bigger player variant.
                    const scaleX = 1.2;
                    const scaleY = 1.2;
                    ctx.scale(scaleX, scaleY);
                    const body = flashOn ? "#ffffff" : "#111827";
                    const pants = flashOn ? "#ffffff" : "#3f3f46";
                    const hat = flashOn ? "#ffffff" : "#7f1d1d";
                    ctx.fillStyle = "#f1c9a5";
                    ctx.beginPath();
                    ctx.arc(0, -enemy.h * 0.18, enemy.w * 0.12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = hat;
                    ctx.fillRect(-enemy.w * 0.16, -enemy.h * 0.34, enemy.w * 0.32, enemy.h * 0.11);
                    ctx.fillRect(-enemy.w * 0.12, -enemy.h * 0.42, enemy.w * 0.24, enemy.h * 0.1);
                    ctx.fillStyle = body;
                    ctx.fillRect(-enemy.w * 0.15, -enemy.h * 0.06, enemy.w * 0.3, enemy.h * 0.28);
                    ctx.fillStyle = pants;
                    ctx.fillRect(-enemy.w * 0.15, enemy.h * 0.18, enemy.w * 0.3, enemy.h * 0.18);
                    ctx.strokeStyle = "#0f172a";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(-enemy.w * 0.08, enemy.h * 0.36);
                    ctx.lineTo(-enemy.w * 0.12, enemy.h * 0.46);
                    ctx.moveTo(enemy.w * 0.08, enemy.h * 0.36);
                    ctx.lineTo(enemy.w * 0.12, enemy.h * 0.46);
                    ctx.stroke();
                    ctx.fillStyle = "#ef4444";
                    ctx.fillRect(-enemy.w * 0.06, -enemy.h * 0.2, enemy.w * 0.05, enemy.h * 0.05);
                    ctx.fillRect(enemy.w * 0.01, -enemy.h * 0.2, enemy.w * 0.05, enemy.h * 0.05);
                }

                ctx.strokeStyle = `rgba(248, 250, 252, ${0.35 + pulse * 0.4})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, Math.max(enemy.w, enemy.h) * 0.56, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                const barW = Math.max(70, enemy.w + 24);
                const barH = 8;
                const barX = cx - barW / 2;
                const barY = enemy.y - 18;
                ctx.fillStyle = "rgba(15, 23, 42, 0.86)";
                ctx.fillRect(barX, barY, barW, barH);
                ctx.fillStyle = healthRatio > 0.45 ? "#22c55e" : (healthRatio > 0.2 ? "#f59e0b" : "#ef4444");
                ctx.fillRect(barX + 1, barY + 1, (barW - 2) * healthRatio, barH - 2);
                ctx.strokeStyle = "rgba(248, 250, 252, 0.75)";
                ctx.lineWidth = 1;
                ctx.strokeRect(barX, barY, barW, barH);
                return;
            }

            ctx.save();
            ctx.translate(cx, cy - bob * 0.5);
            ctx.scale((isShooter ? (player.x < enemy.x ? -1 : 1) : facing), 1);

            // Feet
            ctx.fillStyle = isBomb ? "#2a2f39" : (isFlyer ? "#496170" : (isBeetle ? "#2f2f35" : "#5c3219"));
            ctx.fillRect(-11, 8 + footSwing * 0.15, 9, 6);
            ctx.fillRect(2, 8 - footSwing * 0.15, 9, 6);

            // Body
            ctx.fillStyle = isPiranha ? "#3da34c" : (isBomb ? "#404854" : (isShooter ? "#5a2f7a" : (isFlyer ? "#55839a" : (isBeetle ? "#3f4854" : (isHopper ? "#7e4a2c" : "#9b5a2d")))));
            ctx.beginPath();
            ctx.ellipse(0, isHopper ? -2.5 : -1, isBeetle ? 15 : (isFlyer ? 13 : (isBomb ? 12 : 14)), isBeetle ? 11 : (isFlyer ? 10 : (isBomb ? 12 : 13)), 0, 0, Math.PI * 2);
            ctx.fill();

            // Belly
            ctx.fillStyle = isPiranha ? "#7fe05f" : (isBomb ? "#7a8797" : (isShooter ? "#8e5eb0" : (isBeetle ? "#66707e" : (isFlyer ? "#89b8cc" : "#c98755"))));
            ctx.beginPath();
            ctx.ellipse(0, 2, isHopper ? 7 : 8, isHopper ? 6 : 7, 0, 0, Math.PI * 2);
            ctx.fill();

            if (isFlyer) {
                ctx.fillStyle = "#b7d6e4";
                ctx.beginPath();
                ctx.ellipse(-10, -2, 8, 4, -0.2, 0, Math.PI * 2);
                ctx.ellipse(10, -2, 8, 4, 0.2, 0, Math.PI * 2);
                ctx.fill();
            }
            if (isBomb) {
                ctx.fillStyle = enemy.explodingFrames > 0 ? "#ff6b3d" : "#f97316";
                ctx.fillRect(-2, -15, 4, 4);
                ctx.beginPath();
                ctx.arc(4, -14, 2.5, 0, Math.PI * 2);
                ctx.fill();
                if (enemy.explodingFrames > 0) {
                    const progress = 1 - (enemy.explodingFrames / 32);
                    const blastR = 10 + progress * (enemy.explosionRadius || 72);
                    ctx.strokeStyle = `rgba(255,120,70,${0.65 - progress * 0.45})`;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(0, 0, blastR, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.strokeStyle = `rgba(255,210,120,${0.5 - progress * 0.4})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, Math.max(0, blastR - 10), 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
            if (isPiranha) {
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(-11, -13, 22, 8);
                ctx.fillStyle = "#f8fafc";
                ctx.fillRect(-8, -11, 3, 3);
                ctx.fillRect(5, -11, 3, 3);
            }

            // Eyes
            ctx.fillStyle = "#fffef4";
            ctx.fillRect(-5, -8, 4, 7);
            ctx.fillRect(1, -8, 4, 7);
            ctx.fillStyle = "#1a120b";
            ctx.fillRect(-3, -6, 2, 3);
            ctx.fillRect(3, -6, 2, 3);

            // Brows / frown
            ctx.strokeStyle = isShooter ? "#2b1636" : (isBeetle ? "#111520" : "#2a170c");
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(-6, -9);
            ctx.lineTo(-1, -10);
            ctx.moveTo(1, -10);
            ctx.lineTo(6, -9);
            ctx.stroke();

            if (isShooter) {
                ctx.fillStyle = "#d8b4fe";
                ctx.fillRect(8, -3, 6, 3);
            }

            ctx.restore();
        }
        function drawPlayerSprite(px) {
            const blink = invulnerable > 0 && Math.floor(invulnerable / 6) % 2 === 0;
            const activeSkin = getSkinById(equippedSkin);
            const speedCap = effectSpeed > 0 ? MAX_RUN_SPEED + 2.1 : MAX_RUN_SPEED;
            const speedNorm = clamp(Math.abs(player.vx) / Math.max(0.001, speedCap), 0, 1);
            const onGround = player.onGround;
            const running = onGround && speedNorm > 0.08;
            const runPhase = Math.sin(runElapsedFrames * 0.42 + player.x * 0.09);
            const bob = running ? Math.abs(runPhase) * (1 + speedNorm * 1.2) : 0;
            const armSwing = running ? runPhase * (2 + speedNorm * 4.5) : 0;
            const legSwing = running ? runPhase * (2.2 + speedNorm * 5.2) : 0;
            const jumpPose = !onGround;
            const jumpTilt = jumpPose ? clamp(player.vy / 10, -1, 1) : 0;

            const immortalPalette = {
                classic: { hat: "#ffe082", body: "#00e5ff", pants: "#1d4ed8" },
                forest: { hat: "#fef08a", body: "#22d3ee", pants: "#0f766e" },
                sunset: { hat: "#fde68a", body: "#38bdf8", pants: "#4338ca" },
                shadow: { hat: "#e2e8f0", body: "#60a5fa", pants: "#1e3a8a" },
                royal: { hat: "#f5d0fe", body: "#22d3ee", pants: "#5b21b6" },
                ocean: { hat: "#dbeafe", body: "#67e8f9", pants: "#1d4ed8" },
                ember: { hat: "#fecaca", body: "#22d3ee", pants: "#7e22ce" },
                nebula: { hat: "#ddd6fe", body: "#67e8f9", pants: "#312e81" }
            };
            const imm = immortalPalette[equippedSkin] || { hat: "#fef9c3", body: "#22d3ee", pants: "#1d4ed8" };
            const pulse = 0.7 + 0.3 * Math.sin(runElapsedFrames * 0.5);
            const hatColor = blink ? "#ffffff" : (effectImmortal > 0 ? imm.hat : "#d63939");
            const shirtColor = blink ? "#ffffff" : (effectImmortal > 0 ? imm.body : activeSkin.body);
            const pantsColor = blink ? "#ffffff" : (effectImmortal > 0 ? imm.pants : activeSkin.pants);
            const cx = px + player.w / 2;
            const cy = player.y + player.h / 2;

            ctx.save();
            ctx.translate(cx, cy - bob * 0.5);
            ctx.scale(playerFacing, 1);

            // Head
            ctx.fillStyle = "#ffd7ba";
            ctx.beginPath();
            ctx.arc(0, -11 - bob * 0.25, 7, 0, Math.PI * 2);
            ctx.fill();

            // Hat + brim (brim makes facing direction obvious)
            ctx.fillStyle = hatColor;
            ctx.fillRect(-8, -18 - bob * 0.25, 16, 5);
            ctx.fillRect(-6, -21 - bob * 0.25, 12, 4);
            ctx.fillRect(3, -16 - bob * 0.25, 6, 2);

            // Eyes
            ctx.fillStyle = "#151515";
            ctx.fillRect(-3, -12 - bob * 0.25, 2, 2);
            ctx.fillRect(1, -12 - bob * 0.25, 2, 2);

            // Torso
            ctx.fillStyle = shirtColor;
            ctx.fillRect(-8, -6 - bob * 0.1, 16, 13);

            if (effectImmortal > 0) {
                ctx.strokeStyle = `rgba(255,255,255,${0.35 + pulse * 0.45})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(-9, -7 - bob * 0.1, 18, 15);
            }

            // Arms
            ctx.strokeStyle = "#ffd7ba";
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (jumpPose) {
                ctx.moveTo(-8, -3);
                ctx.lineTo(-13, -8 + jumpTilt * 2);
                ctx.moveTo(8, -3);
                ctx.lineTo(12, -10 + jumpTilt * 2);
            } else {
                ctx.moveTo(-8, -3);
                ctx.lineTo(-12, -1 + armSwing);
                ctx.moveTo(8, -3);
                ctx.lineTo(12, -1 - armSwing);
            }
            ctx.stroke();

            // Pants
            ctx.fillStyle = pantsColor;
            ctx.fillRect(-8, 7, 16, 9);

            // Legs
            ctx.strokeStyle = "#262626";
            ctx.lineWidth = 3;
            ctx.beginPath();
            if (jumpPose) {
                ctx.moveTo(-4, 16);
                ctx.lineTo(-7, 20 + Math.max(0, jumpTilt * 2.5));
                ctx.moveTo(4, 16);
                ctx.lineTo(7, 20 + Math.max(0, jumpTilt * 2.5));
            } else {
                ctx.moveTo(-4, 16);
                ctx.lineTo(-6, 20 + legSwing);
                ctx.moveTo(4, 16);
                ctx.lineTo(6, 20 - legSwing);
            }
            ctx.stroke();

            ctx.restore();
        }
        function drawPlayerStatusTimers(px) {
            if (playerFrozenFrames <= 0) return;

            const label = `FROZEN ${formatSecondsFromFrames(playerFrozenFrames)}`;
            const centerX = px + player.w / 2;
            const baseY = player.y - 14;

            ctx.save();
            ctx.font = "700 12px Inter, Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const padX = 8;
            const badgeH = 18;
            const textW = ctx.measureText(label).width;
            const badgeW = textW + padX * 2;
            const badgeX = clamp(centerX - badgeW / 2, 4, canvas.width - badgeW - 4);
            const badgeY = baseY - badgeH;

            ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
            ctx.strokeStyle = "rgba(125, 211, 252, 0.95)";
            ctx.lineWidth = 1.4;
            ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
            ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

            ctx.fillStyle = "#e0f2fe";
            ctx.fillText(label, badgeX + badgeW / 2, badgeY + badgeH / 2 + 0.5);
            ctx.restore();
        }

        function draw() {
            if (screens.game.classList.contains("hidden")) return;

            drawBackground();

            // Water hazard layer (replaces solid ground).
            const waterTop = GROUND_Y;
            const waterGrad = ctx.createLinearGradient(0, waterTop, 0, canvas.height);
            waterGrad.addColorStop(0, levelTheme.waterTop || "rgba(72, 186, 238, 0.86)");
            waterGrad.addColorStop(0.5, levelTheme.waterMid || "rgba(37, 139, 201, 0.9)");
            waterGrad.addColorStop(1, levelTheme.waterBottom || "rgba(23, 88, 146, 0.95)");
            ctx.fillStyle = waterGrad;
            ctx.fillRect(0, waterTop, canvas.width, canvas.height - waterTop);
            ctx.strokeStyle = levelTheme.waveBright || "rgba(214, 246, 255, 0.92)";
            ctx.lineWidth = 2.5;
            for (let i = 0; i < 14; i++) {
                const wx = ((i * 118) - cameraX * 0.34) % (canvas.width + 180) - 90;
                ctx.beginPath();
                ctx.moveTo(wx, waterTop + 10);
                ctx.quadraticCurveTo(wx + 28, waterTop - 3, wx + 56, waterTop + 10);
                ctx.stroke();
            }
            ctx.strokeStyle = levelTheme.waveDim || "rgba(104, 196, 232, 0.5)";
            ctx.lineWidth = 1.8;
            for (let i = 0; i < 10; i++) {
                const wx = ((i * 170) - cameraX * 0.22) % (canvas.width + 240) - 120;
                const wy = waterTop + 26 + (i % 3) * 13;
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.quadraticCurveTo(wx + 22, wy - 4, wx + 44, wy);
                ctx.stroke();
            }

            solids.forEach(block => {
                const color =
                    block.kind === "wall" ? "#4c5968" :
                    (block.kind === "moving_platform" ? "#d4b26a" :
                    (block.route ? (levelTheme.platformRoute || "#b77f3d") : (levelTheme.platformSide || "#9f7440")));
                drawWorldRect(block, color);
            });

            spikes.forEach(h => {
                const sx = h.x - cameraX;
                if (sx + h.w < -20 || sx > canvas.width + 20) return;
                if (h.type === "saw") {
                    const cx = sx + h.w / 2;
                    const cy = h.y + h.h / 2;
                    const angle = (runElapsedFrames * 0.24) % (Math.PI * 2);
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate(angle);
                    ctx.fillStyle = "#c6ccd9";
                    ctx.beginPath();
                    for (let i = 0; i < 12; i++) {
                        const a = (i / 12) * Math.PI * 2;
                        const r = i % 2 === 0 ? h.w / 2 : h.w / 2 - 5;
                        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = "#6b7382";
                    ctx.beginPath();
                    ctx.arc(0, 0, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    return;
                }
                if (h.type === "flame") {
                    const phase = ((runElapsedFrames + h.phase) % h.period);
                    const active = phase < h.period * 0.56;
                    if (!active) return;
                    const flicker = 1 + Math.sin((runElapsedFrames + h.phase) * 0.35) * 0.18;
                    ctx.fillStyle = "#ff6b2d";
                    ctx.beginPath();
                    ctx.ellipse(sx + h.w / 2, h.y + h.h / 2, (h.w * 0.5) * flicker, (h.h * 0.52) * flicker, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#ffd25b";
                    ctx.beginPath();
                    ctx.ellipse(sx + h.w / 2, h.y + h.h / 2 + 1, h.w * 0.28, h.h * 0.3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    return;
                }
                if (h.type === "burn") {
                    const flicker = 1 + Math.sin((runElapsedFrames + h.x * 0.2) * 0.33) * 0.16;
                    ctx.fillStyle = "#ff6b2d";
                    ctx.beginPath();
                    ctx.ellipse(sx + h.w / 2, h.y + h.h / 2, (h.w * 0.5) * flicker, (h.h * 0.52) * flicker, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#ffd25b";
                    ctx.beginPath();
                    ctx.ellipse(sx + h.w / 2, h.y + h.h / 2 + 1, h.w * 0.28, h.h * 0.3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    return;
                }
                if (h.type === "poison") {
                    ctx.fillStyle = "rgba(126, 255, 92, 0.88)";
                    ctx.beginPath();
                    ctx.ellipse(sx + h.w / 2, h.y + h.h * 0.58, h.w * 0.5, h.h * 0.45, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "rgba(34, 197, 94, 0.92)";
                    ctx.beginPath();
                    ctx.arc(sx + h.w * 0.34, h.y + h.h * 0.44, 3.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(sx + h.w * 0.68, h.y + h.h * 0.4, 2.6, 0, Math.PI * 2);
                    ctx.fill();
                    return;
                }
                if (h.type === "freeze") {
                    ctx.fillStyle = "#7dd3fc";
                    ctx.beginPath();
                    ctx.moveTo(sx + h.w / 2, h.y);
                    ctx.lineTo(sx + h.w, h.y + h.h * 0.45);
                    ctx.lineTo(sx + h.w * 0.76, h.y + h.h);
                    ctx.lineTo(sx + h.w * 0.24, h.y + h.h);
                    ctx.lineTo(sx, h.y + h.h * 0.45);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = "rgba(224, 242, 254, 0.95)";
                    ctx.beginPath();
                    ctx.arc(sx + h.w * 0.56, h.y + h.h * 0.44, 2.4, 0, Math.PI * 2);
                    ctx.fill();
                    return;
                }
                ctx.fillStyle = "#d53d3d";
                ctx.beginPath();
                ctx.moveTo(sx, h.y + h.h);
                ctx.lineTo(sx + h.w / 2, h.y);
                ctx.lineTo(sx + h.w, h.y + h.h);
                ctx.closePath();
                ctx.fill();
            });

            coins.forEach(c => {
                const sx = c.x - cameraX;
                if (sx + c.w < -20 || sx > canvas.width + 20) return;
                ctx.fillStyle = "#ffd84d";
                ctx.beginPath();
                ctx.arc(sx + c.w / 2, c.y + c.h / 2, c.w / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#cc9e00";
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            const gx = goal.x - cameraX;
            ctx.fillStyle = "#f5f5f5";
            ctx.fillRect(gx, goal.y, 6, goal.h);
            ctx.fillStyle = "#1ec94c";
            ctx.fillRect(gx + 6, goal.y + 22, 54, 34);

            enemies.forEach(drawEnemySprite);
            enemyProjectiles.forEach(p => {
                const px = p.x - cameraX;
                if (px + p.w < -20 || px > canvas.width + 20) return;
                ctx.fillStyle = "#ef4444";
                ctx.beginPath();
                ctx.arc(px + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fecaca";
                ctx.beginPath();
                ctx.arc(px + p.w / 2, p.y + p.h / 2, p.w / 4, 0, Math.PI * 2);
                ctx.fill();
            });
            playerProjectiles.forEach(p => {
                const px = p.x - cameraX;
                if (px + p.w < -20 || px > canvas.width + 20) return;
                const pulse = 0.65 + 0.35 * Math.sin(runElapsedFrames * 0.45 + p.x * 0.02);
                ctx.fillStyle = `rgba(59, 130, 246, ${0.65 + pulse * 0.35})`;
                ctx.beginPath();
                ctx.arc(px + p.w / 2, p.y + p.h / 2, p.w / 2 + 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#dbeafe";
                ctx.beginPath();
                ctx.arc(px + p.w / 2, p.y + p.h / 2, Math.max(2.4, p.w / 3), 0, Math.PI * 2);
                ctx.fill();
            });

            if (dashFxFrames > 0) {
                const progress = dashFxFrames / 14;
                const fromX = dashFxFromX - cameraX;
                const toX = dashFxToX - cameraX;
                ctx.save();
                const trail = ctx.createLinearGradient(fromX, dashFxY, toX, dashFxY);
                trail.addColorStop(0, `rgba(255,255,255,${0.06 + progress * 0.22})`);
                trail.addColorStop(0.5, `rgba(82,224,255,${0.1 + progress * 0.35})`);
                trail.addColorStop(1, `rgba(82,224,255,0)`);
                ctx.strokeStyle = trail;
                ctx.lineWidth = 7 + (1 - progress) * 5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(fromX, dashFxY);
                ctx.lineTo(toX, dashFxY - 2);
                ctx.stroke();
                ctx.restore();
            }

            const px = player.x - cameraX;
            drawPlayerSprite(px);

            if (effectShield > 0) {
                ctx.strokeStyle = "rgba(90,160,255,0.85)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(px + player.w / 2, player.y + player.h / 2, player.w / 1.3, 0, Math.PI * 2);
                ctx.stroke();
            }

            drawPlayerStatusTimers(px);
        }

        function updateUI() {
            if (gameWon) {
                statsDisplay.innerText = `LEVEL: ${MAX_LEVELS}/${MAX_LEVELS} | POINTS: ${points} | HEARTS: ${getHeartIcons()} | POWER: NONE | RUN: ${formatFrames(runElapsedFrames)}`;
                refreshPowerButtonVisibility();
                return;
            }
            const selectedPower = getPowerUpById(selectedPowerUpId);
            let powerText = "NONE";
            if (selectedPower) {
                if (selectedPower.id === "dash_boost") {
                    powerText = `${selectedPower.name} x${dashUsesRemaining}`;
                } else if (selectedPower.id === "tracker_boost") {
                    powerText = `${selectedPower.name} x${trackerUsesRemaining}`;
                } else {
                    powerText = selectedPower.name;
                }
            }
            const activeEffects = getActiveEffectTimers();
            if (activeEffects.length) powerText += ` [${activeEffects.join(" | ")}]`;
            const liveBoss = getBossForLevel(currentLevel);
            const bossText = liveBoss ? ` | BOSS HP: ${Math.max(0, liveBoss.health)}/${liveBoss.maxHealth}` : "";
            statsDisplay.innerText =
                `LEVEL: ${currentLevel}/${MAX_LEVELS} | POINTS: ${points} | HEARTS: ${getHeartIcons()} | POWER: ${powerText}${bossText} | RUN: ${formatFrames(runElapsedFrames)}`;
            refreshPowerButtonVisibility();
        }
        function canContinue() {
            return localStorage.getItem("mrp_saved_run") !== null;
        }

        function saveGameState() {
            if (!hasStartedRun || gameOver || gameWon) return;
            const payload = {
                currentLevel,
                health,
                points,
                timeLeft,
                timerCounter,
                runElapsedFrames,
                dashUsesRemaining,
                trackerUsesRemaining,
                shieldUsedThisRun,
                speedUsedThisRun,
                shieldCooldownFrames,
                speedCooldownFrames,
                jumpCooldownFrames,
                selectedPowerUpId,
                cameraX,
                invulnerable,
                effectShield,
                effectSpeed,
                effectJump,
                effectFreezeTime,
                effectImmortal,
                levelTheme,
                runTerrainOrder,
                worldWidth,
                solids,
                enemies,
                enemyProjectiles,
                playerProjectiles,
                coins,
                spikes,
                goal,
                levelSpawn,
                player,
                equippedSkin,
                unlockedSkins,
                unlockedPowerUps
            };
            localStorage.setItem("mrp_saved_run", JSON.stringify(payload));
        }

        function clearSavedRun() {
            localStorage.removeItem("mrp_saved_run");
        }

        function loadSavedRun() {
            const raw = localStorage.getItem("mrp_saved_run");
            if (!raw) return false;
            try {
                const s = JSON.parse(raw);
                currentLevel = s.currentLevel;
                health = s.health;
                points = typeof s.points === "number" ? s.points : ((s.coinsCollected || 0) * 10);
                timeLeft = s.timeLeft;
                timerCounter = s.timerCounter;
                runElapsedFrames = s.runElapsedFrames || 0;
                dashUsesRemaining =
                    typeof s.dashUsesRemaining === "number" ? s.dashUsesRemaining :
                    (typeof s.teleportUsesRemaining === "number" ? s.teleportUsesRemaining : 3);
                trackerUsesRemaining = typeof s.trackerUsesRemaining === "number" ? s.trackerUsesRemaining : 0;
                shieldUsedThisRun = !!s.shieldUsedThisRun;
                speedUsedThisRun = !!s.speedUsedThisRun;
                shieldCooldownFrames = typeof s.shieldCooldownFrames === "number" ? s.shieldCooldownFrames : 0;
                speedCooldownFrames = typeof s.speedCooldownFrames === "number" ? s.speedCooldownFrames : 0;
                jumpCooldownFrames = typeof s.jumpCooldownFrames === "number" ? s.jumpCooldownFrames : 0;
                selectedPowerUpId = s.selectedPowerUpId || selectedPowerUpId;
                if (selectedPowerUpId === "teleport_boost") selectedPowerUpId = "dash_boost";
                if (selectedPowerUpId === "points_boost") selectedPowerUpId = "tracker_boost";
                if (selectedPowerUpId === "immortal_boost") selectedPowerUpId = "tracker_boost";
                cameraX = s.cameraX;
                invulnerable = s.invulnerable;
                effectShield = s.effectShield || 0;
                effectSpeed = s.effectSpeed || 0;
                effectJump = s.effectJump || 0;
                effectFreezeTime = s.effectFreezeTime || 0;
                effectImmortal = s.effectImmortal || 0;
                runTerrainOrder = Array.isArray(s.runTerrainOrder) && s.runTerrainOrder.length
                    ? s.runTerrainOrder.slice(0, MAX_LEVELS).map((item, idx) => {
                        if (typeof item === "string") return { ...getTerrainById(item) };
                        if (item && typeof item === "object") return item;
                        return createProceduralTerrain(idx);
                    })
                    : generateTerrainSequence(MAX_LEVELS);
                levelTheme = s.levelTheme || getTerrainForLevel(currentLevel);
                worldWidth = s.worldWidth;
                solids = s.solids || [];
                enemies = s.enemies || [];
                enemyProjectiles = s.enemyProjectiles || [];
                playerProjectiles = s.playerProjectiles || [];
                coins = s.coins || [];
                spikes = s.spikes || [];
                goal = s.goal;
                levelSpawn = s.levelSpawn || levelSpawn;
                Object.assign(player, s.player || {});
                // Shop progression is sourced from dedicated shop storage to avoid stale run snapshots.
                if (!localStorage.getItem("mrp_equipped_skin") && s.equippedSkin) {
                    equippedSkin = s.equippedSkin;
                }
                if (!localStorage.getItem("mrp_unlocked_skins") && Array.isArray(s.unlockedSkins)) {
                    unlockedSkins = Array.from(new Set(["classic", ...s.unlockedSkins]));
                }
                if (!localStorage.getItem("mrp_unlocked_powerups") && Array.isArray(s.unlockedPowerUps)) {
                    unlockedPowerUps = Array.from(new Set(s.unlockedPowerUps));
                }
                gameOver = false;
                gameWon = false;
                hasStartedRun = true;
                return true;
            } catch (error) {
                return false;
            }
        }

        function loadShopState() {
            try {
                const unlocked = JSON.parse(localStorage.getItem("mrp_unlocked_skins") || "[]");
                if (Array.isArray(unlocked) && unlocked.length > 0) {
                    unlockedSkins = Array.from(new Set(["classic", ...unlocked]));
                }
            } catch (error) {
                unlockedSkins = ["classic"];
            }
            try {
                const unlockedPowers = JSON.parse(localStorage.getItem("mrp_unlocked_powerups") || "[]");
                if (Array.isArray(unlockedPowers) && unlockedPowers.length > 0) {
                    const migrated = unlockedPowers.map(p => {
                        if (p === "teleport_boost") return "dash_boost";
                        if (p === "points_boost") return "tracker_boost";
                        if (p === "immortal_boost") return "tracker_boost";
                        return p;
                    });
                    unlockedPowerUps = Array.from(new Set(migrated));
                }
            } catch (error) {
                unlockedPowerUps = [];
            }
            const savedSkin = localStorage.getItem("mrp_equipped_skin");
            equippedSkin = unlockedSkins.includes(savedSkin) ? savedSkin : "classic";
            if (selectedPowerUpId === "teleport_boost") selectedPowerUpId = "dash_boost";
            if (selectedPowerUpId === "points_boost") selectedPowerUpId = "tracker_boost";
            if (selectedPowerUpId === "immortal_boost") selectedPowerUpId = "tracker_boost";
            if (!unlockedPowerUps.includes(selectedPowerUpId)) {
                selectedPowerUpId = "";
            }
            if (selectedPowerUpId === "hp_boost") {
                selectedPowerUpId = "";
            }
            dashUsesRemaining = Number(localStorage.getItem("mrp_dash_charges") || 0);
            trackerUsesRemaining = Number(localStorage.getItem("mrp_tracker_charges") || 0);
            if (!hasOwnedPowerUp("dash_boost")) dashUsesRemaining = 0;
            if (!hasOwnedPowerUp("tracker_boost")) trackerUsesRemaining = 0;
            if (hasOwnedPowerUp("tracker_boost") && trackerUsesRemaining <= 0) trackerUsesRemaining = 3;
        }

        function saveShopState() {
            localStorage.setItem("mrp_unlocked_skins", JSON.stringify(unlockedSkins));
            localStorage.setItem("mrp_equipped_skin", equippedSkin);
            localStorage.setItem("mrp_unlocked_powerups", JSON.stringify(unlockedPowerUps));
            localStorage.setItem("mrp_selected_powerup", selectedPowerUpId || "");
            localStorage.setItem("mrp_dash_charges", String(dashUsesRemaining));
            localStorage.setItem("mrp_tracker_charges", String(trackerUsesRemaining));
        }
        function resetShopState() {
            unlockedSkins = ["classic"];
            equippedSkin = "classic";
            unlockedPowerUps = [];
            selectedPowerUpId = "";
            dashUsesRemaining = 0;
            trackerUsesRemaining = 0;
            saveShopState();
            renderShop();
            updateUI();
            menuStatus.textContent = "Shop reset to default.";
        }
        function resetSkinShopOnExit() {
            unlockedSkins = ["classic"];
            equippedSkin = "classic";
            saveShopState();
            saveGameState();
        }

        function renderShop() {
            skinShopPoints.textContent = points;
            powerShopPoints.textContent = points;
            skinShopList.innerHTML = "";
            powerShopList.innerHTML = "";

            skins.forEach(skin => {
                const row = document.createElement("div");
                row.className = "shop-item";
                const unlocked = unlockedSkins.includes(skin.id);
                const equipped = equippedSkin === skin.id;

                const label = document.createElement("span");
                label.textContent = `${skin.name} (${skin.cost} pts)`;
                row.appendChild(label);

                const btn = document.createElement("button");
                btn.type = "button";
                if (equipped) {
                    btn.textContent = "Equipped";
                    btn.disabled = true;
                } else if (unlocked) {
                    btn.textContent = "Equip";
                } else {
                    btn.textContent = "Buy";
                }

                btn.addEventListener("click", () => {
                    if (!unlockedSkins.includes(skin.id)) {
                        if (points < skin.cost) {
                            menuStatus.textContent = "Not enough points.";
                            return;
                        }
                        points -= skin.cost;
                        unlockedSkins.push(skin.id);
                    }
                    equippedSkin = skin.id;
                    saveShopState();
                    updateUI();
                    saveGameState();
                    renderShop();
                    menuStatus.textContent = `${skin.name} equipped.`;
                });

                row.appendChild(btn);
                skinShopList.appendChild(row);
            });

            shopPowerUps.forEach(item => {
                const row = document.createElement("div");
                row.className = "shop-item";

                const label = document.createElement("span");
                const dashText = item.id === "dash_boost" && hasOwnedPowerUp("dash_boost") ? ` [${dashUsesRemaining}/3]` : "";
                const trackerText = item.id === "tracker_boost" && hasOwnedPowerUp("tracker_boost") ? ` [${trackerUsesRemaining}/3]` : "";
                label.textContent = `${item.name}${dashText}${trackerText} (${item.cost} pts)`;
                row.appendChild(label);

                const btn = document.createElement("button");
                btn.type = "button";
                const owned = hasOwnedPowerUp(item.id);
                if (item.id === "hp_boost") {
                    btn.textContent = "Buy";
                } else if (!owned) {
                    btn.textContent = "Buy";
                } else if (selectedPowerUpId === item.id) {
                    btn.textContent = "Equipped";
                } else {
                    btn.textContent = "Equip";
                }
                btn.addEventListener("click", () => {
                    if (item.id === "hp_boost") {
                        if (!hasStartedRun || gameOver || gameWon) {
                            menuStatus.textContent = "Start or continue a run before buying +1 Heart.";
                            return;
                        }
                        if (health >= getMaxHealth()) {
                            menuStatus.textContent = "Health is already at max.";
                            return;
                        }
                        if (points < item.cost) {
                            menuStatus.textContent = "Not enough points.";
                            return;
                        }
                        points -= item.cost;
                        consumeOwnedPowerUp("hp_boost");
                        health = Math.min(getMaxHealth(), health + 1);
                        updateUI();
                        saveGameState();
                        saveShopState();
                        renderShop();
                        menuStatus.textContent = "+1 Heart added.";
                        return;
                    }

                    const hasPower = hasOwnedPowerUp(item.id);
                    if (!hasPower) {
                        if (points < item.cost) {
                            menuStatus.textContent = "Not enough points.";
                            return;
                        }
                        points -= item.cost;
                        addOwnedPowerUp(item.id);
                        if (item.id === "dash_boost") {
                            dashUsesRemaining = 3;
                        }
                        if (item.id === "tracker_boost") {
                            trackerUsesRemaining = 3;
                        }
                        selectedPowerUpId = item.id;
                        saveShopState();
                        updateUI();
                        saveGameState();
                        renderShop();
                        menuStatus.textContent = `${item.name} bought.`;
                        return;
                    }
                    if (item.id === "tracker_boost" && trackerUsesRemaining <= 0) {
                        if (points < item.cost) {
                            menuStatus.textContent = "Not enough points.";
                            return;
                        }
                        points -= item.cost;
                        trackerUsesRemaining = 3;
                        selectedPowerUpId = item.id;
                        addOwnedPowerUp(item.id);
                        saveShopState();
                        updateUI();
                        saveGameState();
                        renderShop();
                        menuStatus.textContent = `${item.name} recharged to 3 shots.`;
                        return;
                    }
                    selectedPowerUpId = item.id;
                    saveShopState();
                    updateUI();
                    saveGameState();
                    renderShop();
                    menuStatus.textContent = `${item.name} equipped. Use it in-game with E.`;
                });

                row.appendChild(btn);
                powerShopList.appendChild(row);
            });
        }

        function startNewRun() {
            currentLevel = 1;
            health = 3;
            points = 0;
            timerCounter = 0;
            runElapsedFrames = 0;
            dashUsesRemaining = hasOwnedPowerUp("dash_boost") ? (dashUsesRemaining > 0 ? dashUsesRemaining : 3) : 0;
            trackerUsesRemaining = hasOwnedPowerUp("tracker_boost") ? (trackerUsesRemaining > 0 ? trackerUsesRemaining : 3) : 0;
            shieldUsedThisRun = false;
            speedUsedThisRun = false;
            shieldCooldownFrames = 0;
            speedCooldownFrames = 0;
            jumpCooldownFrames = 0;
            gameOver = false;
            gameWon = false;
            hasStartedRun = true;
            runTerrainOrder = generateTerrainSequence(MAX_LEVELS);
            levelTheme = getTerrainForLevel(1);
            levelTemplates = {};
            buildLevel(currentLevel);
            openGameScreen();
            saveGameState();
        }

        function continueRun() {
            if (!loadSavedRun()) {
                menuStatus.textContent = "No unfinished run found.";
                continueBtn.disabled = true;
                return;
            }
            openGameScreen();
            updateUI();
        }

        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }

        document.getElementById("play-btn").addEventListener("click", startNewRun);
        document.getElementById("continue-btn").addEventListener("click", continueRun);
        shopNavBtn.addEventListener("click", openSkinShopScreen);
        if (powerNavBtn) powerNavBtn.addEventListener("click", openPowerShopScreen);
        document.getElementById("settings-nav-btn").addEventListener("click", openSettingsScreen);
        document.getElementById("timer-nav-btn").addEventListener("click", showTimeStats);
        document.getElementById("skin-shop-back-btn").addEventListener("click", () => openMainMenu("Welcome"));
        document.getElementById("power-shop-back-btn").addEventListener("click", () => openMainMenu("Welcome"));
        document.getElementById("settings-back-btn").addEventListener("click", () => openMainMenu("Welcome"));
        document.getElementById("exit-btn").addEventListener("click", () => {
            resetSkinShopOnExit();
            window.close();
            menuStatus.textContent = "If this tab did not close, close it manually.";
        });

        menuBtn.addEventListener("click", e => {
            e.stopPropagation();
            toggleGameQuickMenu();
        });
        gameMenuPanel.addEventListener("click", e => e.stopPropagation());
        gameMenuNewBtn.addEventListener("click", () => {
            closeGameQuickMenu();
            startNewRun();
        });
        gameMenuContinueBtn.addEventListener("click", () => {
            closeGameQuickMenu();
            continueRun();
        });
        gameMenuPowerBtn.addEventListener("click", () => {
            closeGameQuickMenu();
            openPowerShopScreen();
        });
        gameMenuTimeBtn.addEventListener("click", () => {
            closeGameQuickMenu();
            showTimeStats();
        });
        gameMenuBackBtn.addEventListener("click", () => {
            closeGameQuickMenu();
            openMainMenu("Welcome");
        });
        victoryBackBtn.addEventListener("click", () => openMainMenu("Welcome"));
        document.addEventListener("click", () => closeGameQuickMenu());
        powerBtn.addEventListener("click", useSelectedPowerUpInGame);

        window.addEventListener("keydown", e => {
            keys[e.code] = true;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
                e.preventDefault();
            }
            if (["ArrowUp", "KeyW", "Space"].includes(e.code)) {
                jumpQueued = true;
            }
            if (e.code === "KeyM" && !screens.game.classList.contains("hidden")) {
                openMainMenu("Welcome");
            }
            if (e.code === "KeyR" && hasStartedRun) {
                startNewRun();
            }
            if (e.code === "KeyE") {
                useSelectedPowerUpInGame();
            }
        });

        window.addEventListener("keyup", e => {
            keys[e.code] = false;
            if (["ArrowUp", "KeyW", "Space"].includes(e.code)) {
                jumpQueued = false;
            }
        });

        window.addEventListener("beforeunload", saveGameState);

        loadShopState();
        updateUI();
        openMainMenu("Welcome");
        gameLoop();
    
