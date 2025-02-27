/**
 * Handles audio playback for the game
 */
export default class Audio {
    /**
     * Create a new audio system
     */
    constructor() {
        this.sounds = {};
        this.muted = false;
        this.loaded = false;
        this.loadPromise = null;
    }

    /**
     * Load all game sounds
     * @param {Object} soundPaths - Object mapping sound names to file paths
     * @returns {Promise} Promise that resolves when all sounds are loaded
     */
    loadSounds(soundPaths) {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise((resolve) => {
            const totalSounds = Object.keys(soundPaths).length;
            let loadedSounds = 0;

            // Load each sound
            for (const [name, path] of Object.entries(soundPaths)) {
                const audio = new Audio(path);
                
                // Handle successful load
                audio.addEventListener('canplaythrough', () => {
                    loadedSounds++;
                    if (loadedSounds === totalSounds) {
                        this.loaded = true;
                        resolve();
                    }
                }, { once: true });
                
                // Handle load error
                audio.addEventListener('error', () => {
                    console.warn(`Failed to load sound: ${name} (${path})`);
                    loadedSounds++;
                    if (loadedSounds === totalSounds) {
                        this.loaded = true;
                        resolve();
                    }
                }, { once: true });

                // Store the audio element
                this.sounds[name] = audio;
            }

            // If no sounds to load, resolve immediately
            if (totalSounds === 0) {
                this.loaded = true;
                resolve();
            }
        });

        return this.loadPromise;
    }

    /**
     * Play a sound
     * @param {string} name - Name of the sound to play
     * @param {number} volume - Volume level (0.0 to 1.0)
     * @param {boolean} loop - Whether to loop the sound
     * @returns {HTMLAudioElement|null} The audio element or null if sound doesn't exist
     */
    play(name, volume = 1.0, loop = false) {
        if (this.muted || !this.sounds[name]) {
            return null;
        }

        // Clone the audio to allow overlapping sounds
        const sound = this.sounds[name].cloneNode();
        sound.volume = volume;
        sound.loop = loop;
        sound.play().catch(error => {
            console.warn(`Error playing sound ${name}:`, error);
        });

        return sound;
    }

    /**
     * Stop a specific sound
     * @param {HTMLAudioElement} sound - The sound to stop
     */
    stop(sound) {
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /**
     * Mute or unmute all sounds
     * @param {boolean} muted - Whether to mute sounds
     */
    setMuted(muted) {
        this.muted = muted;
        
        // Stop all currently playing sounds if muting
        if (muted) {
            for (const sound of Object.values(this.sounds)) {
                sound.pause();
            }
        }
    }

    /**
     * Toggle mute state
     * @returns {boolean} New mute state
     */
    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    /**
     * Check if sounds are muted
     * @returns {boolean} True if sounds are muted
     */
    isMuted() {
        return this.muted;
    }

    /**
     * Check if sounds are loaded
     * @returns {boolean} True if sounds are loaded
     */
    isLoaded() {
        return this.loaded;
    }
} 