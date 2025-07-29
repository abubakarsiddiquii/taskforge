import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:5000/todos");
    setTodos(res.data);
  };

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    await axios.post("http://localhost:5000/todos", {
      desc: newTodo,
      completed: false,
    });
    setNewTodo("");
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    fetchTodos();
  };

  const handleEdit = (todo) => {
    setEditingId(todo.todo_id);
    setEditText(todo.todo_desc);
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    await axios.put(`http://localhost:5000/todos/${editingId}`, {
      desc: editText,
      completed: false,
    });
    setEditingId(null);
    setEditText("");
    fetchTodos();
  };

  const handleToggle = async (todo) => {
    await axios.put(`http://localhost:5000/todos/${todo.todo_id}`, {
      desc: todo.todo_desc,
      completed: !todo.todo_completed,
    });
    fetchTodos();
  };

  const handleDeleteAll = async () => {
    await axios.delete("http://localhost:5000/todos");
    fetchTodos();
  };

  return (
    <div className="app">
      <h1 className="title">TaskForge</h1>
      <div className="todo-box">
        <div className="input-section">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Forge your next task..."
          />
          <button onClick={handleAdd}>Add</button>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.todo_id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.todo_completed}
                onChange={() => handleToggle(todo)}
              />
              {editingId === todo.todo_id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                  />
                  <button onClick={handleUpdate} className="update-btn">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`desc ${
                      todo.todo_completed ? "completed" : ""
                    }`}
                  >
                    {todo.todo_desc}
                  </span>
                  <button onClick={() => handleEdit(todo)} className="edit-btn">
                    ✏️
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(todo.todo_id)}
                className="delete-btn"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        {todos.length > 0 && (
          <button className="delete-all" onClick={handleDeleteAll}>
            Delete All
          </button>
        )}
      </div>
    </div>
  );
}
