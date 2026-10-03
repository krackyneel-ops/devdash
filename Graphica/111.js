/* ==========================================================
   KHETCONNECT - INTERACTIVE VET DOCTOR CHAT SYSTEM
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chatBody');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const voiceBtn = document.getElementById('voiceBtn');

    // Get current time formatted (e.g., "10:18 AM")
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    // Scroll chat to the bottom smoothly
    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Send User Message
    function sendMessage() {
        const text = messageInput.value.trim();
        if (text === '') return;

        // 1. Create and append outgoing bubble
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'message outgoing';
        userMsgDiv.innerHTML = `
            <div class="msg-bubble">
                <p>${escapeHTML(text)}</p>
                <span class="msg-time">${getCurrentTime()} <span class="checkmarks">✓✓</span></span>
            </div>
        `;
        // Insert before the typing indicator
        chatBody.insertBefore(userMsgDiv, typingIndicator);
        messageInput.value = '';
        scrollToBottom();

        // 2. Trigger Doctor Typing and Auto-Response
        triggerDoctorResponse(text);
    }

    // Doctor Auto-Response Logic
    function triggerDoctorResponse(userText) {
        typingIndicator.style.display = 'flex';
        scrollToBottom();

        setTimeout(() => {
            typingIndicator.style.display = 'none';

            let doctorReply = "Kripya apne pashu (cow/buffalo) ke baare me thoda aur batayein: kya pashu ko bukhar hai ya chara bilkul nahi kha raha?";
            const lower = userText.toLowerCase();

            if (lower.includes('chara') || lower.includes('eating') || lower.includes('गाय')) {
                doctorReply = "Agar pashu chara nahi kha raha hai, toh kripya uska taapman (temperature) check karein. Saath hi pait me gas (bloat) toh nahi hai? Aap chahein toh ek video photo bhej sakte hain.";
            } else if (lower.includes('bukhar') || lower.includes('fever')) {
                doctorReply = "Bukhar me pashu ko taaza paani pilayein aur chhaon me rakhein. Turant Paracetamol bolus (veterinary grade) pashu chikitsak ki dekh-rekh me dein. Main abhi prescription generate kar raha hoon.";
            } else if (lower.includes('doodh') || lower.includes('milk')) {
                doctorReply = "Doodh kam hone par calcium deficiency ya mastitis (thanela) ho sakta hai. Kripya than (udders) me koi sujan ya laali toh nahi hai, check karein.";
            }

            const docMsgDiv = document.createElement('div');
            docMsgDiv.className = 'message incoming';
            docMsgDiv.innerHTML = `
                <div class="msg-bubble">
                    <p>${doctorReply}</p>
                    <span class="msg-time">${getCurrentTime()}</span>
                </div>
            `;
            chatBody.insertBefore(docMsgDiv, typingIndicator);
            scrollToBottom();
        }, 1500);
    }

    // Enter Key Trigger
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    // Voice Record Button simulation
    let isRecording = false;
    voiceBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        if (isRecording) {
            voiceBtn.style.color = '#ef4444';
            voiceBtn.style.transform = 'scale(1.2)';
            messageInput.placeholder = '🎙️ Recording voice note... (Click mic to send)';
        } else {
            voiceBtn.style.color = '';
            voiceBtn.style.transform = '';
            messageInput.placeholder = 'Enter your message or ask Dr. Kulkarni...';
            
            // Send mock voice note
            const voiceMsg = document.createElement('div');
            voiceMsg.className = 'message outgoing';
            voiceMsg.innerHTML = `
                <div class="msg-bubble">
                    <p>🎵 <em>Voice Note (0:08)</em></p>
                    <span class="msg-time">${getCurrentTime()} <span class="checkmarks">✓✓</span></span>
                </div>
            `;
            chatBody.insertBefore(voiceMsg, typingIndicator);
            scrollToBottom();
            triggerDoctorResponse("voice note");
        }
    });

    // Helper: Prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Expose quick reply tag sender to global scope
    window.sendQuickText = function(text) {
        messageInput.value = text;
        sendMessage();
    };
});