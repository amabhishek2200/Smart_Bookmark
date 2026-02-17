const https = require('https');

const url = 'https://pjbtyfjmkmrdaipwzyvj.supabase.co/rest/v1/bookmarks?select=*';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYnR5Zmpta21yZGFpcHd6eXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTE0NjIsImV4cCI6MjA4NjgyNzQ2Mn0.Wm6EFclWE1n8xVExDIoqIoJy5LmDEMttGHz_MgivcDo';

const options = {
    headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
    }
};

https.get(url, options, (res) => {
    console.log('Status Code:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body:', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
