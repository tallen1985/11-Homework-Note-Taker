const express = require('express');
const path = require('path')
const db = require('./db/db.json')

const app = express();
const PORT = 3001;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/api/notes', (req, res) => {
    console.log(db)
    res.json(db)
})

app.post('/api/notes', (req, res) => {
    console.log('request is ' + req.body)
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})


app.listen(PORT, () => {
    console.log(`Server started and ready at http://localhost:${PORT}`);
})