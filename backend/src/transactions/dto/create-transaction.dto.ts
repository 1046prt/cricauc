import { IsUUID, IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsUUID()
  teamId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  auctionId?: string;

  @IsOptional()
  @IsUUID()
  tradeId?: string;
}

