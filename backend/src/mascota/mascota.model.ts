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
import { User } from 'src/usuario/usuario.model';
import { Especie } from './especie.model';
import { Condicion } from './condicion.model';
import { Publicacion } from 'src/publicacion/publicacion.model';

@Table({ tableName: 'mascotas', paranoid: true })
export class Mascota extends Model<Mascota, Partial<Mascota>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare nombre: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare raza?: string;

  @Column({
    type: DataType.ENUM('Macho', 'Hembra'),
    allowNull: false,
  })
  declare sexo: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare edad?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare vacunado: boolean;

  @Column({
    type: DataType.ENUM('Chico', 'Mediano', 'Grande'),
    allowNull: false,
  })
  declare tamanio: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  declare fotos_url: string[];

  @ForeignKey(() => Especie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare especie_id: number;

  @BelongsTo(() => Especie)
  especie: Especie;

  @ForeignKey(() => Condicion)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare condicion_id: number;

  @BelongsTo(() => Condicion)
  condicion: Condicion;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare usuario_id: number;

  @BelongsTo(() => User, {
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE',
  })
  usuario: User;

  @HasMany(() => Publicacion)
  declare publicacion: Publicacion[];

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
