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

@Table({ tableName: 'usuarios', paranoid: true })
export class User extends Model<Partial<User>> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

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
  contrasenia: string;

  @Column({
    type: DataType.ENUM('Admin', 'Publicador'),
    allowNull: false,
  })
  rol: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  telefono?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  direccion?: string;

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
