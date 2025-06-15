import { ApiProperty } from '@nestjs/swagger';
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
import { Mascota } from 'src/mascota/mascota.model';

export enum EstadoPublicacion {
  Abierta = 'Abierta',
  Cerrada = 'Cerrada',
}

@Table({ tableName: 'publicaciones' })
export class Publicacion extends Model<Partial<Publicacion>> {
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
  titulo: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descripcion: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ubicacion: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contacto: string;

  @ApiProperty()
  @Column({ type: DataType.DATE })
  publicado: Date;

  @ApiProperty()
  @Column({
    type: DataType.ENUM(...Object.values(EstadoPublicacion)),
    allowNull: false,
    defaultValue: EstadoPublicacion.Abierta,
  })
  estado: EstadoPublicacion;

  @ApiProperty()
  @ForeignKey(() => Mascota)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  mascota_id: number;

  @BelongsTo(() => Mascota, {
    foreignKey: 'mascota_id',
    onDelete: 'CASCADE',
  })
  mascota: Mascota;

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
