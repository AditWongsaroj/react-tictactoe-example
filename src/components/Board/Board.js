import Square from "./Square/Square";
import { useState } from "react";

export default function Board({ xIsNext, squares, onPlay, moveCount }) {
  function handleClick(val) {
    if (squares[val] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[val] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares); // array [0] "X":"O" [1] winning array
  let status = winner
    ? "Winner: " + winner[0]
    : moveCount === 9
    ? "Draw"
    : "Next player: " + (xIsNext ? "X" : "O");

  let boardhtml = [];
  boardhtml.push(<div className="status">{status}</div>);
  for (let i = 0; i < 3; i++) {
    boardhtml.push(<div className="board-row"></div>);
    for (let j = 0; j < 3; j++) {
      let curSq = i * 3 + j;
      let winId;
      if (winner) {
        winId = winner[1].some((x) => x === curSq) ? "highlight" : "boring";
      }
      boardhtml.push(
        <Square
          id={winId}
          value={squares[curSq]}
          onSquareClick={() => handleClick(curSq)}
        />
      );
    }
  }

  return boardhtml;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
