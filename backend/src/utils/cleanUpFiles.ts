import fs from "fs/promises";

export const cleanUpFiles = async (
    filePaths: string[] | string
): Promise<void> => {
    try {
        if (typeof filePaths === "string") {
            await fs.unlink(filePaths);
            return;
        }

        if (Array.isArray(filePaths) && filePaths.length > 0) {
            await Promise.all(filePaths.map((file) => fs.unlink(file)));
            return;
        }

        throw new Error("File path is required");
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Unknown error";

        console.error(
            `Error while deleting file(s) locally: ${message}`
        );
    }
};
