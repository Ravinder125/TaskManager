import fs from 'fs/promises'

export const cleanUpFiles = async (filePaths) => {
    if (filePaths) {
        for (const filePath of filePaths) {
            try {
                await fs.unlink(filePath)
                // console.log(`${filePath} file has been deleted locally`)
            } catch (error) {
                console.error(`Error while deleting ${filePath} file locally`)
            }
        }
    }
}