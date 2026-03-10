import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ToDoList from "./assets/components/ToDoList";
import "../src/assets/components/style.css";
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ToDoList />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
