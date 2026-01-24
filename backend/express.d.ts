import { Types } from "mongoose";

declare global {
    namespace Express {
        interface User {
            _id: Types.ObjectId;
            role: "admin" | "user";
            email: string;
        }

        interface Request {
            user: User;
        }
    }
}

export { };
