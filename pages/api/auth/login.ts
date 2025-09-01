// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== LOGIN API CALLED ===');
  console.log('Request body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Searching for user with email:', email);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found - role:', user.role, 'type:', typeof user.role);
    console.log('User role trimmed:', user.role.trim());
    console.log('User role uppercase:', user.role.toUpperCase());

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin
    console.log('Checking if user is admin...');
    console.log('User role value:', user.role);
    console.log('User role === "ADMIN":', user.role === 'ADMIN');
    console.log('User role trimmed === "ADMIN":', user.role.trim() === 'ADMIN');

    if (user.role !== 'ADMIN') {
      console.log('User is NOT admin, returning 403');
      return res.status(403).json({ error: 'Admin access required' });
    }

    console.log('User IS admin, proceeding with login...');

    // Generate JWT token
    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}