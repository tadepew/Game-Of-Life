import React from "react";
import { Link } from "@reach/router";

export default function Rules() {
  return (
    <div className="rules">
      {/* <Link to="/">Home</Link> */}
      <h1>Rules:</h1>
      <h2>
        These rules, which compare the behavior of the automaton to real life,
        can be condensed into the following:{" "}
      </h2>
      <p>Any live cell with two or three live neighbors survives.</p>
      <p>Any dead cell with three live neighbors becomes a live cell.</p>
      <p>All other live cells die in the next generation.</p>
      <p>Similarly, all other dead cells stay dead.</p>
      <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
        More here
      </a>
    </div>
  );
}
