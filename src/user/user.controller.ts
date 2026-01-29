import {
  Body,
  Controller,
  Get,
  Inject,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { IUserService } from './interface/user.service.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from './roles/roles.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: 'get user profile' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('')
  async getProfile(@Req() request: Request): Promise<{ data: UserDto }> {
    const fullUser: UserDto = request['fullUser'];
    const user = await this.userService.getProfile(fullUser._id.toString());
    return { data: user };
  }

  @ApiOperation({ summary: 'update user profile' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('')
  async updateProfile(
    @Req() request: Request,
    @Body() dto: UpdateProfileDto,
  ): Promise<{ data: UserDto }> {
    const fullUser: UserDto = request['fullUser'];
    const updatedUser = await this.userService.updateProfile(fullUser._id, dto);
    return { data: updatedUser };
  }
}
