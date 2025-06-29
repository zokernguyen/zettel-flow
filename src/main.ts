import { DEFAULT_SETTINGS } from './constants';
import { FileManager } from './fileExplorer';
import { Formatter } from './formater';
import { DataGenerator } from './generator';
import { ZettelFlowSettings } from './interfaces';
import { Notice, Plugin } from 'obsidian';
import { ZettelFlowSettingTab } from './setting';
import { ZettelFlowManager } from './zettelFlowManager';


export default class ZettelFlowPlugin extends Plugin {
	settings!: ZettelFlowSettings;
	generator!: DataGenerator;
	fileManager!: FileManager;
	formatter!: Formatter;
	zettelFlowManager!: ZettelFlowManager;

	override async onload() {
		await this.loadSettings();
		
		this.generator = new DataGenerator(this.app, this);
		this.fileManager = new FileManager(this.app, this);
		this.formatter = new Formatter(this.app, this);
		this.zettelFlowManager = new ZettelFlowManager(this.app, this);

		// This creates an icon in the left ribbon.
		const ribbonSiblingIconEl = this.addRibbonIcon('move-right', 'New Sibling Note', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Created a new Sibling Note!');
			this.zettelFlowManager.newZettelFile(true);
		});

		// This creates an icon in the left ribbon.
		const ribbonChildIconEl = this.addRibbonIcon('split', 'New Child Note', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Created a new Child Note!');
			this.zettelFlowManager.newZettelFile(false);
		});


		// Generate a new empty sibling note
		this.addCommand({
			id: 'New-sibling-note',
			name: 'New Sibling Note',
			editorCallback: () => {
				this.zettelFlowManager.newZettelFile(true);				
			},
		});

		// Generate a new empty child note
		this.addCommand({
			id: 'New-child-note',
			name: 'New Child Note',
			editorCallback: () => {
				this.zettelFlowManager.newZettelFile(false);				
			},
		});

		
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ZettelFlowSettingTab(this.app, this));
	}

	override onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
