import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Lobby = ({ playerName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, player, room, joinRoom, createRoom } = useGame();
  const [roomIdInput, setRoomIdInput] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    if (location.state) {
      setAction(location.state.action);
      if (location.state.action === 'create' && playerName) {
        createRoom(playerName);
      }
    }
  }, [location]);

  useEffect(() => {
    if (socket && room.id) {
      navigate(`/room/${room.id}`);
    }
  }, [room.id]);

  const handleJoin = () => {
    if (playerName && roomIdInput) {
      joinRoom(roomIdInput.toUpperCase(), playerName);
    }
  };

  const handleCreate = () => {
    if (playerName) {
      createRoom(playerName);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-bunker mb-8">
        <h2 className="text-3xl text-green-400 mb-6 text-center">
          {action === 'create' ? 'Создание комнаты' : 'Присоединение к игре'}
        </h2>
        
        <div className="mb-8">
          <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
            <p className="text-green-300 mb-2">
              <i className="fas fa-user mr-2"></i>Ваше имя: 
              <span className="text-white ml-2 font-bold">{playerName}</span>
            </p>
          </div>

          {action === 'join' && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  <i className="fas fa-key mr-2"></i>ID комнаты:
                </label>
                <input
                  type="text"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                           text-white text-center text-xl tracking-widest font-orbitron
                           focus:outline-none focus:border-green-500"
                  placeholder="Введите ID (например: A1B2C3)"
                  maxLength="6"
                />
              </div>
              
              <button
                onClick={handleJoin}
                className="btn-primary w-full text-lg py-4"
                disabled={!roomIdInput || !playerName}
              >
                <i className="fas fa-sign-in-alt"></i> Войти в комнату
              </button>
            </div>
          )}

          {action === 'create' && (
            <div className="text-center">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Создаем комнату...
                </p>
                <p className="text-sm text-gray-400">
                  После создания вы будете перенаправлены в лобби
                </p>
              </div>
              
              <button
                onClick={handleCreate}
                className="btn-primary text-lg py-4 px-8"
                disabled={!playerName}
              >
                <i className="fas fa-plus"></i> Создать новую комнату
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl text-yellow-400 mb-3">
            <i className="fas fa-info-circle mr-2"></i>Информация
          </h3>
          <ul className="text-gray-300 space-y-2">
            <li><i className="fas fa-users mr-2 text-green-400"></i>Для начала игры нужно 4+ игрока</li>
            <li><i className="fas fa-crown mr-2 text-yellow-400"></i>Создатель комнаты — ведущий</li>
            <li><i className="fas fa-clock mr-2 text-blue-400"></i>Таймер обсуждения: 5 минут</li>
            <li><i className="fas fa-vote-yea mr-2 text-red-400"></i>Голосование после каждого раунда</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
