import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateHistoricalPointsDto {
  @IsUUID()
  playerId: string;

  @IsString()
  season: string;

  @IsString()
  leagueType: string;

  @IsNumber()
  totalPoints: number;

  @IsOptional()
  @IsNumber()
  matchesPlayed?: number;

  @IsOptional()
  @IsNumber()
  runs?: number;

  @IsOptional()
  @IsNumber()
  wickets?: number;

  @IsOptional()
  detailedStats?: Record<string, any>;
}

