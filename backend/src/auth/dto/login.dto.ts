import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@hillarystep.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

export class MfaVerifyDto {
  @ApiProperty({ example: 'base64-mfa-challenge-token' })
  @IsString()
  @IsNotEmpty()
  mfaToken: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class MfaEnrollDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class MfaRecoveryDto {
  @ApiProperty({ example: 'base64-mfa-challenge-token' })
  @IsString()
  @IsNotEmpty()
  mfaToken: string;

  @ApiProperty({ example: 'ABCD-1234-5678EF' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(128)
  code: string;
}

export class MfaDisableDto {
  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
