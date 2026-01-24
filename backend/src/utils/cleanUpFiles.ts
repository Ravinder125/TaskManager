import fs from 'fs/promises'

export const cleanUpFiles = async (filePaths) => {
    if (filePaths) {
        for (const filePath of filePaths) {
            try {
                await fs.unlink(filePath)
            } catch (error) {
                console.error(`Error while deleting ${filePath} file locally`)
            }
        }
    }
}