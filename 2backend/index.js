import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { TodoModel, UserModel } from './db.js';
import { auth, JWT_SECRET } from './auth.js'; // Importing your auth middleware
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

mongoose.connect("mongodb+srv://harshitshukla:5oEGVqmxuPryvEwg@cluster1.kci1x.mongodb.net/TodoGrow");

// User Sign Up
app.post('/api/signup', async (req, res) => {
    const { email, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);
    

    try {
        await UserModel.create({
            email,
            name,
            password: hashedPassword
        });
        res.json({ message: "You are signed up!" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add new user' });
    }
});

// User Sign In
app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    
    
    const user = await UserModel.findOne({ email });
    console.log(user);
    console.log(user.password);

  
    
    

    if (!user) {
        return res.status(403).json({ message: "Invalid Credentials!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    

    if (passwordMatch) {
        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);
        console.log(token);
        
        res.json({ token, message: "You are signed in!" });
    } else {
        res.status(403).json({ message: "error" });
    }
});

// Create Todo
app.post('/api/todos', auth, async (req, res) => {
    const userId = req.userId; // Get userId from the request
    const { text, completed } = req.body;

    try {
        const newTodo = await TodoModel.create({
            userId,
            text,
            completed,
        });
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to-do' });
    }
});

// Get Todos for the authenticated user
app.get('/api/todos', auth, async (req, res) => {
    const userId = req.userId;

    try {
        const todos = await TodoModel.find({ userId }); // Filter by userId
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// Delete Todo
app.delete('/api/todos/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await TodoModel.findOneAndDelete({ _id: id, userId: req.userId }); // Ensure todo belongs to the user
        if (deletedTodo) {
            res.status(200).json({ message: 'To-do deleted successfully' });
        } else {
            res.status(404).json({ error: 'To-do not found or does not belong to user' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete to-do' });
    }
});

// Update Todo
app.put('/api/todos/:id', auth, async (req, res) => {
    const { id } = req.params;  
    const { text, completed } = req.body;

    if (!text && typeof completed === 'undefined') {
        return res.status(400).json({ error: 'Text or completed status must be provided' });
    }
    try {
        const updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: id, userId: req.userId }, // Ensure the todo belongs to the user
            { text, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: 'To-do not found or does not belong to user' });
        }

        res.status(200).json(updatedTodo); 
    } catch (error) {
        console.error('Error updating to-do:', error);
        res.status(500).json({ error: 'Failed to update to-do' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
