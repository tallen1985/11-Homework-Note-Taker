//Importing modules
const express = require('express');
const fs = require('fs');
const path = require('path')

//Global variable declarations
const app = express();
const PORT = process.env.PORT || 3001;
let db;


//Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//Get Routes 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})



app.get('/api/notes', (req, res) => {
    const rawData = fs.readFileSync('./db/db.json', 'utf8')
    db = JSON.parse(rawData);
    res.json(db)
})

app.get('/*', (req, res) => {
    res.send(path.join(__dirname, 'public/index.html'))
})
//Post Routes
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


//Delete Routes
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    if (noteId) {
        const filteredDb = db.filter(note => note.id != noteId)
        db = filteredDb
        const stringDb = JSON.stringify(db);
        fs.writeFileSync('./db/db.json', stringDb)
        console.log(`Note Id:${noteId} successfully deleted.`)
        res.status(200).send(`Deleted note ${noteId}`)
    }
})

app.listen(PORT, () => {
    console.log(`Server started and ready at http://localhost:${PORT}`);
})