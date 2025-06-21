import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../../src/usuario/usuario.model';
import { Rol } from '../../src/usuario/rol.model'; 

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Inicializar Sequelize con Postgres en memoria para testing
    sequelize = new Sequelize({
      dialect: 'postgres',
      storage: ':memory:',
      logging: false,
    });

    // Agregar modelos
    sequelize.addModels([User, Rol]);

    // Sincronizar esquema
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('debería crear un usuario correctamente', async () => {
    const user = await User.create({
      email: 'test@example.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      contrasenia: '123456',
      rol_id: 1,
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.nombre).toBe('Juan');
    expect(user.apellido).toBe('Pérez');
    expect(user.contrasenia).toBe('123456');
    expect(user.rol_id).toBe(1);
    expect(user.telefono).toBe('123456789');
    expect(user.direccion).toBe('Calle Falsa 123');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.deletedAt).toBeNull();
  });

  it('debería lanzar error si falta un campo obligatorio', async () => {
    await expect(
      User.create({
        email: 'test2@example.com',
        nombre: 'Ana',
        apellido: 'Gómez',
        // falta contrasenia
        rol_id: 1,
      } as any)
    ).rejects.toThrow();
  });

  it('debería permitir soft delete (paranoid)', async () => {
    const user = await User.create({
      email: 'delete@example.com',
      nombre: 'Delete',
      apellido: 'User',
      contrasenia: 'pass',
      rol_id: 1,
    });

    await user.destroy();

    // El usuario no debería estar en findAll normal
    const found = await User.findAll();
    expect(found.find(u => u.id === user.id)).toBeUndefined();

    // Pero sí en findAll con paranoid false
    const foundParanoidFalse = await User.findAll({ paranoid: false });
    expect(foundParanoidFalse.find(u => u.id === user.id)).toBeDefined();

    // deletedAt debe estar seteado
    const deletedUser = await User.findOne({ where: { id: user.id }, paranoid: false });
    expect(deletedUser?.deletedAt).toBeInstanceOf(Date);
  });
});