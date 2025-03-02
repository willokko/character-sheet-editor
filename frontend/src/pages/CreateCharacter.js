import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCharacter = () => {
  const navigate = useNavigate();
  const [character, setCharacter] = useState({
    nome: '',
    idade: '',
    descricao: '',
    imagem: '',
    itens: '',
    hp: {
      atual: 0,
      max: 0
    },
    san: {
      atual: 0,
      max: 0
    },
    atributos: {
      FOR: 0,
      DES: 0,
      VIG: 0,
      MNT: 0,
      CAR: 0
    },
    pericias: '',
    especializacoes: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

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
    } else if (name in character.atributos) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Preparar dados para envio
    const characterData = {
      ...character,
      idade: parseInt(character.idade) || 0,
      itens: character.itens.split(',').map(item => item.trim()),
      pericias: character.pericias.split(',').map(pericia => pericia.trim()),
      especializacoes: character.especializacoes.split(',').map(esp => esp.trim())
    };

    try {
      const response = await fetch('http://localhost:3001/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar personagem');
      }

      const data = await response.json();
      console.log('Personagem criado:', data);
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      alert('Erro ao criar personagem. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-darker p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 button-secondary px-4 py-2 flex items-center gap-2"
        >
          ← Voltar
        </button>

        <form onSubmit={handleSubmit} className="bg-dark-lighter rounded-lg shadow-lg p-6 space-y-6 animate-slide-up">
          <h1 className="text-3xl font-bold text-center text-gray-200">Criar Personagem</h1>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagem do Personagem
            </label>
            <div className="flex flex-col items-center space-y-2">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                />
              )}
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
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
              <input
                type="text"
                name="nome"
                value={character.nome}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Idade</label>
              <input
                type="number"
                name="idade"
                value={character.idade}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* HP e SAN */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">HP</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">SAN</label>
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
            </div>
          </div>

          {/* Atributos */}
          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-3">Atributos</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(character.atributos).map(([attr, valor]) => (
                <div key={attr}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{attr}</label>
                  <input
                    type="number"
                    name={attr}
                    value={valor}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={character.descricao}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Perícias e Especializações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Perícias</label>
              <textarea
                name="pericias"
                value={character.pericias}
                onChange={handleChange}
                rows="3"
                placeholder="Separe as perícias por vírgula"
                className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Especializações</label>
              <textarea
                name="especializacoes"
                value={character.especializacoes}
                onChange={handleChange}
                rows="3"
                placeholder="Separe as especializações por vírgula"
                className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Itens */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Itens</label>
            <textarea
              name="itens"
              value={character.itens}
              onChange={handleChange}
              rows="3"
              placeholder="Separe os itens por vírgula"
              className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="button-secondary px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button-primary px-4 py-2"
            >
              Criar Personagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacter;
