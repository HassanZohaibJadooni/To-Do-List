import React, { useState, useEffect } from "react";

function ToDoList() {
  // input field ka state (jo user type karega)
  const [inputValue, setInputValue] = useState("");

  // tasks ka state (localStorage se load hoga agar pehle save ho)
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks"); // localStorage se tasks lena
    return savedTasks ? JSON.parse(savedTasks) : []; // agar mile to parse warna empty array
  });

  // jab bhi tasks change hon to localStorage update karo
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // editing ke liye index store karna
  const [editIndex, setEditIndex] = useState(null);

  // edit input ka text
  const [editText, setEditText] = useState("");

  // filter state (all / active / completed)
  const [filter, setFilter] = useState("all");

  // drag and drop ke liye dragged item ka index
  const [dragIndex, setDragIndex] = useState(null);

  // ================= ADD TASK =================

  const addTask = () => {
    // agar input empty ho to function stop
    if (!inputValue.trim()) return;

    // new task object
    const newTask = {
      text: inputValue, // task ka text
      completed: false, // default incomplete
    };

    // tasks array me new task add
    setTasks([...tasks, newTask]);

    // input field reset
    setInputValue("");
  };

  // enter key press hone par task add
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // input field change handle
  const handleChange = (value) => {
    setInputValue(value);
  };

  // ================= COMPLETE / UNCOMPLETE =================

  const toggleTask = (index) => {
    // map se specific task ka completed toggle
    const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task));

    setTasks(updatedTasks);
  };

  // ================= DELETE TASK =================

  const removeTask = (index) => {
    // filter se selected task remove
    const updatedTasks = tasks.filter((_, i) => i !== index);

    setTasks(updatedTasks);
  };

  // ================= EDIT TASK =================

  const startEdit = (index, text) => {
    setEditIndex(index); // edit mode start
    setEditText(text); // input me existing text show
  };

  const saveEdit = (index) => {
    // task text update karna
    const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, text: editText } : task));

    setTasks(updatedTasks);

    // edit mode band
    setEditIndex(null);
  };

  // ================= MARK ALL DONE =================

  const markAllDone = () => {
    // sab tasks ko completed true kar dena
    const updatedTasks = tasks.map((task) => ({
      ...task,
      completed: true,
    }));

    setTasks(updatedTasks);
  };

  // ================= FILTER TASKS =================

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;

    if (filter === "completed") return task.completed;

    return true;
  });

  // remaining tasks count
  const remainingTasks = tasks.filter((task) => !task.completed).length;

  // ================= DRAG AND DROP =================

  const handleDragStart = (index) => {
    setDragIndex(index); // dragged item ka index store
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // drop allow karne ke liye
  };

  const handleDrop = (index) => {
    const updatedTasks = [...tasks];

    // dragged item nikalna
    const draggedItem = updatedTasks[dragIndex];

    updatedTasks.splice(dragIndex, 1); // purani position se remove

    updatedTasks.splice(index, 0, draggedItem); // new position par add

    setTasks(updatedTasks);
  };

  // ================= JSX =================

  return (
    <>
      <div className="bg-pattern">
        <div className="todo-wrapper">
          <div className="todo-app">
            {/* HEADER */}
            <div className="container header">
              <h1 className="title">
                <img src="/img/todo.svg" alt="TODO" draggable="false" />
                <div className="ani-vector">
                  <span></span>
                  <span></span>
                </div>

                <div className="pendulums">
                  <div className="pendulum">
                    <div className="bar"></div>
                    <div className="motion">
                      <div className="string"></div>
                      <div className="weight"></div>
                    </div>
                  </div>

                  <div className="pendulum shadow">
                    <div className="bar"></div>
                    <div className="motion">
                      <div className="string"></div>
                      <div className="weight"></div>
                    </div>
                  </div>
                </div>
              </h1>

              {/* ADD TASK INPUT */}
              <div className="add-content-wrapper">
                <input type="text" value={inputValue} onChange={(e) => handleChange(e.target.value)} placeholder="Add a to-do item..." onKeyDown={handleKeyDown} className="add-content" />

                <button className="submit-btn" onClick={addTask}>
                  Add
                </button>
              </div>
            </div>

            {/* MAIN SECTIONs */}
            <div className="container main">
              <div className="todo-list-box">
                {/* TOP BAR */}
                <div className="bar-message">
                  <button className="btn-allFinish" onClick={markAllDone}>
                    Mark All Done
                  </button>

                  <div className="bar-message-text">Act Now, Simplify Life ☕</div>
                </div>
                <div className="d-flex border-left-2">
                  <div class="buttons-div-box red-div" onClick={() => setFilter("all")}>
                    All
                  </div>

                  <div class="buttons-div-box green-div" onClick={() => setFilter("active")}>
                    Pending
                  </div>

                  <div class="buttons-div-box blue-div" onClick={() => setFilter("completed")}>
                    Completed
                  </div>
                </div>

                {/* TASK LIST */}
                <ul className="todo-list">
                  {filteredTasks.map((task, index) => (
                    <li key={index} draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}>
                      {/* EDIT MODE */}
                      {editIndex === index ? (
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => saveEdit(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(index);
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className={`todo-content ${task.completed ? "completed" : ""}`} onDoubleClick={() => startEdit(index, task.text)}>
                          {task.text}
                        </div>
                      )}

                      {/* COMPLETE BUTTON */}
                      <button className={`todo-btn ${task.completed ? "btn-unfinish" : "btn-finish"}`} onClick={() => toggleTask(index)}>
                        {task.completed ? "✓" : ""}
                      </button>

                      {/* DELETE BUTTON */}
                      <button className="todo-btn btn-delete" onClick={() => removeTask(index)}>
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
              <div className="bar-message bar-bottom">
                <div className="bar-message-text">{remainingTasks} items remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ToDoList;
