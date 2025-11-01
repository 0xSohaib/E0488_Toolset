// Si es la primera vez que usas la consola de DevTools, habilita el pegado de código mediante "allow pasting" en la consola.
// Este script es para (SIEM Taskboard) que corre en el puerto 3030
// github.com/0xSohaib

class AutoTaskerGM {
    constructor() {
        this.tasksUrl = '/api/tasks';  
        this.severityMapping = {
            
            "Proceso Ejecución": "critical",  
            "Certificado invalido": "critical",
            "Proceso Ejecución": "high",  
            "HTTP Request": "medium",  
            "Email Phishing": "low"  
        };
        
        this.currentTaskIndex = 0;
        this.currentTransitionIndex = 0;
        this.transitions = ['todo>investigating', 'investigating>contained', 'contained>closed'];
        this.isRunning = false;
        this.tasksData = [];
    }
    
    async start() {
        if (this.isRunning) {
            this.updateStatus("⚠️ Paciencia, estoy en ello...");
            return;
        }
        
        this.isRunning = true;
        this.updateStatus("🚀 Vamos allá!...");
        
        
        await this.fetchTasks();
        
        if (this.tasksData.length === 0) {
            this.updateStatus("❌ No hay nada que hacer :(");
            this.isRunning = false;
            return;
        }
        
        console.log(`📊 Procesando ${this.tasksData.length} tareas`);
        console.log(`🎯 Objetivos: 2 críticas, 1 alta, 1 media, 1 baja`);
        
        this.processNextTask();
    }
    
    async fetchTasks() {
        try {
            this.updateStatus("📡 Troleando a la API...");
            const response = await fetch(this.tasksUrl);
            const tasks = await response.json();
            
            
            this.tasksData = tasks.map(task => {
                
                let severity = this.severityMapping[task.title] || 'low';
                
                
                if (task.title === "Proceso Ejecución") {
                    if (task.description.includes("Emotet") || task.description.includes("162[.]243[.]103[.]246")) {
                        severity = "critical";  
                    } else if (task.description.includes("166[.]1.160[.]118")) {
                        severity = "high";  
                    }
                }
                
                return {
                    id: task.id,
                    title: task.title,
                    severity: severity,
                    quiz: task.quiz || {}
                };
            });
            
            console.log("✅ Tareas completadas:");
            this.tasksData.forEach(task => {
                console.log(`   • ${task.title}: ${task.severity}`);
            });
            
        } catch (error) {
            console.error('❌ Error al importar tareas:', error);
            this.tasksData = [];
        }
    }
    
    stop() {
        this.isRunning = false;
        this.updateStatus("⏹️ La parasión (del verbo parar).");
    }
    
    processNextTask() {
        if (!this.isRunning) return;
        
        if (this.currentTaskIndex >= this.tasksData.length) {
            this.updateStatus("✅ \"Vaia vaia\", que baina hay aquí? Parece ser...");
            this.checkFlag();
            this.isRunning = false;
            return;
        }
        
        const task = this.tasksData[this.currentTaskIndex];
        this.updateStatus(`🔄 Procesando tarea ${this.currentTaskIndex + 1}/${this.tasksData.length}`);
        console.log(`\n🔄 Tarea ${this.currentTaskIndex + 1}: ${task.title} (Severidad: ${task.severity})`);
        
        this.currentTransitionIndex = 0;
        
        
        this.setTaskSeverity(task);
    }
    
    setTaskSeverity(task) {
        const taskElement = this.findTaskElement(task.id);
        
        if (taskElement) {
            
            const severitySelect = taskElement.querySelector('select[data-action="changeSeverity"]');
            
            if (severitySelect) {
                console.log(`   ⚡ Ajustando severidad a: ${task.severity}`);
                
                
                severitySelect.value = task.severity;
                
                
                const event = new Event('change', { bubbles: true });
                severitySelect.dispatchEvent(event);
                
                
                setTimeout(() => {
                    this.processCurrentTransition();
                }, 1000);
            } else {
                console.log(`   ❌ No se encuentra la severidad`);
                this.processCurrentTransition();
            }
        } else {
            console.log(`   ❌ No se encuentra el element de la tarea: ${task.id}`);
            this.skipTask();
        }
    }
    
