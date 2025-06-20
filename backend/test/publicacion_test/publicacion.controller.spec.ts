import { Test } from '@nestjs/testing';
import { PublicacionesController } from '../../src/publicacion/publicacion.controller';
import { PublicacionesService } from '../../src/publicacion/publicacion.service';
import { CreatePublicacionDto } from '../../src/publicacion/dto/create-publicacion.dto';
import { UpdatePublicacionDto } from '../../src/publicacion/dto/update-publicacion.dto';
import { QueryOpcionesDto } from '../../src/common/dto/query-opciones.dto';
import { Publicacion } from '../../src/publicacion/publicacion.model';
import { Role } from '../../src/auth/roles.enum';

// Mock service implementation
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

// Mock request object with user data
const mockRequest = {
  user: {
    id: 1,
    roles: [Role.PUBLICADOR],
  },
};

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

  // Test 1: Authenticated user - Get all posts
  describe('findAll', () => {
    it('should return posts for authenticated user', async () => {
      const result = [{ id: 1 }] as Publicacion[];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(1, mockRequest as any)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(1, mockRequest.user);
    });
  });

  // Test 2: Filtered posts with pagination
  describe('findPublicacionesConFiltros', () => {
    it('should return filtered posts', async () => {
      const mockResult = { publicaciones: [{}], total: 10, totalPages: 2 };
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

  // Test 3: Create post
  describe('create', () => {
    it('should create new post', async () => {
      const dto = new CreatePublicacionDto();
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto, 1, mockRequest as any)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto, 1, mockRequest.user);
    });
  });

  // Test 4: Get single post (authenticated)
  describe('findOne', () => {
    it('should return single post', async () => {
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1, 2, mockRequest as any)).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(2, 1, mockRequest.user);
    });
  });

  // Test 5: Update post
  describe('update', () => {
    it('should update existing post', async () => {
      const dto = new UpdatePublicacionDto();
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, 2, dto, mockRequest as any)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(2, dto, 1, mockRequest.user);
    });
  });

  // Test 6: Delete post
  describe('remove', () => {
    it('should delete post', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1, 2, mockRequest as any);
      expect(service.remove).toHaveBeenCalledWith(2, 1, mockRequest.user);
    });
  });

  // Test 7: Public endpoint - Get all published posts
  describe('findAllPublicadas', () => {
    it('should return public posts', async () => {
      const result = [{ id: 1 }] as Publicacion[];
      jest.spyOn(service, 'findPublicadasYAbiertas').mockResolvedValue(result);

      expect(await controller.findAllPublicadas()).toEqual(result);
    });
  });

  // Test 8: Public endpoint - Get single published post
  describe('findOnePublicada', () => {
    it('should return single public post', async () => {
      const result = { id: 1 } as Publicacion;
      jest.spyOn(service, 'findOnePublicada').mockResolvedValue(result);

      expect(await controller.findOnePublicada(1)).toEqual(result);
    });
  });
});
