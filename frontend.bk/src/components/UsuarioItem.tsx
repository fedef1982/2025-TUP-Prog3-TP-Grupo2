import { Usuario } from '../types/usuario';

interface UsuarioItemProps {
  usuario: Usuario;
  onEdit: (usuario: Usuario) => void;
  onDelete: (userId: number) => void;
}

export default function UsuarioItem({ usuario, onEdit, onDelete }: UsuarioItemProps) {
  // Función para formatear la fecha
  const formatDate = (date?: Date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para traducir el rol
  const translateRole = (role: string) => {
    const roles: Record<string, string> = {
      'Publicador': 'Publicador',
      'Admin': 'Administrador',
    };
    return roles[role] || role;
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        {/* Información principal */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">
              {usuario.nombre} {usuario.apellido}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              usuario.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-800' 
                : usuario.role === 'EDITOR'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
            }`}>
              {translateRole(usuario.role)}
            </span>
          </div>

          <div className="mt-1 space-y-1">
            <p className="text-sm flex items-center">
              <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {usuario.email}
            </p>

            {usuario.telefono && (
              <p className="text-sm flex items-center">
                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {usuario.telefono}
              </p>
            )}
          </div>
        </div>

        {/* Información secundaria */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>Creado: {formatDate(usuario.createdAt)}</p>
          <p>Actualizado: {formatDate(usuario.updatedAt)}</p>
          {usuario.deletedAt && (
            <p className="text-red-500">Eliminado: {formatDate(usuario.deletedAt)}</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2">
          <button
            onClick={() => onEdit(usuario)}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={() => onDelete(usuario.id)}
            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 flex items-center justify-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {usuario.direccion && (
        <div className="mt-3 pt-3 border-t text-sm">
          <p className="font-medium text-gray-700">Dirección:</p>
          <p className="text-gray-600">{usuario.direccion}</p>
        </div>
      )}
    </div>
  );
}