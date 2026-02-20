// Exercise Image Manager - Gestisce upload e storage immagini esercizi
class ExerciseImageManager {
    constructor() {
        this.storageKey = 'ptflow_exercise_images';
    }

    // Ottieni tutte le immagini salvate
    getAllImages() {
        const images = localStorage.getItem(this.storageKey);
        return images ? JSON.parse(images) : {};
    }

    // Salva immagine per un esercizio (base64)
    saveImage(exerciseName, base64Image) {
        const images = this.getAllImages();
        const normalizedName = this.normalizeExerciseName(exerciseName);
        images[normalizedName] = {
            name: exerciseName,
            image: base64Image,
            uploaded_at: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(images));
        return normalizedName;
    }

    // Ottieni immagine per un esercizio
    getImage(exerciseName) {
        const images = this.getAllImages();
        const normalizedName = this.normalizeExerciseName(exerciseName);
        return images[normalizedName]?.image || null;
    }

    // Normalizza nome esercizio (lowercase, trim, no spazi multipli)
    normalizeExerciseName(name) {
        return name.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    // Verifica se esercizio ha immagine
    hasImage(exerciseName) {
        return this.getImage(exerciseName) !== null;
    }

    // Rimuovi immagine
    removeImage(exerciseName) {
        const images = this.getAllImages();
        const normalizedName = this.normalizeExerciseName(exerciseName);
        delete images[normalizedName];
        localStorage.setItem(this.storageKey, JSON.stringify(images));
    }

    // Converti file in base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Conta immagini salvate
    getImageCount() {
        return Object.keys(this.getAllImages()).length;
    }

    // Pulisci storage (per debugging)
    clearAll() {
        localStorage.removeItem(this.storageKey);
    }
}

// Istanza globale
const exerciseImageManager = new ExerciseImageManager();
