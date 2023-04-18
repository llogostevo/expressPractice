const express = require('express');
const path = require('path');

const app = express();

// take everything from the public folder and send it the browser when requested. 
app.use(express.static(path.join(__dirname, 'public')));

// get the index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https:localhost:${port}`)
});

