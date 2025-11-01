// Si es la primera vez que usas la consola de DevTools, habilita el pegado de código mediante "allow pasting" en la consola.
// Este script es para (NET - SIEM / NET Defender Sim) que corre en el puerto 4040
// github.com/0xSohaib

class DefenderGod {
    constructor() {
        this.isRunning = false;
        this.concurrentEvents = 5; 
        this.eventTypeMapping = {
            'muchas_peticiones': 'Muchas peticiones al servidor',
            'intento_ssh': 'Intento de acceso SSH',
            'escaneo_nmap': 'Escaneo Nmap',
            'fuerza_bruta_ssh': 'Hydra en SSH',
            'http': 'Petición HTTP',
            'correo_spam': 'SPAM',
            'correo_legitimo': 'Email',
            'ftp_login': 'Inicio de sesión FTP',
            'fuerza_bruta_ftp': 'Fuerza bruta FTP',
            'escaneo_nessus': 'Escaneo Nessus',
            'intento_sqli': 'Intento de SQLi',
            'fuerza_bruta_rdp': 'Fuerza bruta RDP',
            'amplificacion_dns': 'Amplificación DNS',
            'barrido_icmp': 'Barrido ICMP',
            'acceso_credenciales': 'Acceso a credenciales',
            'acceso_root': 'Intento de root',
            'ejecucion_procesos': 'Ejecución de procesos elevados'
        };
        this.alwaysMaliciousTypes = [
            'muchas_peticiones', 'fuerza_bruta_ssh', 'correo_spam',
            'fuerza_bruta_ftp', 'intento_sqli', 'fuerza_bruta_rdp', 'amplificacion_dns'
        ];
        
        this.createControlPanel();
    }

    createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #2d2d2d;
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            max-width: 400px;
        `;
        
        panel.innerHTML = `
            <h4 style="margin-top: 0; color: #ccc;">🚀 DefenderGod Turbo by <a href="https://github.com/0xSohaib" style="color: #ccc";>0xSohaib</a></h4>
            
            <div style="margin-bottom: 10px; font-size: 12px; color: #ccc;">
                <strong>Turbo Mode. Cómo usar?</strong><br>
                • Primero click en despegar<br>
                • Después del primer evento resuelto, haz clic varias veces en spawn rápido. (con 5 clicks mas que suficiente).<br>
                • Disfruta.<br>
            </div>
            
            <button onclick="netDefenderExact.startTurboPlay()" style="width: 100%; padding: 10px; margin: 5px 0; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">
                🚀 1- Despega madafaka
            </button>

            <button onclick="netDefenderExact.rapidSpawn()" style="width: 100%; padding: 8px; margin: 5px 0; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                ⚡ 2- Spawn Rápido (x5)
            </button>

            <button onclick="netDefenderExact.stopAutoPlay()" style="width: 100%; padding: 10px; margin: 5px 0; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                ⏹️ Parar Turbo
            </button>
                        
            <div id="exactStatus" style="margin-top: 10px; font-size: 12px; color: #0f0;">
                Turbo listo para destruir!
            </div>
            
            <div id="exactStats" style="margin-top: 5px; font-size: 11px; color: #ccc;">
                Score: 0 | Disp: 100% | Carga: 5% | Rep: 100%
            </div>
            
            <button onclick="this.parentElement.remove()" style="width: 100%; padding: 8px; margin: 5px 0; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                ❌ Cerrar panel
            </button>
        `;
        
        document.body.appendChild(panel);
    }

    showCustomFlagModal(realFlag) {
        
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1a1a1a;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            border: 3px solid #0f0;
            box-shadow: 0 0 30px rgba(40, 255, 33, 0.5);
        `;

