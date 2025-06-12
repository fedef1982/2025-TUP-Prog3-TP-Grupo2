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

@Table({ tableName: 'publicaciones', paranoid: true })
export class Publicacion extends Model<Partial<Publicacion>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare titulo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare descripcion: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare ubicacion: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contacto: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare publicado: Date | null;

  @Column({
    type: DataType.ENUM(...Object.values(EstadoPublicacion)),
    allowNull: false,
    defaultValue: EstadoPublicacion.Abierta,
  })
  declare estado: EstadoPublicacion;

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
