const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../data/db.json');

// Helper function to read database
const readDB = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Helper function to write to database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get all profiles
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.profiles);
});

// Create new profile
router.post('/', (req, res) => {
  const db = readDB();
  const newProfile = {
    id: db.profiles.length + 1,
    ...req.body
  };
  db.profiles.push(newProfile);
  writeDB(db);
  res.status(201).json(newProfile);
});

// Search profiles by skill
router.get('/search', (req, res) => {
  const { skill } = req.query;
  const db = readDB();
  
  if (!skill) {
    return res.status(400).json({ error: 'Skill parameter is required' });
  }

  const results = db.profiles.filter(profile => 
    profile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
  
  res.json(results);
});

// Get projects
router.get('/projects', (req, res) => {
  const db = readDB();
  // Ensure proper JSON formatting
  const projects = db.projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    skills_needed: project.skills_needed,
    image: project.image,
    team_size: project.team_size || 1,
    created_at: project.created_at || new Date().toISOString(),
    members: project.members || []
  }));
  res.json(projects);
});

// Create new project
router.post('/projects', (req, res) => {
  const db = readDB();
  const newProject = {
    id: db.projects.length + 1,
    ...req.body,
    team_size: 1,
    created_at: new Date().toISOString(),
    members: [req.body.creator_id || 1] // Add creator as first member
  };
  db.projects.push(newProject);
  writeDB(db);
  res.status(201).json(newProject);
});

// Join/Leave project
router.post('/projects/:id/members', (req, res) => {
  const db = readDB();
  const project = db.projects.find(p => p.id == req.params.id);
  const { userId, action } = req.body;

  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (action === 'join') {
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      project.team_size = project.members.length;
    }
  } else if (action === 'leave') {
    project.members = project.members.filter(id => id !== userId);
    project.team_size = project.members.length;
  }

  writeDB(db);
  res.json(project);
});

// Join/Leave project
router.post('/projects/:id/members', (req, res) => {
  const db = readDB();
  const project = db.projects.find(p => p.id == req.params.id);
  const { userId, action } = req.body;

  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (action === 'join') {
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      project.team_size = project.members.length;
    }
  } else if (action === 'leave') {
    project.members = project.members.filter(id => id !== userId);
    project.team_size = project.members.length;
  }

  writeDB(db);
  res.json(project);
});

module.exports = router;