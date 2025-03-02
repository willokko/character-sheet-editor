import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiceRoller from '../components/DiceRoller';

const ViewCharacter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [selectedAtributo, setSelectedAtributo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/characters/${id}`);
      const data = await response.json();
      setCharacter(data);
      setImagePreview(data.imagem);
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCharacter(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseInt(value) || 0
        }
      }));
    } else if (character && name in character.atributos) {
      setCharacter(prev => ({
        ...prev,
        atributos: {
          ...prev.atributos,
          [name]: parseInt(value) || 0
        }
      }));
    } else {
      setCharacter(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacter(prev => ({
          ...prev,
          imagem: reader.result
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/characters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      });

      if (response.ok) {
        setIsEditing(false);
        fetchCharacter();
      }
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
    }
  };

  const handleAtributoClick = (atributo, valor) => {
    setSelectedAtributo({ nome: atributo, valor });
    setShowDiceRoller(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/characters/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao excluir personagem:', error);
    }
  };

  if (!character)
    return (
      <div className="min-h-screen bg-dark-darker text-gray-200 p-4">
        Carregando...
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-darker p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 button-secondary px-4 py-2 flex items-center gap-2"
        >
          ← Voltar
        </button>

        <div className="bg-dark-lighter rounded-lg shadow-lg p-6 space-y-6 animate-slide-up">
          {/* Cabeçalho com botões */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-200">{character.nome}</h1>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 button-secondary"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Editar
                </button>
              )}
            </div>
          </div>

          {/* Imagem do personagem */}
          <div className="text-center">
            {isEditing ? (
              <div className="space-y-2">
                <img
                  src={imagePreview || character.imagem}
                  alt={character.nome}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-primary"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary-dark"
                />
              </div>
            ) : (
              character.imagem && (
                <img
                  src={character.imagem}
                  alt={character.nome}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-primary mb-4"
                />
              )
            )}
          </div>

          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nome</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nome"
                  value={character.nome}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="mt-1 text-gray-200">{character.nome}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Idade</label>
              {isEditing ? (
                <input
                  type="number"
                  name="idade"
                  value={character.idade}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="mt-1 text-gray-200">{character.idade}</p>
              )}
            </div>
          </div>

          {/* Status (HP/SAN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">HP</label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="hp.atual"
                    value={character.hp.atual}
                    onChange={handleChange}
                    placeholder="Atual"
                    className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    name="hp.max"
                    value={character.hp.max}
                    onChange={handleChange}
                    placeholder="Máximo"
                    className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <p className="mt-1 text-gray-200">
                  {character.hp.atual}/{character.hp.max}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">SAN</label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="san.atual"
                    value={character.san.atual}
                    onChange={handleChange}
                    placeholder="Atual"
                    className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    name="san.max"
                    value={character.san.max}
                    onChange={handleChange}
                    placeholder="Máximo"
                    className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <p className="mt-1 text-gray-200">
                  {character.san.atual}/{character.san.max}
                </p>
              )}
            </div>
          </div>

          {/* Atributos */}
          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">Atributos</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(character.atributos).map(([attr, valor]) => (
                <div key={attr} className="text-center">
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300">{attr}</label>
                      <input
                        type="number"
                        name={attr}
                        value={valor}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAtributoClick(attr, valor)}
                      className="w-full p-3 bg-dark-darker rounded hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-bold text-gray-200">{attr}</div>
                      <div className="text-gray-200">{valor}</div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Perícias e Especializações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Perícias</label>
              {isEditing ? (
                <textarea
                  name="pericias"
                  value={character.pericias}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="mt-1 text-gray-200">{character.pericias}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Especializações</label>
              {isEditing ? (
                <textarea
                  name="especializacoes"
                  value={character.especializacoes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="mt-1 text-gray-200">{character.especializacoes}</p>
              )}
            </div>
          </div>

          {/* Botão de Excluir (modo de edição) */}
          {isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              {showDeleteConfirm ? (
                <div className="text-center space-y-4">
                  <p className="text-red-600 font-medium">
                    Tem certeza que deseja excluir este personagem?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Confirmar Exclusão
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 button-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir Personagem
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showDiceRoller && selectedAtributo && (
        <DiceRoller
          quantidade={selectedAtributo.valor}
          onRollComplete={() => setShowDiceRoller(false)}
        />
      )}
    </div>
  );
};

export default ViewCharacter;