import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Router, Link, Match } from "@reach/router";
import Game from "../src/Grid";
import Rules from "../src/Rules";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Game of Life</h1>
        <div className="link">
          <Match path="/">
            {(props) =>
              props.match ? (
                <Link to="/rules">Rules</Link>
              ) : (
                <Link to="/">Home</Link>
              )
            }
          </Match>
        </div>
      </header>
      <Router>
        <Game path="/" />
        <Rules path="/rules" />
      </Router>
    </div>
  );
}

export default App;
