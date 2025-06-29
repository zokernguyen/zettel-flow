
import {
	PluginSettingTab,
	Setting,
	App,
} from 'obsidian';
import ZettelFlowPlugin from 'app/main';
import { FileSuggest } from 'app/suggesters/fileSuggester';



export class ZettelFlowSettingTab extends PluginSettingTab {
	plugin: ZettelFlowPlugin;

	constructor(app: App, plugin: ZettelFlowPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();


		new Setting(containerEl)
			.setName('Template file location')
			.addSearch((component) => {
				new FileSuggest(this.app, component.inputEl);
				component
					.setPlaceholder('Example: folder1/note')
					.setValue(this.plugin.settings.templateFilePath)
					.onChange((newTemplateFile) => {
						this.plugin.settings.templateFilePath = newTemplateFile;
						this.plugin.saveSettings();
					});
			});


		new Setting(containerEl)
			.setName('Use Templater Plugin')
			.addToggle(async (component) => {
				component
					.setValue(this.plugin.settings.useTemplater)
					.onChange((value) => {
						this.plugin.settings.useTemplater = value;
						this.plugin.saveSettings();
					});
			});

	}
}
