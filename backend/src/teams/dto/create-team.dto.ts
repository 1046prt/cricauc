import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsUUID()
  leagueId: string;
}

