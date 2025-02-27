/**
 * Generates sound effects programmatically using Web Audio API
 */
export default class SoundGenerator {
    /**
     * Create a new sound generator
     */
    constructor() {
        console.log('SoundGenerator constructor called');
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
        this.debugMode = true; // Enable debug mode
        this.userInteractionRequired = false;
        this.onReadyCallbacks = [];
        console.log('SoundGenerator constructor completed');
    }

    /**
     * Initialize the audio context
     * @returns {boolean} Whether initialization was successful
     */
    initialize() {
        console.log('SoundGenerator.initialize called');
        try {
            // Create audio context
            console.log('Creating AudioContext...');
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (this.debugMode) {
                console.log('Audio context created successfully:', this.audioContext);
                console.log('Audio context state:', this.audioContext.state);
                console.log('Audio context sample rate:', this.audioContext.sampleRate);
                console.log('Audio context destination:', this.audioContext.destination);
            }
            
            // Check if user interaction is required
            if (this.audioContext.state === 'suspended') {
                this.userInteractionRequired = true;
                console.warn('AudioContext is suspended. User interaction required to start audio.');
                
                // Add event listeners for user interaction
                const resumeAudioContext = () => {
                    console.log('User interaction detected, attempting to resume AudioContext');
                    if (this.audioContext.state === 'suspended') {
                        this.audioContext.resume().then(() => {
                            console.log('AudioContext resumed by user interaction');
                            
                            // Call any callbacks waiting for audio to be ready
                            console.log(`Calling ${this.onReadyCallbacks.length} ready callbacks`);
                            this.onReadyCallbacks.forEach(callback => callback());
                            this.onReadyCallbacks = [];
                            
                            // Remove event listeners once audio is running
                            document.removeEventListener('click', resumeAudioContext);
                            document.removeEventListener('keydown', resumeAudioContext);
                            document.removeEventListener('touchstart', resumeAudioContext);
                            console.log('Event listeners removed');
                        }).catch(err => {
                            console.error('Failed to resume AudioContext after user interaction:', err);
                        });
                    } else {
                        console.log('AudioContext already running, no need to resume');
                    }
                };
                
                console.log('Adding event listeners for user interaction');
                document.addEventListener('click', resumeAudioContext);
                document.addEventListener('keydown', resumeAudioContext);
                document.addEventListener('touchstart', resumeAudioContext);
            } else {
                console.log('AudioContext already running, no user interaction required');
            }
            
            // Create master gain node
            console.log('Creating master gain node');
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 1.0;
            this.masterGain.connect(this.audioContext.destination);
            console.log('Master gain node created and connected');
            
            this.initialized = true;
            
            // Add a test sound to verify audio is working
            if (this.debugMode && !this.userInteractionRequired) {
                console.log('Playing test sound immediately since no user interaction required');
                this.playTestSound();
            } else if (this.debugMode) {
                console.log('Test sound will be played after user interaction');
            }
            
            console.log('SoundGenerator initialization completed successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            console.error('Browser may not support Web Audio API or there may be another issue');
            return false;
        }
    }
    
    /**
     * Register a callback to be called when audio is ready
     * @param {Function} callback - Function to call when audio is ready
     */
    onReady(callback) {
        console.log('onReady called, audio context state:', this.audioContext ? this.audioContext.state : 'no context');
        if (this.audioContext && this.audioContext.state === 'running') {
            // Audio is already ready, call immediately
            console.log('Audio already ready, calling callback immediately');
            callback();
        } else {
            // Add to callback queue
            console.log('Audio not ready, adding callback to queue');
            this.onReadyCallbacks.push(callback);
        }
    }
    
    /**
     * Check if audio is ready to play
     * @returns {boolean} Whether audio is ready
     */
    isReady() {
        try {
            const ready = this.audioContext && this.audioContext.state === 'running';
            console.log('isReady called, result:', ready);
            return ready;
        } catch (error) {
            console.error('Error checking if audio is ready:', error);
            return false;
        }
    }
    
    /**
     * Try to resume the audio context
     * @returns {Promise} Promise that resolves when the context is resumed
     */
    resumeAudioContext() {
        console.log('resumeAudioContext called');
        if (!this.audioContext) {
            console.warn('Cannot resume: AudioContext not initialized');
            return Promise.resolve();
        }
        
        if (this.audioContext.state === 'suspended') {
            console.log('AudioContext is suspended, attempting to resume...');
            return this.audioContext.resume().then(() => {
                console.log('AudioContext resumed successfully, new state:', this.audioContext.state);
                
                // Call any callbacks waiting for audio to be ready
                if (this.audioContext.state === 'running' && this.onReadyCallbacks.length > 0) {
                    console.log(`Calling ${this.onReadyCallbacks.length} ready callbacks after resume`);
                    this.onReadyCallbacks.forEach(callback => callback());
                    this.onReadyCallbacks = [];
                }
                
                return Promise.resolve();
            }).catch(err => {
                console.error('Error resuming AudioContext:', err);
                return Promise.reject(err);
            });
        }
        console.log('AudioContext already running');
        return Promise.resolve();
    }
    
    /**
     * Play a simple test sound to verify audio is working
     */
    playTestSound() {
        console.log('playTestSound called');
        try {
            if (!this.audioContext) {
                console.error('Cannot play test sound: AudioContext not initialized');
                return;
            }
            
            console.log('Playing test sound...');
            
            // Resume audio context if it's suspended
            if (this.audioContext.state === 'suspended') {
                console.log('Audio context is suspended, attempting to resume...');
                this.resumeAudioContext().then(() => {
                    this._generateAndPlayTestSound();
                }).catch(err => {
                    console.error('Failed to resume audio context:', err);
                });
            } else {
                this._generateAndPlayTestSound();
            }
        } catch (error) {
            console.error('Error playing test sound:', error);
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
    }
    
    /**
     * Internal method to generate and play a test sound
     * @private
     */
    _generateAndPlayTestSound() {
        try {
            // Create oscillator
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
            
            // Create gain node for volume
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Start and stop
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 1);
            
            console.log('Test sound should be playing now');
        } catch (error) {
            console.error('Error generating test sound:', error);
        }
    }

    /**
     * Generate a player shoot sound
     * @returns {AudioBuffer} The generated sound as an AudioBuffer
     */
    generateShootSound() {
        console.log('generateShootSound called');
        if (!this.initialized) {
            console.log('Sound generator not initialized, initializing now');
            this.initialize();
        }

        try {
            const duration = 0.3;
            const sampleRate = this.audioContext.sampleRate;
            const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
            const data = buffer.getChannelData(0);

            // Create a laser-like sound
            for (let i = 0; i < buffer.length; i++) {
                // Frequency sweep from high to low
                const t = i / sampleRate;
                const frequency = 1000 - 700 * t;
                
                // Amplitude envelope (quick attack, slow decay)
                const envelope = Math.max(0, 1 - t / duration);
                
                // Generate sound
                data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
            }

            if (this.debugMode) {
                console.log('Generated shoot sound buffer:', buffer);
            }

            return buffer;
        } catch (error) {
            console.error('Error generating shoot sound:', error);
            return null;
        }
    }

    /**
     * Generate an enemy shoot sound
     * @returns {AudioBuffer} The generated sound as an AudioBuffer
     */
    generateEnemyShootSound() {
        if (!this.initialized) {
            this.initialize();
        }

        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a lower-pitched laser sound
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            // Frequency sweep from low to high
            const frequency = 300 + 200 * t;
            
            // Amplitude envelope
            const envelope = Math.max(0, 1 - t / duration);
            
            // Generate sound with some noise
            data[i] = (
                Math.sin(2 * Math.PI * frequency * t) * 0.7 + 
                (Math.random() * 2 - 1) * 0.3
            ) * envelope * 0.5;
        }

        return buffer;
    }

