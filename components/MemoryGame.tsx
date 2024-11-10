'use client'
import React, { useState, useEffect } from 'react';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Player {
  name: string;
  matches: number;
}

interface DifficultyLevel {
  name: string;
  grid: string;
  emojis: string[];
}

const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  easy: {
    name: 'Fácil',
    grid: 'grid-cols-2 sm:grid-cols-3',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻'],
  },
  medium: {
    name: 'Medio',
    grid: 'grid-cols-3 sm:grid-cols-4',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  },
  hard: {
    name: 'Difícil',
    grid: 'grid-cols-4 sm:grid-cols-5',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  }
};

const MemoryGame = () => {
  const [gameState, setGameState] = useState<'setup' | 'playing'>('setup');
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isWinner, setIsWinner] = useState<boolean>(false);

  useEffect(() => {
    if (gameState === 'playing') {
      initGame();
    }
  }, [difficulty, gameState]);

  const initGame = () => {
    const currentEmojis = DIFFICULTY_LEVELS[difficulty].emojis;
    const duplicatedEmojis = [...currentEmojis, ...currentEmojis];
    const shuffledCards = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWinner(false);
    setCurrentPlayerIndex(0);
    setPlayers(playerNames.map(name => ({ name, matches: 0 })));
  };

  const handleCardClick = (cardId: number) => {
    if (flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlipped;
      
      if (cards[firstId].content === cards[secondId].content) {
        // Match encontrado
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].matches++;
        setPlayers(updatedPlayers);
        
        setMatched([...matched, firstId, secondId]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setIsWinner(true);
        }
      } else {
        // No hay match, cambiar turno
        setTimeout(() => {
          setFlipped([]);
          setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }, 1000);
      }
    }
  };

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(2, Number(e.target.value)), 4);
    setNumPlayers(value);
    setPlayerNames(Array(value).fill(''));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    if (playerNames.every(name => name.trim())) {
      setGameState('playing');
    }
  };

  if (gameState === 'setup') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold mb-4">Configuración del Juego</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Número de Jugadores (2-4):
            </label>
            <input
              type="number"
              min="2"
              max="4"
              value={numPlayers}
              onChange={handleNumPlayersChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-3">
            {Array.from({ length: numPlayers }).map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-2">
                  Jugador {index + 1}:
                </label>
                <input
                  type="text"
                  value={playerNames[index] || ''}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Nombre del Jugador ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleStartGame}
            disabled={!playerNames.every(name => name.trim())}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Comenzar Juego
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Juego de Memoria</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(DIFFICULTY_LEVELS).map(([level, { name }]) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-3 py-1 rounded-md text-sm ${
                  difficulty === level 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {players.map((player, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-center ${
                currentPlayerIndex === index 
                  ? 'bg-blue-100 border-2 border-blue-500' 
                  : 'bg-gray-100'
              }`}
            >
              <div className="font-semibold truncate">{player.name}</div>
              <div className="text-sm">{player.matches} pares</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg">Movimientos: {moves}</span>
          <button 
            onClick={initGame}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>

      <div className={`grid ${DIFFICULTY_LEVELS[difficulty].grid} gap-2 sm:gap-4`}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              aspect-square flex items-center justify-center text-2xl sm:text-4xl cursor-pointer
              rounded-lg shadow-md transition-all duration-300
              ${(flipped.includes(card.id) || matched.includes(card.id)) 
                ? 'bg-white rotate-0' 
                : 'bg-blue-500 rotate-180'}
            `}
          >
            <div className={`transform transition-all duration-300 ${
              (flipped.includes(card.id) || matched.includes(card.id)) 
                ? 'rotate-0' 
                : 'rotate-180'
            }`}>
              {(flipped.includes(card.id) || matched.includes(card.id)) ? card.content : '❓'}
            </div>
          </div>
        ))}
      </div>

      {isWinner && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
          <div className="text-xl font-bold mb-2">🎉 ¡Juego Terminado! 🎉</div>
          <div className="space-y-2">
            {players
              .sort((a, b) => b.matches - a.matches)
              .map((player, index) => (
                <div key={index}>
                  {index === 0 && player.matches > players[1]?.matches ? '🏆 ' : ''}
                  {player.name}: {player.matches} pares
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;