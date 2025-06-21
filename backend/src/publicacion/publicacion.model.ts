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
  HasMany,
} from 'sequelize-typescript';
import { Mascota } from 'src/mascota/mascota.model';
import { Visita } from 'src/visita/visita.model';

export enum EstadoPublicacion {
  Abierta = 'Abierta',
  Cerrada = 'Cerrada',
}

@Table({ tableName: 'publicaciones', paranoid: true })
export class Publicacion extends Model<Publicacion, Partial<Publicacion>> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare titulo: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare descripcion: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare ubicacion: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contacto: string;

  @ApiProperty()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare publicado: Date | null;

  @ApiProperty()
  @Column({
    type: DataType.ENUM(...Object.values(EstadoPublicacion)),
    allowNull: false,
    defaultValue: EstadoPublicacion.Abierta,
  })
  declare estado: EstadoPublicacion;

  @ApiProperty()
  @ForeignKey(() => Mascota)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare mascota_id: number;

  @BelongsTo(() => Mascota, {
    foreignKey: 'mascota_id',
    onDelete: 'CASCADE',
  })
  mascota: Mascota;

  @HasMany(() => Visita)
  declare visita: Visita[];

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
