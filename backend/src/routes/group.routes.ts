import { Router } from 'express';
import { groupService } from '../services/group.service';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { projectId, name, inviteCode } = req.body;
    const newGroup = await groupService.createGroup(projectId, { name, inviteCode });
    res.json(newGroup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.post('/join', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { groupId, role } = req.body;
    const member = await groupService.joinGroup(groupId, userId, role);
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join group' });
  }
});

export default router;
