const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/inventory.db');

// Add a new book
router.post('/add', (req, res) => {
    const { title, author, genre, publication_date, isbn } = req.body;
    db.run(`INSERT INTO inventory (title, author, genre, publication_date, isbn)
            VALUES (?, ?, ?, ?, ?)`,
        [title, author, genre, publication_date, isbn], 
        (err) => {
            if (err) {
                return res.status(500).send('Error adding book');
            }
            res.send('Book added successfully');
        });
});

// Filter books
router.get('/filter', (req, res) => {
    const { title, author, genre } = req.query;
    let query = `SELECT * FROM inventory WHERE 1=1`;
    let params = [];

    if (title) {
        query += ` AND title LIKE ?`;
        params.push(`%${title}%`);
    }
    if (author) {
        query += ` AND author LIKE ?`;
        params.push(`%${author}%`);
    }
    if (genre) {
        query += ` AND genre = ?`;
        params.push(genre);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send('Error fetching books');
        }
        res.json(rows);
    });
});

// Export books as CSV or JSON
router.get('/export/:format', (req, res) => {
    const format = req.params.format;
    db.all(`SELECT * FROM inventory`, (err, rows) => {
        if (err) {
            return res.status(500).send('Error fetching books');
        }

        if (format === 'csv') {
            const csvData = rows.map(row => Object.values(row).join(',')).join('\n');
            res.header('Content-Type', 'text/csv');
            res.attachment('books.csv');
            return res.send(csvData);
        } else if (format === 'json') {
            res.json(rows);
        } else {
            res.status(400).send('Unsupported format');
        }
    });
});

module.exports = router;
