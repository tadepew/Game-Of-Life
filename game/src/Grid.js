import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import useInterval from "../src/hooks/useInterval";

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

const numRows = 25;
const numCols = 25;

// 0 is dead, 1 is alive

const operations = [
  // -1 is row above
  // 0 is current row
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

//Grid
const initalizeGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols).fill(0)));
    // 2nd param of Array.from is a mapping function returning value 0
  } // filling cells with 0 meaning dead
  return rows;
};

const Game = () => {
  const [grid, setGrid] = useState(() => {
    return initalizeGrid();
  });

  const [start, setStart] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const startRef = useRef(start);
  //curent value of ref is start
  //use current value in a callback
  startRef.current = start;

  useInterval(() => {
    if (!startRef.current) {
      return; // this is basically our 'base case' for the recursive function
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            // iterates through every value in the grid
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              // live cell with fewer than 2 or more than 3 dies
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              // if cell is dead and has 3 neighbors, cell comes alive
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
            if (start) {
              setStart(false);
            } else {
              setStart(true);
            }
          }}
        >
          {start ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            setGrid(initalizeGrid());
            setStart(false);
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
      </div>
      <div
        className="default-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const nextGen = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1; // toggles
                });
                setGrid(nextGen);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "darkcyan" : "white",
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Game;
