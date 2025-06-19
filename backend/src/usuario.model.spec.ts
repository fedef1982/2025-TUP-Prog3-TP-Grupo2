// user.model.test.ts
import { Sequelize } from 'sequelize-typescript';
import { User } from './usuario/usuario.model';
import { Rol } from './usuario/rol.model';

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Configuramos Sequelize para usar SQLite en memoria para testing
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    // Agregamos los modelos
    sequelize.addModels([User, Rol]);

    // Sincronizamos la base de datos (crea tablas)
    await sequelize.sync({ force: true });

    // Creamos un rol para usar en los tests
    await Rol.create({ ...{ id: 1, nombre: 'Admin' } }); 
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('debería crear un usuario correctamente', async () => {
    const user = await User.create({
      email: 'test@example.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      contrasenia: 'password123',
      rol_id: 1,
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.nombre).toBe('Juan');
    expect(user.apellido).toBe('Pérez');
    expect(user.rol_id).toBe(1);
    expect(user.telefono).toBe('123456789');
    expect(user.direccion).toBe('Calle Falsa 123');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('debería lanzar un error si falta un campo obligatorio', async () => {
    await expect(
      User.create({
        email: 'sin_nombre@example.com',
        apellido: 'Pérez',
        contrasenia: 'password123',
        rol_id: 1,
      }),
    ).rejects.toThrow();
  });

  it('debería respetar la unicidad del email', async () => {
    await User.create({
      email: 'unique@example.com',
      nombre: 'Ana',
      apellido: 'Gomez',
      contrasenia: 'pass123',
      rol_id: 1,
    });

    await expect(
      User.create({
        email: 'unique@example.com', // email repetido
        nombre: 'Pedro',
        apellido: 'Lopez',
        contrasenia: 'pass456',
        rol_id: 1,
      }),
    ).rejects.toThrow();
  });

  it('debería cargar la asociación con Rol', async () => {
    const user = await User.create({
      email: 'roluser@example.com',
      nombre: 'Carlos',
      apellido: 'Ramirez',
      contrasenia: 'pass789',
      rol_id: 1,
    });

    const userWithRol = await User.findByPk(user.id, { include: [Rol] });
    expect(userWithRol).not.toBeNull();
    expect(userWithRol!.rol).toBeDefined();
    expect(userWithRol!.rol.id).toBe(1);
    expect(userWithRol!.rol.nombre).toBe('Admin');
  });
});
