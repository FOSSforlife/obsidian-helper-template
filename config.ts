import { homedir } from 'os';

export const ObsidianHelperConfig = {
  vaultRoot: `${homedir}/Obsidian`,
  templateDir: 'templates',
} as const;
