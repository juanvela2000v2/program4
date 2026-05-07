import { IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  listingId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  method: string;
}

export class SimulatePaymentDto {
  @IsOptional()
  @IsUrl({ require_tld: false })
  webhookUrl?: string;
}
