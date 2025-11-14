import { IsUUID, IsNumber } from 'class-validator';

export class CreateAuctionDto {
  @IsUUID()
  leagueId: string;

  @IsUUID()
  playerId: string;

  @IsNumber()
  startingPrice: number;
}

