import React, { useState, useEffect } from "react";

function ToDoList() {
  const [inputValue, setInputValue] = useState("");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [filter, setFilter] = useState("all");

  const [dragIndex, setDragIndex] = useState(null);
  const [nextId, setNextId] = useState(tasks.length + 1);


  const addTask = () => {
    if (!inputValue.trim()) return;

    const newTask = {
      id: nextId,
      text: inputValue,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
    setNextId(nextId + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleChange = (value) => {
    setInputValue(value);
  };

  // COMPLETE / UNCOMPLETE

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));

    setTasks(updatedTasks);
  };

  // DELETE TASK

  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // EDIT TASK

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, text: editText } : task));

    setTasks(updatedTasks);
    setEditId(null);
  };

  // MARK ALL DONE

  const markAllDone = () => {
    const updatedTasks = tasks.map((task) => ({
      ...task,
      completed: true,
    }));

    setTasks(updatedTasks);
  };

  // FILTER TASKS

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingTasks = tasks.filter((task) => !task.completed).length;

  // DRAG & DROP

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    const updatedTasks = [...tasks];
    const draggedItem = updatedTasks[dragIndex];

    updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(index, 0, draggedItem);

    setTasks(updatedTasks);
  };

  return (
    <>
      <div className="bg-pattern">
        <div className="todo-wrapper">
          <div className="todo-app">
            {/* HEADER */}

            <div className="container header">
              <h1 className="title">
                <img src="/img/todo.svg" alt="TODO" draggable="false" />
              </h1>

              {/* ADD TASK */}

              <div className="add-content-wrapper">
                <input type="text" value={inputValue} onChange={(e) => handleChange(e.target.value)} placeholder="Add a to-do item..." onKeyDown={handleKeyDown} className="add-content" />

                <button className="submit-btn" onClick={addTask}>
                  Add
                </button>
              </div>
            </div>

            {/* MAIN */}

            <div className="container main">
              <div className="todo-list-box">
                {/* TOP BAR */}

                <div className="bar-message">
                  <button className="btn-allFinish" onClick={markAllDone}>
                    Mark All Done
                  </button>

                  <div className="bar-message-text">Act Now, Simplify Life ☕</div>
                </div>

                {/* FILTER BUTTONS */}

                <div className="d-flex border-left-2">
                  <div className="buttons-div-box red-div" onClick={() => setFilter("all")}>
                    All
                  </div>

                  <div className="buttons-div-box green-div" onClick={() => setFilter("active")}>
                    Pending
                  </div>

                  <div className="buttons-div-box blue-div" onClick={() => setFilter("completed")}>
                    Completed
                  </div>
                </div>

                {/* TASK LIST */}

                <ul className="todo-list">
                  {filteredTasks.map((task, index) => (
                    <li key={task.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}>
                      {/* EDIT MODE */}

                      {editId === task.id ? (
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => saveEdit(task.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(task.id);
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className={`todo-content ${task.completed ? "completed" : ""}`} onDoubleClick={() => startEdit(task.id, task.text)}>
                          {task.text}
                        </div>
                      )}

                      {/* COMPLETE */}

                      <button className={`todo-btn ${task.completed ? "btn-unfinish" : "btn-finish"}`} onClick={() => toggleTask(task.id)}>
                        {task.completed ? "✓" : ""}
                      </button>

                      {/* DELETE */}

                      <button className="todo-btn btn-delete" onClick={() => removeTask(task.id)}>
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                {/* BOTTOM BAR */}

                <div className="bar-message bar-bottom">
                  <div className="bar-message-text">{remainingTasks} items remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ToDoList;
