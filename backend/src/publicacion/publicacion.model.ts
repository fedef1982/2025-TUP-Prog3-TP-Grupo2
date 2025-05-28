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
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  titulo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  descripcion: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ubicacion: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contacto: string;

  @Column({ type: DataType.DATE })
  publicado: Date;

  @Column({
    type: DataType.ENUM(...Object.values(EstadoPublicacion)),
    allowNull: false,
    defaultValue: EstadoPublicacion.Abierta,
  })
  estado: EstadoPublicacion;

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
