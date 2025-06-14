import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Rol } from './rol.model';
import { Mascota } from 'src/mascota/mascota.model';

@Table({ tableName: 'usuarios', paranoid: true })
export class User extends Model<User, Partial<User>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nombre: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare apellido: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contrasenia: string;

  @ForeignKey(() => Rol)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rol_id: number;

  @BelongsTo(() => Rol)
  declare rol: Rol;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare telefono?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare direccion?: string;

  @HasMany(() => Mascota)
  declare mascota: Mascota[];

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  declare deletedAt: Date;
}
