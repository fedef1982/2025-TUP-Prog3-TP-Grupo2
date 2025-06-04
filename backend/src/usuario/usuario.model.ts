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

export enum Rol {
  Admin = 'Admin',
  Publicador = 'Publicador',
}

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
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nombre: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare apellido: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contrasenia: string;

  @Column({
    type: DataType.ENUM(...Object.values(Rol)),
    allowNull: false,
  })
  declare rol: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare telefono?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare direccion?: string;

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
