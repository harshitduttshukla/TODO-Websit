import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import axios from 'axios';

function Home() {
  const [inputvalue, setinputvalue] = useState('');
  const [todos, setToDo] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editvalue, setEditValue] = useState('');
  const [filter, setFilter] = useState('All');

  const { setUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get('http://localhost:3000/api/todos');
        setToDo(response.data);
      } catch (error) {
        console.log('Error fetching todos:', error);
      }
    }

    fetchTodos();
  }, []);

  function handerlaer(e) {
    setinputvalue(e.target.value);
  }

  async function handleAddTodo() {
    if (inputvalue.trim()) {
      const newTodo = { text: inputvalue, completed: false };
      try {
        const response = await axios.post('http://localhost:3000/api/todos', newTodo);
        setToDo([...todos, response.data]);
        setinputvalue('');
      } catch (error) {
        console.log('Error adding to-do:', error);
      }
    }
  }

  function handleToggleTodo(index) {
    const updateToDos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setToDo(updateToDos);
  }

  function handleEdit(index) {
    setEditIndex(index);
    setEditValue(todos[index].text);
  }

  function handleSaveEdit(index) {
    const todoToUpdate = todos[index];
    axios.put(`http://localhost:3000/api/todos/${todoToUpdate._id}`, {
      text: editvalue,
      completed: todoToUpdate.completed,
    })
      .then((response) => {
        const updatedTodos = todos.map((todo, i) =>
          i === index ? response.data : todo
        );
        setToDo(updatedTodos);
        setEditIndex(-1);
      })
      .catch((error) => {
        console.log('Error updating todo:', error);
      });
  }

  function handleDeleteTodo(id) {
    axios.delete(`http://localhost:3000/api/todos/${id}`)
      .then((response) => {
        console.log(response.data.message);
        setToDo(todos.filter((todo) => todo._id !== id));
      })
      .catch((error) => {
        console.log('Error deleting to-do:', error);
      });
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Active') {
      return !todo.completed;
    }
    if (filter === 'Completed') {
      return todo.completed;
    }
    return true;
  });

  useEffect(() => {
    const tasksLeft = todos.filter((todo) => !todo.completed).length;
    setUser(tasksLeft);
  }, [todos, setUser]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-yellow-600">ToDo App</h1>
        <input
          type="text"
          placeholder="Add a new task..."
          value={inputvalue}
          onChange={handerlaer}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleAddTodo}
          className="bg-yellow-500 text-white font-semibold rounded-lg py-2 w-full hover:bg-yellow-600 transition"
        >
          Add ToDo
        </button>

        <div className="flex justify-between mt-4 mb-4">
          <button
            onClick={() => handleFilterChange('All')}
            className="text-yellow-600 hover:underline"
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('Active')}
            className="text-yellow-600 hover:underline"
          >
            Active
          </button>
          <button
            onClick={() => handleFilterChange('Completed')}
            className="text-yellow-600 hover:underline"
          >
            Completed
          </button>
        </div>

        <ul>
          {filteredTodos.map((todo, index) => (
            <li key={todo._id} className="flex items-center justify-between border-b py-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(index)}
                className="mr-2"
              />
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editvalue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-300 rounded-lg p-1 flex-1"
                  />
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="bg-green-500 text-white font-semibold rounded-lg px-2 py-1 ml-2 hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-500 hover:underline ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="text-red-500 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
