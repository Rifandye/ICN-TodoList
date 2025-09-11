import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddUserIdToTask1757604868668 implements MigrationInterface {
  private tableName = 'tasks';

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
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({ name: 'user_id', type: 'uuid', isNullable: true }),
    );

    await queryRunner.createForeignKey(this.tableName, this.foreignKeys[0]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreignKeys[0]);
    await queryRunner.dropColumn(this.tableName, 'user_id');
  }
}
