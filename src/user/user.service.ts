import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from 'src/user/user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all users from the database.
   * @returns A promise that resolves to an array of users.
   */
  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  /**
   * Retrieves a user by their unique identifier, or null if not found.
   * @param id The unique identifier of the user to search for.
   * @returns The user object if found, or null if not found.
   */
  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Retrieves a user by their email address, or null if not found.
   * @param email The email address to search for.
   * @returns The user object if found, or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Create a new user.
   * @param data The user data to create, including id, email, and name.
   * @returns The created user.
   */
  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  /**
   * update user data
   * @param id the id of the user
   * @param data {email, name} to update
   * @returns updated user
   */
  async update(id: number, data: UpdateUserDto): Promise<User> {
    // check email exists or not
    const exists = await this.findByEmail(data.email as string);
    if (exists && exists.id !== id) {
      throw new HttpException(
        {
          message: ['Email already exists'],
          error: 'Bad Request',
          statusCode: 400,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.prisma.user.update({ where: { id }, data });
  }

  /**
   * Deletes a user by their id.
   * @param id The id of the user to delete.
   * @returns The deleted user.
   */
  async delete(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException(
        {
          message: ['User not found'],
          error: 'Not Found',
          statusCode: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.prisma.user.delete({ where: { id } });
  }
}
