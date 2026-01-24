// import mongoose from "mongoose";

// const inviteTokenSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
//     },
//     token: { type: String, required: true },
//     role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
//     isExpired: { type: Boolean, default: false }
// }, { timestamps: true })

// export const InviteToken = mongoose.model('InviteToken', inviteTokenSchema);
