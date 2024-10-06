// Add book form handler
document.getElementById('addBookForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value,
        publication_date: document.getElementById('publication_date').value,
        isbn: document.getElementById('isbn').value,
    };

    fetch('/books/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(err => console.error('Error:', err));
});

// Filter form handler
document.getElementById('filterForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
        title: document.getElementById('filterTitle').value,
        author: document.getElementById('filterAuthor').value,
        genre: document.getElementById('filterGenre').value,
    }).toString();

    fetch(`/books/filter?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            const bookList = document.querySelector('#bookList tbody');
            bookList.innerHTML = '';
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${book.title}</td>
                                 <td>${book.author}</td>
                                 <td>${book.genre}</td>
                                 <td>${book.publication_date}</td>
                                 <td>${book.isbn}</td>`;
                bookList.appendChild(row);
            });
        })
        .catch(err => console.error('Error:', err));
});

// Export books
function exportBooks(format) {
    window.location.href = `/books/export/${format}`;
}

// Function to refresh and display all books
function refreshBookList() {
    fetch('/books/filter')
        .then(response => response.json())
        .then(data => {
            const bookList = document.querySelector('#bookList tbody');
            bookList.innerHTML = '';  // Clear current list
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${book.title}</td>
                                 <td>${book.author}</td>
                                 <td>${book.genre}</td>
                                 <td>${book.publication_date}</td>
                                 <td>${book.isbn}</td>`;
                bookList.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching books:', err));
}

// Hook up the refresh button
document.getElementById('refreshButton').addEventListener('click', refreshBookList);

// Optionally, call refreshBookList on page load to display all books initially
window.onload = refreshBookList;
