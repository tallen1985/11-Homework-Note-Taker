const express = require('express');
const fs = require('fs');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3001;
const rawData = fs.readFileSync('./db/db.json', 'utf8')
    let db = JSON.parse(rawData)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/api/notes', (req, res) => {
    res.json(db)
})

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: Date.now().toString()
        }

        db.push(newNote)

        const stringDb = JSON.stringify(db);
        fs.writeFileSync('./db/db.json', stringDb)
        
        console.log(`${newNote.title} added to list`)
        res.status(200).send('note added successfully');
        }
    })

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    if (noteId) {
        const filteredDb = db.filter(note => note.id != noteId)
        db = filteredDb
        const stringDb = JSON.stringify(db);
        console.log(db)
        fs.writeFileSync('./db/db.json', stringDb)
        
        res.status(200).send(`Deleted note ${noteId}`)
    }
})

app.listen(PORT, () => {
    console.log(`Server started and ready at http://localhost:${PORT}`);
})