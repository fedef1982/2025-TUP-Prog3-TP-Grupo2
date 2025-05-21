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

@Table({ tableName: 'publicaciones' })
export class Publicacion extends Model<Publicacion> {
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

  @Column({
    type: DataType.ENUM('Admin', 'Publicador'),
    allowNull: false,
  })
  fotos_url: string;

  @Column({ type: DataType.DATE })
  publicado: Date;

  @Column(DataType.STRING)
  direccion: string;

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

// cuando exita el modelo de publicaciones hay que dejar la relación de HasMany del usuario con publicaciones
