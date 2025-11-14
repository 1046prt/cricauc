import { IsUUID, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateDraftDto {
  @IsUUID()
  leagueId: string;

  @IsOptional()
  @IsNumber()
  pickTimerSeconds?: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  pickOrder: string[]; // Array of team IDs
}

