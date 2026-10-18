import { Router } from 'express';
import { userService } from '../services/user.service';

const router = Router();

router.get('/me', async (req, res) => {
  try {
    // Requires Better Auth session middleware to set req.user
    const userId = (req as any).user?.id; 
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await userService.getUserWithProfile(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/me/profile', async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const updated = await userService.updateProfile(userId, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
