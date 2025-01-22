import React, { useState } from 'react';
import { Flower2, Rabbit, Cat, RotateCcw } from 'lucide-react';

type PieceType = 'grass' | 'rabbit' | 'fox';
type Player = 1 | 2;
type Cell = { piece: PieceType; player: Player } | null;

interface PlayerPieces {
  grass: number;
  rabbit: number;
  fox: number;
}

const initialPlayerPieces = {
  1: { grass: 2, rabbit: 2, fox: 2 },
  2: { grass: 2, rabbit: 2, fox: 2 }
};

function App() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);
  const [playerPieces, setPlayerPieces] = useState<{ [key in Player]: PlayerPieces }>(initialPlayerPieces);

  const canReplace = (cellPiece: PieceType | null, newPiece: PieceType): boolean => {
    if (!cellPiece) return true;
    if (newPiece === 'rabbit' && cellPiece === 'grass') return true;
    if (newPiece === 'fox' && (cellPiece === 'grass' || cellPiece === 'rabbit')) return true;
    return false;
  };

  const handleCellClick = (index: number) => {
    if (!selectedPiece || winner) return;
    
    const currentCell = board[index];
    if (currentCell?.player === currentPlayer) return;
    
    if (currentCell && !canReplace(currentCell.piece, selectedPiece)) return;
    
    const newBoard = [...board];
    newBoard[index] = { piece: selectedPiece, player: currentPlayer };
    
    setBoard(newBoard);
    setPlayerPieces(prev => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        [selectedPiece]: prev[currentPlayer][selectedPiece] - 1
      }
    }));
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setSelectedPiece(null);
  };

  const renderPiece = (cell: Cell) => {
    if (!cell) return null;
    const color = cell.player === 1 ? 'text-blue-500' : 'text-red-500';
    switch (cell.piece) {
      case 'grass':
        return <Flower2 className={`w-8 h-8 ${color}`} />;
      case 'rabbit':
        return <Rabbit className={`w-8 h-8 ${color}`} />;
      case 'fox':
        return <Cat className={`w-8 h-8 ${color}`} />;
    }
  };

  const checkWinner = () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[b] && board[c] &&
          board[a].player === board[b].player &&
          board[b].player === board[c].player) {
        return board[a].player;
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setSelectedPiece(null);
    setPlayerPieces(initialPlayerPieces);
  };

  const winner = checkWinner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Carrot Rabbit Fox
        </h1>
        
        <div className="mb-6">
          {!winner ? (
            <div className="text-lg font-semibold mb-2 text-center">
              Player {currentPlayer}'s Turn
              <span className={currentPlayer === 1 ? 'text-blue-500' : 'text-red-500'}>
                {currentPlayer === 1 ? ' (Blue)' : ' (Red)'}
              </span>
            </div>
          ) : (
            <div className="text-center mb-4">
              <div className="text-xl font-bold mb-2">
                Player {winner} Wins! 🎉
              </div>
              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </button>
            </div>
          )}
          
          {!winner && (
            <div className="flex justify-center gap-4 mb-4">
              {(['grass', 'rabbit', 'fox'] as PieceType[]).map((piece) => (
                <button
                  key={piece}
                  onClick={() => playerPieces[currentPlayer][piece] > 0 ? setSelectedPiece(piece) : null}
                  className={`p-3 rounded-lg transition-all ${
                    selectedPiece === piece ? 'bg-purple-100 scale-110' : 'bg-gray-100'
                  } ${playerPieces[currentPlayer][piece] === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'}`}
                  disabled={playerPieces[currentPlayer][piece] === 0}
                >
                  <div className="flex flex-col items-center">
                    {piece === 'grass' && <Flower2 className="w-6 h-6" />}
                    {piece === 'rabbit' && <Rabbit className="w-6 h-6" />}
                    {piece === 'fox' && <Cat className="w-6 h-6" />}
                    <span className="text-sm mt-1">({playerPieces[currentPlayer][piece]})</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center
                transition-all ${!winner && selectedPiece ? 'hover:bg-gray-200 hover:scale-105' : ''} 
                ${winner ? 'cursor-default' : ''}`}
              disabled={winner}
            >
              {renderPiece(cell)}
            </button>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Rules:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Each player has 2 of each piece: Grass, Rabbit, and Fox</li>
            <li>Rabbits can replace opponent's Grass</li>
            <li>Foxes can replace opponent's Grass or Rabbits</li>
            <li>Once placed, your own pieces cannot be moved</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;