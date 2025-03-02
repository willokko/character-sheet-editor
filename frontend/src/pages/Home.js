import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/characters');
      const data = await response.json();
      setCharacters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      setCharacters([]);
    }
  };

  return (
    <div className="min-h-screen bg-dark-darker p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-bold text-center text-gray-200 mb-4">
            Seus Personagens
          </h1>
          <Link
            to="/create"
            className="block w-full button-primary py-3 text-center shadow-lg shadow-primary/20"
          >
            + Criar Novo Personagem
          </Link>
        </div>

        <div className="grid gap-4">
          {characters && characters.length > 0 ? (
            characters.map((char, index) => (
              <Link
                key={char.id}
                to={`/view/${char.id}`}
                className="bg-dark-lighter p-4 rounded-lg card-hover animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  {char.imagem ? (
                    <img
                      src={char.imagem}
                      alt={char.nome}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-dark flex items-center justify-center text-2xl text-primary border-2 border-primary">
                      {char.nome.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-gray-200">{char.nome}</h2>
                        <p className="text-sm text-gray-400">Idade: {char.idade}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-400">
                          HP: {char.hp.atual}/{char.hp.max}
                        </div>
                        <div className="text-sm text-primary-light">
                          SAN: {char.san.atual}/{char.san.max}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400 animate-fade-in">
              Nenhum personagem criado ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 