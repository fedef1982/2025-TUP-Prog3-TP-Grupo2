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

@Table({ tableName: 'usuarios' })
export class User extends Model<User> {
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
  password: string;

  @Column({
    type: DataType.ENUM('Admin', 'Publicador'),
    allowNull: false,
  })
  rol: string;

  @Column(DataType.STRING)
  telefono: string;

  @Column(DataType.STRING)
  direccion: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deleted_at: Date;
}
