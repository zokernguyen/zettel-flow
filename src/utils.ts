// Credits go to qawatake's Binary File Manager Plugin https://github.com/qawatake/obsidian-binary-file-manager-plugin/blob/main/src/Util.ts
import * as fs from 'fs';

export async function retry<T>(
	callback: () => T | undefined,
	timeoutMilliSecond: number,
	trials: number,
	check: (_value: T) => boolean = (_: T) => true
): Promise<T | undefined> {
	if (!Number.isInteger(trials)) {
		throw `arg trials: ${trials} is not an integer`;
	}
	const result = await Promise.race([
		delay(timeoutMilliSecond),
		(async (): Promise<T | undefined> => {
			for (let i = 0; i < trials; i++) {
				const t = callback();
				if (t !== undefined && check(t)) {
					return t;
				}
				await delay(1);
			}
			return undefined;
		})(),
	]);

	if (result === undefined) {
		return undefined;
	}
	return result as T;
}

async function delay(milliSecond: number): Promise<undefined> {
	await new Promise((resolve) => setTimeout(resolve, milliSecond));
	return undefined;
}

const INVALID_CHARS_IN_FILE_NAME = new Set<string>([
	'\\',
	'/',
	':',
	'*',
	'?',
	'"',
	'<',
	'>',
	'|',
]);

export function validFileName(fileName: string): {
	valid: boolean;
	included?: string;
} {
	for (const char of fileName) {
		if (INVALID_CHARS_IN_FILE_NAME.has(char)) {
			return { valid: false, included: char };
		}
	}

	return { valid: true };
}

export async function getFolderCreateTime(folderPath: string): Promise<number> {
	return new Promise((resolve, reject) => {
		fs.stat(folderPath, (err, stats) => {
			if (err) {
				reject(err);
			}
		//console.log(`Folder creation date: ${stats.birthtime}`);
			return resolve(stats.birthtime.getMilliseconds());
		});
	});
}

export function last<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}
