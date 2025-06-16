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
} from 'sequelize-typescript';
import { EstadoVisita } from './dto/create-visita.dto';
import { DisponibilidadHoraria } from './dto/create-visita.dto';
import { Publicacion } from 'src/publicacion/publicacion.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'visitas', paranoid: true })
export class Visita extends Model<Visita, Partial<Visita>> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ApiProperty()
  @Column({
    type: DataType.ENUM(...Object.values(EstadoVisita)),
    allowNull: false,
    defaultValue: EstadoVisita.Pendiente,
  })
  declare estado: EstadoVisita;

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
  declare telefono: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare disponibilidad_fecha: Date;

  @ApiProperty()
  @Column({
    type: DataType.ENUM(...Object.values(DisponibilidadHoraria)),
    allowNull: false,
  })
  declare disponibilidad_horario: DisponibilidadHoraria;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare descripcion: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare tracking: string;

  @ApiProperty()
  @ForeignKey(() => Publicacion)
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  declare publicacion_id: number;

  @ApiProperty()
  @BelongsTo(() => Publicacion, {
    foreignKey: 'publicacion_id',
    onDelete: 'CASCADE',
  })
  publicacion: Publicacion;

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
