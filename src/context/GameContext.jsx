import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [player, setPlayer] = useState({
    id: '',
    name: '',
    isHost: false,
    cards: [],
    voted: false
  });
  const [room, setRoom] = useState({
    id: '',
    players: [],
    gameStarted: false,
    currentRound: 0,
    timer: 300,
    voting: false,
    revealedCards: {}
  });

  // Динамическое подключение к сокету
  useEffect(() => {
    const socketUrl = import.meta.env.PROD 
      ? 'https://bunker-backend-wgu1.onrender.com'
      : 'http://localhost:5000';
    
    const newSocket = io(socketUrl, {
      transports: ['websocket'],
      reconnection: true
    });
    
    setSocket(newSocket);

    // Обработчики событий
    newSocket.on('room-updated', (roomData) => {
      setRoom(roomData);
    });

    newSocket.on('cards-dealt', (cards) => {
      setPlayer(prev => ({ ...prev, cards }));
    });

    newSocket.on('round-started', (roundData) => {
      setRoom(prev => ({ ...prev, ...roundData }));
    });

    newSocket.on('card-revealed', ({ playerId, cardType, cardValue }) => {
      setRoom(prev => ({
        ...prev,
        revealedCards: {
          ...prev.revealedCards,
          [playerId]: {
            ...prev.revealedCards[playerId],
            [cardType]: cardValue
          }
        }
      }));
    });

    newSocket.on('vote-started', () => {
      setRoom(prev => ({ ...prev, voting: true }));
    });

    newSocket.on('vote-ended', (results) => {
      setRoom(prev => ({ 
        ...prev, 
        voting: false,
        voteResults: results 
      }));
    });

    newSocket.on('game-ended', (winners) => {
      alert(`Игра окончена! Победители: ${winners.map(w => w.name).join(', ')}`);
    });

    return () => newSocket.close();
  }, []);

  const joinRoom = (roomId, playerName) => {
    if (socket && playerName) {
      socket.emit('join-room', { roomId, playerName });
      setPlayer(prev => ({ ...prev, name: playerName }));
    }
  };

  const createRoom = (playerName) => {
    if (socket && playerName) {
      socket.emit('create-room', { playerName });
      setPlayer(prev => ({ ...prev, name: playerName, isHost: true }));
    }
  };

  const startGame = () => {
    if (socket && player.isHost) {
      socket.emit('start-game');
    }
  };

  const revealCard = (cardType) => {
    if (socket) {
      socket.emit('reveal-card', { cardType });
    }
  };

  const submitVote = (votedPlayerId) => {
    if (socket) {
      socket.emit('submit-vote', { votedPlayerId });
      setPlayer(prev => ({ ...prev, voted: true }));
    }
  };

  return (
    <GameContext.Provider value={{
      socket,
      player,
      room,
      joinRoom,
      createRoom,
      startGame,
      revealCard,
      submitVote
    }}>
      {children}
    </GameContext.Provider>
  );
};
