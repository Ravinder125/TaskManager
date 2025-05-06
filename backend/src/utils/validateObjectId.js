import mongoose from 'mongoose';

export const validateObjectId = (ids = []) => {
    const isValid = ids.map(id => mongoose.Types.ObjectId.isValid(id))
    if (!isValid.map((v) => !v)) return false
    return true
}