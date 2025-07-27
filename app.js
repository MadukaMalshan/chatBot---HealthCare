function appendMessage(text, sender) {
    const answersDiv = document.getElementById('answers');
    const bubble = document.createElement('div');
    bubble.className = `bubble ${sender}`;
    bubble.innerHTML = text;
    answersDiv.appendChild(bubble);
    answersDiv.scrollTop = answersDiv.scrollHeight;
}

function sendText() {
    const input = document.getElementById('userInput');
    const userText = input.value.trim();
    if (!userText) return;
    appendMessage(userText, 'user');
    input.value = '';
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
        const botReply = marked.parse(result.candidates[0].content.parts[0].text);
        appendMessage(botReply, 'ai');
      })
      .catch((error) => console.error(error));
  }


const userInput = document.getElementById('userInput');
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendText();
    }
});