import { NextApiRequest, NextApiResponse } from 'next';
import { Usuario } from '../../types/usuario';

// Base de datos simulada
let usuarios: Usuario[] = [
  {
    id: 1,
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@example.com',
    contrasenia: '$2a$10$EjemploDeHashSeguro', // En producción, usar bcrypt
    role: 'ADMIN',
    telefono: '+1234567890',
    direccion: 'Calle Principal 123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuración básica de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'PUT':
        await handlePut(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Método ${req.method} no permitido` });
    }
  } catch (error) {
    console.error('Error en API usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// Handlers específicos para cada método HTTP

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id, email } = req.query;

  // Filtrar usuarios no eliminados por defecto
  let result = usuarios.filter(u => !u.deletedAt);

  // Búsqueda por ID
  if (id) {
    const usuario = usuarios.find(u => u.id === Number(id));
    return usuario
      ? res.status(200).json(usuario)
      : res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Búsqueda por email
  if (email) {
    result = result.filter(u => u.email.includes(email as string));
  }

  // Ordenar por fecha de creación (más recientes primero)
  result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));

  res.status(200).json(result);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { nombre, apellido, email, contrasenia, role, telefono, direccion } = req.body;

  // Validaciones básicas
  if (!nombre || !apellido || !email || !contrasenia) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  // Verificar si el email ya existe
  if (usuarios.some(u => u.email === email && !u.deletedAt)) {
    return res.status(409).json({ message: 'El email ya está registrado' });
  }

  // Crear nuevo usuario
  const newUser: Usuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nombre,
    apellido,
    email,
    contrasenia, // En producción, hashear la contraseña aquí
    role: role || 'USER',
    telefono,
    direccion,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  usuarios.push(newUser);
  res.status(201).json(newUser);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Se requiere el ID del usuario' });
  }

  const userIndex = usuarios.findIndex(u => u.id === Number(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Actualizar solo los campos permitidos
  const updatedUser = {
    ...usuarios[userIndex],
    ...updateData,
    updatedAt: new Date()
  };

  // No permitir actualización de ciertos campos
  delete updatedUser.id;
  delete updatedUser.createdAt;
  delete updatedUser.deletedAt;

  usuarios[userIndex] = {
    ...usuarios[userIndex],
    ...updatedUser
  };

  res.status(200).json(usuarios[userIndex]);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { hardDelete } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Se requiere el ID del usuario' });
  }

  const userIndex = usuarios.findIndex(u => u.id === Number(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  if (hardDelete) {
    // Eliminación física
    usuarios.splice(userIndex, 1);
  } else {
    // Eliminación lógica (soft delete)
    usuarios[userIndex] = {
      ...usuarios[userIndex],
      deletedAt: new Date()
    };
  }

  res.status(204).end();
}