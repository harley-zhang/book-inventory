const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const db = new sqlite3.Database('./db/inventory.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create inventory table if not exists
db.run(`CREATE TABLE IF NOT EXISTS inventory (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    publication_date TEXT,
    isbn TEXT UNIQUE NOT NULL
);`);

const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