        modalContent.innerHTML = `
            <h2 style="color: #ccc; margin-top: 0;">YEAAAAAAAH!</h2>
    
                <img src="https://c.tenor.com/cVupG1LYfuUAAAAd/tenor.gif" width="80%">

            <div style="background: #2d2d2d; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h3 style="color: #28a745; margin: 0 0 10px 0;">🎯 FLAG OBTENIDA</h3>
                <p style="color: white; font-family: monospace; font-size: 18px; background: #000; padding: 10px; border-radius: 5px; margin: 0;">
                    ${realFlag}
                </p>
            </div>
            <p style="color: #ccc; margin: 15px 0;">
                I was made for loving you, baby. You were made for loving me.
            </p>
            <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" 
                    style="background: #dc3545; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                Cerrar
            </button>
            <div style="margin-top: 15px; font-size: 12px; color: #666;">
                by <a href="https://github.com/0xSohaib" style="color: #666;">0xSohaib</a>
            </div>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }

    updateStatus(message) {
        const statusEl = document.getElementById('exactStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }
        console.log(`🚀 ${message}`);
    }

    updateStats() {
        const statsEl = document.getElementById('exactStats');
        if (!statsEl) return;

        const score = document.getElementById('score')?.textContent || '0';
        const availability = document.getElementById('barAvailability')?.textContent || '100%';
        const load = document.getElementById('barLoad')?.textContent || '5%';
        const reputation = document.getElementById('barReputation')?.textContent || '100%';
        
        statsEl.textContent = `Score: ${score} | Disp: ${availability} | Carga: ${load} | Rep: ${reputation}`;
    }

    startTurboPlay() {
        if (this.isRunning) {
            this.updateStatus("⚠️ Ya estoy en turbo!");
            return;
        }

        this.isRunning = true;
        this.updateStatus("🎯 TURBO ACTIVADO - Destruyendo eventos");
        
        
        this.spawnInterval = setInterval(() => {
            this.manualSpawn();
        }, 2000);

        
        this.processInterval = setInterval(() => {
            this.processAllEventsTurbo();
            this.updateStats();
            this.checkVictory();
        }, 300);

        this.updateStatus("⚡ Procesando eventos a velocidad turbo");
    }

    stopAutoPlay() {
        this.isRunning = false;
        if (this.spawnInterval) clearInterval(this.spawnInterval);
        if (this.processInterval) clearInterval(this.processInterval);
        this.updateStatus("⏹️ Turbo parado");
    }

    rapidSpawn() {
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.manualSpawn();
            }, i * 200); 
        }
        this.updateStatus("⚡ Spawneados 5 eventos rápidos");
    }

    manualSpawn() {
        const spawnButton = document.getElementById('spawn');
        if (spawnButton && this.isRunning) {
            spawnButton.click();
        }
    }

    processAllEventsTurbo() {
        const eventsContainer = document.getElementById('events');
        if (!eventsContainer) return;

        const eventCards = eventsContainer.querySelectorAll('.list-group-item');
        
        if (eventCards.length === 0) {
            return;
        }

        
        eventCards.forEach((eventCard, index) => {
            
            this.processEventCardTurbo(eventCard);
        });

        if (eventCards.length > 0) {
            this.updateStatus(`⚡ Procesando ${eventCards.length} eventos simultáneos`);
        }
    }

    processEventCardTurbo(eventCard) {
        try {
            
            const ipElement = eventCard.querySelector('strong');
            const typeElement = eventCard.querySelector('.text-muted');
            const sourceIpElement = eventCard.querySelector('code');
            
            if (!ipElement || !typeElement || !sourceIpElement) return;

            const sourceIp = ipElement.textContent.trim();
            const eventLabel = typeElement.textContent.trim();
            const exactSourceIp = sourceIpElement.textContent.trim();

            
            const eventType = this.getEventTypeFromLabel(eventLabel);
            const network = this.getNetworkFromIP(exactSourceIp);
            const action = this.makeExactDecision(eventType, exactSourceIp, network);
            
            
            const actionButton = eventCard.querySelector(`button.btn-${this.getButtonColor(action)}`);
            if (actionButton && !actionButton.disabled) {
                
                actionButton.click();
            }

        } catch (error) {
            
        }
    }

    getEventTypeFromLabel(label) {
        
        for (const [type, typeLabel] of Object.entries(this.eventTypeMapping)) {
            if (typeLabel === label) return type;
        }
        return 'unknown';
    }

    getNetworkFromIP(ip) {
        const [firstOctet, secondOctet] = ip.split('.').map(Number);
        
        if (firstOctet === 100 && secondOctet >= 64 && secondOctet <= 127) return 'seguridad';
        if (firstOctet === 10) return 'corp-lan';
        if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'sucursales';
        if (firstOctet === 192 && secondOctet === 168) return 'dmz';
        return 'internet';
    }

    makeExactDecision(eventType, sourceIp, network) {
        if (network === 'seguridad') return 'allow';
        if (this.alwaysMaliciousTypes.includes(eventType)) return 'deny';
        if (network !== 'internet') {
            const allowedTypes = this.getAllowedTypesForNetwork(network);
            if (allowedTypes === 'ALL' || allowedTypes.has(eventType)) return 'allow';
            return 'deny';
        }
        if (network === 'internet') {
            if (eventType === 'http' || eventType === 'correo_legitimo') return 'allow';
            return 'deny';
        }
        return 'deny';
    }

    getAllowedTypesForNetwork(network) {
        const rules = {
            'corp-lan': new Set(['intento_ssh', 'http', 'correo_legitimo', 'ftp_login', 'ejecucion_procesos']),
            'sucursales': new Set(['intento_ssh', 'http', 'correo_legitimo', 'ftp_login']),
            'dmz': new Set([
                'intento_ssh', 'escaneo_nmap', 'fuerza_bruta_ssh', 'http', 'correo_spam', 'ftp_login',
                'fuerza_bruta_ftp', 'escaneo_nessus', 'intento_sqli', 'fuerza_bruta_rdp', 'barrido_icmp', 'ejecucion_procesos'
            ]),
            'seguridad': 'ALL'
        };
        return rules[network] || new Set();
    }

    getButtonColor(action) {
        return { 'deny': 'danger', 'allow': 'secondary', 'forward': 'warning' }[action] || 'secondary';
    }

    checkVictory() {
        const scoreElement = document.getElementById('score');
        const availabilityBar = document.getElementById('barAvailability');
        
        if (!scoreElement || !availabilityBar) return;

        const currentScore = parseInt(scoreElement.textContent) || 0;
        const availabilityText = availabilityBar.textContent;
        const availabilityMatch = availabilityText.match(/(\d+)%/);
        const currentAvailability = availabilityMatch ? parseInt(availabilityMatch[1]) : 100;

        const winModal = document.getElementById('winModal');
        const isModalVisible = winModal && getComputedStyle(winModal).display !== 'none';

        if (isModalVisible) {
            const flagText = document.getElementById('flagText');
            if (flagText) {
                const realFlag = flagText.textContent.trim();
                this.updateStatus(`🎉 FLAG OBTENIDA: ${realFlag}`);
                this.stopAutoPlay();
                setTimeout(() => {
                    this.showCustomFlagModal(realFlag);
                }, 1000);
                return;
            }
        }

        if (currentScore >= 200 && currentAvailability >= 80) {
            this.updateStatus(`⚡ Condiciones cumplidas! Score: ${currentScore}`);
        }
    }
}

const netDefenderExact = new DefenderGod();

setInterval(() => {
    netDefenderExact.updateStats();
}, 500);

console.log("🚀 DefenderGod Turbo cargado!");
