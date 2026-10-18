import { Router } from 'express';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import groupRoutes from './group.routes';
import discussionRoutes from './discussion.routes';
import progressRoutes from './progress.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/groups', groupRoutes);
router.use('/discussions', discussionRoutes);
router.use('/progress', progressRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