    processCurrentTransition() {
        if (!this.isRunning) return;
        
        const task = this.tasksData[this.currentTaskIndex];
        
        if (this.currentTransitionIndex >= this.transitions.length) {
            
            this.currentTaskIndex++;
            setTimeout(() => this.processNextTask(), 1500);
            return;
        }
        
        const transition = this.transitions[this.currentTransitionIndex];
        const quizData = task.quiz[transition];
        
        if (!quizData || !quizData.answer) {
            console.log(`   ❌ No mas preguntas, su señoría ${transition}`);
            this.currentTransitionIndex++;
            setTimeout(() => this.processCurrentTransition(), 500);
            return;
        }
        
        const answer = Array.isArray(quizData.answer) ? quizData.answer[0] : quizData.answer;
        
        console.log(`   📝 ${transition}: ${answer}`);
        
        
        const taskElement = this.findTaskElement(task.id);
        
        if (taskElement) {
            this.clickQuickMoveButton(taskElement, transition, answer);
        } else {
            console.log(`   ❌ No existe elemento`);
            this.skipTask();
        }
    }
    
    findTaskElement(taskId) {
        
        return document.querySelector(`[data-id="${taskId}"]`);
    }
    
    clickQuickMoveButton(taskElement, transition, answer) {
        const quickMoveButton = taskElement.querySelector('button[onclick*="quickMove"]');
        
        if (quickMoveButton) {
            console.log(`   👆 "Mover" ${transition}`);
            quickMoveButton.click();
            
            
            setTimeout(() => {
                this.answerQuizModal(answer, transition);
            }, 1000);
        } else {
            console.log(`   ❌ "Mover" no disponible`);
            this.retryTransition();
        }
    }
    
    answerQuizModal(answer, transition) {
        
        setTimeout(() => {
            const modal = document.querySelector('#quizModal');
            const isModalVisible = modal && 
                                 (modal.style.display !== 'none' && 
                                  modal.style.display !== '') ||
                                 modal.classList.contains('show');
            
            if (isModalVisible) {
                console.log(`   📝 No me preguntes a mi aunque sepa la respuesta: ${answer}`);
                
                
                const answerInput = document.getElementById('quizAnswer');
                if (answerInput) {
                    
                    answerInput.value = '';
                    answerInput.value = answer;
                    
                    console.log(`   ✅ Viste eso?: ${answer}`);
                    
                    
                    setTimeout(() => {
                        this.clickModalMoveButton(transition);
                    }, 800);
                } else {
                    console.log(`   ❌ Aquí no hay libertad de expresión`);
                    this.retryTransition();
                }
            } else {
                console.log(`   ❌ No me dejan hacer nada`);
                this.retryTransition();
            }
        }, 1500);
    }
    
    clickModalMoveButton(transition) {
        const moveButton = document.querySelector('#quizModal button[type="submit"], #quizModal .btn-primary');
        
        if (moveButton && !moveButton.disabled) {
            console.log(`   ✅ "Move"`);
            moveButton.click();
            
            
            setTimeout(() => {
                this.currentTransitionIndex++;
                setTimeout(() => this.processCurrentTransition(), 2000);
            }, 2000);
        } else {
            console.log(`   ❌ El botón no botonea`);
            this.retryTransition();
        }
    }
    
    retryTransition() {
        
        this.closeModal();
        
        
        setTimeout(() => {
            this.processCurrentTransition();
        }, 2000);
    }
    
    closeModal() {
        const closeButton = document.querySelector('#quizModal .btn-close, #quizModal .btn-secondary');
        if (closeButton) {
            closeButton.click();
        }
    }
    
    skipTask() {
        this.currentTaskIndex++;
        setTimeout(() => this.processNextTask(), 1000);
    }
    
    async checkFlag() {
        try {
            const response = await fetch('/api/flag');
            if (response.ok) {
                const data = await response.json();
                if (data.flag) {
                    console.log('\n🎉🎉🎉 Chúpate esa Fer! 🎉🎉🎉');
                    console.log('🏁', data.flag);
                    this.showFlag(data.flag);
                    return true;
                } else {
                    console.log('❌ Se acabaron las tareas, pero no hay flag. Algo salió mal.');
                    this.showCompletionMessage();
                }
            }
        } catch (error) {
            console.log('❌ Error al revisar la flag');
            this.showCompletionMessage();
        }
        return false;
    }
    
