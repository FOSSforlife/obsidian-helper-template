This is a template that you can customize to create your own data wrangler for your Obsidian database. This is useful for cases in which you need more powerful querying than Dataview, or you need to import/export your data into multiple formats.

## Features

- Interact with your Obsidian data, including properties and Markdown text, like an ORM that is fully type-safe.
- Write your own parsing logic - the returned data structure doesn't have to match your Obsidian schema 1-to-1
- Most of the core functionality is contained within a Singleton class - no need to manage instantiation, just script away!
- Auto-caches repeated data requests.
- Makes use of functional programming principles, making the code readable, testable, and super easy to modify.

## Usage

1. `git clone https://github.com/FOSSforlife/obsidian-helper-template`
2. `cd obsidian-helper-template && npm i`
3. Edit `config.ts` with your vault's details.
4. Edit the code inside `features/` to match your vault's data structures.
5. Add some scripts to the `scripts/` folder that make use of the repositories that you've added.

## API

```ts
export interface ObsidianFileMetadata {
  name: string;
}

export interface ObsidianFile {
  attributes: {
    file: ObsidianFileMetadata;
  } & Record<string, any>;
  body: string;
}

// This is a Singleton class. Access it ONLY using ObsidianService.instance
export declare class ObsidianService {
  readdir(folder: string): Promise<any>;
  readFile(filePath: string): Promise<ObsidianFile>;
  writeFile(filePath: string, data: ObsidianFile): Promise<any>;
  static get instance(): ObsidianService;
}
```

## Roadmap

- More Markdown utilities for parsing the actual body into sections, todo lists, tables, and bullet points
- Code generation to create interfaces and repositories from your Markdown schema
- One-command install using `npm create` or `npx`
- Make caching toggleable (in case someone is using this in a stateful environment, as opposed to the command line)
