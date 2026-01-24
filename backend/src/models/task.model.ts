import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ITask, ITodo } from "../types/models/task.model.type.js";


/* =======================
   Todo Schema
======================= */

const todoSchema = new Schema<ITodo>(
    {
        text: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
    },
    { _id: false }
);

/* =======================
   Task Schema
======================= */


const taskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        todoList: [todoSchema],
        assignedTo: [
            { type: Schema.Types.ObjectId, ref: "User", required: true },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        attachments: [{ type: String }],
        dueTo: { type: Date, default: Date.now },
        completedAt: { type: Date },
        status: {
            type: String,
            enum: ["completed", "pending", "in-progress"],
            default: "pending",
        },
        progress: { type: Number, default: 0 },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

/* =======================
   Plugin
======================= */

taskSchema.plugin(mongooseAggregatePaginate);

/* =======================
   Model
======================= */

export const Task = mongoose.model<
    ITask,
    mongoose.AggregatePaginateModel<ITask>
>("Task", taskSchema);
