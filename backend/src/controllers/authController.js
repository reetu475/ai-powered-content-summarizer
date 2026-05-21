import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateId } from '../utils/helpers.js';
import fs from 'fs';
import path from 'path';

// File-based user storage for development persistence
const usersFile = path.join(process.cwd(), 'users.json');
let users = new Map();

// Load users from file on startup
const loadUsers = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      const usersArray = JSON.parse(data);
      usersArray.forEach(userData => {
        const user = new User(userData);
        users.set(userData.id, user);
      });
      console.log(`Loaded ${users.size} users from file`);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
};

// Save users to file
const saveUsers = () => {
  try {
    const usersArray = Array.from(users.values()).map(u => ({
      id: u.id,
      email: u.email,
      password: u.password,
      name: u.name,
      createdAt: u.createdAt
    }));
    fs.writeFileSync(usersFile, JSON.stringify(usersArray, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Load users on startup
loadUsers();

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await User.hashPassword(password);

    // Create user
    const userId = generateId();
    const userData = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };

    const user = new User(userData);
    users.set(userId, user);
    saveUsers(); // Save to file

    // Generate token
    const token = jwt.sign(
      { id: userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export default { register, login, getMe };
