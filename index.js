const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3036;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password', // Replace with your MySQL password
    database: 'todo_list'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// API Routes
// Create a new task
// app.post('/tasks', (req, res) => {
//     const { description, due_date } = req.body;
//     const query = 'INSERT INTO tasks (description, due_date) VALUES (?, ?)';
//     db.query(query, [description, due_date], (err, results) => {
//         if (err) {
//             console.error('Error adding task:', err.stack);
//             res.status(500).json({ error: 'Failed to add task' });
//             return;
//         }
//         res.status(201).json({ message: 'Task added successfully', taskId: results.insertId });
//     });
// });



app.post('/tasks', (req, res) => {
    const { description, due_date } = req.body;
    console.log('Received task:', description, due_date); // Log received data
    const query = 'INSERT INTO tasks (description, due_date) VALUES (?, ?)';
    db.query(query, [description, due_date], (err, results) => {
        if (err) {
            console.error('Error adding task:', err.stack);
            res.status(500).json({ error: 'Failed to add task' });
            return;
        }
        console.log('Task added successfully:', results); // Log success
        res.status(201).json({ message: 'Task added successfully', taskId: results.insertId });
    });
});



// Get all tasks
app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err.stack);
            res.status(500).json({ error: 'Failed to fetch tasks' });
            return;
        }
        res.status(200).json(results);
    });
});

// Update task status
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE tasks SET status = ? WHERE task_id = ?';
    db.query(query, [status, id], (err, results) => {
        if (err) {
            console.error('Error updating task status:', err.stack);
            res.status(500).json({ error: 'Failed to update task status' });
            return;
        }
        res.status(200).json({ message: 'Task status updated successfully' });
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE task_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting task:', err.stack);
            res.status(500).json({ error: 'Failed to delete task' });
            return;
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    });
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
