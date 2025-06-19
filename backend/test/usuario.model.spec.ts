import { User } from '../src/usuario/usuario.model';
import { Rol } from '../src/usuario/rol.model';
import { Sequelize } from 'sequelize';

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

  it('Debe crear un usuario con sus propiedades correctas', () => {
    const user = new User({
      id: 1,
      email: 'usuarioTest@gmail.com',
      nombre: 'Usuario',
      apellido: 'Test',
      contrasenia: '123456',
      rol_id: 2,
      telefono: '1234567890',
      direccion: 'Calle Falsa 1234',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('usuarioTest@gmail.com');
    expect(user.nombre).toBe('Usuario');
    expect(user.apellido).toBe('Test');
    expect(user.contrasenia).toBe('123456');
    expect(user.rol_id).toBe(2);
    expect(user.telefono).toBe('1234567890');
    expect(user.direccion).toBe('Calle Falsa 1234');
  });

  it('Debe tener el nombre de tabla correcto', () => {
    expect(User.getTableName()).toBe('usuarios');
  });

  it('Debería tener habilitado el modo "paranoid"', () => {
    expect(User.options.paranoid).toBe(true);
  });

  it('Deberían tener asociaciones definidas', () => {
    // Para probar asociaciones, comprobamos que la propiedad rol existe
    expect(User.associations).toHaveProperty('rol');
  });
});
