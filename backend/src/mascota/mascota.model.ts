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
import { User } from 'src/usuario/usuario.model';
import { Especie } from './especie.model';
import { Condicion } from './condicion.model';

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
  nombre: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  raza?: string;

  @Column({
    type: DataType.ENUM('Macho', 'Hembra'),
    allowNull: false,
  })
  sexo: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  edad?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  vacunado: boolean;

  @Column({
    type: DataType.ENUM('Chico', 'Mediano', 'Grande'),
    allowNull: false,
  })
  tamanio: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  fotos_url: string[];

  @ForeignKey(() => Especie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  especie_id: number;

  @BelongsTo(() => Especie)
  especie: Especie;

  @ForeignKey(() => Condicion)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  condicion_id: number;

  @BelongsTo(() => Condicion)
  condicion: Condicion;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  usuario_id: number;

  @BelongsTo(() => User)
  usuario: User;

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
