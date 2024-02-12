import { readdir, rename } from 'node:fs/promises';

const renameReceipts = async (dirPath: string) => {
    try {
        const files = await readdir(dirPath, { recursive: true });
        for (const file of files) {
            console.log(`Find new file ${file}`);
            if (file.endsWith('.pdf')) {
                const reciptName = file.split('.')[0];
                const parts = reciptName.split(' ');
                const lastPart = parts[parts.length - 1];
                const reciptDate = lastPart.slice(0, 10);

                // Test if the last part is a date
                const reciptDateTest = Date.parse(reciptDate);
                if (isNaN(reciptDateTest)) {
                    console.error(`Error: ${reciptDate} is not a date`);
                    continue;
                }

                let newFileName = parts.slice(0, parts.length - 1);
                newFileName = [reciptDate, ...newFileName];

                if (lastPart.length > 10) {
                    newFileName.push(lastPart.slice(11));
                }

                // console.log(`new name: ${newFileName.join('_')}.pdf`);
                const oldPath =  `${dirPath}/${file}`;
                const newPath = `${dirPath}/${newFileName.join('_')}.pdf`;
                await rename(oldPath, newPath)
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const dirPath = '/Volumes/MyDocuments-1/Recipts/ICA';

(async () => {
    await renameReceipts(dirPath);
})();
