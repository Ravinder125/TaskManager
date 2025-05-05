import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    dueTo: {
        type: Date,
        default: new Date
    },
    completedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'in-progress'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

todoSchema.plugin(mongooseAggregatePaginate)

export const Todo = mongoose.model('Todo', todoSchema)