import { IsNotEmpty, IsString } from 'class-validator';

export class QueryPdfDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}