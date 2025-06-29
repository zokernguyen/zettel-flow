// Credits go to qawatake's Binary File Manager Plugin https://github.com/qawatake/obsidian-binary-file-manager-plugin/blob/main/src/Uncover.ts

import { App, Plugin } from 'obsidian';

export class UncoveredApp extends App {
	plugins!: { plugins: PluginMap };

interface PluginMap {
	[K: string]: Plugin;
}