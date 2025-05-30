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
} from 'sequelize-typescript';
import { Estado_visita } from './dto/create-visita.dto';
import { Disponibilidad_horaria } from './dto/create-visita.dto';
import { Publicacion } from 'src/publicacion/publicacion.model';

@Table({ tableName: 'visitas', paranoid: true })
export class Visita extends Model<Partial<Visita>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.ENUM(...Object.values(Estado_visita)),
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
    type: DataType.ENUM(...Object.values(Disponibilidad_horaria)),
    allowNull: false,
  })
  disponibilidad_horario: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descripcion: string;

  @ForeignKey(() => Publicacion)
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
