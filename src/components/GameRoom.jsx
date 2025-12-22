import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import PlayerList from './PlayerList';
import Card from './Card';
import Timer from './Timer';

const GameRoom = () => {
  const { roomId } = useParams();
  const { socket, player, room, startGame, revealCard } = useGame();
  const [selectedCard, setSelectedCard] = useState(null);

  const cardTypes = [
    'profession', 'health', 'age', 'hobby', 
    'phobia', 'baggage', 'special'
  ];

  const cardLabels = {
    profession: 'Профессия',
    health: 'Здоровье',
    age: 'Возраст',
    hobby: 'Хобби',
    phobia: 'Фобия',
    baggage: 'Багаж',
    special: 'Особенность'
  };

  const canStartGame = player.isHost && room.players.length >= 4 && !room.gameStarted;

  const handleCardClick = (cardType) => {
    if (room.gameStarted && room.currentRound === cardTypes.indexOf(cardType) + 1) {
      if (!room.revealedCards[player.id]?.[cardType]) {
        setSelectedCard(cardType);
        revealCard(cardType);
      }
    }
  };

  if (!room.gameStarted) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Лобби комнаты */}
        <div className="card-bunker mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl text-green-400">
                <i className="fas fa-door-closed mr-2"></i>Комната: {roomId}
              </h2>
              <p className="text-gray-400">Пригласите друзей по этому ID</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="bg-green-900/30 px-4 py-2 rounded-lg border border-green-700">
                <p className="text-green-300">
                  <i className="fas fa-users mr-2"></i>
                  Игроков: <span className="text-white font-bold">{room.players.length}/8</span>
                </p>
              </div>
            </div>
          </div>

          <PlayerList players={room.players} />

          <div className="mt-8 border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-300">
                  {player.isHost ? (
                    <span className="text-yellow-400">
                      <i className="fas fa-crown mr-2"></i>Вы — ведущий
                    </span>
                  ) : (
                    <span className="text-blue-400">
                      <i className="fas fa-user mr-2"></i>Ожидайте начала игры...
                    </span>
                  )}
                </p>
              </div>

              {canStartGame ? (
                <button
                  onClick={startGame}
                  className="btn-primary text-lg px-8 py-3"
                >
                  <i className="fas fa-play mr-2"></i> Начать игру
                </button>
              ) : player.isHost ? (
                <div className="text-red-400 bg-red-900/20 px-4 py-2 rounded-lg">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Нужно минимум 4 игрока
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Чат лобби */}
        <div className="card-bunker">
          <h3 className="text-xl text-green-400 mb-4">
            <i className="fas fa-comments mr-2"></i>Чат лобби
          </h3>
          <div className="bg-gray-800/50 rounded-lg p-4 h-64 mb-4 overflow-y-auto">
            {/* Сообщения чата */}
            <div className="text-gray-400 italic text-center py-8">
              Чат появится здесь во время игры
            </div>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Напишите сообщение..."
              className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg 
                       text-white focus:outline-none focus:border-green-500"
            />
            <button className="btn-secondary rounded-l-none px-6">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Игровой процесс
  return (
    <div className="max-w-7xl mx-auto">
      {/* Шапка игры */}
      <div className="card-bunker mb-6">
        <div className="grid md:grid-cols-3 gap-4 items-center">
          <div>
            <h2 className="text-2xl text-green-400">
              Раунд {room.currentRound}/7
            </h2>
            <p className="text-gray-400">
              {room.currentRound > 0 && `Откройте: ${cardLabels[cardTypes[room.currentRound - 1]]}`}
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-block bg-gray-800/50 px-6 py-2 rounded-lg">
              <p className="text-gray-300">
                <i className="fas fa-users mr-2"></i>
                Выжило: <span className="text-white font-bold">{room.players.length}</span>
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Timer initialTime={room.timer} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Левая колонка: Мои карты */}
        <div className="lg:col-span-1">
          <div className="card-bunker h-full">
            <h3 className="text-xl text-green-400 mb-6">
              <i className="fas fa-user-secret mr-2"></i>Мои карты
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {player.cards.map((card, index) => {
                const cardType = cardTypes[index];
                const isRevealed = room.revealedCards[player.id]?.[cardType];
                const isCurrentRound = room.currentRound === index + 1;
                
                return (
                  <div key={index} className="relative">
                    <Card
                      type={cardType}
                      value={card}
                      revealed={isRevealed}
                      onClick={() => handleCardClick(cardType)}
                      disabled={!isCurrentRound || isRevealed}
                    />
                    
                    {isCurrentRound && !isRevealed && (
                      <div className="absolute -top-2 -right-2">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                <i className="fas fa-info-circle mr-2"></i>
                Открывайте карты по раундам, когда ведущий даст команду
              </p>
            </div>
          </div>
        </div>

        {/* Центральная колонка: Стол переговоров */}
        <div className="lg:col-span-2">
          <div className="card-bunker h-full">
            <h3 className="text-xl text-green-400 mb-6">
              <i className="fas fa-comments mr-2"></i>Стол переговоров
            </h3>
            
            {/* Игроки и их открытые карты */}
            <div className="mb-8">
              <h4 className="text-lg text-yellow-400 mb-4">
                <i className="fas fa-users mr-2"></i>Игроки
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {room.players.map((p) => (
                  <div key={p.id} className="player-card">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-green-400 font-bold">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        {p.id === player.id && (
                          <span className="text-xs text-green-400">(Вы)</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Открытые карты игрока */}
                    <div className="mt-3">
                      {cardTypes.map((type) => {
                        const revealedCard = room.revealedCards[p.id]?.[type];
                        return revealedCard ? (
                          <div key={type} className="text-xs bg-gray-700/50 p-2 rounded mb-1">
                            <span className="text-green-300">{cardLabels[type]}:</span>
                            <p className="text-white truncate">{revealedCard}</p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка голосования */}
            {room.voting && !player.voted && (
              <div className="mt-8 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <h4 className="text-lg text-red-400 mb-3">
                  <i className="fas fa-vote-yea mr-2"></i>Голосование за исключение
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {room.players
                    .filter(p => p.id !== player.id)
                    .map(p => (
                      <button
                        key={p.id}
                        onClick={() => submitVote(p.id)}
                        className="btn-danger py-2"
                      >
                        {p.name}
                      </button>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Чат игры */}
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h4 className="text-lg text-green-400 mb-3">
                <i className="fas fa-comment-dots mr-2"></i>Игровой чат
              </h4>
              <div className="bg-gray-800/50 rounded-lg p-4 h-48 mb-4 overflow-y-auto">
                <div className="space-y-2">
                  <div className="text-gray-300">
                    <span className="text-green-400 font-bold">Система:</span>
                    <span className="ml-2">Игра началась! Откройте карты "Профессия"</span>
                  </div>
                </div>
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Обсуждайте стратегию..."
                  className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg 
                           text-white focus:outline-none focus:border-green-500"
                />
                <button className="btn-secondary rounded-l-none px-6">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
