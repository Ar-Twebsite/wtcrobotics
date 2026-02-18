/* WTC ROBOTICS - PERFECTED WITH EXACT DIALOGUE */

const CONFIG = {
    DEBUG_MODE: true,
    LANGUAGE: 'it-IT',
    VOICE_RATE: 0.85,
    VOICE_PITCH: 1.0,
    FBX_MODEL_PATH: 'Waving.fbx', // Base model
    ANIM_PATHS: {
        talking: 'Talking.fbx',
        nodding: 'Thoughtful Head Nod.fbx'
    },
    ANIMATION_FADE: 0.8 // Slower fade for smoothness
};

const MOCK = {
    // Mock Data for "Generic Business Club"
    clubName: "Business Club",
    teams: [
        'Juventus', 'Inter', 'Milan', 'Napoli', 'Roma', 'Lazio', 'Fiorentina', 'Atalanta',
        'Torino', 'Bologna', 'Udinese', 'Monza', 'Genoa', 'Lecce', 'Verona', 'Cagliari',
        'Empoli', 'Salernitana', 'Frosinone', 'Sassuolo'
    ],
    companies: [
        { name: 'TechCorp Italia', contact: 'Marco Rossi', keywords: ['informatica', 'software', 'tech', 'it', 'sviluppo', 'web', 'app', 'digitale'] },
        { name: 'InnovaSolutions', contact: 'Laura Bianchi', keywords: ['consulenza', 'management', 'business', 'strategia', 'startup', 'innovazione'] },
        { name: 'DigitalBridge', contact: 'Giuseppe Verde', keywords: ['marketing', 'social', 'adv', 'pubblicità', 'comunicazione', 'brand', 'media'] },
        { name: 'CloudServe SRL', contact: 'Anna Neri', keywords: ['cloud', 'server', 'hosting', 'network', 'reti', 'sicurezza', 'cyber'] },
        { name: 'EcoBuild', contact: 'Roberto Gialli', keywords: ['edilizia', 'costruzioni', 'architettura', 'design', 'immobiliare', 'real estate'] },
        { name: 'FinanceNow', contact: 'Sofia Blu', keywords: ['finanza', 'banche', 'investimenti', 'crypto', 'soldi', 'economia', 'assicurazione'] },
        { name: 'LegalPoint', contact: 'Avv. Ferrari', keywords: ['legale', 'avvocato', 'diritto', 'leggi', 'normative', 'compliance'] },
        { name: 'HealthCare Plus', contact: 'Dott. Romano', keywords: ['salute', 'medicina', 'sanità', 'benessere', 'pharma', 'biotech'] },
        { name: 'AutoMotive Group', contact: 'Ing. Conti', keywords: ['auto', 'motori', 'meccanica', 'trasporti', 'logistica', 'veicoli'] },
        { name: 'Food & Wine Co', contact: 'Chef Esposito', keywords: ['cibo', 'ristorazione', 'vino', 'food', 'beverage', 'agrifood'] }
    ],
    menu: ['Lasagna alla bolognese', 'Filetto al pepe verde', 'Verdure grigliate', 'Tiramisù artigianale', 'Insalata di mare', 'Risotto ai funghi porcini'],
    romaStats: [
        "La Roma ha una media di 2.3 gol a partita in casa quest'anno. L'Olimpico è una vera fortezza!",
        "Sapevi che la Roma è imbattuta nelle ultime 5 partite casalinghe? La Curva Sud sta facendo la differenza.",
        "Oggi allo stadio ci sono oltre 62.000 spettatori. È il terzo sold-out consecutivo!",
        "Paulo Dybala ha segnato in 3 delle ultime 4 partite contro questo avversario. Occhi puntati su di lui stasera.",
        "La difesa della Roma ha concesso solo 2 gol nelle ultime 4 gare interne. Un muro!",
        "Storicamente, la Roma ha vinto il 70% degli scontri diretti giocati in casa contro questa squadra."
    ],
    genericStats: [
        "Il calcio è lo sport più seguito in Italia con oltre 32 milioni di appassionati, praticamente la metà della popolazione!",
        "La Serie A è trasmessa in oltre 200 paesi nel mondo, raggiungendo un'audience globale di milioni di persone.",
        "Il settore calcio in Italia genera un indotto di oltre 4 miliardi di euro l'anno, un vero motore economico.",
        "Sapevi che l'Olimpico è stato inaugurato nel 1953? Ha visto Olimpiadi, Mondiali ed Europei.",
        "Il business hospitality negli stadi è cresciuto del 40% negli ultimi 5 anni. È il posto giusto per fare affari!"
    ]
};

