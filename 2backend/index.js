import express from 'express';
import mongoose  from 'mongoose';
import cors from 'cors';
import  {TodoModel,UserModel}  from './db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {auth ,JWT_SECRET}  from './auth.js';

const app = express();
app.use(express.json());
app.use(cors({origin : 'http://localhost:5173'}))
mongoose.connect("mongodb+srv://harshitshukla:5oEGVqmxuPryvEwg@cluster1.kci1x.mongodb.net/TodoGrow")

app.post('/api/signup', async (req,res)=>{
  const {email,name,password} = req.body;
  console.log(name);

  const hashedPassword = await bcrypt.hash(password,5);
  try{
    await UserModel.create({
      email,
      name,
      password: hashedPassword
    })
    res.json({message: "You are singed up!"});
  }
  catch(error) {
    res.status(500).json({error : 'Failed to add new-User'});
  }
})


app.post("/api/signin", async (req,res)=>{
  const {email, password} = req.body;
  const user = await UserModel.findOne({email});
  if(!user){
    return res.status(403).json({message : "Invalid Credentials!"});
  }

  const PasswordMatch = await bcrypt.compare(password,user.password)

  if(PasswordMatch){
    const token = jwt.sign({id : user._id.toString()},JWT_SECRET)
    res.json({token,message : "You are singned in!"});
  }
  else{
    res.status(403).json({message : "Invalid Credentials!"})
  }

})


app.post('/api/todos', async (req,res) => {
    const userId = req.userId;
    console.log(userId);
    
    const { text, completed} = req.body;
    console.log(text);
    try{
        const newTodo =  await TodoModel.create({
            userId,
            text,
            completed,
        })
        res.status(201).json(newTodo);
    }
    catch (error){
        res.status(500).json({error : 'Failed to add to-do'});
    }
})

app.get('/api/todos', async (req, res) => {
    try {
      const todos = await TodoModel.find();  
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  });
  app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        if (deletedTodo) {
            res.status(200).json({ message: 'To-do deleted successfully' });
        } else {
            res.status(404).json({ error: 'To-do not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete to-do' });
    }
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;  
  const { text, completed } = req.body; 
    console.log(text);
    
  if (!text && typeof completed === 'undefined') {
    return res.status(400).json({ error: 'Text or completed status must be provided' });
  }
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true, runValidators: true } 
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'To-do not found' });
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

