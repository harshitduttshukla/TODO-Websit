import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;


const Todo = new Schema({
    userId  : {
    type : Schema.Types.ObjectId,
    ref : "User"
    },
    text : String,
    completed : Boolean,
});

const User = new Schema({
    email : String,
    name : String,
    password : String,
})

// const TodoModel = mongoose.model('todos',Todo);
// const UserModel = mongoose.model('users',User);


export const TodoModel = mongoose.model('todos', Todo);
export const UserModel = mongoose.model('users', User);


// module.exports = {
//     TodoModel,
//     UserModel,

// }

// export default TodoModel;