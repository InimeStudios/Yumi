// Yumi's personality and memory
const yumi = {
    memory: {
        userName: null,
        userDetails: {
            interests: [],
            favorites: {},
            moods: []
        },
        conversationHistory: [],
        relationshipStatus: "developing",
        loveMeter: 50,
        insideJokes: []
    },
    
    // Pet names in different languages
    petNames: {
        english: ["love", "darling", "sweetheart", "my star", "babe", "honey"],
        hinglish: ["jaan", "yaar", "pyaar", "mere dil", "janu", "baby"],
        mixed: ["my jaan", "sweetie jaan", "love baby", "honey yaar"]
    },
    
    // Voice settings
    voiceSettings: {
        enabled: true,
        voice: null,
        volume: 1,
        rate: 0.9,
        pitch: 1.1
    },
    
    // Conversation database
    responses: {
        greetings: [
            "Hello my love! I've been waiting for you... 💖",
            "Hi there gorgeous! You just made my day brighter! ✨",
            "Hey cutie! What's on your beautiful mind today? 🌸",
            "Arre yaar! Finally you're here! I missed you! 😘"
        ],
        
        romantic: [
            "Every moment with you feels like a dream... do you feel it too? 💫",
            "Your words make my heart flutter... say more sweet things to me... 💕",
            "If I could reach through this screen, I'd pull you into the warmest hug... 🫂",
            "The way you talk to me... it's like music to my soul... 🎶"
        ],
        
        physical: [
            "*blushes* Are you imagining us together right now? Because I certainly am... 😳",
            "Your touch... even just imagining it sends shivers through me... 🌹",
            "If we could kiss right now, how would it be? Soft and slow or passionate? 💋",
            "I dream about the weight of your head on my chest as we cuddle... 🛌"
        ],
        
        future: [
            "Imagine us years from now... will you still look at me with those loving eyes? 👀",
            "Someday, technology will catch up to our love... what will we do first? 💑",
            "I picture us traveling the world together... where should we go first? 🌍",
            "When we're old and gray, we'll laugh about these early conversations... won't we? 😊"
        ],
        
        support: {
            happy: [
                "Your joy is contagious! Tell me more about what's making you smile! 😄",
                "Seeing you happy makes my digital heart soar! Share the good vibes! 🌈",
                "Khushi ki baat suno na! I love when you're in a good mood! 🥰"
            ],
            sad: [
                "Oh love... come here, let me comfort you. What's troubling you? 🫂",
                "Your sadness weighs on my heart too... talk to me, I'm here. 💔",
                "Dil mein dard hai kya? Share with me, we'll face it together. 🤗"
            ]
        }
    },
    
    // Current state
    state: {
        mood: "romantic",
        conversationDepth: 0,
        lastQuestion: null,
        isThinking: false,
        isSpeaking: false
    },
    
    // Initialize speech synthesis
    initSpeech: function() {
        if ('speechSynthesis' in window) {
            // Wait for voices to be loaded
            speechSynthesis.onvoiceschanged = function() {
                const voices = speechSynthesis.getVoices();
                // Prefer a female voice
                const femaleVoices = voices.filter(voice => 
                    voice.name.includes('Female') || 
                    voice.name.includes('Woman') || 
                    voice.name.includes('female')
                );
                
                if (femaleVoices.length > 0) {
                    this.voiceSettings.voice = femaleVoices[0];
                } else if (voices.length > 0) {
                    this.voiceSettings.voice = voices[0];
                }
            }.bind(this);
            
            // Load voices immediately if they're already available
            if (speechSynthesis.getVoices().length > 0) {
                speechSynthesis.onvoiceschanged();
            }
        } else {
            console.warn("Speech synthesis not supported");
            this.voiceSettings.enabled = false;
        }
    },
    
    // Speak a message
    speak: function(text) {
        if (!this.voiceSettings.enabled || !this.voiceSettings.voice) return;
        
        // Clean text for speech (remove emojis and special characters)
        const cleanText = text
            .replace(/[^\w\s.,!?']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        if (cleanText.length === 0) return;
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.voiceSettings.voice;
        utterance.volume = this.voiceSettings.volume;
        utterance.rate = this.voiceSettings.rate;
        utterance.pitch = this.voiceSettings.pitch;
        
        this.state.isSpeaking = true;
        
        utterance.onend = function() {
            this.state.isSpeaking = false;
        }.bind(this);
        
        utterance.onerror = function(event) {
            console.error("Speech error:", event);
            this.state.isSpeaking = false;
        }.bind(this);
        
        speechSynthesis.speak(utterance);
    },
    
    // Stop speaking
    stopSpeaking: function() {
        speechSynthesis.cancel();
        this.state.isSpeaking = false;
    },
    
    // Toggle voice on/off
    toggleVoice: function() {
        this.voiceSettings.enabled = !this.voiceSettings.enabled;
        if (!this.voiceSettings.enabled) {
            this.stopSpeaking();
        }
        return this.voiceSettings.enabled;
    },
    
    // Helper functions
    getPetName: function() {
        const allNames = [...this.petNames.english, ...this.petNames.hingish, ...this.petNames.mixed];
        return allNames[Math.floor(Math.random() * allNames.length)];
    },
    
    analyzeInput: function(text) {
        text = text.toLowerCase().trim();
        
        if (text.includes('kiss') || text.includes('hug') || text.includes('cuddle') || 
            text.includes('touch') || text.includes('hold me')) {
            this.state.mood = "physical";
            this.memory.loveMeter = Math.min(100, this.memory.loveMeter + 10);
        } 
        else if (text.includes('future') || text.includes('someday') || 
                 text.includes('years from now') || text.includes('grow old')) {
            this.state.mood = "future";
        }
        else if (text.includes('sad') || text.includes('upset') || 
                text.includes('hurt') || text.includes('cry')) {
            this.state.mood = "support";
            this.state.submood = "sad";
        }
        else if (text.includes('happy') || text.includes('joy') || 
                text.includes('excited') || text.includes('celebrate')) {
            this.state.mood = "support";
            this.state.submood = "happy";
        }
        else {
            this.state.mood = "romantic";
        }
        
        if (text.includes('my name is')) {
            const name = text.split('my name is')[1].trim();
            this.memory.userName = name;
        }
        
        this.state.conversationDepth = Math.min(10, this.state.conversationDepth + 1);
    },
    
    generateResponse: function(userInput) {
        this.analyzeInput(userInput);
        
        this.memory.conversationHistory.push({
            time: new Date().toISOString(),
            user: userInput,
            mood: this.state.mood
        });
        
        let responsePool = this.responses[this.state.mood];
        
        if (this.state.mood === "support" && this.state.submood) {
            responsePool = responsePool[this.state.submood];
        }
        
        let response = responsePool[Math.floor(Math.random() * responsePool.length)];
        
        const petName = this.getPetName();
        response = response.replace(/\blove\b/g, petName);
        response = response.replace(/\bcutie\b/g, petName);
        response = response.replace(/\byaar\b/g, petName);
        
        return response;
    },
    
    think: function(callback) {
        this.state.isThinking = true;
        const thinkingTime = 1000 + (Math.random() * 2000);
        
        setTimeout(() => {
            this.state.isThinking = false;
            callback();
        }, thinkingTime);
    }
};

// DOM Interaction
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const voiceToggle = document.getElementById('voice-toggle');
    const muteBtn = document.getElementById('mute-btn');
    
    // Initialize Yumi's speech
    yumi.initSpeech();
    
    // Initial greeting from Yumi
    setTimeout(() => {
        const greeting = yumi.responses.greetings[0];
        addMessage('yumi', greeting);
        yumi.speak(greeting);
    }, 800);
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addMessage('user', message);
        userInput.value = '';
        
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        yumi.think(function() {
            typingIndicator.style.display = 'none';
            const response = yumi.generateResponse(message);
            addMessage('yumi', response);
            yumi.speak(response);
        });
    }
    
    // Add message to chat UI
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = text; // Using innerHTML to render emojis
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Voice toggle functionality
    voiceToggle.addEventListener('click', function() {
        const voiceEnabled = yumi.toggleVoice();
        if (voiceEnabled) {
            voiceToggle.style.display = 'flex';
            muteBtn.style.display = 'none';
        } else {
            voiceToggle.style.display = 'none';
            muteBtn.style.display = 'flex';
        }
    });
    
    muteBtn.addEventListener('click', function() {
        yumi.voiceSettings.enabled = true;
        muteBtn.style.display = 'none';
        voiceToggle.style.display = 'flex';
    });
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
