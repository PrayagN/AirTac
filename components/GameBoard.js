"use client";

import { useState, useEffect } from 'react';
import styles from './GameBoard.module.css';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function GameBoard() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    checkWinner();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  const checkWinner = () => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    if (!board.includes(null)) {
      setIsDraw(true);
    }
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsDraw(false);
  };

  const renderCell = (index) => {
    const value = board[index];
    const cellClass = `${styles.cell} ${value === 'X' ? styles.cellX : value === 'O' ? styles.cellO : ''}`;
    
    return (
      <div 
        key={index} 
        className={cellClass} 
        onClick={() => handleClick(index)}
      >
        {value}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>XOX</h1>
      
      <div className={styles.board}>
        {board.map((_, index) => renderCell(index))}
      </div>

      <div className={styles.status}>
        {winner 
          ? <span className={winner === 'X' ? styles.cellX : styles.cellO}>Winner: {winner}</span> 
          : isDraw 
          ? 'Draw!' 
          : <span>Next Player: <span className={isXNext ? styles.cellX : styles.cellO}>{isXNext ? 'X' : 'O'}</span></span>}
      </div>

      <button className={styles.resetButton} onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}
