import { CreateUsuarioDto } from './usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from './usuario/dto/update-usuario.dto';
import { mockUsersArray, mockUser } from './mock-user';
import { MockAuthGuard } from './mock-auth.guard';

const mockAuthGuard = new MockAuthGuard();

export const mockUsersService = {
  findAll: jest.fn().mockResolvedValue(mockUsersArray),
  
  //findOne: jest.fn().mockImplementation((id: number) => Promise.resolve(mockUser)),
  
  findOne: jest.fn().mockImplementation((id: number, user: any) => {
   const mockRequest = mockAuthGuard.createMockRequest();
   const authenticatedUser = user || mockRequest.user;

   if (authenticatedUser && authenticatedUser.id === id) {
    return Promise.resolve(mockUser);
   }
   // Devolver null si no coincide ó manejar el error
    return Promise.resolve(null);
  }),
  
  create: jest.fn().mockImplementation((dto: CreateUsuarioDto) => Promise.resolve(mockUser)),
  update: jest.fn().mockImplementation((id: number, dto: UpdateUsuarioDto) => Promise.resolve(mockUser)),
  remove: jest.fn().mockResolvedValue(undefined),
};