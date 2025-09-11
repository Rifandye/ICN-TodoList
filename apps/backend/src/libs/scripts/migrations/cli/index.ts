import { input, select } from '@inquirer/prompts';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const MIGRATION_DIR = 'src/libs/scripts/migrations/files';
const DATASOURCE = 'src/libs/scripts/migrations/datasource/index.ts';

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const runCommand = async (command: string, message?: string) => {
  const { default: ora } = await import('ora');
  const spinner = ora(message || `Running: ${command}`).start();
  try {
    const { stdout, stderr } = await execAsync(command);
    spinner.succeed(message || 'Command completed');
    if (stderr) console.warn(`\x1b[33m${stderr}\x1b[0m`);
    if (stdout) console.log(`\x1b[32m${stdout}\x1b[0m`);
  } catch (error: unknown) {
    spinner.fail(message || 'Command failed');
    if (error instanceof Error) {
      console.error(`\x1b[31mError: ${error.message}\x1b[0m`);
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'stdout' in error &&
      typeof (error as { stdout: unknown }).stdout === 'string'
    ) {
      console.log(
        `\x1b[33mOutput: ${(error as { stdout: string }).stdout}\x1b[0m`,
      );
    }
  }
};

const main = async () => {
  while (true) {
    const action = await select({
      message: 'Select a migration operation:',
      choices: [
        { name: 'Create new table', value: 'createTable' },
        { name: 'Drop table', value: 'dropTable' },
        { name: 'Add column', value: 'addColumn' },
        { name: 'Remove column', value: 'removeColumn' },
        { name: 'Rename column', value: 'renameColumn' },
        { name: 'Create index', value: 'createIndex' },
        { name: 'Run migration', value: 'runMigration' },
        { name: 'Revert migration', value: 'revertMigration' },
        { name: 'Exit', value: 'exit' },
      ],
    });

    if (action === 'createTable') {
      const tableName = await input({ message: 'Enter new table name:' });
      const migrationName = `Create${capitalize(tableName)}Table`;
      await runCommand(
        `pnpm typeorm migration:create ${MIGRATION_DIR}/${migrationName}`,
        `Creating migration: ${migrationName}`,
      );
    }

    if (action === 'dropTable') {
      const tableName = await input({ message: 'Enter table to drop:' });
      const migrationName = `Drop${capitalize(tableName)}Table`;
      await runCommand(
        `pnpm typeorm migration:create ${MIGRATION_DIR}/${migrationName}`,
        `Creating migration: ${migrationName}`,
      );
    }

    if (action === 'addColumn') {
      const tableName = await input({ message: 'Enter table name:' });
      const columnName = await input({ message: 'Enter column name:' });
      const migrationName = `Add${capitalize(columnName)}To${capitalize(tableName)}`;
      await runCommand(
        `pnpm typeorm migration:create ${MIGRATION_DIR}/${migrationName}`,
        `Creating migration: ${migrationName}`,
      );
    }

    if (action === 'removeColumn') {
      const tableName = await input({ message: 'Enter table name:' });
      const columnName = await input({
        message: 'Enter column name to remove:',
      });
      const migrationName = `Remove${capitalize(columnName)}From${capitalize(tableName)}`;
      await runCommand(
        `pnpm typeorm migration:create ${MIGRATION_DIR}/${migrationName}`,
        `Creating migration: ${migrationName}`,
      );
    }

    if (action === 'renameColumn') {
      const tableName = await input({ message: 'Enter table name:' });
      const oldName = await input({ message: 'Enter current column name:' });
      const newName = await input({ message: 'Enter new column name:' });
      const migrationName = `Rename${capitalize(oldName)}To${capitalize(newName)}In${capitalize(tableName)}`;
      await runCommand(
        `pnpm typeorm migration:create ${MIGRATION_DIR}/${migrationName}`,
        `Creating migration: ${migrationName}`,
      );
    }

    if (action === 'createIndex') {
      const tableName = await input({ message: 'Enter table name:' });
      const columnInput = await input({
        message: 'Enter column name(s) (comma‑separated for composite index):',
      });
      const indexNameInput = await input({
        message: 'Enter index name (optional, press ENTER for default):',
      });

      const cleanedColumns = columnInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const defaultIndexName = `Idx${cleanedColumns.map(capitalize).join('And')}On${capitalize(tableName)}`;
      const indexName = indexNameInput.length
        ? capitalize(indexNameInput)
        : defaultIndexName;

      const migrationName = `Create${indexName}`;

      await runCommand(
        `pnpm typeorm migration:create ${MIGRATION_DIR}/${migrationName}`,
        `Creating migration: ${migrationName}`,
      );
    }

    if (action === 'runMigration') {
      console.log('\n🔍 Checking pending migrations...\n');
      await runCommand(
        `pnpm typeorm-ts-node-commonjs migration:show -d ${DATASOURCE}`,
        'Fetching pending migrations',
      );
      console.log('\n🚀 Running migrations...\n');
      await runCommand(
        `pnpm typeorm-ts-node-commonjs migration:run -d ${DATASOURCE}`,
        'Applying migrations',
      );
      console.log('\n✅ Migrations are up to date.\n');
    }

    if (action === 'revertMigration') {
      await runCommand(
        `pnpm typeorm-ts-node-commonjs migration:revert -d ${DATASOURCE}`,
        'Reverting last migration',
      );
    }

    if (action === 'exit') {
      console.log('Goodbye 👋');
      process.exit(0);
    }
  }
};

void main();
