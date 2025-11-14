import { IsEnum, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { LeagueType } from '../entities/league.entity';

export class CreateLeagueDto {
  @IsString()
  name: string;

  @IsEnum(LeagueType)
  type: LeagueType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  basePurse: number;

  @IsOptional()
  @IsNumber()
  maxPlayersPerTeam?: number;

  @IsOptional()
  @IsNumber()
  maxPlayersPerAuction?: number;

  @IsOptional()
  @IsNumber()
  auctionTimerSeconds?: number;

  @IsOptional()
  @IsNumber()
  minBidIncrement?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
