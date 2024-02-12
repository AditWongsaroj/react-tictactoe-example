import { useState } from "react";
import Board from "./components/Board/Board";
import MoveList from "./components/MoveList/MoveList";

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
