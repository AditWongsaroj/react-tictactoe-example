import { useState } from "react";

export default function MoveList({ history, jumpTo }) {
  const [reverse, setReverse] = useState(false);

  let moves = history.map((currentMoves, moveNumber) => {
    let description;
    if (moveNumber === 0) {
      description = "Go to game start ";
    } else {
      const lastMoves = history[moveNumber - 1];
      const movePosition = currentMoves.findIndex((e, i) => e !== lastMoves[i]);
      description = `Go to move #${moveNumber} 
        (${(movePosition % 3) + 1}, ${Math.floor(movePosition / 3) + 1})`;
      // (x, y coordinate from movePosition)
    }
    if (moveNumber === history.length - 1) {
      //description for current move
      description = description.substring(6);
      description = description.charAt(0).toUpperCase() + description.slice(1);
      return <li key={moveNumber}>{description}</li>;
    }

    return (
      <li key={moveNumber}>
        <button
          id="goto"
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
      <button id="revButton" onClick={handleClick}>
        Reverse Sort Order
      </button>
    </>
  );
}
