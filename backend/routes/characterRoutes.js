const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '..', 'data', 'characters.json');

// Listar todos os personagens
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler personagens' });
  }
});

// Criar novo personagem
router.post('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const characters = JSON.parse(data);
    
    const newCharacter = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    characters.push(newCharacter);
    await fs.writeFile(dataPath, JSON.stringify(characters, null, 2));
    
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar personagem' });
  }
});

// Buscar personagem por ID
router.get('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const characters = JSON.parse(data);
    const character = characters.find(c => c.id === req.params.id);
    
    if (!character) {
      return res.status(404).json({ error: 'Personagem não encontrado' });
    }
    
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar personagem' });
  }
});

module.exports = router; 