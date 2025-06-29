import {
	App,
	normalizePath,
	TAbstractFile,
	TFile,
    TFolder,
} from 'obsidian';

import ZettelFlowPlugin from './main';

export class FileManager {
    private app: App;
    private plugin: ZettelFlowPlugin;

    constructor(app: App, plugin: ZettelFlowPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    openFile(file: TFile) {
        const leaf = this.app.workspace.getLeaf();
        leaf.openFile(file);
    }

    // Create the new metadata file for current file/folder using template
    async newFile (filePath: string, content: string) {
        
        this.app.vault.create( filePath, content).then((file: TFile) => {
            this.openFile(file);
        }).catch((error: { message: any; }) => {
            console.error('Error creating the new file:', error.message);
        });
    }

    // return current time if couldn't find the folder create time
    async getObjCreatedTime(inputObj: TFile | TFolder): Promise<number> {
        let ctime = Date.now();
        
        if (inputObj instanceof TFile)
            ctime = inputObj.stat.ctime
        else {
            const folder = await this.app.vault.adapter.stat(normalizePath(inputObj.path));
            ctime = folder ? folder.ctime : ctime;
        } 
        return ctime;
    }

    // find existing files in the given folder, or all the vault
	existingFile(fileName: string, folder?: TFolder | null): boolean {
        let files = undefined;

        if (folder) 
            files = folder.children.filter((file: TAbstractFile) => file instanceof TFile);
        else 
            files = this.app.vault.getMarkdownFiles();
		const file = files.find((file: TFile) =>  file.basename === fileName);
		return file ? true : false;
	}
}