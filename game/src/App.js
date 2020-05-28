import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Game from "../src/Grid";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Game of Life</h1>
      </header>
      <Game />
    </div>
  );
}

export default App;
