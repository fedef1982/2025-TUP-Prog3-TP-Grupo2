import { Test } from '@nestjs/testing';
import { Publicacion, EstadoPublicacion } from '../../src/publicacion/publicacion.model';
import { PublicacionesController } from '../../src/publicacion/publicacion.controller';
import { PublicacionesService } from '../../src/publicacion/publicacion.service';
import { CreatePublicacionDto } from '../../src/publicacion/dto/create-publicacion.dto';
import { UpdatePublicacionDto } from '../../src/publicacion/dto/update-publicacion.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';
import { Role } from '../../src/auth/roles.enum';
import { Mascota } from '../../src/mascota/mascota.model';
import { Visita } from '../../src/visita/visita.model';
import { DisponibilidadHoraria } from '../../src/visita/dto/create-visita.dto';
import { EstadoVisita } from '../../src/visita/dto/create-visita.dto';

const mockPublicacionesService = {
  findAll: jest.fn(),
  findPublicacionesConFiltros: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findPublicadasYAbiertas: jest.fn(),
  findOnePublicada: jest.fn(),
};

const mockRequest = {
  user: {
    id: 1,
    roles: [Role.PUBLICADOR],
  },
};

const mockMascota: Mascota = {
  id: 1,
  nombre: 'Rocky',
  raza: 'Labrador',
  sexo: 'Macho',
  edad: 3,
  vacunado: true,
  tamanio: 'Mediano',
  fotos_url: [
    'https://sitioWeb.com/foto1.jpg',
    'https://sitioWeb.com/foto2.jpg'
  ],
  especie_id: 1,
  condicion_id: 1,
  usuario_id: 1,
  createdAt: new Date('2025-06-19T10:00:00Z'),
  updatedAt: new Date('2025-06-20T10:00:00Z'),
  deletedAt: new Date('2025-06-20T10:00:00Z'),
} as Mascota;

const mockVisita: Visita = {
  id: 1,
  estado: EstadoVisita.Pendiente,
  nombre: 'Marcos',
  apellido: 'Velardez',
  telefono: '11-2233-4455',
  email: 'publicadortest@gmail.com',
  disponibilidad_fecha: new Date('2025-06-01'),
  disponibilidad_horario: DisponibilidadHoraria.Tarde,
  descripcion: 'Motivo de la visita',
  tracking: 'VISIT-20250614-ABC123',
  publicacion_id: 1,
  createdAt: new Date('2025-06-20T12:00:00Z'),
  updatedAt: new Date('2025-06-20T12:00:00Z'),
  deletedAt: new Date('2025-06-20T12:00:00Z'),
} as Visita;


const mockPublicacion: Publicacion = {
  id: 1,
  titulo: 'Publicación de prueba',
  descripcion: 'Descripción de la publicación de prueba',
  ubicacion: 'Buenos Aires',
  contacto: 'contactotest@gmail.com',
  publicado: new Date('2025-06-20T12:00:00Z'),
  estado: EstadoPublicacion.Abierta,
  mascota_id: 1,
  mascota: mockMascota as Mascota,
  visita: [mockVisita as Visita],    
  createdAt: new Date('2025-06-19T10:00:00Z'),
  updatedAt: new Date('2025-06-20T10:00:00Z'),
  deletedAt: new Date('2025-06-20T10:00:00Z'),
} as Publicacion;

describe('PublicacionesController', () => {
  let controller: PublicacionesController;
  let service: PublicacionesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PublicacionesController],
      providers: [
        {
          provide: PublicacionesService,
          useValue: mockPublicacionesService,
        },
      ],
    }).compile();

    controller = moduleRef.get<PublicacionesController>(PublicacionesController);
    service = moduleRef.get<PublicacionesService>(PublicacionesService);
    
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('Debería devolver las publicaciones del usuario autenticado.', async () => {
      const result = [{ id: 1 }] as Publicacion[];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(1, mockRequest as any)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(1, mockRequest.user);
    });
  });

  describe('findPublicacionesConFiltros', () => {
    it('Deberían devolverse las publicaciones filtradas.', async () => {
      const mockResult = { publicaciones: [ mockPublicacion ], total: 10, totalPages: 2 };
      const queryParams = new QueryOpcionesDto();
      jest.spyOn(service, 'findPublicacionesConFiltros').mockResolvedValue(mockResult);

      const response = await controller.findPublicacionesConFiltros(
        1,
        mockRequest as any,
        queryParams
      );
      
      expect(response).toEqual(mockResult);
      expect(service.findPublicacionesConFiltros).toHaveBeenCalledWith(
        1,
        mockRequest.user,
        queryParams
      );
    });
  });

  describe('create', () => {
    it('Debería crear una nueva publicación', async () => {
      const dto = new CreatePublicacionDto();
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto, 1, mockRequest as any)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto, 1, mockRequest.user);
    });
  });

  describe('findOne', () => {
    it('Debería devolver una sola publicación', async () => {
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1, 2, mockRequest as any)).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(2, 1, mockRequest.user);
    });
  });

  describe('update', () => {
    it('Debería actualizar la publicación existente', async () => {
      const dto = new UpdatePublicacionDto();
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, 2, dto, mockRequest as any)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(2, dto, 1, mockRequest.user);
    });
  });

  describe('remove', () => {
    it('Debería eliminar la publicación', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1, 2, mockRequest as any);
      expect(service.remove).toHaveBeenCalledWith(2, 1, mockRequest.user);
    });
  });

  describe('findAllPublicadas', () => {
    it('Deberían devolverse las publicaciones públicas.', async () => {
      const result = [{ id: 1 }] as Publicacion[];
      jest.spyOn(service, 'findPublicadasYAbiertas').mockResolvedValue(result);

      expect(await controller.findAllPublicadas()).toEqual(result);
    });
  });

  describe('findOnePublicada', () => {
    it('Debería devolver una única publicación pública.', async () => {
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'findOnePublicada').mockResolvedValue(result);

      expect(await controller.findOnePublicada(1)).toEqual(result);
    });
  });
});
