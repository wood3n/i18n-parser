import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@/entities/User";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  getOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