class WTCApp {
    constructor() {
        this.state = 'INIT';
        this.micEnabled = false;
        this.isSpeaking = false;

        this.el = {
            loadingScreen: document.getElementById('loadingScreen'),
            loadingProgress: document.getElementById('loadingProgress'),
            loadingStatus: document.getElementById('loadingStatus'),
            micPermissionScreen: document.getElementById('micPermissionScreen'),
            btnMicAllow: document.getElementById('btnMicAllow'),
            btnMicDeny: document.getElementById('btnMicDeny'),
            dialogText: document.getElementById('dialogText'),
            userResponse: document.getElementById('userResponse'),
            responseText: document.getElementById('responseText'),
            statusText: document.querySelector('.status-text'),
            statusDot: document.querySelector('.status-dot'),
            debugState: document.getElementById('debugState'),
            debugMic: document.getElementById('debugMic'),
            debugAnim: document.getElementById('debugAnim'),
            canvas: document.getElementById('canvas-container')
        };

        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.robot = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.anims = {};
        this.currentAnim = null;

        this.init();
    }

    async init() {
        console.log('=== WTC ROBOTICS INIT ===');
        try {
            await this.setup3D();
            this.progress(40, '3D Ready');

            await this.loadRobot();
            this.progress(80, 'Robot Loaded');

            this.setupEvents();
            this.progress(100, 'Complete!');

            await this.wait(500);
            this.el.loadingScreen.classList.add('hidden');
            await this.wait(300);
            this.showMicPermission();

        } catch (err) {
            console.error('INIT ERROR:', err);
            this.progress(0, 'Error: ' + err.message);
        }
    }

    wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    progress(pct, msg) {
        this.el.loadingProgress.style.width = `${pct}%`;
        this.el.loadingStatus.textContent = msg;
        console.log(`[${pct}%] ${msg}`);
    }

    showMicPermission() {
        console.log('>>> SHOWING MIC PERMISSION');
        this.el.micPermissionScreen.classList.add('show');
        // Ensure permission screen is clear
        this.el.micPermissionScreen.querySelector('.mic-title').innerHTML = "Abilita Microfono<br><span style='font-size: 16px; font-weight: normal; opacity: 0.8'>(Lupo ti ascolterà!)</span>";

        this.el.btnMicAllow.onclick = async () => {
            console.log('>>> USER: Allow microphone');

            // 1. IMMEDIATE AUDIO UNLOCK (Crucial for iOS/Android)
            // Play a silent utterance to unlock the TTS engine
            const silent = new SpeechSynthesisUtterance("");
            this.synthesis.speak(silent);

            // 2. REQUEST MIC PERMISSION
            try {
                // We must await this, but we've already triggered the TTS unlock above
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
                console.log('>>> MIC PERMISSION GRANTED');
            } catch (err) {
                console.error('>>> MIC PERMISSION DENIED:', err);
                alert("Impossibile accedere al microfono. Controlla le impostazioni del browser.");
                return;
            }

            // 3. FAST TRANSITION (No artificial delays)
            this.el.micPermissionScreen.classList.remove('show');

            // 4. INIT SPEECH RECOGNITION
            await this.initSpeech();

            // 5. WARMUP RECOGNITION (Critical for iOS)
            // Trigger recognition permission immediately while in user gesture
            if (this.recognition) {
                try {
                    console.log('>>> WARMING UP SPEECH REC...');
                    this.recognition.start();
                    // Stop it shortly after to clear the "recording" state but keep permission
                    setTimeout(() => {
                        try { this.recognition.stop(); } catch (e) { }
                    }, 500);
                } catch (e) {
                    console.warn('>>> Warmup warning:', e);
                }
            }

            this.micEnabled = true;

            // 6. START IMMEDIATELY
            this.start();
        };

        this.el.btnMicDeny.onclick = () => {
            console.log('>>> USER: Deny microphone');
            window.location.href = './index.html';
        };
    }

