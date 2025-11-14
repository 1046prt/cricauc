import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { PlayerRole } from '../entities/player.entity';

export class CreatePlayerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsEnum(PlayerRole)
  role: PlayerRole;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  stats?: Record<string, any>;
}

