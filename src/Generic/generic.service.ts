import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "src/auth/dto/auth.dto";

export class GenericService<T> {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly modelName: string
  ) {}

  async create(data: CreateUserDto): Promise<T | null> {
    return this.prisma[this.modelName].create({ data });
  }

  async findAll(): Promise<T[]> {
    return this.prisma[this.modelName].findMany();
  }
  async findOne(where: { email: string }): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({
      where: where,
    });
  }
  async update(id: string, data: any): Promise<T | null> {
    return this.prisma[this.modelName].update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T | null> {
    return this.prisma[this.modelName].delete({ where: { id } });
  }
}
