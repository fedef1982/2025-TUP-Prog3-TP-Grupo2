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
import { Mascota } from '../mascota/mascota.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'usuarios', paranoid: true })
export class User extends Model<User, Partial<User>> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nombre: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare apellido: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contrasenia: string;

  @ApiProperty()
  @ForeignKey(() => Rol)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rol_id: number;

  @BelongsTo(() => Rol)
  declare rol: Rol;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare telefono?: string;

  @ApiProperty()
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
