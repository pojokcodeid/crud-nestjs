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
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
