import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  let boardhtml = [];
  boardhtml.push(<div className="status">{status}</div>);
  for (let i = 0; i < 3; i++) {
    boardhtml.push(<div className="board-row"></div>);
    for (let j = 0; j < 3; j++) {
      boardhtml.push(
        <Square
          value={squares[i * 3 + j]}
          onSquareClick={() => handleClick(i * 3 + j)}
        />
      );
    }
  }

  return boardhtml;
}

//TODO:
function MoveList({ moves }) {
  function handleClick() {}

  return (
    <>
      <ol start="0">{moves}</ol>
      <button onClick={handleClick}>Sort Order</button>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [moves, setMoves] = useState([Array(9).fill(null)]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    updateMoves();
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setHistory([...history.slice(0, nextMove + 1)]);
    updateMoves();
    setCurrentMove(nextMove);
  }

  function updateMoves() {
    setMoves(
      history.map((_, move) => {
        let description = move > 0 ? "Go to move #" + move : "Go to game start";

        if (move === currentMove) {
          description = description.substring(6);
          description =
            description.charAt(0).toUpperCase() + description.slice(1);
          return <li key={move}>{description}</li>;
        }

        return (
          <li key={move}>
            <button
              onClick={() => {
                jumpTo(move);
              }}
            >
              {description}
            </button>
          </li>
        );
      })
    );
  }

  function sortMoves() {
    moves.reverse();
    setReversed(!reversed);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <MoveList moves={moves} />
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
      return squares[a];
    }
  }
  return null;
}
