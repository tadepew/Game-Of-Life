import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import useInterval from "../src/hooks/useInterval";
import { Link } from "@reach/router";

// export default function Grid({ toggle, clickable }) {
//   const [grid, setGrid] = useState(cellGrid);
//   const [clickable, setClickable] = useState(true);
//   const [generation, setGeneration] = useState(0);
//   return (
//     <div
//       className="grid"
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(15, 25px)",
//         gridTemplateRows: "repeat(15, 25px)",
//       }}
//     >
//       {grid.map((cell, i) => {
//         return (
//           <div
//             key={cell.id}
//             className={cell.alive ? "alive" : "dead"}
//             // onClick={clickable ? toggleLife : null}
//             data-id={cell.id}
//             style={{ border: ".1px solid black", padding: "1px" }}
//           />
//         );
//       })}
//     </div>
//   );
// }

// 0 is dead, 1 is alive

// const alive = 1;
// const dead = 0;

const numRows = 25;
const numCols = 25;

// nw(-1, -1)   n(0, -1)  ne(1, -1)
// w(-1, 0)     c(0,0)    e(1, 0)
// sw(-1, 1)    s(0, 1)   se(1, 1)
const direction = [
  // -1 is row above
  // 0 is current row
  // 8 neighbors
  [0, -1], // n
  [0, 1], // s
  [1, 0], // e
  [-1, 0], // w
  [1, -1], // ne
  [-1, 1], // sw
  [1, 1], // se
  [-1, -1], // nw
];

//Empty grid of 0s (all dead)
const initalizeGrid = () => {
  const rows = [];
  // empty array that will then be filled with zeros
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols).fill(0)));
    // 2nd param of Array.from is a mapping function returning value 0
  } // filling cells with 0 meaning dead
  return rows;
};

//Random grid
const randomGrid = () => {
  const rows = [];
  // empty array that will then be filled with zeros
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
    // 2nd param of Array.from is a mapping function returning value 0
  } // filling cells with 0 meaning dead
  return rows;
};

const Game = () => {
  const [grid, setGrid] = useState(() => {
    return initalizeGrid();
  });

  //   console.log(grid);

  const [start, setStart] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const [gens, setGens] = useState(0);
  const [noCells, setNoCells] = useState(false);

  // don't want to cause a re render so use a  ref
  const startRef = useRef(start);
  //curent value of ref is start
  //use current value in a callback
  startRef.current = start;

  useInterval(() => {
    if (!startRef.current) {
      return;
    }
    setGrid((g) => {
      // g is current grid
      // produce makes a new grid
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            // iterates through every value in the grid
            let live_neighbors = 0;

            // how many neighbors does each cell have?
            // compute with for each
            direction.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                // checking for neighbors and to see if in bounds
                live_neighbors += g[newI][newJ];
                setGens(gens + 1);
                // console.log("neighbors", live_neighbors);
                //
              }
              //   console.log("newI", newI);
            });

            if (live_neighbors < 2 || live_neighbors > 3) {
              // cell with fewer than 2 live neighbors or more than 3 live neighbors dies
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && live_neighbors === 3) {
              // if cell is dead and has 3 live neighbors, cell comes alive
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
  }, speed);

  return (
    // wrap in a fragment
    <>
      <div className="buttons">
        <button
          onClick={() => {
            // if it's running, click to stop
            setStart(!start);
            startRef.current = true;
            setGens(0);
          }}
        >
          {start ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            setGrid(initalizeGrid());
            setStart(false);
            setGens(0);
          }}
        >
          Clear
        </button>
        <button
          onClick={() => {
            setSpeed(speed / 2);
          }}
        >
          Speed up
        </button>
        <button
          onClick={() => {
            setSpeed(speed * 2);
          }}
        >
          Slow down
        </button>
        <button
          onClick={() => {
            setGrid(randomGrid());
            setStart(true);
          }}
        >
          Random
        </button>
      </div>
      <div className="gens">
        <p>Generation: {gens}</p>
      </div>
      <div
        className="default-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 33px)`,
          gridTemplateRows: `repeat(${numRows}, 33px)`,
        }}
        // display grid turns the 'cells' into boxes
      >
        {grid.map((rows, r) =>
          rows.map((col, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => {
                if (start) {
                  return null;
                  // cannot click if the game is running
                  // else 'produce' the next gen
                } else {
                  const nextGen = produce(grid, (gridCopy) => {
                    gridCopy[r][c] = grid[r][c] ? 0 : 1; // toggles
                  });
                  setGrid(nextGen);
                }
              }}
              style={{
                width: 30,
                height: 30,
                backgroundColor: grid[r][c] ? "darkcyan" : "white",
                border: "solid 1px grey",
                // borderBottom: "0px",
                borderRadius: "5px",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Game;