    async initSpeech() {
        console.log('>>> INIT SPEECH RECOGNITION');
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SR();
            this.recognition.lang = CONFIG.LANGUAGE;
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (e) => {
                const text = e.results[0][0].transcript.toLowerCase();
                console.log(`>>> USER SAID: "${text}"`);
                this.showUserText(text);
                this.process(text);
            };

            this.recognition.onerror = (e) => {
                console.error('>>> SPEECH ERROR:', e.error);
                if (e.error === 'no-speech') {
                    console.log('>>> No speech, retrying...');
                    setTimeout(() => this.autoListen(), 1000);
                }
            };

            this.recognition.onend = () => {
                console.log('>>> RECOGNITION ENDED');
                this.stopListen();
            };

            console.log('>>> Speech recognition ready');
        }
    }

    async setup3D() {
        console.log('>>> SETUP 3D SCENE');
        this.scene = new THREE.Scene();

        // Responsive camera based on screen size
        const isMobile = window.innerWidth < 768;
        const cameraDistance = isMobile ? 2.0 : 1.8;
        const cameraHeight = isMobile ? 0.6 : 0.7;

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, cameraHeight, cameraDistance);
        this.camera.lookAt(0, 0.4, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // Fix highlight clipping (Critique #1)
        this.renderer.toneMappingExposure = 1.0; // Adjust exposure (Critique #1)
        this.el.canvas.appendChild(this.renderer.domElement);

        // EXPERT LIGHTING SETUP (Critique #4, #5, #6)

        // 1. Hemisphere (Ambience) - darker to allow contrast
        const hemisphere = new THREE.HemisphereLight(0xffffff, 0x444444, 0.81);
        this.scene.add(hemisphere);

        // 2. Key Light (Main) - 45° offset (Critique #4), Soft Area-like
        const key = new THREE.DirectionalLight(0xFAFAF9, 0.01);
        key.position.set(2, 3, 2); // 45 degrees
        key.castShadow = true;
        key.shadow.mapSize.width = 2048;
        key.shadow.mapSize.height = 2048;
        key.shadow.bias = -0.00005; // Fix shadow acne (Critique #9)
        key.shadow.radius = 4; // Soft edge
        this.scene.add(key);

        // 3. Fill Light - Opposite Key, soft & cool (Critique #5)
        const fill = new THREE.DirectionalLight(0xcceeff, 0.01);
        fill.position.set(-2, 1, 2);
        this.scene.add(fill);

        // 4. Rim Light - Strong Backlight for separation (Critique #6)
        const rim = new THREE.DirectionalLight(0xffffff, 0.01);
        rim.position.set(0, 3, -4);
        this.scene.add(rim);

        // Soft Floor Shadow
        const ground = new THREE.Mesh(
            new THREE.CircleGeometry(6, 64),
            new THREE.ShadowMaterial({ opacity: 0.3 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        this.animate();
        window.addEventListener('resize', () => this.resize());
        console.log('>>> 3D scene ready');
    }

    async loadRobot() {
        console.log('>>> LOADING ROBOT ASSETS');
        const loader = new THREE.FBXLoader();

        // Helper to load FBX
        const loadFBX = (path) => new Promise(resolve => loader.load(path, resolve,
            (p) => this.progress(p.loaded / p.total * 100, `Loading ${path}...`),
            (e) => { console.error(e); resolve(null); }
        ));

        // 1. Load Base Mesh (Waving)
        const baseFbx = await loadFBX(CONFIG.FBX_MODEL_PATH);
        if (!baseFbx) return;

        // 2. Load Animations
        const talkFbx = await loadFBX(CONFIG.ANIM_PATHS.talking);
        const nodFbx = await loadFBX(CONFIG.ANIM_PATHS.nodding);

        // Setup Main Mesh
        this.robot = baseFbx;

        // Scale - Reduced by another 25% from 0.15/0.18 -> approx 0.11/0.135
        const vh = window.innerHeight;
        const isMobile = window.innerWidth < 768;
        const targetHeight = isMobile ? vh * 0.11 : vh * 0.13;

        const box = new THREE.Box3().setFromObject(baseFbx);
        const fbxHeight = box.max.y - box.min.y;
        const scale = targetHeight / fbxHeight / 100; // Adjust for unit scale

        baseFbx.scale.setScalar(scale);

        // Materials - Fix "Chrome" -> Matte White Plastic
        baseFbx.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(mat => {
                        // EXPERT MATERIAL CALIBRATION (Critique #3, #8)

                        // 1. Fix Albedo brightness (Critique #8) - Avoid pure white 0xffffff
                        if (mat.color.getHex() === 0xffffff) {
                            mat.color.setHex(0xdddddd); // Light grey max
                        }

                        // 2. Increase Roughness (Critique #3) - Avoid chrome look
                        mat.roughness = 1; // High roughness for plastic/matte
                        mat.metalness = 0.05; // Low metalness

                        // 3. Occlusion/Detail
                        mat.aoMapIntensity = 1.5; // Fake some AO if map exists

                        // 4. No Emission (Critique #1)
                        mat.emissive = new THREE.Color(0x000000);
                    });
                }
            }
        });

        this.scene.add(baseFbx);
        this.mixer = new THREE.AnimationMixer(baseFbx);

        // 3. Extract and Add Animations
        // Wave (from base)
        if (baseFbx.animations[0]) {
            this.anims['wave'] = this.mixer.clipAction(baseFbx.animations[0]);
            this.anims['greeting'] = this.anims['wave'];
        }

        // Talk
        if (talkFbx && talkFbx.animations[0]) {
            // Retargeting happens automatically if bone names match (usually true for Mixamo)
            this.anims['talk'] = this.mixer.clipAction(talkFbx.animations[0]);
        }

        // Nod (Listen/Idle)
        if (nodFbx && nodFbx.animations[0]) {
            this.anims['idle'] = this.mixer.clipAction(nodFbx.animations[0]);
            this.anims['listen'] = this.anims['idle'];
        }

        console.log('>>> Animations loaded:', Object.keys(this.anims));
        this.playAnim('idle', true);
    }

    createPlaceholder() {
        const group = new THREE.Group();
        const vh = window.innerHeight;
        const targetHeight = vh * 0.15;
        const scale = targetHeight / 200;

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.7, 0.3),
            new THREE.MeshStandardMaterial({
                color: 0xff6600,
                metalness: 0.7,
                emissive: 0xff6600,
                emissiveIntensity: 0.3
            })
        );
        body.position.y = 0.7 * scale;
        body.scale.setScalar(scale);
        body.castShadow = true;
        group.add(body);

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5 })
        );
        head.position.y = 1.2 * scale;
        head.scale.setScalar(scale);
        head.castShadow = true;
        group.add(head);

        this.robot = group;
        this.scene.add(group);
        console.log('>>> Placeholder created with scale:', scale);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);

        // NO ROTATION - robot stays still

        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            // Adjust camera position - MOVE BACK FURTHER on Desktop
            const isMobile = window.innerWidth < 768;

            // Desktop: Increased distance to 4.5 to make it really small/companion-like
            const cameraDistance = isMobile ? 3.5 : 4.5;
            const cameraHeight = isMobile ? 1.0 : 0.8;

            this.camera.position.set(0, cameraHeight, cameraDistance);
            this.camera.lookAt(0, 0.4, 0);

            // Re-update scale if robot exists
            if (this.robot) {
                const vh = window.innerHeight;
                const targetHeight = isMobile ? vh * 0.11 : vh * 0.13;
                // Simplified re-scale logic would be here if needed
            }
        }
    }

    playAnim(name, loop = false) {
        this.el.debugAnim.textContent = name;

        if (this.currentAnim) {
            this.currentAnim.fadeOut(CONFIG.ANIMATION_FADE);
        }

        const action = this.anims[name] || this.anims['idle'] || this.anims['anim_0'];
        if (action) {
            action.reset();
            action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.fadeIn(CONFIG.ANIMATION_FADE);
            action.play();
            this.currentAnim = action;
        }
    }

    setupEvents() {
        // No button events needed - all voice-based
        console.log('>>> No buttons to setup - voice only');
    }

    setState(s) {
        this.state = s;
        // No debug text
    }

    start() {
        console.log('=== STARTING EXPERIENCE ===');
        this.status('Pronto', false);
        this.playAnim('greeting', false);
        setTimeout(() => this.greeting(), 1000);
    }

    // === CONVERSATION PHASES - EXACT DIALOGUE ===

    // === CONVERSATION PHASES - NEW LOGIC ===

    greeting() {
        console.log('>>> PHASE 1: GREETING');
        this.setState('GREETING');
        this.playAnim('wave', false); // TRIGGER WAVE
        this.say(`Ciao, io sono Lupo! Benvenuto al ${MOCK.clubName}. Sei qui per lavoro, sport o per il buffet? ha ha ha.`, () => {
            console.log('>>> Waiting for choice...');
            this.setState('WAITING_CHOICE');
            this.autoListen();
        });
    }

    process(input) {
        input = input.toLowerCase().trim();
        console.log(`>>> PROCESS: "${input}" in ${this.state}`);

        // RESET TIMER on valid input
        if (this.noResponseTimer) {
            clearTimeout(this.noResponseTimer);
            this.noResponseTimer = null;
        }

        if (this.state === 'WAITING_CHOICE') {
            if (input.includes('lavoro') || input.includes('work') || input.includes('business') || input.includes('azienda')) {
                this.work();
            } else if (input.includes('sport') || input.includes('calcio') || input.includes('partita') || input.includes('squadra')) {
                this.sport();
            } else if (input.includes('buffet') || input.includes('mangiare') || input.includes('fame') || input.includes('cibo')) {
                this.buffet();
            } else if (input.includes('tutto') || input.includes('tutti')) {
                this.all();
            } else if (input.includes('chi sei') || input.includes('come ti chiami')) {
                this.who();
            } else if (input.includes('carino') || input.includes('bello') || input.includes('simpatico')) {
                this.compliment();
            } else if (input.includes('non') && (input.includes('calcio') || input.includes('piace'))) {
                this.disinterest();
            } else {
                this.defaultResponse();
            }
        }
        else if (this.state === 'WAITING_PROFESSION') {
            this.handleProfession(input);
        }
        else if (this.state === 'WAITING_TEAM') {
            this.handleTeam(input);
        }
    }

    // --- 1. NO RESPONSE ---
    handleNoResponse() {
        console.log('>>> NO RESPONSE DETECTED (Fallback)');
        this.stopListen();

        let fallbackText = "";

        // Context-aware fallback
        switch (this.state) {
            case 'WAITING_CHOICE':
                // "Non dice nulla -> Statistica generata con AI + commento sulla partita"
                const stat = this.getStat(true);
                fallbackText = `${stat} Sembra che oggi ci sia timidezza nell'aria! Comunque, se ti va di parlare io sono qui. Scrivi pure se preferisci o riprova a parlarmi.`;
                break;
            case 'WAITING_PROFESSION':
                // Fallback for Work
                fallbackText = "Vabbè, non devi dirmelo per forza... Comunque, sai che se scarichi l'app del Business Club puoi contattare direttamente altre aziende?";
                break;
            case 'WAITING_TEAM':
                // Fallback for Sport
                fallbackText = "Capisco, magari sei neutrale! Comunque sai che l'atmosfera qui è sempre unica.";
                break;
            default:
                fallbackText = "Non ho sentito bene, ma non importa. Goditi l'evento!";
                break;
        }

        this.say(fallbackText, () => {
            // Return to 'neutral' state or restart? 
            // Best to just wait for user to re-engage or loop back to main menu
            this.status('Pronto', false);
            // Optionally auto-listen again? No, might loop. Just wait.
            if (this.state === 'WAITING_PROFESSION') {
                // Close the work loop
                setTimeout(() => this.workClose(), 100);
            } else {
                this.restartLoop();
            }
        });
    }

    restartLoop() {
        console.log('>>> RESTARTING LOOP...');
        // Wait a bit then go back to waiting choice (or even greeting if needed, but choice is better)
        setTimeout(() => {
            this.el.dialogText.textContent = "Dimmi pure se ti serve altro!";
            this.setState('WAITING_CHOICE');
            this.autoListen();
        }, 2000);
    }

    // --- 2. WORK ---
    work() {
        console.log('>>> PHASE 2: WORK');
        this.setState('WORK');
        this.say("Fai bene, ci sono più di 350 aziende quindi semplicemente stando qui puoi far evolvere la tua azienda grazie a partnership strategiche. Di cosa ti occupi?", () => {
            this.setState('WAITING_PROFESSION');
            this.autoListen();
        });
    }

    handleProfession(input) {
        console.log('>>> Handling profession:', input);

        if ((input.includes('non') && (input.includes('dire') || input.includes('dico'))) || input === '') {
            // "Preferisco non dirlo" / Silence (handled by separate timer usually, but if they say it)
            this.say("Vabbè, non devi dirmelo per forza...", () => this.workClose());
        } else {
            // Match logic
            const comp = this.matchCompany(input);
            const msg = `Da quello che mi hai detto, secondo me potresti provare a sentire ${comp.contact} del database BUSINESS CLUB.`;
            this.say(msg, () => this.workClose());
        }
    }

    workClose() {
        console.log('>>> Work closing');
        this.workAppPitch();
    }

    workAppPitch() {
        this.say(`Sai che se scarichi l'app del ${MOCK.clubName} puoi contattare direttamente altre aziende come la tua in pochissimo tempo? Puoi installarla sia su iPhone che su ogni altro telefono. Scaricala subito!`, () => {
            this.say("Se hai bisogno di qualcosa o hai qualche curiosità, dimmi pure!", () => {
                this.restartLoop();
            });
        });
    }

    matchCompany(input) {
        for (const c of MOCK.companies) {
            if (c.keywords.some(k => input.includes(k))) return c;
        }
        return MOCK.companies[Math.floor(Math.random() * MOCK.companies.length)];
    }

    // --- 3. SPORT ---
    sport() {
        console.log('>>> PHASE 3: SPORT');
        this.setState('SPORT');
        this.say("CHE SQUADRA TIFI?", () => {
            this.setState('WAITING_TEAM');
            this.autoListen();
        });
    }

    handleTeam(input) {
        console.log('>>> Handling team:', input);

        if (input.includes('non') && (input.includes('piace') || input.includes('tifo') || input.includes('calcio'))) {
            // Hate football
            this.disinterest();
        } else {
            // Check for ANY Serie A team
            const foundTeam = MOCK.teams.find(t => input.toLowerCase().includes(t.toLowerCase()));

            if (foundTeam) {
                this.say(`Ah, ${foundTeam}! Grande squadra. Quest'anno il campionato è davvero imprevedibile.`, () => {
                    this.sportClose();
                });
            } else if (input.includes('roma')) {
                // Explicit Roma check just in case
                const stat = this.getStat(false);
                this.say(`Forza Roma sempre! ${stat}`, () => {
                    this.sportClose();
                });
            } else {
                // Genuine neutral or unknown
                const stat = this.getStat(true);
                this.say(`Il calcio è sempre emozionante. ${stat}`, () => {
                    this.sportClose();
                });
            }
        }
    }

    sportClose() {
        console.log('>>> Sport closing');
        this.say("Calcio a parte, se hai bisogno di qualcosa o hai qualche curiosità, dimmi pure!", () => {
            this.restartLoop();
        });
    }

    disinterest() {
        console.log('>>> DISINTEREST');
        this.say("Capisco, non a tutti piace. Sicuramente sarai qui per lavoro o per fare compagnia a un tuo collega.", () => {
            const stat = MOCK.genericStats[Math.floor(Math.random() * MOCK.genericStats.length)];
            this.say(stat);
        });
    }

    // --- 4. BUFFET ---
    buffet() {
        console.log('>>> PHASE 4: BUFFET');
        this.setState('BUFFET');
        const menu = MOCK.menu.join(', ');
        this.say("Eh ti capisco! Purtroppo non posso assaggiare il menù di oggi ma sono sicuro sia tutto buonissimo!", () => {
            this.say(`Oggi puoi mangiare: ${menu}.`, () => {
                this.say("Del resto, a stomaco pieno è più facile lavorare e ti godi di più la partita.", () => {
                    this.restartLoop();
                });
            });
        });
    }

    // --- 5. TUTTO ---
    all() {
        console.log('>>> PHASE 5: ALL');
        this.say("Quando ci si trova bene in un posto è sempre per più di un motivo!", () => {
            this.restartLoop();
        });
    }

    // --- IDENTITY ---
    who() {
        console.log('>>> PHASE: WHO');
        this.say(`Sono Lupo! Il robot di WTC Robotics per il ${MOCK.clubName}! Praticamente sono qui per rispondere a ogni tua domanda e far in modo che il tuo soggiorno oggi sia indimenticabile!`, () => {
            this.restartLoop();
        });
    }

    // --- COMPLIMENT ---
    compliment() {
        console.log('>>> PHASE: COMPLIMENT');
        this.playAnim('wave', false);
        this.say("Lo so!", () => {
            this.restartLoop();
        });
    }

    defaultResponse() {
        console.log('>>> Default response');
        // If we don't understand, maybe just give a stat or ask again? 
        // Prompt says: "Non dice nulla -> Statistica". 
        // If they say something unintelligible, maybe treat as "Non dice nulla" or specific fallback?
        // Let's ask clarification.
        this.say("Non ho capito bene. Lavoro, sport o buffet?", () => {
            this.autoListen();
        });
    }

    getStat(isRoma) {
        const stats = isRoma ? MOCK.romaStats : MOCK.genericStats;
        return stats[Math.floor(Math.random() * stats.length)];
    }

    // === SPEECH & AUDIO ===

    say(text, onEnd = null) {
        console.log(`>>> LUPO: "${text}"`);
        this.isSpeaking = true;
        this.setState('SPEAKING');
        this.el.dialogText.textContent = text;
        this.playAnim('talk', true);
        this.status('Parlando...', true);

        this.synthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = CONFIG.LANGUAGE;
        u.rate = 0.9; // Slightly slower for clarity
        u.pitch = 1.0; // Normal pitch

        u.onend = () => {
            console.log('>>> Speech done');
            this.isSpeaking = false;
            this.playAnim('idle', true); // Revert to idle (Nodding/Breathing)
            this.status('Pronto', false);
            if (onEnd) {
                console.log('>>> Callback...');
                onEnd();
            }
        };

        u.onerror = (e) => {
            console.error('>>> TTS ERROR:', e);
            this.isSpeaking = false;
            if (onEnd) onEnd();
        };

        this.synthesis.speak(u);
    }

    autoListen() {
        if (this.micEnabled) {
            setTimeout(() => this.startListen(), 500);
        }
    }

    startListen() {
        if (!this.recognition) return;

        console.log('>>> LISTENING');
        this.playAnim('listen', true); // Use 'listen' (mapped to Nod or Idle)
        this.status('ASCOLTO... PARLA ORA!', true); // Visual Cue
        // this.el.debugMic.textContent = 'Listening'; // REMOVED

        try {
            this.recognition.start();

            // Start No Response Timer (e.g. 6 seconds)
            this.startNoResponseTimer();

        } catch (err) {
            console.error('>>> Listen error:', err);
            // Fallback immediately if start fails
            setTimeout(() => this.handleNoResponse(), 2000);
        }
    }

    stopListen() {
        console.log('>>> STOP LISTEN');
        if (this.recognition) {
            try { this.recognition.stop(); } catch (e) { }
        }
        if (this.noResponseTimer) {
            clearTimeout(this.noResponseTimer);
            this.noResponseTimer = null;
        }
        this.playAnim('idle', true);
        this.status('Pronto', false);
        // this.el.debugMic.textContent = 'Stopped'; // REMOVED
    }

    startNoResponseTimer() {
        if (this.noResponseTimer) clearTimeout(this.noResponseTimer);
        this.noResponseTimer = setTimeout(() => {
            console.log('>>> TIMER EXPIRED - NO RESPONSE');
            this.handleNoResponse();
        }, 8000); // 8 seconds generous timeout to avoid cutting off
    }

    showUserText(text) {
        this.el.responseText.textContent = text;
        this.el.userResponse.classList.add('show');
        setTimeout(() => {
            this.el.userResponse.classList.remove('show');
        }, 3000);
    }

    status(text, active) {
        this.el.statusText.textContent = text;
        if (active) this.el.statusDot.classList.add('glow');
        else this.el.statusDot.classList.remove('glow');
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM LOADED ===');
    app = new WTCApp();
});
window.WTCApp = app;