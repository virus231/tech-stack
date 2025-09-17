import { Router } from 'express';
import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../controllers/users';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /users/me - отримати інформацію про поточного авторизованого користувача
router.get('/me', getCurrentUser);

// PUT /users/me - оновити інформацію (ім'я, email, пароль)
router.put('/me', updateCurrentUser);

// DELETE /users/me - видалити свій акаунт (опціонально)
router.delete('/me', deleteCurrentUser);

export default router;