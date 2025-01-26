import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User') // Untuk mengelompokkan endpoint di Swagger
@ApiBearerAuth('access-token') // Menambahkan otorisasi Bearer Token di endpoint ini
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: Logger,
  ) {}

  private userCheck = async (id: number) => {
    const user = await this.userService.findById(id);
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
  };

  private userEmailCheck = async (id: number, email: string) => {
    const exists = await this.userService.findByEmail(email);
    if (exists && exists.id !== id) {
      console.log(exists, id);
      throw new HttpException(
        {
          message: ['Email already exists'],
          error: 'Bad Request',
          statusCode: 400,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  };
  /**
   * Retrieves all user data.
   * @returns A promise that resolves to a list of users.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  // ini contoh jika ingin req res dengan cara express js
  async users(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.userService.findAll();
      res.status(200).json({
        message: 'Get Success',
        data: data,
      });
    } catch (error: unknown) {
      res.status(500).json({ error });
      this.logger.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(200)
  async user(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.userService.findById(id);
      return {
        message: 'Get Success',
        data,
      };
    } catch (error) {
      this.logger.error(error);
    }
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
    try {
      body.password = bcrypt.hashSync(body.password, 10);
      const data = await this.userService.create(body);
      return {
        message: 'Create Success',
        data,
      };
    } catch (error) {
      this.logger.log(error);
    }
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
    @Body() body: UpdateUserDto,
  ) {
    await this.userCheck(id);
    await this.userEmailCheck(id, body.email as string);
    try {
      let user = {};
      if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
        user = await this.userService.update(id, body);
      } else {
        user = await this.userService.updatNoPassword(id, body);
      }
      return {
        message: 'Update Success',
        data: user,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Deletes a user by their id.
   * @param id The id of the user to delete.
   * @returns A promise that resolves to the deleted user.
   */
  @Delete('/:id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userCheck(id);
    const user = await this.userService.delete(id);
    try {
      return {
        message: 'Delete Success',
        data: user,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto) {
    const user = await this.userService.verifyUser(body.email, body.password);
    return {
      message: 'Login Success',
      data: user,
    };
  }
}
