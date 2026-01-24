
export type CookieOptions = {
    httpOnly: boolean;
    secure: boolean;
    sameSite: boolean | "strict" | "lax" | "none" | undefined;
    maxAge?: number;
};