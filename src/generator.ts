// Credits go to qawatake's Binary File Manager Plugin https://github.com/qawatake/obsidian-binary-file-manager-plugin/blob/main/src/Generator.ts

import {
	App,
	TFile,
	Notice,
	Plugin,
} from 'obsidian';

import ZettelFlowPlugin from './main';
import { UncoveredApp } from './uncover';
import { retry } from './utils';
import { TEMPLATER_PLUGIN_NAME, DEFAULT_TEMPLATE_CONTENT, RETRY_NUMBER, TIMEOUT_MILLISECOND } from './constants';

export class DataGenerator {
	private app: App;
	private plugin: ZettelFlowPlugin;

	constructor(app: App, plugin: ZettelFlowPlugin) {
		this.app = app;
		this.plugin = plugin;
	}
    
	async genFileContent(newFilePath: string): Promise<string> {		
		const templateContent = await this.fetchTemplateContent();
		let ctime = Date.now();

		//first process - internal format support content
		let draftContent = this.plugin.formatter.format(templateContent, newFilePath, ctime);
		
		// process with Templater
		const templaterPlugin = await this.getTemplaterPlugin();
		if (this.plugin.settings.useTemplater && templaterPlugin) {			
			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const content = await templaterPlugin.templater.parse_template(
					{ run_mode: 4 },
					draftContent
				);
			} catch (err) {
				new Notice(
					'ERROR in Zettel Flow Plugin: failed to connect to Templater. Your Templater version may not be supported'
				);
				console.log(err);
			}
		}

		return draftContent;
	}

	private async fetchTemplateContent(): Promise<string> {
		let filePath = this.plugin.settings.templateFilePath;

		if (filePath === '') {
			return DEFAULT_TEMPLATE_CONTENT;
		}

		const templateFile = await retry(
			() => {
				return this.app.vault.getAbstractFileByPath(
					filePath
				);
			},
			TIMEOUT_MILLISECOND,
			RETRY_NUMBER,
			(abstractFile) => abstractFile !== null
		);

		if (!(templateFile instanceof TFile)) {
			const msg = `Template file ${filePath} is invalid`;
			console.log(msg);
			new Notice(msg);
			return DEFAULT_TEMPLATE_CONTENT;
		}
		return await this.app.vault.read(templateFile);
	}

    private async getTemplaterPlugin(): Promise<Plugin | undefined> {
		const app = this.app as UncoveredApp;
		return await retry(
			() => {
				return app.plugins.plugins[TEMPLATER_PLUGIN_NAME];
			},
			TIMEOUT_MILLISECOND,
			RETRY_NUMBER
		);
	}
}