import { readdir, readFile, writeFile } from 'fs/promises';
import path, { basename } from 'path';
import { stringify } from 'yaml';
import fm from 'front-matter';
import { ObsidianHelperConfig } from '../../config';

// Similar to https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/
export interface ObsidianMetadata {
  name: string;
  path: string;
}

export interface ObsidianFile {
  attributes: Record<string, any>;
  body: string;
  metadata: ObsidianMetadata;
}

export class ObsidianService {
  private static _instance: ObsidianService;

  constructor(private memoryCache = new Map<string, ObsidianFile>()) {}

  async readdir(folder: string) {
    return readdir(path.join(ObsidianHelperConfig.vaultRoot, folder));
  }

  async readFile(filePath: string): Promise<ObsidianFile> {
    const cacheResult = this.memoryCache.get(filePath);
    if (cacheResult) {
      return cacheResult;
    }

    const fileResult = (
      await readFile(
        path.join(ObsidianHelperConfig.vaultRoot, `${filePath}.md`)
      )
    ).toString();
    const fmResult = fm(fileResult);
    const result: ObsidianFile = {
      attributes: fmResult.attributes as Record<string, any>,
      body: fmResult.body,
      metadata: {
        name: basename(filePath),
        path: filePath,
      },
    };
    return result;
  }

  async writeFile(filePath: string, data: ObsidianFile) {
    const { attributes, body } = data;
    this.memoryCache.set(filePath, data);
    return writeFile(
      path.join(ObsidianHelperConfig.vaultRoot, `${filePath}.md`),
      `---\n${stringify(attributes)}\n---\n${body})`
    );
  }

  static get instance(): ObsidianService {
    return this._instance || (this._instance = new this());
  }
}
