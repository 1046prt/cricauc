import { IsUUID, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTradeDto {
  @IsUUID()
  initiatorTeamId: string;

  @IsUUID()
  recipientTeamId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  initiatorPlayers: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  recipientPlayers: string[];

  @IsOptional()
  @IsNumber()
  cashInvolved?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