    /**
     * Generate an explosion sound
     * @returns {AudioBuffer} The generated sound as an AudioBuffer
     */
    generateExplosionSound() {
        if (!this.initialized) {
            this.initialize();
        }

        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create an explosion sound (noise with lowpass filter effect)
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Amplitude envelope (quick attack, medium decay)
            const envelope = Math.max(0, 1 - t / (duration * 0.8));
            
            // Generate noise
            const noise = Math.random() * 2 - 1;
            
            // Low frequency oscillation for rumble
            const lfo = Math.sin(2 * Math.PI * 8 * t) * 0.2;
            
            // Combine with lowpass filter effect (simulated by reducing high frequencies over time)
            const filterEffect = Math.max(0, 1 - t / (duration * 0.3));
            
            // Final sound
            data[i] = (noise * filterEffect + lfo) * envelope * 0.7;
        }

        return buffer;
    }

    /**
     * Generate a player hit sound
     * @returns {AudioBuffer} The generated sound as an AudioBuffer
     */
    generatePlayerHitSound() {
        if (!this.initialized) {
            this.initialize();
        }

        const duration = 0.4;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a player hit sound (combination of explosion and alarm)
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Amplitude envelope
            const envelope = Math.max(0, 1 - t / duration);
            
            // Noise component (explosion)
            const noise = Math.random() * 2 - 1;
            
            // Alarm component (oscillating tone)
            const alarm = Math.sin(2 * Math.PI * 440 * t) * Math.sin(2 * Math.PI * 5 * t);
            
            // Combine components
            data[i] = (noise * 0.5 + alarm * 0.5) * envelope * 0.6;
        }

        return buffer;
    }

    /**
     * Generate a game over sound
     * @returns {AudioBuffer} The generated sound as an AudioBuffer
     */
    generateGameOverSound() {
        if (!this.initialized) {
            this.initialize();
        }

        const duration = 1.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a sad descending tone
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Descending frequency
            const frequency1 = 300 * Math.pow(0.5, t);
            const frequency2 = 150 * Math.pow(0.5, t);
            
            // Amplitude envelope with slight tremolo
            const tremolo = 0.9 + 0.1 * Math.sin(2 * Math.PI * 8 * t);
            const envelope = Math.max(0, 1 - t / duration) * tremolo;
            
            // Generate sound with two frequencies
            data[i] = (
                Math.sin(2 * Math.PI * frequency1 * t) * 0.5 + 
                Math.sin(2 * Math.PI * frequency2 * t) * 0.5
            ) * envelope * 0.6;
        }

        return buffer;
    }

    /**
     * Generate a game win sound
     * @returns {AudioBuffer} The generated sound as an AudioBuffer
     */
    generateGameWinSound() {
        if (!this.initialized) {
            this.initialize();
        }

        const duration = 2.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a victory fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const noteDuration = duration / notes.length;

        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const noteIndex = Math.min(Math.floor(t / noteDuration), notes.length - 1);
            const noteTime = t - noteIndex * noteDuration;
            const frequency = notes[noteIndex];
            
            // Amplitude envelope for each note
            const envelope = Math.max(0, 1 - noteTime / noteDuration);
            
            // Add some harmonics
            const harmonic1 = Math.sin(2 * Math.PI * frequency * t);
            const harmonic2 = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.3;
            const harmonic3 = Math.sin(2 * Math.PI * frequency * 3 * t) * 0.1;
            
            // Combine harmonics
            data[i] = (harmonic1 + harmonic2 + harmonic3) * envelope * 0.5;
        }

        return buffer;
    }

    /**
     * Generate a background music loop
     * @returns {AudioBuffer} The generated sound as an AudioBuffer
     */
    generateBackgroundMusic() {
        if (!this.initialized) {
            this.initialize();
        }

        const duration = 4.0; // 4-second loop
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        // Create a simple 4-note bass pattern that loops
        const bassNotes = [100, 120, 80, 90]; // Bass frequencies
        const beatDuration = duration / bassNotes.length;
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const beatIndex = Math.floor((t % duration) / beatDuration);
            const beatTime = t % beatDuration;
            const bassFreq = bassNotes[beatIndex];
            
            // Bass drum on each beat
            const drumEnvelope = Math.max(0, 1 - beatTime * 10);
            const drum = (Math.random() * 2 - 1) * drumEnvelope * 0.3;
            
            // Bass note with envelope
            const bassEnvelope = Math.max(0, 1 - beatTime / beatDuration);
            const bass = Math.sin(2 * Math.PI * bassFreq * t) * bassEnvelope * 0.4;
            
            // Add tension with increasing tempo
            const tension = Math.sin(2 * Math.PI * (2 + beatIndex) * t) * 0.1;
            
            // Combine sounds
            data[i] = bass + drum + tension;
        }

        return buffer;
    }

    /**
     * Play a generated sound
     * @param {AudioBuffer} buffer - The sound buffer to play
     * @param {number} volume - Volume level (0.0 to 1.0)
     * @param {boolean} loop - Whether to loop the sound
     * @returns {Object} An object with controls for the sound
     */
    playSound(buffer, volume = 1.0, loop = false) {
        console.log('playSound called with buffer:', buffer ? 'valid buffer' : 'null buffer', 'volume:', volume, 'loop:', loop);
        
        if (!this.initialized) {
            console.warn('Cannot play sound: audio not initialized');
            return {
                source: null,
                gainNode: null,
                stop: () => {}
            };
        }
        
        if (!buffer) {
            console.warn('Cannot play sound: buffer is null');
            return {
                source: null,
                gainNode: null,
                stop: () => {}
            };
        }

        try {
            // Resume audio context if it's suspended (needed for Chrome's autoplay policy)
            if (this.audioContext.state === 'suspended') {
                console.log('Audio context is suspended, attempting to resume...');
                this.resumeAudioContext().then(() => {
                    console.log('AudioContext resumed successfully');
                    // Try playing the sound again after resuming
                    return this._createAndPlaySound(buffer, volume, loop);
                }).catch(err => {
                    console.error('Failed to resume audio context:', err);
                    return {
                        source: null,
                        gainNode: null,
                        stop: () => {}
                    };
                });
            } else {
                return this._createAndPlaySound(buffer, volume, loop);
            }
            
            // Default return in case the above code doesn't return
            return {
                source: null,
                gainNode: null,
                stop: () => {}
            };
        } catch (error) {
            console.error('Error playing sound:', error);
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
            return {
                source: null,
                gainNode: null,
                stop: () => {}
            };
        }
    }
    
    /**
     * Internal method to create and play a sound
     * @private
     */
    _createAndPlaySound(buffer, volume, loop) {
        try {
            // Create source node
            console.log('Creating buffer source node');
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.loop = loop;
            
            // Create gain node for volume control
            console.log('Creating gain node with volume:', volume);
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume;
            
            // Connect nodes
            console.log('Connecting audio nodes');
            source.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            // Start playback
            console.log('Starting audio playback');
            source.start();
            
            if (this.debugMode) {
                console.log('Playing sound:', { 
                    volume, 
                    loop, 
                    buffer: {
                        duration: buffer.duration,
                        numberOfChannels: buffer.numberOfChannels,
                        sampleRate: buffer.sampleRate,
                        length: buffer.length
                    }
                });
            }
            
            // Return controls
            return {
                source,
                gainNode,
                stop: () => {
                    try {
                        source.stop();
                        if (this.debugMode) {
                            console.log('Sound stopped');
                        }
                    } catch (e) {
                        // Ignore errors if already stopped
                        if (this.debugMode) {
                            console.warn('Error stopping sound:', e);
                        }
                    }
                }
            };
        } catch (error) {
            console.error('Error creating and playing sound:', error);
            return {
                source: null,
                gainNode: null,
                stop: () => {}
            };
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setMasterVolume(volume) {
        console.log('setMasterVolume called with volume:', volume);
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
            if (this.debugMode) {
                console.log('Master volume set to:', volume);
            }
        } else {
            console.warn('Cannot set volume: master gain node not initialized');
        }
    }

    /**
     * Mute or unmute all sounds
     * @param {boolean} muted - Whether to mute sounds
     */
    setMuted(muted) {
        console.log('setMuted called with muted:', muted);
        this.setMasterVolume(muted ? 0 : 1);
        if (this.debugMode) {
            console.log('Audio muted:', muted);
        }
    }
} 