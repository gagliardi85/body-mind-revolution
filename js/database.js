// PT Flow Premium - Database Manager con Firebase
// Sostituisce localStorage con Firebase Realtime Database

const firebaseConfig = {
    apiKey: "AIzaSyDMcXFqYw9CmXmle3zw4kii5p8Q6hE6p8E",
    authDomain: "body-mind-revolution.firebaseapp.com",
    databaseURL: "https://body-mind-revolution-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "body-mind-revolution",
    storageBucket: "body-mind-revolution.firebasestorage.app",
    messagingSenderId: "441173918508",
    appId: "1:441173918508:web:5e2cc75ca6c1d7ee2aa289"
};

firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.database();

function arrayToFirebase(arr) {
    const obj = {};
    arr.forEach(item => { obj[item.id] = item; });
    return obj;
}

function firebaseToArray(obj) {
    if (!obj) return [];
    return Object.values(obj);
}

let _cache = { clients:[], profiles:[], plans:[], sessions:[], feedback:[], notes:[], archived_clients:[] };

async function saveCollection(name, arr) {
    _cache[name] = arr;
    const obj = {};
    arr.forEach(item => { obj[item.id || ('k_'+Math.random())] = item; });
    await firebaseDB.ref('ptflow/' + name).set(obj);
}

class DatabaseManager {
    constructor() {
        this._ready = false;
        this._init();
    }

    async _init() {
        const snap = await firebaseDB.ref('ptflow').once('value');
        const data = snap.val() || {};
        _cache.clients = firebaseToArray(data.clients);
        _cache.profiles = firebaseToArray(data.profiles);
        _cache.plans = firebaseToArray(data.plans);
        _cache.sessions = firebaseToArray(data.sessions);
        _cache.feedback = firebaseToArray(data.feedback);
        _cache.notes = firebaseToArray(data.notes);
        _cache.archived_clients = firebaseToArray(data.archived_clients);

        if (_cache.clients.length === 0) await this._createDemoData();
        this._ready = true;
        document.dispatchEvent(new Event('db_ready'));

        firebaseDB.ref('ptflow').on('value', snap => {
            const d = snap.val() || {};
            _cache.clients = firebaseToArray(d.clients);
            _cache.profiles = firebaseToArray(d.profiles);
            _cache.plans = firebaseToArray(d.plans);
            _cache.sessions = firebaseToArray(d.sessions);
            _cache.feedback = firebaseToArray(d.feedback);
            _cache.notes = firebaseToArray(d.notes);
            _cache.archived_clients = firebaseToArray(d.archived_clients);
            document.dispatchEvent(new Event('db_updated'));
        });
    }

    async _createDemoData() {
        const demoClients = [
            { id:'client_001', name:'Maria Bianchi', email:'maria@email.com', role:'client', status:'active', archived:false, created_at:new Date().toISOString() },
            { id:'client_002', name:'Luca Rossi', email:'luca@email.com', role:'client', status:'active', archived:false, created_at:new Date().toISOString() },
            { id:'client_003', name:'Sara Verde', email:'sara@email.com', role:'client', status:'active', archived:false, created_at:new Date().toISOString() }
        ];
        const demoProfiles = [
            { id:'prof_001', client_id:'client_001', age:35, weight:65, level:'intermedio', problems:['schiena'], goal:'tonificazione', equipment:['tappetino'], duration_preference:45, frequency:3, last_updated:new Date().toISOString() },
            { id:'prof_002', client_id:'client_002', age:28, weight:78, level:'principiante', problems:['sovrappeso'], goal:'dimagrimento', equipment:['nessuna'], duration_preference:30, frequency:4, last_updated:new Date().toISOString() },
            { id:'prof_003', client_id:'client_003', age:42, weight:58, level:'avanzato', problems:['spalla'], goal:'forza', equipment:['tappetino','pesi'], duration_preference:60, frequency:5, last_updated:new Date().toISOString() }
        ];
        await saveCollection('clients', demoClients);
        await saveCollection('profiles', demoProfiles);
        await saveCollection('plans', []);
        await saveCollection('sessions', []);
        await saveCollection('feedback', []);
        await saveCollection('notes', []);
        await saveCollection('archived_clients', []);
    }

    getAllClients() { return (_cache.clients||[]).filter(c=>c.archived!==true); }
    getClientById(id) { return this.getAllClients().find(c=>c.id===id); }
    authenticateClient(name) { const n=name.toLowerCase().trim(); return this.getAllClients().find(c=>c.name.toLowerCase().trim()===n); }

