const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('.'));


// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '',       
  database: 'reddit_clone'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Fetch all posts
app.get('/api/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Create a new post
// Create a new post
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  db.query('INSERT INTO posts (title, content, likes) VALUES (?, ?, ?)', [title, content, 0], (err, result) => {
      if (err) throw err;
      // Fetch the newly created post
      db.query('SELECT * FROM posts WHERE id = ?', [result.insertId], (err, results) => {
          if (err) throw err;
          // Ensure likes is explicitly set to 0
          const postWithLikes = {
              ...results[0],
              likes: results[0].likes !== null ? results[0].likes : 0
          };
          res.status(201).json(postWithLikes);
      });
  });
});



// Create a new endpoint to like a post
app.post('/api/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], (err) => {
      if (err) throw err;
      res.status(200).json({ message: 'Post liked successfully' });
  });
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.query('DELETE FROM posts WHERE id = ?', [postId], (err) => {
      if (err) throw err;
      res.status(200).json({ message: 'Post deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
