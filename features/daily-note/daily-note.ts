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
  private static folder = 'daily';

  static async today(): Promise<DailyNote> {
    const currentDate = new Date();
    const filePath = path.join(
      this.folder,
      formatDate(currentDate, 'YYYY-LL-dd')
    );
    const existing = await ObsidianService.instance.readFile(filePath);

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
    await ObsidianService.instance.writeFile(filePath, newFile);
    return newFile;
  }

  static async save(dailyNote: DailyNote): Promise<void> {
    await ObsidianService.instance.writeFile(
      dailyNote.metadata.path,
      dailyNote
    );
  }

  static async deserialize(dailyNoteFile: ObsidianFile): Promise<DailyNote> {
    // include your own parsing logic here
    return dailyNoteFile as DailyNote;
  }

  static async serialize(dailyNote: DailyNote): Promise<ObsidianFile> {
    // include your own Markdown generation here
    return dailyNote as ObsidianFile;
  }
}
