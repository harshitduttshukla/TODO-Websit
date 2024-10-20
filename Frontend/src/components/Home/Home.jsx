import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import axios from 'axios';

function Home() {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('All');
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user might not be logged in.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/api/todos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error.response ? error.response.data : error.message);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, cannot add todo.');
      return;
    }

    if (inputValue.trim()) {
      const newTodo = { text: inputValue, completed: false };
      try {
        const response = await axios.post('http://localhost:3000/api/todos', newTodo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos((prevTodos) => [...prevTodos, response.data]);
        setInputValue('');
      } catch (error) {
        console.error('Error adding todo:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleToggleTodo = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(todos[index].text);
  };

  const handleSaveEdit = async (index) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, cannot save todo.');
      return;
    }

    const todoToUpdate = todos[index];
    try {
      const response = await axios.put(`http://localhost:3000/api/todos/${todoToUpdate._id}`, {
        text: editValue,
        completed: todoToUpdate.completed,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTodos = todos.map((todo, i) =>
        i === index ? response.data : todo
      );
      setTodos(updatedTodos);
      setEditIndex(-1);
    } catch (error) {
      console.error('Error updating todo:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, cannot delete todo.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error.response ? error.response.data : error.message);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />
        <button
          onClick={handleAddTodo}
          className="bg-yellow-500 text-white font-semibold rounded-lg py-2 w-full hover:bg-yellow-600 transition"
        >
          Add ToDo
        </button>

        <div className="flex justify-between mt-4 mb-4">
          <button onClick={() => handleFilterChange('All')} className="text-yellow-600 hover:underline">All</button>
          <button onClick={() => handleFilterChange('Active')} className="text-yellow-600 hover:underline">Active</button>
          <button onClick={() => handleFilterChange('Completed')} className="text-yellow-600 hover:underline">Completed</button>
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
                    value={editValue}
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
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
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
