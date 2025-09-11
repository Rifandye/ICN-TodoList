import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateProjectTable1757596698101 implements MigrationInterface {
  private tableName = 'projects';

  private foreignKeyConstructor = (
    sourceColumnName: string,
    targetTableName: string,
    targetColumnName: string,
  ) => {
    return new TableForeignKey({
      name: `FK-${this.tableName}-${targetTableName}-${sourceColumnName}`.slice(
        0,
        63,
      ),
      columnNames: [sourceColumnName],
      referencedColumnNames: [targetColumnName],
      referencedTableName: targetTableName,
    });
  };

  private foreignKeys = [this.foreignKeyConstructor('user_id', 'users', 'id')];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: true,
          }),
          new TableColumn({
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          }),
          new TableColumn({
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          }),
        ],
        foreignKeys: this.foreignKeys,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(this.tableName, this.foreignKeys);
    await queryRunner.dropTable(this.tableName);
  }
}
