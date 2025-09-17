import { Router } from 'express';
import { getAllPosts, getPostById, createPost, updatePost } from '../controllers/posts';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

// GET /posts - отримати всі пости
router.get('/', getAllPosts);

// GET /posts/:id - отримати конкретний пост
router.get('/:id', getPostById);

// POST /posts - створити новий пост (тільки авторизований користувач)
router.post('/', authenticateToken, createPost);

// PUT /posts/:id - оновити пост (тільки автор поста)
router.put('/:id', authenticateToken, updatePost);

export default router;