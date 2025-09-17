import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

const prisma = new PrismaClient();

/**
 * Register new user
 * POST /auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: RegisterRequest = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Password must be at least 6 characters long'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
      return;
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: null
      }
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      token
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create user'
    });
  }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required'
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      token
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to authenticate user'
    });
  }
};