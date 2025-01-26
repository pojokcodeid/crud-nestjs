import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserWithToken } from 'src/user/user.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Retrieves all users from the database.
   * @returns A promise that resolves to an array of users.
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => ({ ...user, password: 'xxxxxxxxxxx' }));
  }

  /**
   * Retrieves a user by their unique identifier, or null if not found.
   * @param id The unique identifier of the user to search for.
   * @returns The user object if found, or null if not found.
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return { ...user, password: 'xxxxxxxxxxx' };
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
    const user = await this.prisma.user.update({ where: { id }, data });
    return { ...user, password: 'xxxxxxxxxxx' };
  }

  async updatNoPassword(id: number, data: UpdateUserDto): Promise<User> {
    // check email exists or not
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
      },
    });
    return { ...user, password: 'xxxxxxxxxxx' };
  }

  /**
   * Deletes a user by their id.
   * @param id The id of the user to delete.
   * @returns The deleted user.
   */
  async delete(id: number): Promise<User> {
    return await this.prisma.user
      .delete({ where: { id } })
      .then((user) => ({ ...user, password: 'xxxxxxxxxxx' }));
  }

  async verifyUser(
    email: string,
    password: string,
  ): Promise<UserWithToken | undefined> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (bcrypt.compareSync(password, user.password as string)) {
      const payload = { sub: user.id, email: user.email };
      return {
        ...user,
        password: 'xxxxxxxxxxx',
        token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
