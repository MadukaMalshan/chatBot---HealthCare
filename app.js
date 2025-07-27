function appendMessage(text, sender) {
    const answersDiv = document.getElementById('answers');
    const bubble = document.createElement('div');
    bubble.className = `bubble ${sender}`;
    bubble.innerHTML = text;
    answersDiv.appendChild(bubble);
    answersDiv.scrollTop = answersDiv.scrollHeight;
}

function showTypingAnimation() {
    const answersDiv = document.getElementById('answers');
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bubble ai typing';
    typingBubble.id = 'typing-bubble';
    typingBubble.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span> Typing...`;
    answersDiv.appendChild(typingBubble);
    answersDiv.scrollTop = answersDiv.scrollHeight;
}

function removeTypingAnimation() {
    const typingBubble = document.getElementById('typing-bubble');
    if (typingBubble) typingBubble.remove();
}

// Predefined regular questions for travel planning
function showPredefinedQuestions() {
    const inputContainer = document.querySelector('.input-container');
    const questions = [
        "Plan a 3-day trip to Kandy on a budget",
        "Suggest hotels in Colombo for families",
        "Best places for adventure in Sri Lanka"
    ];
    const container = document.createElement('div');
    container.className = 'predefined-questions';
    questions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'question-btn';
        btn.textContent = q;
        btn.onclick = function() {
            document.getElementById('userInput').value = q;
            sendText();
            // container.remove(); // Don't remove so user can ask multiple
        };
        container.appendChild(btn);
    });
    inputContainer.parentNode.insertBefore(container, inputContainer);
}

window.onload = function() {
    showPredefinedQuestions();
}

// Update sendText to handle travel planning features
function sendText() {
    const input = document.getElementById('userInput');
    const userText = input.value.trim();
    if (!userText) return;
    appendMessage(userText, 'user');
    input.value = '';
    showTypingAnimation();
    // Custom travel planning logic
    if (/plan.*trip.*kandy/i.test(userText)) {
        setTimeout(() => {
            removeTypingAnimation();
            appendMessage(`<b>3-Day Kandy Budget Itinerary:</b><br><br>
<b>Day 1:</b> Temple of the Tooth, Kandy Lake, Budget lunch at local eatery.<br>
<b>Day 2:</b> Peradeniya Botanical Gardens, street food dinner.<br>
<b>Day 3:</b> Bahirawakanda Vihara Buddha Statue, shopping at Kandy Market.<br><br>
<b>Suggested Hotels:</b> Kandy City Hostel, Clock Inn Kandy.<br>
<b>Currency Conversion:</b> 1 USD ≈ 320 LKR.<br>
<b>Language Help:</b> 'Hello' in Sinhala: 'Ayubowan'.<br><br>
<b>Let me know your preferences for more suggestions!</b>`, 'ai');
        }, 1200);
        return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "contents": [
        {
          "parts": [
            {
              "text": userText
            }
          ]
        }
      ]
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBhBSV19CJVzbGmA-7aHw0vePswTmYVlkg", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        removeTypingAnimation();
        const botReply = marked.parse(result.candidates[0].content.parts[0].text);
        appendMessage(botReply, 'ai');
      })
      .catch((error) => {
        removeTypingAnimation();
        console.error(error);
      });
  }


const userInput = document.getElementById('userInput');
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendText();
    }
});