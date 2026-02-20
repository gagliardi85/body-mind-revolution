// PT Flow Premium - AI Workout Generator
// Genera schede personalizzate basate su profilo, feedback e linee guida

class WorkoutGenerator {
    constructor() {
        this.exerciseDatabase = this.initExerciseDatabase();
    }

    // Database esercizi con adattamenti per problematiche e link YouTube
    initExerciseDatabase() {
        return {
            warmup: [
                { name: 'Respirazione diaframmatica', duration: '60 sec', safe_for: 'all', video: 'https://www.youtube.com/watch?v=1Rte68Hx5Y4' },
                { name: 'Cat-Cow', reps: '10 rip', safe_for: 'all', avoid: [], video: 'https://www.youtube.com/watch?v=kqnUA0O7key' },
                { name: 'Rotazioni spalle', reps: '8 rip/lato', safe_for: 'all', avoid: ['spalla'], video: 'https://www.youtube.com/watch?v=5JJUWdW4hZk' },
                { name: 'Marcia sul posto', duration: '2 min', safe_for: 'all', video: 'https://www.youtube.com/watch?v=TLCugz96sig' },
                { name: 'Rotazioni bacino', reps: '8 rip', safe_for: 'all', video: 'https://www.youtube.com/watch?v=dIm1BfnXrEk' },
                { name: 'Allungamento collo', duration: '30 sec', safe_for: 'all', video: 'https://www.youtube.com/watch?v=cXq3hGugxOA' }
            ],
            mobility: [
                { name: 'Child pose', duration: '45 sec', safe_for: ['schiena', 'post-parto'], level: 'beginner', video: 'https://www.youtube.com/watch?v=2MTmI4QvhA4' },
                { name: 'Thread the needle', reps: '6 rip/lato', safe_for: ['schiena', 'spalla'], level: 'beginner', video: 'https://www.youtube.com/watch?v=YqfE8JUxkHc' },
                { name: 'Glute bridge', reps: '10 rip', safe_for: ['schiena', 'post-parto'], level: 'beginner', video: 'https://www.youtube.com/watch?v=wPM8icPu6H8' },
                { name: 'Cat stretch', reps: '8 rip', safe_for: 'all', level: 'beginner', video: 'https://www.youtube.com/watch?v=kqnUA0O7key' },
                { name: 'Hip circles', reps: '10 rip/lato', safe_for: 'all', level: 'intermediate', video: 'https://www.youtube.com/watch?v=FYmoD38G4Sk' }
            ],
            core: [
                { name: 'Plank sui gomiti', duration: '20-30 sec', safe_for: ['schiena'], level: 'beginner', avoid: ['post-parto-early'], video: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
                { name: 'Dead bug', reps: '8 rip/lato', safe_for: ['schiena', 'post-parto'], level: 'beginner', video: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws' },
                { name: 'Bird dog', reps: '8 rip/lato', safe_for: ['schiena'], level: 'intermediate', video: 'https://www.youtube.com/watch?v=wiFNA3sqjCA' },
                { name: 'Plank laterale', duration: '15-20 sec/lato', safe_for: ['schiena'], level: 'intermediate', avoid: ['spalla'], video: 'https://www.youtube.com/watch?v=K2VljzCC16g' },
                { name: 'Hollow hold', duration: '15-20 sec', safe_for: [], level: 'advanced', avoid: ['schiena', 'post-parto'], video: 'https://www.youtube.com/watch?v=LlDNef_Ztsc' },
                { name: 'Crunch alternato', reps: '12 rip', safe_for: 'all', level: 'beginner', video: 'https://www.youtube.com/watch?v=3p8EBPVZ2Iw' }
            ],
            strength_lower: [
                { name: 'Squat a corpo libero', reps: '12 rip', safe_for: 'all', level: 'beginner', video: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
                { name: 'Affondi alternati', reps: '10 rip/lato', safe_for: 'all', level: 'intermediate', video: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
                { name: 'Ponte glutei', reps: '15 rip', safe_for: ['schiena', 'post-parto'], level: 'beginner', video: 'https://www.youtube.com/watch?v=wPM8icPu6H8' },
                { name: 'Step up', reps: '10 rip/lato', safe_for: 'all', level: 'intermediate', equipment: 'step', video: 'https://www.youtube.com/watch?v=dQqApCGd5Ss' },
                { name: 'Squat bulgaro', reps: '8 rip/lato', safe_for: [], level: 'advanced', video: 'https://www.youtube.com/watch?v=2C-uSHzP31Q' },
                { name: 'Donkey kicks', reps: '12 rip/lato', safe_for: 'all', level: 'beginner', video: 'https://www.youtube.com/watch?v=SJ1Xuz9K02I' }
            ],
            strength_upper: [
                { name: 'Push up sulle ginocchia', reps: '8 rip', safe_for: ['post-parto'], level: 'beginner', avoid: ['spalla'], video: 'https://www.youtube.com/watch?v=jWxvty2KROs' },
                { name: 'Rematore con elastico', reps: '12 rip', safe_for: ['schiena'], level: 'intermediate', equipment: 'elastici', video: 'https://www.youtube.com/watch?v=c3097FSyF_0' },
                { name: 'Shoulder press leggero', reps: '10 rip', safe_for: [], level: 'intermediate', avoid: ['spalla'], equipment: 'pesi', video: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
                { name: 'Bicep curl', reps: '12 rip', safe_for: 'all', level: 'beginner', equipment: 'pesi', video: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
                { name: 'Tricep dips su sedia', reps: '8 rip', safe_for: [], level: 'intermediate', avoid: ['spalla'], video: 'https://www.youtube.com/watch?v=0326dy_-CzM' },
                { name: 'Alzate laterali', reps: '10 rip', safe_for: [], level: 'intermediate', avoid: ['spalla'], equipment: 'pesi', video: 'https://www.youtube.com/watch?v=3VcKaXpzqRo' }
            ],
            cardio: [
                { name: 'Jumping jacks', duration: '30 sec', safe_for: [], level: 'intermediate', avoid: ['sovrappeso', 'post-parto'], video: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8' },
                { name: 'Mountain climbers', duration: '30 sec', safe_for: [], level: 'intermediate', avoid: ['schiena', 'sovrappeso', 'post-parto'], video: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
                { name: 'Marcia veloce', duration: '60 sec', safe_for: 'all', level: 'beginner', video: 'https://www.youtube.com/watch?v=TLCugz96sig' },
                { name: 'Skip sul posto', duration: '30 sec', safe_for: ['sovrappeso'], level: 'intermediate', video: 'https://www.youtube.com/watch?v=8opcQdC-V-U' },
                { name: 'Burpees modificati', reps: '6 rip', safe_for: [], level: 'advanced', avoid: ['schiena', 'sovrappeso', 'post-parto', 'spalla'], video: 'https://www.youtube.com/watch?v=JZQA08SlJnM' }
            ],
            cooldown: [
                { name: 'Stretching quadricipiti', duration: '30 sec/lato', safe_for: 'all', video: 'https://www.youtube.com/watch?v=5gsYl_p-MBw' },
                { name: 'Stretching posteriori coscia', duration: '30 sec/lato', safe_for: 'all', video: 'https://www.youtube.com/watch?v=1dLDqHpQVgY' },
                { name: 'Stretching schiena', duration: '45 sec', safe_for: ['schiena'], video: 'https://www.youtube.com/watch?v=2MTmI4QvhA4' },
                { name: 'Respirazione profonda', duration: '60 sec', safe_for: 'all', video: 'https://www.youtube.com/watch?v=1Rte68Hx5Y4' },
                { name: 'Stretching spalle', duration: '30 sec/lato', safe_for: [], avoid: ['spalla'], video: 'https://www.youtube.com/watch?v=cXq3hGugxOA' }
            ]
        };
    }

    // Genera scheda completa
    generateWorkoutPlan(clientId) {
        const client = db.getClientById(clientId);
        const profile = db.getProfileByClientId(clientId);
        const latestFeedback = db.getLatestFeedbackByClientId(clientId);

        if (!profile) {
            throw new Error('Profilo cliente non trovato');
        }

        const targetDuration = this.calculateDuration(profile, latestFeedback);
        const intensity = this.calculateIntensity(profile, latestFeedback);

        // ✅ CALCOLO AUTOMATICO DEL NUMERO DI ESERCIZI IN BASE ALLA DURATA
        // Stima tempo per fase (in minuti):
        // - Warmup: 6-8 min (3 esercizi × 2 min)
        // - Mobility: 5-7 min (3 esercizi × 2 min)
        // - Strength: 10-15 min (5 esercizi × 3 min)
        // - Circuit: 8-12 min (4 esercizi × 3 min)
        // - Cooldown: 4-5 min (3 esercizi × 1.5 min)
        // TOTALE MEDIO = ~40 min

        let warmupCount = 3;
        let mobilityCount = 3;
        let strengthCount = 5;
        let circuitCount = 4;
        let cooldownCount = 3;

        // Adatta il numero di esercizi in base alla durata target
        if (targetDuration <= 30) {
            // Allenamento breve (20-30 min)
            warmupCount = 2;
            mobilityCount = 2;
            strengthCount = 3;
            circuitCount = 2;
            cooldownCount = 2;
        } else if (targetDuration >= 60) {
            // Allenamento lungo (60+ min)
            warmupCount = 4;
            mobilityCount = 4;
            strengthCount = 7;
            circuitCount = 6;
            cooldownCount = 4;
        }

        // Costruisci scheda
        const plan = {
            client_id: clientId,
            trainer_id: 'trainer_001',
            status: 'in_attesa_approvazione',
            title: this.generateTitle(profile),
            objective: profile.goal,
            duration: targetDuration,
            equipment: profile.equipment,
            phases: {
                warmup: this.selectExercises('warmup', warmupCount, profile, intensity, latestFeedback),
                mobility: this.selectExercises('mobility', mobilityCount, profile, intensity, latestFeedback),
                strength: this.selectStrengthExercises(profile, intensity, latestFeedback, strengthCount),
                circuit: this.selectCircuitExercises(profile, intensity, circuitCount, latestFeedback),
                cooldown: this.selectExercises('cooldown', cooldownCount, profile, intensity, latestFeedback)
            },
            ai_suggestion: this.generateAISuggestion(profile, latestFeedback, targetDuration),
            trainer_notes: profile.custom_problems ? `⚠️ Problematiche specifiche: ${profile.custom_problems}` : '',
            client_notes: ''
        };

        return db.addPlan(plan);
    }

    // Calcola durata basata su preferenze e feedback
    calculateDuration(profile, feedback) {
        let duration = profile.duration_preference || 45;

        if (feedback && feedback.duration_adjustment) {
            if (feedback.duration_adjustment === 'troppo_lunga') {
                duration = Math.max(20, duration - 15);
            } else if (feedback.duration_adjustment === 'troppo_corta') {
                duration = Math.min(75, duration + 15);
            }
        }

        return duration;
    }

    // Calcola intensità
    calculateIntensity(profile, feedback) {
        const levelMap = {
            'principiante': 0.6,
            'intermedio': 0.8,
            'avanzato': 1.0
        };

        let intensity = levelMap[profile.level] || 0.7;

        if (feedback && feedback.intensity_adjustment) {
            if (feedback.intensity_adjustment === 'troppo_difficile') {
                intensity = Math.max(0.4, intensity - 0.15);
            } else if (feedback.intensity_adjustment === 'troppo_facile') {
                intensity = Math.min(1.0, intensity + 0.15);
            }
        }

        return intensity;
    }

    // Seleziona esercizi sicuri
    selectExercises(category, count, profile, intensity, feedback = null) {
        const exercises = this.exerciseDatabase[category];
        const problems = profile.problems || [];
        
        // ✅ NUOVO: Estrai esercizi da evitare dal feedback
        let avoidExercises = [];
        if (feedback && feedback.difficult_part) {
            // Se il cliente ha segnalato parte difficile, prova a estrarre nome esercizio
            const difficultPart = feedback.difficult_part.toLowerCase();
            avoidExercises = exercises
                .filter(ex => difficultPart.includes(ex.name.toLowerCase()))
                .map(ex => ex.name);
        }
        
        // Filtra esercizi sicuri
        const safe = exercises.filter(ex => {
            // ✅ NUOVO: Evita esercizi che hanno causato problemi
            if (avoidExercises.includes(ex.name)) return false;
            
            // Controlla se è safe per le problematiche
            if (ex.safe_for === 'all') return true;
            if (Array.isArray(ex.safe_for)) {
                return problems.some(p => ex.safe_for.includes(p));
            }
            
            // Controlla cosa evitare
            if (ex.avoid && Array.isArray(ex.avoid)) {
                return !problems.some(p => ex.avoid.includes(p));
            }

            // Controlla equipment
            if (ex.equipment) {
                return profile.equipment.includes(ex.equipment);
            }

            return true;
        });

        // Seleziona casualmente (SHUFFLE per variare ogni volta)
        const selected = [];
        const available = [...safe];
        
        // ✅ SHUFFLE dell'array per garantire varietà
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
        }
        
        // Prendi i primi 'count' dopo lo shuffle
        return available.slice(0, Math.min(count, available.length));
    }

    // Seleziona esercizi di forza
    selectStrengthExercises(profile, intensity, feedback, count = 5) {
        const problems = profile.problems || [];
        const hasUpperIssues = problems.some(p => ['spalla'].includes(p));
        
        // Se ha problemi spalla, focus su lower body
        if (hasUpperIssues) {
            return {
                title: '💪 Rinforzo Lower Body',
                exercises: this.selectExercises('strength_lower', count, profile, intensity, feedback)
            };
        }

        // Altrimenti bilanciato (60% lower, 40% upper)
        const lowerCount = Math.ceil(count * 0.6);
        const upperCount = Math.floor(count * 0.4);
        const lower = this.selectExercises('strength_lower', lowerCount, profile, intensity, feedback);
        const upper = this.selectExercises('strength_upper', upperCount, profile, intensity, feedback);

        return {
            title: '💪 Rinforzo Total Body',
            exercises: [...lower, ...upper]
        };
    }

    // Seleziona circuito finale
    selectCircuitExercises(profile, intensity, count = 4, feedback = null) {
        const style = profile.style_preference;
        
        if (style === 'pilates') {
            return {
                title: '🔥 Circuito Mind-Body',
                exercises: this.selectExercises('core', count, profile, intensity, feedback)
            };
        }

        if (style === 'cardio') {
            return {
                title: '🔥 Circuito Cardio',
                exercises: this.selectExercises('cardio', count, profile, intensity, feedback)
            };
        }

        // Functional mix
        const core = this.selectExercises('core', 2, profile, intensity, feedback);
        const cardio = this.selectExercises('cardio', 1, profile, intensity, feedback);

        return {
            title: '🔥 Circuito Functional',
            exercises: [...core, ...cardio]
        };
    }

    // Genera titolo scheda
    generateTitle(profile) {
        const styleNames = {
            'pilates': 'Pilates Core',
            'cardio': 'Cardio Burn',
            'functional': 'Functional Training'
        };

        const levelNames = {
            'principiante': 'Base',
            'intermedio': 'Intermedio',
            'avanzato': 'Avanzato'
        };

        const style = styleNames[profile.style_preference] || 'Allenamento';
        const level = levelNames[profile.level] || '';

        return `${style} ${level} - Body & Mind Revolution`;
    }

    // Genera suggerimenti AI
    generateAISuggestion(profile, feedback, targetDuration) {
        const suggestions = [];

        // ✅ Aggiungi suggerimento sulla durata
        suggestions.push(`✓ Durata target: ${targetDuration} minuti`);

        if (profile.problems.includes('schiena')) {
            suggestions.push('✓ Evitati esercizi ad alto carico sulla colonna');
            suggestions.push('✓ Focus su rinforzo core e stabilizzazione');
        }

        if (profile.problems.includes('spalla')) {
            suggestions.push('✓ Limitati movimenti overhead');
            suggestions.push('✓ Privilegiati esercizi lower body');
        }

        if (profile.problems.includes('post-parto')) {
            suggestions.push('✓ Progressione graduale dell\'intensità');
            suggestions.push('✓ Focus su recupero pavimento pelvico');
        }

        if (profile.problems.includes('sovrappeso')) {
            suggestions.push('✓ Esercizi a basso impatto articolare');
            suggestions.push('✓ Progressione graduale del cardio');
        }

        if (feedback) {
            if (feedback.feeling === 'molto_faticoso') {
                suggestions.push('⚠️ Ridotta intensità rispetto al feedback precedente');
            }
            if (feedback.pain_discomfort) {
                suggestions.push(`⚠️ Cliente ha segnalato dolore: ${feedback.pain_discomfort}`);
            }
            if (feedback.favorite_exercises) {
                suggestions.push(`💚 Cliente ha apprezzato: ${feedback.favorite_exercises}`);
            }
        }

        return suggestions.join('\n');
    }

    // Rigenera scheda con feedback
    regenerateWithFeedback(clientId, feedbackData) {
        // Salva feedback
        feedbackData.client_id = clientId;
        db.addFeedback(feedbackData);

        // Genera nuova scheda
        return this.generateWorkoutPlan(clientId);
    }
}

// Inizializza globalmente
const workoutGenerator = new WorkoutGenerator();
