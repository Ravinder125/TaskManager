import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const todoSchema = new Schema({
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false }
});

const TaskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    todoList: [todoSchema],
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    attachments: [{ type: String }],
    dueTo: { type: Date, default: new Date },
    completedAt: { type: Date },
    status: { type: String, enum: ['completed', 'pending', 'in-progress'], default: 'pending' },
    progress: { type: Number, default: 0 },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

TaskSchema.plugin(mongooseAggregatePaginate);

export const Task = mongoose.model('Task', TaskSchema);
