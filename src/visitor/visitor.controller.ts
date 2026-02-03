import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import * as Express from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/user/roles/roles.enum';
import type { IVisitorService } from './interface/visitor.service.interface';
import { RecordVisitorDto } from './dto/record-visitor.dto';

function getClientIp(req: Express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0]?.trim() ?? '';
  }
  return (req as Express.Request & { ip?: string }).ip ?? req.socket?.remoteAddress ?? 'unknown';
}

@Controller('visitors')
export class VisitorController {
  constructor(
    @Inject('IVisitorService')
    private readonly visitorService: IVisitorService,
  ) {}

  @ApiOperation({ summary: 'Get total visitor count (public)' })
  @Get('count')
  async getCount(): Promise<{ data: { total: number } }> {
    const total = await this.visitorService.getTotalCount();
    return { data: { total } };
  }

  @ApiOperation({ summary: 'Get visitor summary: total + top countries (public)' })
  @Get('summary')
  async getSummary(): Promise<{
    data: { total: number; byCountry: Array<{ country: string; count: number }> };
  }> {
    const summary = await this.visitorService.getPublicSummary();
    return { data: summary };
  }

  @ApiOperation({ summary: 'Record a visit (public)' })
  @Post()
  async record(@Req() req: Express.Request, @Body() dto: RecordVisitorDto): Promise<{ data: { ok: boolean } }> {
    const ip = getClientIp(req);
    const userAgent = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : undefined;
    await this.visitorService.record(ip, dto, userAgent);
    return { data: { ok: true } };
  }

  @ApiOperation({ summary: 'Get visitor stats (admin only)' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats')
  async getStats(): Promise<{
    data: { total: number; byCountry: Array<{ country: string; count: number }>; byLocation: Array<{ country: string; city: string; count: number }> };
  }> {
    const stats = await this.visitorService.getStats();
    return { data: stats };
  }
}
