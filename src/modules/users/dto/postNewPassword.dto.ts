import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PostNewPasswordDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  oldPassword: string;
}
