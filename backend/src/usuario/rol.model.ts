import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { User } from './usuario.model';

@Table({ tableName: 'roles', timestamps: false })
export class Rol extends Model<Rol> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nombre: string;

  @HasMany(() => User)
  declare usuarios: User[];
}
