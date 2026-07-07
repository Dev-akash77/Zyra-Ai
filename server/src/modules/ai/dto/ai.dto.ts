import { IsNotEmpty, IsString } from 'class-validator';

export class IngestDataDto {
  @IsString()
  @IsNotEmpty({ message: 'Text Must Provide' })
  text!: string;

  @IsString()
  @IsNotEmpty({ message: 'Source Meta Data is Missing' })
  source!: string;
}

export class AskZyraDto {
  @IsString()
  @IsNotEmpty({ message: 'Must Provide Query' })
  query!: string;
}