    async addClient(client) {
        const clients=[...(_cache.clients||[])];
        client.id='client_'+Date.now(); client.created_at=new Date().toISOString(); client.role='client'; client.status='active';
        clients.push(client); await saveCollection('clients',clients); return client;
    }
    async updateClient(id,updates) {
        const clients=[...(_cache.clients||[])]; const i=clients.findIndex(c=>c.id===id);
        if(i>=0){clients[i]={...clients[i],...updates}; await saveCollection('clients',clients); return clients[i];} return null;
    }
    async archiveClient(id) {
        const clients=[...(_cache.clients||[])]; const i=clients.findIndex(c=>c.id===id);
        if(i>=0){const c={...clients[i],archived_at:new Date().toISOString(),status:'archived'}; const arch=[...(_cache.archived_clients||[]),c]; clients.splice(i,1); await saveCollection('clients',clients); await saveCollection('archived_clients',arch); return true;} return false;
    }
    getArchivedClients() { return _cache.archived_clients||[]; }
    async restoreClient(id) {
        const arch=[...(_cache.archived_clients||[])]; const i=arch.findIndex(c=>c.id===id);
        if(i>=0){const c={...arch[i]}; delete c.archived_at; c.status='active'; c.restored_at=new Date().toISOString(); const clients=[...(_cache.clients||[]),c]; arch.splice(i,1); await saveCollection('clients',clients); await saveCollection('archived_clients',arch); return true;} return false;
    }

    getProfileByClientId(id) { return (_cache.profiles||[]).find(p=>p.client_id===id); }
    async updateProfile(clientId,data) {
        const profiles=[...(_cache.profiles||[])]; const i=profiles.findIndex(p=>p.client_id===clientId);
        data.client_id=clientId; data.last_updated=new Date().toISOString();
        if(!data.id) data.id='prof_'+Date.now();
        if(i>=0){profiles[i]=data;}else{profiles.push(data);}
        await saveCollection('profiles',profiles); return data;
    }

    getAllPlans() { return _cache.plans||[]; }
    getPlansByClientId(id) { return this.getAllPlans().filter(p=>p.client_id===id); }
    getActivePlanByClientId(id) { return this.getPlansByClientId(id).find(p=>p.status==='attiva'); }
    async addPlan(plan) {
        const plans=[...(_cache.plans||[])]; plan.id='plan_'+Date.now(); plan.generated_at=new Date().toISOString(); plans.push(plan); await saveCollection('plans',plans); return plan;
    }
    async updatePlan(planId,updates) {
        const plans=[...(_cache.plans||[])]; const i=plans.findIndex(p=>p.id===planId);
        if(i>=0){plans[i]={...plans[i],...updates}; await saveCollection('plans',plans); return plans[i];} return null;
    }
    async approvePlan(planId) {
        const plans=[...(_cache.plans||[])]; const toApprove=plans.find(p=>p.id===planId); if(!toApprove) return null;
        plans.forEach(p=>{if(p.client_id===toApprove.client_id&&p.status==='attiva')p.status='completata';});
        const i=plans.findIndex(p=>p.id===planId); if(i>=0)plans[i]={...plans[i],status:'attiva',approved_at:new Date().toISOString()};
        await saveCollection('plans',plans); return plans[i];
    }

    getAllSessions() { return _cache.sessions||[]; }
    getSessionsByClientId(id) { return this.getAllSessions().filter(s=>s.client_id===id); }
    async addSession(s) { const sessions=[...(_cache.sessions||[])]; s.id='session_'+Date.now(); s.completed_at=new Date().toISOString(); sessions.push(s); await saveCollection('sessions',sessions); return s; }

    getAllFeedback() { return _cache.feedback||[]; }
    getFeedbackByClientId(id) { return this.getAllFeedback().filter(f=>f.client_id===id); }
    getLatestFeedbackByClientId(id) { const f=this.getFeedbackByClientId(id); if(!f.length)return null; return f.sort((a,b)=>new Date(b.submitted_at)-new Date(a.submitted_at))[0]; }
    async addFeedback(data) { const f=[...(_cache.feedback||[])]; data.id='feedback_'+Date.now(); data.submitted_at=new Date().toISOString(); f.push(data); await saveCollection('feedback',f); return data; }

    getNotesByClientId(id) { return (_cache.notes||[]).filter(n=>n.client_id===id); }
    async addNote(note) { const notes=[...(_cache.notes||[])]; note.id='note_'+Date.now(); note.created_at=new Date().toISOString(); notes.push(note); await saveCollection('notes',notes); return note; }

    getClientStats(id) {
        const s=this.getSessionsByClientId(id); const f=this.getFeedbackByClientId(id); const p=this.getPlansByClientId(id);
        return {totalWorkouts:s.length,totalFeedback:f.length,totalPlans:p.length,lastWorkout:s.length>0?s[s.length-1].completed_at:null};
    }

    async clearAllData() { if(confirm('⚠️ Eliminare TUTTI i dati?')){await firebaseDB.ref('ptflow').remove();location.reload();} }
    async resetToDemo() { if(confirm('⚠️ Ripristinare i dati demo?')){await firebaseDB.ref('ptflow').remove();await this._createDemoData();location.reload();} }
}

const db = new DatabaseManager();
