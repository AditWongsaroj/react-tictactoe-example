import { useState } from "react";

function Square({ id, value, onSquareClick }) {
  return (
    <button id={id} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, moveCount }) {
  const [winId, setWinId] = useState(Array(9).fill(null));

  function handleClick(val) {
    if (squares[val] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[val] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares); // [0] "X":"O" [1] winning array
  let status;
  // = winner
  //   ? "Winner: " + winner[0]
  //   : moveCount === 9
  //   ? "Draw"
  //   : "Next player: " + (xIsNext ? "X" : "O");

  if (winner) {
    status = "Winner: " + winner[0];
  } else {
    if (moveCount === 9) {
      status = "Draw";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

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

function MoveList({ history, jumpTo }) {
  const [reverse, setReverse] = useState(false);

  let prevSq = [];
  let moves = history.map((x, moveNumber) => {
    let description;
    if (moveNumber === 0) {
      description = "Go to game start ";
    } else {
      let id = x.findIndex((el, i) => el !== history[moveNumber - 1][i]);
      description = `Go to move #${moveNumber} (${(id % 3) + 1}, ${
        Math.floor(id / 3) + 1
      })`;
    }
    if (moveNumber === history.length - 1) {
      description = description.substring(6);
      description = description.charAt(0).toUpperCase() + description.slice(1);
      return <li key={moveNumber}>{description}</li>;
    }

    return (
      <li key={moveNumber}>
        <button
          onClick={() => {
            jumpTo(moveNumber);
          }}
        >
          {description}
        </button>
      </li>
    );
  });

  if (reverse) {
    moves.reverse();
  }

  function handleClick() {
    setReverse(!reverse);
    moves = [...moves.reverse()];
  }
  let ol_start = reverse ? moves.length - 1 : 0;
  return (
    <>
      <ol reversed={reverse} start={ol_start}>
        {moves}
      </ol>
      <button onClick={handleClick}>Reverse Sort Order</button>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setHistory([...history.slice(0, nextMove + 1)]);
    setCurrentMove(nextMove);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          moveCount={currentMove}
        />
      </div>
      <div className="game-info">
        <MoveList history={history} jumpTo={jumpTo} />
      </div>
    </div>
  );
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
