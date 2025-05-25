/* eslint-disable prettier/prettier */
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
} from 'sequelize-typescript';

@Table({ tableName: 'visita', paranoid: true })
export class Visita extends Model<Partial<Visita>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

    @Column({
    type: DataType.ENUM('Pendiente', 'Aprobado', 'Rechazado'),
    allowNull: false,
  })
  estado: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nombre: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  apellido: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  telefono?: string;

    @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

    @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  disponibilidad_fecha: Date;

    @Column({
    type: DataType.ENUM('Maniana', 'Tarde', 'Noche'),
    allowNull: false,
  })
  disponibilidad_horaria: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descripcion: string;

   @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  publicacion_id: number;

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