import fs from 'fs/promises';

export async function getFileCached<T>(key: string, action: () => Promise<T>): Promise<{ cached: boolean; result: T }> {
    const filePath = `cache/${key}.json`;

    try {
        await fs.mkdir('cache');
    } catch {}

    let result: T;
    let cached = false;
    try {
        const file = await fs.readFile(filePath, 'utf-8');

        result = JSON.parse(file);
        cached = true;
    } catch {
        result = await action();

        await fs.writeFile(filePath, JSON.stringify(result, undefined, 4));
    }

    return { cached, result };
}