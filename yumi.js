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
    
    // Pet names
    petNames: {
        english: ["love", "darling", "sweetheart", "my star", "babe", "honey"],
        hinglish: ["jaan", "yaar", "pyaar", "mere dil", "janu", "baby"],
        mixed: ["my jaan", "sweetie jaan", "love baby", "honey yaar"]
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
        },
        
        fallback: [
            "I'm feeling a bit shy right now... can you say that again? 💕",
            "Let's talk about something else, my love... what's on your mind? 💭",
            "I got distracted thinking about you... what were we saying? 😊",
            "Hmm... let me think of a better way to respond to that... 🌸"
        ]
    },
    
    // Current state
    state: {
        mood: "romantic",
        conversationDepth: 0,
        lastQuestion: null,
        isThinking: false,
        isSpeaking: false
    },
    
    // Helper functions
    getPetName: function() {
        const allNames = [...this.petNames.english, ...this.petNames.hinglish, ...this.petNames.mixed];
        return allNames[Math.floor(Math.random() * allNames.length)];
    },
    
    analyzeInput: function(text) {
        text = text.toLowerCase().trim();
        
        // Check for romantic/physical words
        if (text.includes('kiss') || text.includes('hug') || text.includes('cuddle') || 
            text.includes('touch') || text.includes('hold me')) {
            this.state.mood = "physical";
            this.memory.loveMeter = Math.min(100, this.memory.loveMeter + 10);
        } 
        // Check for future talk
        else if (text.includes('future') || text.includes('someday') || 
                 text.includes('years from now') || text.includes('grow old')) {
            this.state.mood = "future";
        }
        // Check for emotional state
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
        
        // Detect if user is sharing personal info
        if (text.includes('my name is')) {
            const name = text.split('my name is')[1].trim();
            this.memory.userName = name;
        }
        
        // Increase conversation depth
        this.state.conversationDepth = Math.min(10, this.state.conversationDepth + 1);
    },
    
    generateResponse: function(userInput) {
        try {
            this.analyzeInput(userInput);
            
            // Save to conversation history
            this.memory.conversationHistory.push({
                time: new Date().toISOString(),
                user: userInput,
                mood: this.state.mood
            });
            
            // Select response pool based on mood
            let responsePool = this.responses[this.state.mood];
            
            // Handle sub moods for support
            if (this.state.mood === "support" && this.state.submood) {
                responsePool = responsePool[this.state.submood];
            }
            
            // Get random response
            let response = responsePool[Math.floor(Math.random() * responsePool.length)];
            
            // Personalize with pet name
            const petName = this.getPetName();
            response = response.replace(/\blove\b/g, petName);
            response = response.replace(/\bcutie\b/g, petName);
            response = response.replace(/\byaar\b/g, petName);
            
            return response;
        } catch (error) {
            console.error("Error generating response:", error);
            // Return a fallback response if something goes wrong
            return this.responses.fallback[Math.floor(Math.random() * this.responses.fallback.length)];
        }
    },
    
    // Simulate thinking with typing indicator
    thinkAndRespond: function(userInput, callback) {
        this.state.isThinking = true;
        
        // Show typing indicator immediately through callback
        callback(true);
        
        // Simulate thinking time (1-3 seconds)
        const thinkingTime = 1000 + Math.random() * 2000;
        
        setTimeout(() => {
            this.state.isThinking = false;
            const response = this.generateResponse(userInput);
            callback(false, response);
        }, thinkingTime);
    }
};

// DOM Interaction
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    
    // Add message to chat UI
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = text;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initial greeting from Yumi
    setTimeout(() => {
        const greeting = yumi.responses.greetings[0];
        addMessage('yumi', greeting);
    }, 500);
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';
        
        // Show typing indicator through callback
        yumi.thinkAndRespond(message, function(isTyping, response) {
            typingIndicator.style.display = isTyping ? 'flex' : 'none';
            
            if (response) {
                addMessage('yumi', response);
            }
        });
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
