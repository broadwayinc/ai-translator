const chatbox = document.getElementById('chatbox');
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const languageSelect = document.getElementById('language');

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.className = 'message ' + className;
    div.textContent = text;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if(!userText) return;
    appendMessage(userText, 'user');
    input.value = '';

    const targetLang = languageSelect.value;
    appendMessage('Translating...', 'bot');

    try {
        const response = await skapi.clientSecretRequest({
            clientSecretName: 'translator',
            url: 'https://api.openai.com/v1/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer $CLIENT_SECRET'
            },
            data: {
                model: 'gpt-3.5-turbo-instruct',
                prompt: `Translate the following text to ${targetLang}: ${userText}`,
                max_tokens: 100,
                temperature: 0.3
            }
        });
        if (response && Array.isArray(response.choices) && response.choices[0] && typeof response.choices[0].text === 'string') {
            const translation = response.choices[0].text.trim();
            chatbox.lastChild.textContent = translation;
        }
        else if (response && response.error && response.error.message) {
            chatbox.lastChild.textContent = 'Error: ' + response.error.message;
        }
        else {
            chatbox.lastChild.textContent = 'Error: Unexpected response from server';
        }
    } catch(err) {
        chatbox.lastChild.textContent = 'Error: ' + err.message;
    }
});
