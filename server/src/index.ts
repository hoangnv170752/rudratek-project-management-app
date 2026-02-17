import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface Project {
  id: string;
  name: string;
  clientName: string;
  status: 'active' | 'on_hold' | 'completed';
  startDate: string;
  endDate: string | null;
  description: string;
}

interface Database {
  projects: Project[];
}

const dbPath = path.join(__dirname, '..', 'db.json');

const readDb = (): Database => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDb = (data: Database): void => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET all projects with pagination
app.get('/projects', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    let filteredProjects = db.projects;

    // Filter by status
    if (status && status !== 'all') {
      filteredProjects = filteredProjects.filter((p) => p.status === status);
    }

    // Search by name or clientName
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.clientName.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredProjects.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    res.json({
      data: paginatedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

// GET project by ID
app.get('/projects/:id', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const project = db.projects.find((p) => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read project' });
  }
});

// PATCH update project (status)
app.patch('/projects/:id', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const projectIndex = db.projects.findIndex((p) => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updatedProject = { ...db.projects[projectIndex], ...req.body };
    db.projects[projectIndex] = updatedProject;
    writeDb(db);
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
