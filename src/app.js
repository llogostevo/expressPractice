// dotenv import
require('dotenv').config();
// nodemailer import
const nodemailer = require('nodemailer');
// bodyparser import
const bodyParser = require('body-parser');
// express import
const express = require('express');
const path = require('path');
// mustache tempalte libary import
const mustacheExpress = require('mustache-express')

// contents of the jobs file is being stored under the variable JOBS
const JOBS = require('./jobs');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

// used to connect to and send an email
const transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 465,
    secure: true,
    auth: {
        user:process.env.EMAIL_ID,
        pass:process.env.EMAIL_PASSWORD
    }
});


// configure mustache
app.set('views', `${__dirname}/pages`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

// Render the template for Index Route
app.get('/', (req, res)=> {
    res.render('index', {jobs:JOBS});
});

// Route for jobs with a job id
app.get('/jobs/:id', (req, res) => {
    const id = req.params.id;
    const matchedJob = JOBS.find(job=> job.id.toString() === id);
    res.render('job', {job: matchedJob});
});

app.post('/jobs/:id/apply', (req, res) => {
    console.log('req.body', req.body);
    const {name, email, phone, dob, position, coverletter} = req.body;

    // console.log('New Application', {name, email, phone, dob, position, coverletter });
    const matchedJob = JOBS.find(job => job.id.toString() === id);

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: process.env.EMAIL_ID, 
        subject: `New Application for ${matchedJob.title}`, 
        html: `
        <p><strong>Name: </strong>${name}</p>
        <p><strong>Email: </strong>${email}</p>
        <p><strong>Phone: </strong>${phone}</p>
        <p><strong>DOB: </strong>${dob}</p>
        <p><strong>Cover Letter: </strong>${coverletter}</p>`

    };
    transporter.sendMail(mailOptions, (error, info)=> {
        if (error) {
            console.log(error);
            res.status(500). send('Error sending mail'); 
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully')
        }
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https:localhost:${port}`)
});

