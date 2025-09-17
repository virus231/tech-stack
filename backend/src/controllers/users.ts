import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/auth';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

/**
 * Get current user information
 * GET /users/me
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User account no longer exists'
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch user information'
    });
  }
};

/**
 * Update current user information
 * PUT /users/me
 */
export const updateCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to update your profile'
      });
      return;
    }

    const { name, email, password, currentPassword }: UpdateUserRequest = req.body;

    // Validate that at least one field is provided
    if (!name && !email && !password) {
      res.status(400).json({
        error: 'Validation error',
        message: 'At least one field (name, email, or password) must be provided'
      });
      return;
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!currentUser) {
      res.status(404).json({
        error: 'User not found',
        message: 'User account no longer exists'
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};

    // Update name
    if (name !== undefined) {
      if (name.trim().length < 2) {
        res.status(400).json({
          error: 'Validation error',
          message: 'Name must be at least 2 characters long'
        });
        return;
      }
      updateData.name = name.trim();
    }

    // Update email
    if (email !== undefined) {
      if (!email.includes('@')) {
        res.status(400).json({
          error: 'Validation error',
          message: 'Please provide a valid email address'
        });
        return;
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== req.user.userId) {
        res.status(409).json({
          error: 'Email already exists',
          message: 'This email is already registered to another account'
        });
        return;
      }

      updateData.email = email.toLowerCase().trim();
    }

    // Update password
    if (password !== undefined) {
      if (!currentPassword) {
        res.status(400).json({
          error: 'Validation error',
          message: 'Current password is required to set a new password'
        });
        return;
      }

      // Verify current password
      const isValidCurrentPassword = await comparePassword(currentPassword, currentUser.password);
      
      if (!isValidCurrentPassword) {
        res.status(400).json({
          error: 'Authentication failed',
          message: 'Current password is incorrect'
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          error: 'Validation error',
          message: 'New password must be at least 6 characters long'
        });
        return;
      }

      updateData.password = await hashPassword(password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user information'
    });
  }
};

/**
 * Delete current user account
 * DELETE /users/me
 */
export const deleteCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to delete your account'
      });
      return;
    }

    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Password confirmation is required to delete your account'
      });
      return;
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!currentUser) {
      res.status(404).json({
        error: 'User not found',
        message: 'User account no longer exists'
      });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, currentUser.password);
    
    if (!isValidPassword) {
      res.status(400).json({
        error: 'Authentication failed',
        message: 'Password is incorrect'
      });
      return;
    }

    // Delete user (this will cascade delete all posts due to schema setup)
    await prisma.user.delete({
      where: { id: req.user.userId }
    });

    res.status(200).json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete user account'
    });
  }
};