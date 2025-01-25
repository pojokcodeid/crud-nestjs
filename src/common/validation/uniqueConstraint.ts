import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'EmailExists', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  private prisma = new PrismaService();
  async validate(value: string, args?: ValidationArguments): Promise<boolean> {
    const { table, field } = args?.constraints[0] as {
      table: string;
      field: string;
    };
    const parsing = JSON.parse(JSON.stringify(args?.object)) as {
      id: number;
    };
    let data = [];
    try {
      data = await this.prisma.$queryRaw`
        SELECT * FROM ${Prisma.raw(table)} WHERE ${Prisma.raw(field)} = ${value}
      `;
      const idUpdated = data[0] as { id: number };
      console.log(idUpdated);
      if (data.length > 0 && idUpdated.id != parsing.id) {
        return false;
      } else {
        return true;
      }
    } catch {
      return true;
    }
  }
  defaultMessage?(): string {
    return '$property already exists';
  }
}

export type IsUniqueInput = {
  table: string;
  field: string;
};

export function IsUnique(
  property: IsUniqueInput,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'UserExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsUniqueConstraint,
    });
  };
}
