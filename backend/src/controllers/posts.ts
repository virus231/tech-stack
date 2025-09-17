import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

interface CreatePostRequest {
  title: string;
  content: string;
  description?: string;
}

interface UpdatePostRequest {
  title?: string;
  content?: string;
  description?: string;
}

/**
 * Get all posts
 * GET /posts
 */
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      posts,
      total: posts.length
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch posts'
    });
  }
};

/**
 * Get post by ID
 * GET /posts/:id
 */
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Invalid post ID'
      });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
        message: 'Post with this ID does not exist'
      });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch post'
    });
  }
};

/**
 * Create new post
 * POST /posts
 * Requires authentication
 */
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to create a post'
      });
      return;
    }

    const { title, content, description }: CreatePostRequest = req.body;

    // Validate input
    if (!title || !content) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Title and content are required'
      });
      return;
    }

    if (title.trim().length < 3) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Title must be at least 3 characters long'
      });
      return;
    }

    if (content.trim().length < 10) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Content must be at least 10 characters long'
      });
      return;
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        description: description?.trim() || null,
        authorId: req.user.userId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create post'
    });
  }
};

/**
 * Update post by ID
 * PUT /posts/:id
 * Requires authentication and ownership
 */
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to update a post'
      });
      return;
    }

    const { id } = req.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Invalid post ID'
      });
      return;
    }

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true }
    });

    if (!existingPost) {
      res.status(404).json({
        error: 'Post not found',
        message: 'Post with this ID does not exist'
      });
      return;
    }

    if (existingPost.authorId !== req.user.userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own posts'
      });
      return;
    }

    const { title, content, description }: UpdatePostRequest = req.body;

    // Validate input if provided
    if (title !== undefined) {
      if (!title || title.trim().length < 3) {
        res.status(400).json({
          error: 'Validation error',
          message: 'Title must be at least 3 characters long'
        });
        return;
      }
    }

    if (content !== undefined) {
      if (!content || content.trim().length < 10) {
        res.status(400).json({
          error: 'Validation error',
          message: 'Content must be at least 10 characters long'
        });
        return;
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update post'
    });
  }
};