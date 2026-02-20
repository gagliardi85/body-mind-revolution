// PT Flow Premium - Backup Manager System
// Gestisce export/import di backup completi e parziali

class BackupManager {
    constructor() {
        this.version = "1.0";
        this.trainerName = "Alissa Casagrande";
    }

    // Formatta data per nome file
    formatDateForFilename() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}_${month}_${year}`;
    }

    // Export backup completo TRAINER (tutti i clienti e dati)
    exportTrainerBackup() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                trainer: this.trainerName,
                version: this.version,
                type: "trainer_complete",
                data: {
                    clients: JSON.parse(localStorage.getItem('ptflow_clients') || '[]'),
                    profiles: JSON.parse(localStorage.getItem('ptflow_profiles') || '[]'),
                    workout_plans: JSON.parse(localStorage.getItem('ptflow_plans') || '[]'),
                    feedback: JSON.parse(localStorage.getItem('ptflow_feedback') || '[]'),
                    sessions: JSON.parse(localStorage.getItem('ptflow_sessions') || '[]'),
                    notes: JSON.parse(localStorage.getItem('ptflow_notes') || '[]')
                }
            };

            const json = JSON.stringify(backup, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_completo_alissa_${this.formatDateForFilename()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('✅ Backup esportato con successo!', 'success');
            return true;
        } catch (error) {
            console.error('Errore export backup:', error);
            this.showNotification('❌ Errore durante l\'export del backup', 'error');
            return false;
        }
    }

    // Import backup completo TRAINER
    importTrainerBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // Validazione
                    if (!this.validateBackup(backup, 'trainer_complete')) {
                        throw new Error('Formato backup non valido');
                    }

                    // Conferma prima di sovrascrivere
                    const clientCount = backup.data.clients ? backup.data.clients.length : 0;
                    const planCount = backup.data.workout_plans ? backup.data.workout_plans.length : 0;
                    
                    const confirmed = confirm(
                        `⚠️ ATTENZIONE!\n\n` +
                        `Questo backup contiene:\n` +
                        `• ${clientCount} clienti\n` +
                        `• ${planCount} schede\n\n` +
                        `L'importazione SOVRASCRIVERÀ tutti i dati attuali.\n\n` +
                        `Vuoi procedere?`
                    );

                    if (!confirmed) {
                        this.showNotification('❌ Importazione annullata', 'info');
                        resolve(false);
                        return;
                    }

                    // Backup di emergenza prima di importare
                    this.createEmergencyBackup();

                    // Importa dati
                    localStorage.setItem('ptflow_clients', JSON.stringify(backup.data.clients || []));
                    localStorage.setItem('ptflow_profiles', JSON.stringify(backup.data.profiles || []));
                    localStorage.setItem('ptflow_plans', JSON.stringify(backup.data.workout_plans || []));
                    localStorage.setItem('ptflow_feedback', JSON.stringify(backup.data.feedback || []));
                    localStorage.setItem('ptflow_sessions', JSON.stringify(backup.data.sessions || []));
                    localStorage.setItem('ptflow_notes', JSON.stringify(backup.data.notes || []));

                    this.showNotification('✅ Backup importato con successo! Ricarica la pagina.', 'success');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                    resolve(true);
                } catch (error) {
                    console.error('Errore import backup:', error);
                    this.showNotification('❌ Errore: file backup non valido', 'error');
                    reject(error);
                }
            };

            reader.onerror = () => {
                this.showNotification('❌ Errore lettura file', 'error');
                reject(new Error('Errore lettura file'));
            };

            reader.readAsText(file);
        });
    }

    // Export scheda singola per CLIENTE
    exportWorkoutPlan(clientId, planId) {
        try {
            const plans = JSON.parse(localStorage.getItem('ptflow_plans') || '[]');
            const plan = plans.find(p => p.id === planId && p.client_id === clientId);
            
            if (!plan) {
                throw new Error('Scheda non trovata');
            }

            const clients = JSON.parse(localStorage.getItem('ptflow_clients') || '[]');
            const client = clients.find(c => c.id === clientId);
            const clientName = client ? client.name.toLowerCase().replace(/\s+/g, '_') : 'cliente';

            const exportData = {
                timestamp: new Date().toISOString(),
                trainer: this.trainerName,
                version: this.version,
                type: "client_workout",
                client_id: clientId,
                client_name: client ? client.name : 'Cliente',
                workout_plan: plan
            };

            const json = JSON.stringify(exportData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `scheda_${clientName}_${this.formatDateForFilename()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('✅ Scheda esportata! Invia al cliente via WhatsApp', 'success');
            return true;
        } catch (error) {
            console.error('Errore export scheda:', error);
            this.showNotification('❌ Errore durante l\'export della scheda', 'error');
            return false;
        }
    }

    // Import scheda CLIENTE
    importClientWorkout(file, clientId) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validazione
                    if (!this.validateBackup(data, 'client_workout')) {
                        throw new Error('File non valido');
                    }

                    const plan = data.workout_plan;
                    plan.imported_at = new Date().toISOString();
                    plan.status = 'attiva';

                    // Salva nel localStorage
                    const plans = JSON.parse(localStorage.getItem('ptflow_plans') || '[]');
                    
                    // Rimuovi schede precedenti attive per questo cliente
                    const filteredPlans = plans.filter(p => 
                        !(p.client_id === clientId && p.status === 'attiva')
                    );
                    
                    filteredPlans.push(plan);
                    localStorage.setItem('ptflow_plans', JSON.stringify(filteredPlans));

                    this.showNotification('✅ Scheda importata! Pronta per l\'allenamento', 'success');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);

                    resolve(true);
                } catch (error) {
                    console.error('Errore import scheda:', error);
                    this.showNotification('❌ File non valido o corrotto', 'error');
                    reject(error);
                }
            };

            reader.onerror = () => {
                this.showNotification('❌ Errore lettura file', 'error');
                reject(new Error('Errore lettura file'));
            };

            reader.readAsText(file);
        });
    }

    // Export dati personali CLIENTE
    exportClientData(clientId) {
        try {
            const clients = JSON.parse(localStorage.getItem('ptflow_clients') || '[]');
            const client = clients.find(c => c.id === clientId);
            
            if (!client) {
                throw new Error('Cliente non trovato');
            }

            const profiles = JSON.parse(localStorage.getItem('ptflow_profiles') || '[]');
            const profile = profiles.find(p => p.client_id === clientId);

            const plans = JSON.parse(localStorage.getItem('ptflow_plans') || '[]');
            const clientPlans = plans.filter(p => p.client_id === clientId);

            const sessions = JSON.parse(localStorage.getItem('ptflow_sessions') || '[]');
            const clientSessions = sessions.filter(s => s.client_id === clientId);

            const feedback = JSON.parse(localStorage.getItem('ptflow_feedback') || '[]');
            const clientFeedback = feedback.filter(f => f.client_id === clientId);

            const clientName = client.name.toLowerCase().replace(/\s+/g, '_');

            const exportData = {
                timestamp: new Date().toISOString(),
                trainer: this.trainerName,
                version: this.version,
                type: "client_data",
                client: client,
                profile: profile,
                workout_plans: clientPlans,
                sessions: clientSessions,
                feedback: clientFeedback
            };

            const json = JSON.stringify(exportData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `dati_${clientName}_${this.formatDateForFilename()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('✅ I tuoi dati sono stati esportati!', 'success');
            return true;
        } catch (error) {
            console.error('Errore export dati cliente:', error);
            this.showNotification('❌ Errore durante l\'export', 'error');
            return false;
        }
    }

    // Import dati personali CLIENTE
    importClientData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validazione
                    if (!this.validateBackup(data, 'client_data')) {
                        throw new Error('File non valido');
                    }

                    const confirmed = confirm(
                        `⚠️ ATTENZIONE!\n\n` +
                        `Importerai i dati di: ${data.client.name}\n\n` +
                        `Questo SOVRASCRIVERÀ i tuoi dati attuali.\n\n` +
                        `Vuoi procedere?`
                    );

                    if (!confirmed) {
                        this.showNotification('❌ Importazione annullata', 'info');
                        resolve(false);
                        return;
                    }

                    const clientId = data.client.id;

                    // Aggiorna client
                    const clients = JSON.parse(localStorage.getItem('ptflow_clients') || '[]');
                    const clientIndex = clients.findIndex(c => c.id === clientId);
                    if (clientIndex >= 0) {
                        clients[clientIndex] = data.client;
                    } else {
                        clients.push(data.client);
                    }
                    localStorage.setItem('ptflow_clients', JSON.stringify(clients));

                    // Aggiorna profile
                    const profiles = JSON.parse(localStorage.getItem('ptflow_profiles') || '[]');
                    const profileIndex = profiles.findIndex(p => p.client_id === clientId);
                    if (profileIndex >= 0) {
                        profiles[profileIndex] = data.profile;
                    } else if (data.profile) {
                        profiles.push(data.profile);
                    }
                    localStorage.setItem('ptflow_profiles', JSON.stringify(profiles));

                    // Aggiorna plans
                    let plans = JSON.parse(localStorage.getItem('ptflow_plans') || '[]');
                    plans = plans.filter(p => p.client_id !== clientId);
                    plans.push(...data.workout_plans);
                    localStorage.setItem('ptflow_plans', JSON.stringify(plans));

                    // Aggiorna sessions
                    let sessions = JSON.parse(localStorage.getItem('ptflow_sessions') || '[]');
                    sessions = sessions.filter(s => s.client_id !== clientId);
                    sessions.push(...data.sessions);
                    localStorage.setItem('ptflow_sessions', JSON.stringify(sessions));

                    // Aggiorna feedback
                    let feedback = JSON.parse(localStorage.getItem('ptflow_feedback') || '[]');
                    feedback = feedback.filter(f => f.client_id !== clientId);
                    feedback.push(...data.feedback);
                    localStorage.setItem('ptflow_feedback', JSON.stringify(feedback));

                    this.showNotification('✅ Dati importati! Ricarica la pagina.', 'success');
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                    resolve(true);
                } catch (error) {
                    console.error('Errore import dati:', error);
                    this.showNotification('❌ File non valido', 'error');
                    reject(error);
                }
            };

            reader.onerror = () => {
                this.showNotification('❌ Errore lettura file', 'error');
                reject(new Error('Errore lettura file'));
            };

            reader.readAsText(file);
        });
    }

    // Validazione backup
    validateBackup(data, expectedType) {
        if (!data || typeof data !== 'object') return false;
        if (!data.version || !data.timestamp) return false;
        if (data.type !== expectedType) return false;

        if (expectedType === 'trainer_complete') {
            return data.data && typeof data.data === 'object';
        }
        if (expectedType === 'client_workout') {
            return data.workout_plan && typeof data.workout_plan === 'object';
        }
        if (expectedType === 'client_data') {
            return data.client && data.profile && data.workout_plans;
        }

        return false;
    }

    // Backup di emergenza automatico
    createEmergencyBackup() {
        try {
            const emergency = {
                timestamp: new Date().toISOString(),
                type: "emergency",
                data: {
                    clients: localStorage.getItem('ptflow_clients'),
                    profiles: localStorage.getItem('ptflow_profiles'),
                    plans: localStorage.getItem('ptflow_plans'),
                    feedback: localStorage.getItem('ptflow_feedback'),
                    sessions: localStorage.getItem('ptflow_sessions'),
                    notes: localStorage.getItem('ptflow_notes')
                }
            };
            localStorage.setItem('ptflow_emergency_backup', JSON.stringify(emergency));
            console.log('✅ Backup di emergenza creato');
        } catch (error) {
            console.error('Errore backup emergenza:', error);
        }
    }

    // Mostra notifiche
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-text">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 400);
        }, 4000);
    }
}

// Inizializza globalmente
const backupManager = new BackupManager();
