import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('drafts')
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Get()
  findAll(@Query('leagueId') leagueId?: string) {
    return this.draftsService.findAll(leagueId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.draftsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createDraftDto: CreateDraftDto) {
    return this.draftsService.create(createDraftDto);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  start(@Param('id') id: string) {
    return this.draftsService.startDraft(id);
  }

  @Post(':id/pick')
  @UseGuards(JwtAuthGuard)
  makePick(
    @Param('id') id: string,
    @Body('teamId') teamId: string,
    @Body('playerId') playerId: string,
  ) {
    return this.draftsService.makePick(id, teamId, playerId);
  }

  @Post(':id/end')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  end(@Param('id') id: string) {
    return this.draftsService.endDraft(id);
  }
}

