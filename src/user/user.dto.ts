import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUnique } from '../common/validation/uniqueConstraint';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsUnique({ table: 'user', field: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export type UserWithToken = {
  id: number;
  name: string | null;
  email: string;
  password: string;
  createtAt: Date;
  updatedAt: Date;
  token: string;
};
