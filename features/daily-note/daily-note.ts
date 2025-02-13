import path from 'path';
import { ObsidianFile, ObsidianService } from '../../src/services/obsidian';
import { formatDate } from 'date-fns';

// Replace this with your own schema.
// It does not *have* to be based on ObsidianFile, but this simplifies serialization and saving
export interface DailyNote extends ObsidianFile {
  attributes: {
    mood?: number;
  };
}

export class DailyNoteRepository {
  private folder = 'daily';
  private static _instance: DailyNoteRepository;

  constructor(private obsidianService = ObsidianService.instance) {}

  async today(): Promise<DailyNote> {
    const currentDate = new Date();
    const filePath = path.join(
      this.folder,
      formatDate(currentDate, 'YYYY-LL-dd')
    );
    const existing = await this.obsidianService.readFile(filePath);

    if (existing) {
      return this.deserialize(existing);
    }

    const newFile = {
      metadata: {
        name: formatDate(currentDate, 'YYYY-LL-dd'),
        path: filePath,
      },
      attributes: {},
      body: '',
    };
    await this.obsidianService.writeFile(filePath, newFile);
    return newFile;
  }

  async save(dailyNote: DailyNote): Promise<void> {
    await this.obsidianService.writeFile(
      dailyNote.metadata.path,
      this.serialize(dailyNote)
    );
  }

  private deserialize(dailyNoteFile: ObsidianFile): DailyNote {
    // include your own parsing logic here
    return dailyNoteFile as DailyNote;
  }

  private serialize(dailyNote: DailyNote): ObsidianFile {
    // include your own Markdown generation here
    return dailyNote as ObsidianFile;
  }

  static get instance(): DailyNoteRepository {
    return this._instance || (this._instance = new this());
  }
}
