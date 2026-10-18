import { Router } from 'express';
import { progressService } from '../services/progress.service';

const router = Router({ mergeParams: true });

router.post('/upload', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const upload = await progressService.uploadProgress(req.body.groupId, userId, req.body);
    res.json(upload);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload progress' });
  }
});

router.post('/assessment', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const assessment = await progressService.submitPeerAssessment(req.body.groupId, userId, req.body.subjectId, req.body);
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

export default router;
