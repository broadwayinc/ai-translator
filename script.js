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
                model: 'text-davinci-003',
                prompt: `Translate the following text to ${targetLang}: ${userText}`,
                max_tokens: 100,
                temperature: 0.3
            }
        });
        const translation = response.choices[0].text.trim();
        chatbox.lastChild.textContent = translation;
    } catch(err) {
        chatbox.lastChild.textContent = 'Error: ' + err.message;
    }
});
