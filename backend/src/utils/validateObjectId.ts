import mongoose from 'mongoose';

const validateObjectId = (ids: string[] | string) => {
    if (Array.isArray(ids)) {
        return ids.every(id => mongoose.Types.ObjectId.isValid(id))
    }
    return mongoose.Types.ObjectId.isValid(ids)
}

export { validateObjectId }