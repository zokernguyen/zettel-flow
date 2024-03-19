import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TAbstractFile, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface ZettelFlowSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ZettelFlowSettings = {
	mySetting: 'default'
}

export default class ZettelFlowPlugin extends Plugin {
	settings: ZettelFlowSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonSiblingIconEl = this.addRibbonIcon('move-right', 'New Sibling Note', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Created a new Sibling Note!');
			ZettelFlowHelper.newFile(this.app, true);
		});

		// This creates an icon in the left ribbon.
		const ribbonChildIconEl = this.addRibbonIcon('split', 'New Child Note', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Created a new Child Note!');
			ZettelFlowHelper.newFile(this.app, false);
		});


		// Generate a new empty sibling note
		this.addCommand({
			id: 'New-sibling-note',
			name: 'New Sibling Note',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				ZettelFlowHelper.newFile(this.app, true);				
			}
		});

		// Generate a new empty child note
		this.addCommand({
			id: 'New-child-note',
			name: 'New Child Note',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				ZettelFlowHelper.newFile(this.app, false);				
			}
		});

		

		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'zettel-open-sample-modal-simple',
		// 	name: 'Zettel Open sample modal (simple)',
		// 	callback: () => {
		// 		new ZettelFlowModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new ZettelFlowModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });
		// // This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ZettelFlowModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }

class ZettelFlowHelper {
	constructor(){}

	static openFile(app: App, file: TFile) {
		const leaf = app.workspace.getLeaf();
		leaf.openFile(file);
	}

	// we applying the stupid method here, just create new Id until it's unique
	// expect to check in current folder
	static newName(id: string, files: TAbstractFile[], bSibling: boolean): string {
		
		let zettelId = new ZettelID(undefined, id);
		let nextId = '';
		if(bSibling)
			nextId = zettelId.genNextSiblingId();
		else 
			nextId = zettelId.genNextChildId();

		let existingFile;

		while (true) {

			//check whether the name is already existing?
			if(!files)
				break;

			existingFile = files.find((file: TFile) =>  file.basename === nextId);

			// if it's a new ID, break the loop
			if (!existingFile)
				break;

			// otherwise, gen a new name & try again
			// only gen siblings, as it's already F1
			zettelId = new ZettelID(undefined, nextId);
			nextId = zettelId.genNextSiblingId();
		}
		return nextId;
	}

	static newFile (app: App, bSibling: boolean) {		
		const activeFile = app.workspace.getActiveFile();
		if (activeFile) {
		  const fileName = activeFile.basename;
		  console.log(`Current file name: ${fileName}`);
		  let newSiblingName = ZettelFlowHelper.newName(fileName, activeFile.parent ? activeFile.parent?.children : app.vault.getMarkdownFiles(), bSibling);
		  console.log(`New ${bSibling ? 'Sibling' : 'Child'} ID: ${newSiblingName}`);

		  let newFileName = '/' + newSiblingName + '.md';
		  
		  // Create the new file
		  app.vault.create( activeFile.parent?.path + newFileName, '').then((file: TFile) => {					
			console.log(`New file "${newFileName}" created successfully.`);
			ZettelFlowHelper.openFile(app, file);
		  }).catch((error) => {
			console.error('Error creating the new file:', error.message);
		  });


		} else {
		  console.log('No active file.');
		}
	}
}

class ZettelID {
	originID: string = '';
	seperatedID: string[] = [];

	constructor(zettelId?: ZettelID, id?: string){
		if (id){
			this.originID = id;
			this.seperatingID();
		}

		if (zettelId) {
			this.originID = zettelId.originID;
			this.seperatedID = [...zettelId.seperatedID];
		}
	}


	private seperatingID(){

		if (!this.originID)
			return

		const result = this.originID.match(/(\d+|\D+)/g);
		if(result) this.seperatedID = result;

		// "aoueoe34243euouoe34432euooue34243".match(/(\d+|\D+)/g)
		// ["aoueoe", "34243", "euouoe", "34432", "euooue", "34243"]
	}

	public genNextSiblingId(): string {
		return ZettelID.genNextSiblingId(this);
	}

	public genNextChildId(): string {
		return ZettelID.genNextChildId(this);
	}

	static genNextChildId(zettelId: ZettelID): string {
		if(!zettelId.originID)
			return '';

		let newId = new ZettelID(zettelId);
		const lastVal = newId.seperatedID.last();
		let newVal = ''

		if(lastVal) {

			// identiy whether it's number or string
			let result = parseInt(lastVal);
			if (isNaN(result)) {
				// if last characters were letters, then next would be digits
				newVal = '1';
			} else {
				newVal = 'a';

			}
			newId.seperatedID.push(newVal);
		}

		return newId.seperatedID.join('');
	}

	static genNextSiblingId(zettelId: ZettelID): string {
		if(!zettelId.originID)
			return '';

		let newId = new ZettelID(zettelId);
		const lastVal = newId.seperatedID.last();
		let newVal = ''

		if(lastVal) {

			// identiy whether it's number or string
			let result = parseInt(lastVal);
			if (isNaN(result)) {
				newVal = ZettelID.increasingLetters(lastVal);
			} else {
				newVal = (result + 1).toString(10);

			}
			newId.seperatedID.pop();
			newId.seperatedID.push(newVal);
		}

		return newId.seperatedID.join('');
	}

	
	static increasingDigit(digit: string): string {
		let result = parseInt(digit);
		return (result + 1).toString(10);
	}

	// may reference from https://stackoverflow.com/a/12504061
	static increasingLetters(letters: string): string {
		let result = letters;
		let lastChar = result.charAt(letters.length - 1);
		if (lastChar === 'z')
			return result + 'a';
		else {
			return result.replace(/\w$/i, String.fromCharCode(lastChar.charCodeAt(0) + 1));
		}
	}
}