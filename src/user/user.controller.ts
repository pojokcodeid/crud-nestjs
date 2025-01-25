import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  // HttpException,
  // HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/user/user.dto';
// import { plainToInstance } from 'class-transformer';
// import { validateOrReject } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Retrieves all user data.
   * @returns A promise that resolves to a list of users.
   */
  @Get()
  @HttpCode(200)
  async users() {
    const data = await this.userService.findAll();
    return {
      data,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  async user(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.findById(id);
    return {
      data,
    };
  }

  /**
   * Creates a new user.
   * @param body The user data to create, including id, email, and name.
   * @returns A promise that resolves to the created user.
   */
  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateUserDto) {
    // const user = await this.userService.findByEmail(body.email);
    // if (user) {
    //   throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    // }
    const data = await this.userService.create(body);
    return {
      data,
    };
  }

  /**
   * Updates a user.
   * @param body The user data to update, including id, email, and name.
   * @returns A promise that resolves to the updated user.
   */
  @Put('/:id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() body: { email?: string; name?: string },
  ) {
    return {
      data: await this.userService.update(id, body),
    };
  }

  /**
   * Deletes a user by their id.
   * @param id The id of the user to delete.
   * @returns A promise that resolves to the deleted user.
   */
  @Delete('/:id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      data: await this.userService.delete(id),
    };
  }
}
