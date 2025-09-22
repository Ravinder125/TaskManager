import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asynchandler.js'
import { Webhook } from 'svix'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export const clerkService = asyncHandler(async (req, res) => {
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
        evt = wh.verify(JSON.stringify(req.body), req.headers);
    } catch (error) {
        console.error("Webhook verification failed", error)
        return res.status(400).json({ error: "Invalid webhook" });
    }

    const { type, data } = evt

    if (type === "user.created") {
        await UserActivation.create({
            _id: data._id,
            email: data.email_addresses[0].email_address,
            fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            role: "user",
        })
    }

    if (type === "user.updated") {
        await User.findOneAndUpdate(
            { _id: data.id },
            {
                email: data.email_addresses[0].email_address,
                fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            }
        );
    }

    if (type === "user.deleted") {
        await User.findOneAndDelete({ clerkId: data.id });
    }

    res.status(200).json({ success: true });
}) 