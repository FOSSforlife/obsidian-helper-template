import { DailyNoteRepository } from '../features/daily-note/daily-note';
import { input } from '../src/lib/prompt';

// Async wrapper is required because top-level await requires ESM
(async () => {
  const todaysNote = await DailyNoteRepository.instance.today();
  const moodLevel = await input('What is your mood today?');
  todaysNote.attributes.mood = Number(moodLevel);
  await DailyNoteRepository.instance.save(todaysNote);
})();
