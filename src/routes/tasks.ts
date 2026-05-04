import express from 'express';
import type { Response } from 'express';
import { authenticate, type AuthRequest } from '../middleware/auth.js';
import Task from '../models/task.js';

const router = express.Router();

// 1. CREATE a new task
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority } = req.body;
    
    const newTask = new Task({
      title,
      description,
      priority,
      userId: req.userId // Automatically set by our "Gatekeeper" middleware
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// 2. GET all tasks for the logged-in user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// 3. UPDATE task completely
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // { new: true } returns the updated document instead of the old one
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Error updating task", error});
  }
});

// 4. DELETE a task
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
});

export default router;