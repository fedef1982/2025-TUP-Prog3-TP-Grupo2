import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'condiciones', timestamps: false })
export class Condicion extends Model<Condicion> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nombre: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare descripcion?: string;
}
