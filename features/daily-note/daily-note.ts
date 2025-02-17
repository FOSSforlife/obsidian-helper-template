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

  static async today(
    obsidianService = ObsidianService.instance
  ): Promise<DailyNote> {
    const currentDate = new Date();
    const filePath = path.join(
      this.folder,
      formatDate(currentDate, 'YYYY-LL-dd')
    );
    const existing = await obsidianService.readFile(filePath);

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
    await obsidianService.writeFile(filePath, newFile);
    return newFile;
  }

  static async save(
    dailyNote: DailyNote,
    obsidianService = ObsidianService.instance
  ): Promise<void> {
    await obsidianService.writeFile(
      dailyNote.metadata.path,
      this.serialize(dailyNote)
    );
  }

  private static deserialize(dailyNoteFile: ObsidianFile): DailyNote {
    // include your own parsing logic here
    return dailyNoteFile as DailyNote;
  }

  private static serialize(dailyNote: DailyNote): ObsidianFile {
    // include your own Markdown generation here
    return dailyNote as ObsidianFile;
  }
}
