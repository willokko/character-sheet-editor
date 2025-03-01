const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Aumentar limite de tamanho do payload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Caminho para o arquivo de dados
const dataPath = path.join(__dirname, 'data', 'characters.json');

// Garantir que o diretório data existe
async function initializeDataDirectory() {
  const dirPath = path.dirname(dataPath);
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Garantir que o arquivo characters.json existe
async function initializeCharactersFile() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, JSON.stringify([]));
  }
}

// Rota para criar personagem
app.post('/api/characters', async (req, res) => {
  try {
    console.log('Recebendo dados:', req.body);

    // Garantir que o arquivo existe
    await initializeCharactersFile();

    // Ler dados existentes e garantir que é um array
    let characters = [];
    try {
      const fileData = await fs.readFile(dataPath, 'utf8');
      characters = JSON.parse(fileData);
      if (!Array.isArray(characters)) {
        characters = [];
      }
    } catch {
      characters = [];
    }

    // Criar novo personagem
    const newCharacter = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    // Adicionar à lista
    characters.push(newCharacter);

    // Salvar arquivo
    await fs.writeFile(dataPath, JSON.stringify(characters, null, 2));

    // Responder com sucesso
    res.status(201).json(newCharacter);
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro ao criar personagem', details: error.message });
  }
});

// Rota para listar personagens
app.get('/api/characters', async (req, res) => {
  try {
    await initializeCharactersFile();
    const data = await fs.readFile(dataPath, 'utf8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    console.error('Erro ao ler personagens:', error);
    res.status(500).json({ error: 'Erro ao ler personagens' });
  }
});

// Rota para atualizar personagem
app.put('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const data = await fs.readFile(dataPath, 'utf8');
    let characters = JSON.parse(data);

    const index = characters.findIndex(char => char.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Personagem não encontrado' });
    }

    characters[index] = { ...characters[index], ...updatedData };
    await fs.writeFile(dataPath, JSON.stringify(characters, null, 2));

    res.json(characters[index]);
  } catch (error) {
    console.error('Erro ao atualizar personagem:', error);
    res.status(500).json({ error: 'Erro ao atualizar personagem' });
  }
});

// Rota para buscar um personagem específico
app.get('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataPath, 'utf8');
    const characters = JSON.parse(data);
    
    const character = characters.find(char => char.id === id);
    
    if (!character) {
      return res.status(404).json({ error: 'Personagem não encontrado' });
    }
    
    res.json(character);
  } catch (error) {
    console.error('Erro ao buscar personagem:', error);
    res.status(500).json({ error: 'Erro ao buscar personagem' });
  }
});

// Rota para excluir personagem
app.delete('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Tentando excluir personagem com ID:', id);
    
    // Garantir que o arquivo existe
    await initializeCharactersFile();
    
    // Ler dados atuais
    const data = await fs.readFile(dataPath, 'utf8');
    let characters = JSON.parse(data || '[]');
    
    console.log('Personagens encontrados:', characters.length);
    console.log('IDs disponíveis:', characters.map(c => c.id));

    // Encontrar e remover o personagem
    const filteredCharacters = characters.filter(char => char.id !== id);
    
    console.log('Personagens após filtro:', filteredCharacters.length);

    // Se não removeu nenhum personagem, retorna 404
    if (filteredCharacters.length === characters.length) {
      console.log('Personagem não encontrado');
      return res.status(404).json({ error: 'Personagem não encontrado' });
    }

    // Salvar arquivo atualizado
    await fs.writeFile(dataPath, JSON.stringify(filteredCharacters, null, 2));
    
    console.log('Personagem excluído com sucesso');
    res.json({ message: 'Personagem excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir personagem:', error);
    res.status(500).json({ error: 'Erro ao excluir personagem' });
  }
});

// Inicializar e iniciar servidor
async function startServer() {
  await initializeDataDirectory();
  await initializeCharactersFile();
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();