    showFlag(flag) {
        const flagDiv = document.createElement('div');
        flagDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            color: #0f0;
            padding: 30px;
            border: 4px solid #0f0;
            border-radius: 15px;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 0 30px #0f0;
        `;
        flagDiv.innerHTML = `
            <div style="font-size: 28px; margin-bottom: 20px; color: #ff0;">🎯 FLAG OBTENIDA</div>
            <div style="margin: 20px 0; font-weight: bold; font-size: 26px;">${flag}</div>
            <div style="margin-bottom: 20px; color: #0f0;">Eres un/a h4x0r de la 3l1t3! Bien hecho!</div>
            <button onclick="this.parentElement.remove()" style="
                background: #0f0; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 5px; 
                color: #000; 
                font-weight: bold;
                cursor: pointer;
            ">La cerración</button>
        `;
        document.body.appendChild(flagDiv);
    }
    
    showCompletionMessage() {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            color: #ff0;
            padding: 30px;
            border: 4px solid #ff0;
            border-radius: 15px;
            font-family: 'Courier New', monospace;
            font-size: 20px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 0 30px #ff0;
        `;
        msgDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 20px;">✅ All Tasks Completed</div>
            <div style="margin-bottom: 20px;">Check if the flag appeared in the system</div>
            <button onclick="this.parentElement.remove()" style="
                background: #ff0; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 5px; 
                color: #000; 
                font-weight: bold;
                cursor: pointer;
            ">CLOSE</button>
        `;
        document.body.appendChild(msgDiv);
    }
    
    updateStatus(message) {
        const statusEl = document.getElementById('completionStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }
        console.log(message);
    }
}


let completer = null;

function createControlPanel() {
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
        max-width: 350px;
    `;
    
    panel.innerHTML = `
        <h4 style="margin-top: 0; color: #007bff;">🚀 GodMode by <a href="https://github.com/0xSohaib" style="color: #ccc";>0xSohaib</a></h4>
        
        <div style="margin-bottom: 10px; font-size: 12px; color: #ccc;">
            <strong>Objetivos:</strong><br>
            • 2 Crítica<br>
            • 1 Alta<br>
            • 1 Media<br>
            • 1 Baja
        </div>
        
        <button onclick="startCompleteProcessing()" style="width: 100%; padding: 10px; margin: 5px 0; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            🚀 Despega madafaka
        </button>
        
        <button onclick="checkFlagNow()" style="width: 100%; padding: 10px; margin: 5px 0; background: #6f42c1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            🔍 Revisar por la Flag
        </button>
        
        <button onclick="stopProcessing()" style="width: 100%; padding: 10px; margin: 5px 0; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            ⏹️ Parar
        </button>
        
        <div id="completionStatus" style="margin-top: 10px; font-size: 12px; color: #0f0;">
            Empezar de nuevo...
        </div>
        
        <button onclick="this.parentElement.remove()" style="width: 100%; padding: 8px; margin: 5px 0; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            ❌ Cerrar panel
        </button>
    `;
    
    document.body.appendChild(panel);
}


function startCompleteProcessing() {
    completer = new AutoTaskerGM();
    completer.start();
}

function stopProcessing() {
    if (completer) {
        completer.stop();
    }
}

function checkFlagNow() {
    fetch('/api/flag')
        .then(r => r.json())
        .then(data => {
            if (data.flag) {
                alert(`🎉 AY MI MAE, NO ME LO PUEDO CREER!\n\n${data.flag}`);
                const statusEl = document.getElementById('completionStatus');
                if (statusEl) statusEl.textContent = `🎉 LA FLAGUEISHON: ${data.flag}`;
            } else {
                alert("Algo salió mal, revisa el log de consola");
            }
        })
        .catch(() => alert("Error al solicitar la flag de la api"));
}


console.log("🚀 Cargado y listo");
console.log("Comunicación con /api/tasks");
console.log("Disfruta!");


setTimeout(createControlPanel, 1000);
