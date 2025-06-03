import { Usuario } from '../types/usuario';
import UsuarioItem from './UsuarioItems';

interface UsuarioListProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (userId: number) => void;
  currentUserId?: number;
  isLoading?: boolean;
  error?: string | null;
}

export default function UsuarioList({ 
  usuarios, 
  onEdit, 
  onDelete, 
  currentUserId,
  isLoading = false,
  error = null 
}: UsuarioListProps) {
  
  // Función para ordenar usuarios: administradores primero, luego por nombre
  const sortedUsers = [...usuarios].sort((a, b) => {
    if (a.role === 'Admin' && b.role !== 'Admin') return -1;
    if (b.role === 'Admin' && a.role !== 'Admin') return 1;
    return a.nombre.localeCompare(b.nombre);
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        <p className="font-medium">Error al cargar los usuarios:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No hay usuarios registrados</h3>
        <p className="mt-1 text-gray-500">Comienza creando un nuevo usuario.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedUsers.map(usuario => (
          <UsuarioItem 
            key={usuario.id} 
            usuario={usuario} 
            onEdit={onEdit} 
            onDelete={onDelete}
            className={
              currentUserId === usuario.id 
                ? 'ring-2 ring-blue-500' 
                : usuario.deletedAt 
                  ? 'opacity-70 bg-gray-50' 
                  : ''
            }
          />
        ))}
      </div>
      
      <div className="text-sm text-gray-500 text-center mt-4">
        Mostrando {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}