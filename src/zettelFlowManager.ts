import { App, TFile } from "obsidian";

import ZettelFlowPlugin from "app/main";
import { ZettelID } from "app/zettelID";

export class ZettelFlowManager {
	private app: App; //Obsidian app objet
	private plugin: ZettelFlowPlugin; // our current plugin

	constructor(app: App, plugin: ZettelFlowPlugin) {
		this.app = app;
		this.plugin = plugin;
	}

	// we applying the stupid method here, just create new Id until it's unique
	// expect to check in current folder
	newZettelName(baseFileName: string, bSibling: boolean, baseFile: TFile): string {
		
		let zettelId = new ZettelID(baseFileName);
		let nextId = '';
		let existingFileName = true;
		if(bSibling)
			nextId = zettelId.genNextSiblingId();
		else 
			nextId = zettelId.genNextChildId();

		while (existingFileName) {
			
			existingFileName = this.plugin.fileManager.existingFile(nextId, baseFile.parent);

			// gen a new name & try again
			if (existingFileName) {
				zettelId = new ZettelID(nextId);

				// only generating siblings name, as we don't need a child of child anymore
				// only siblings is needing
				// Example: baseFileName is `1a2`
				// 	- Siblings → `1a3`, then `1a4`, then `1a5`, then `1a6`. Not `1a3`, then `1a3a`, then `1a3a1`,
				// 	- Children → `1a2a`, then `1a2b`, then `1a2c`. Not `1a2a`, then `1a2a1`, then `1a2a1a` 
				// 
				nextId = zettelId.genNextSiblingId();
			}
		}
		return nextId;
	}

	async newZettelFile (bSibling: boolean) {		
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
		  const baseFileName = activeFile.basename; // Basing filename for generating the new name
		  let newFileName = this.newZettelName(baseFileName, bSibling, activeFile);

		  
		  // Create the new file with its content
		  let newFilePath = `${activeFile.parent?.path}/${newFileName}.md`;
		  let content = await this.plugin.generator.genFileContent(newFilePath);
		  this.plugin.fileManager.newFile(newFilePath, content);
		} else {
		  console.log('No active file.');
		}
	}

}
