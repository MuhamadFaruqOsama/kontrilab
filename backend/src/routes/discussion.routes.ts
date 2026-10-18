import { Router } from 'express';
import { discussionService } from '../services/discussion.service';

const router = Router({ mergeParams: true }); // to access groupId if mounted on /groups/:groupId/discussions

router.post('/', async (req, res) => {
  try {
    const { groupId } = req.body; // or req.params.groupId
    const session = await discussionService.createSession(groupId, req.body);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create discussion session' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await discussionService.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch discussion session' });
  }
});

router.post('/:id/messages', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const message = await discussionService.addMessage(req.params.id, userId, req.body.message);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add message' });
  }
});

export default router;
