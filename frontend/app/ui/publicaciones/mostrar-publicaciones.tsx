import axios from 'axios';

document.addEventListener('DOMContentLoaded', async () => {
  const output = document.getElementById('output') as HTMLElement;

  try {
    const response = await axios.get<Publicacion[]>('https://localhost:3000/api/publicaciones');
    const publicaciones = response.data;

    let html = '';
    publicaciones.forEach((publicacion) => {
      html += `
        <div class="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
          <img class="w-full h-48 object-cover" src="${publicacion.fotoUrl}" alt="Foto de ${publicacion.nombreMascota}" />
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">${publicacion.nombreMascota}</div>
            <p class="text-gray-700 text-base">
              ${publicacion.descripcion ?? 'Sin descripción'}
            </p>
          </div>
        </div>
      `;
    });

    output.innerHTML = `
      <div class="flex flex-wrap justify-center">
        ${html}
      </div>
    `;
  } catch (error) {
    output.innerHTML = `
      <p class="text-red-500 font-semibold">
        Error al obtener datos: ${(error instanceof Error) ? error.message : String(error)}
      </p>
    `;
  }
});