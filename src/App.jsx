import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import { Toaster } from 'react-hot-toast';

function App() {
  const [playerName, setPlayerName] = useState('');

  return (
    <GameProvider>
      <Router basename="/bunker-game-frontend">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
          <header className="bg-gray-900/50 border-b border-green-900 py-4">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-center">
                <span className="text-green-400">☢</span> БУНКЕР
                <span className="text-green-400"> ☢</span>
              </h1>
              <p className="text-center text-green-300 mt-2 font-orbitron">
                Многопользовательская игра на выживание
              </p>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="max-w-2xl mx-auto">
                  <div className="card-bunker mb-8">
                    <h2 className="text-2xl text-green-400 mb-4">
                      <i className="fas fa-door-open mr-2"></i>Вход в игру
                    </h2>
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">Ваше имя:</label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                                 text-white focus:outline-none focus:border-green-500"
                        placeholder="Введите ваше имя..."
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => <Navigate to="/lobby" state={{ playerName, action: 'create' }} />}
                        className="btn-primary text-lg"
                      >
                        <i className="fas fa-plus"></i> Создать игру
                      </button>
                      <button
                        onClick={() => <Navigate to="/lobby" state={{ playerName, action: 'join' }} />}
                        className="btn-secondary text-lg"
                      >
                        <i className="fas fa-sign-in-alt"></i> Присоединиться
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-bunker">
                    <h3 className="text-xl text-yellow-400 mb-3">
                      <i className="fas fa-book mr-2"></i>Как играть?
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                      <li>Создайте комнату или присоединитесь по ID</li>
                      <li>Дождитесь 4+ игроков (создатель начинает игру)</li>
                      <li>Каждый получает 7 секретных карт</li>
                      <li>По раундам открывайте карты для всех</li>
                      <li>Обсуждайте и голосуйте, кто покинет бункер</li>
                      <li>Выживите до конца!</li>
                    </ol>
                  </div>
                </div>
              } />
              
              <Route path="/lobby" element={<Lobby playerName={playerName} />} />
              <Route path="/room/:roomId" element={<GameRoom />} />
            </Routes>
          </main>

          <footer className="bg-gray-900/50 border-t border-gray-800 py-6 mt-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400 mb-2">
                © 2024 Многопользовательский Бункер | GitHub Pages + Render.com
              </p>
              <a 
                href="https://github.com/ваш-username/bunker-game-frontend" 
                target="_blank" 
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <i className="fab fa-github mr-1"></i> Frontend репозиторий
              </a>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </Router>
    </GameProvider>
  );
}

export default App;
