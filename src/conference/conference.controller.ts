import { Body, Controller, Get, Inject, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/roles/roles.enum';
import { Conference } from './entities/conference.entity';
import type { IConferenceService } from './interface/conference.service.interface';

@Controller('conference')
export class ConferenceController {
  constructor(
    @Inject('IConferenceService')
    private readonly conferenceService: IConferenceService,
  ) {}

  @ApiOperation({ summary: 'Get conference settings (public)' })
  @Get()
  async getSettings(): Promise<{ data: Conference }> {
    const settings = await this.conferenceService.getSettings();
    return { data: settings };
  }

  @ApiOperation({ summary: 'Update conference settings (admin only)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put()
  async updateSettings(
    @Body() dto: UpdateConferenceDto,
  ): Promise<{ data: Conference }> {
    const settings = await this.conferenceService.updateSettings(dto);
    return { data: settings };
  }
}
