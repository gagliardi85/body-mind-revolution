// Exercise YouTube Link Manager - Gestisce link YouTube degli esercizi
class ExerciseYouTubeLinkManager {
    constructor() {
        this.storageKey = 'ptflow_exercise_youtube_links';
    }

    // Ottieni tutti i link salvati
    getAllLinks() {
        const links = localStorage.getItem(this.storageKey);
        return links ? JSON.parse(links) : {};
    }

    // Salva link YouTube per un esercizio
    saveLink(exerciseName, youtubeUrl) {
        const links = this.getAllLinks();
        const normalizedName = this.normalizeExerciseName(exerciseName);
        links[normalizedName] = {
            name: exerciseName,
            url: youtubeUrl,
            saved_at: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(links));
        return normalizedName;
    }

    // Ottieni link per un esercizio
    getLink(exerciseName) {
        const links = this.getAllLinks();
        const normalizedName = this.normalizeExerciseName(exerciseName);
        return links[normalizedName]?.url || null;
    }

    // Normalizza nome esercizio (lowercase, trim, no spazi multipli)
    normalizeExerciseName(name) {
        return name.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    // Verifica se esercizio ha link
    hasLink(exerciseName) {
        return this.getLink(exerciseName) !== null;
    }

    // Rimuovi link
    removeLink(exerciseName) {
        const links = this.getAllLinks();
        const normalizedName = this.normalizeExerciseName(exerciseName);
        delete links[normalizedName];
        localStorage.setItem(this.storageKey, JSON.stringify(links));
    }

    // Conta link salvati
    getLinkCount() {
        return Object.keys(this.getAllLinks()).length;
    }

    // Pulisci storage (per debugging)
    clearAll() {
        localStorage.removeItem(this.storageKey);
    }
}

// Istanza globale
const exerciseYouTubeLinkManager = new ExerciseYouTubeLinkManager();
