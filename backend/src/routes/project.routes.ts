import { Router } from 'express';
import { projectService } from '../services/project.service';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const projects = await projectService.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    // Only teachers can create projects, add check here if needed based on req.user.role

    const newProject = await projectService.createProject(userId, req.body);
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

export default router;
