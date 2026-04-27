import mongoose, { Schema, Document } from 'mongoose';

// This is the TypeScript interface (for our code)
export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  userId: mongoose.Types.ObjectId;
}

// This is the Mongoose Schema (for our Database)
const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['To Do', 'In Progress', 'Done'], 
    default: 'To Do' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// We export it so other files can use it
export default mongoose.model<ITask>('Task', TaskSchema);