import React from "react";
import { useState } from "react";



function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = CalculateWinner(squares);
  let status;
  const stylesBoard ={
    status:{
      fontWeight: "bold",
      color: "white"
    }
  }

  function handleClick(i) {
    if (squares[i] || CalculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();

    if(squares[i]) return;
    if(xIsNext){
      nextSquares[i] = "X";
    } else nextSquares[i] = "O"
    onPlay(nextSquares);
  }


  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const renderSquare = (i, j) => {
    return <Square key={3*i+j}
     value={squares[3*i+j]}
     onSquareClick={() => handleClick(3*i+j)}
     />
  }


  const makeBoard = [...Array(3)].map((x, i) => {
    const boardSquares = [...Array(3)].map((x, j) => {
      return (
        renderSquare(i,j)
      );
    });
    return (
      <div key={i} className="board-row">
        {boardSquares}
      </div>
    );
  });

  return <React.Fragment>
    <div className="status" style={stylesBoard.status}>{status}</div>
    {makeBoard}
  </React.Fragment>
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const stylesGame = {
    goToButton:{
      color: "#f0e1c6",
      cursor: "pointer"
    }
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Reset Game';
    }
    return (
      <React.Fragment>
      <a onClick={() => jumpTo(move)} style={stylesGame.goToButton}>{description}</a> 
      <br></br>
      </React.Fragment>
      );
  });

  return(
    <div className="game">
      <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function CalculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let index = 0; index < lines.length; index++) {
    const [a, b, c] = lines[index];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null;
}
