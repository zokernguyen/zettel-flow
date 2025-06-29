import { ZettelFlowSettings } from "./interfaces";

export const DEFAULT_SETTINGS: ZettelFlowSettings = {
    templateFilePath: '',
    useTemplater: false,
};



export const TEMPLATER_PLUGIN_NAME = 'templater-obsidian';
export const DEFAULT_TEMPLATE_CONTENT = `![[{{PATH}}]]
LINK: [[{{PATH}}]]
CREATED At: {{CDATE:YYYY-MM-DD}}
FILE TYPE: {{EXTENSION:UP}}
`;

export const RETRY_NUMBER = 1000;
export const TIMEOUT_MILLISECOND = 1000;