const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(64).toString('hex');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: sessionSecret, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

let smtpUser = null;
let smtpPass = null;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); 
});

app.get('/email', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/'); 
    }
    res.sendFile(path.join(__dirname, 'public', 'email.html')); 
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        req.session.loggedIn = true; 
        smtpUser = email;  
        smtpPass = password; 

        transporter = nodemailer.createTransport({
            host: 'poczta.interia.pl',
            port: 587,
            secure: false,
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        return res.status(200).send({ message: 'Logged in successfully' });
    }

    res.status(400).send({ message: 'Invalid login details' });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ message: 'Error during logout', error: err });
        }
        res.redirect('/'); 
    });
});

let transporter = nodemailer.createTransport({
    host: 'poczta.interia.pl',
    port: 587,
    secure: false,
    auth: {
        user: smtpUser,
        pass: smtpPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/send-email', (req, res) => {
    if (!req.session.loggedIn || smtpUser === null || smtpPass === null) {
        return res.status(401).send({ message: 'You must be logged in' });
    }

    const { to, subject, text } = req.body;

    const mailOptions = {
        from: smtpUser,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send({ message: 'Error sending email', error });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).send({ message: 'Email sent successfully', info });
    });
});

app.get('/user-email', (req, res) => {
    if (!req.session.loggedIn || !smtpUser) {
        return res.status(401).send({ message: 'Not logged in' });
    }
    res.json({ email: smtpUser });
});

const PORT = 2137;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
