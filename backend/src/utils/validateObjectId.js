import mongoose from 'mongoose';

export const validateObjectId = (ids) => {
    if (Array.isArray(ids)) {
        return ids.every(id => mongoose.Types.ObjectId.isValid(id))
    }
    return mongoose.Types.ObjectId.isValid(ids)
}