import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: "Le nom est obligatoire" })
  @MinLength(2, { message: "Le nom doit contenir au moins 2 caractères" })
  @MaxLength(50, { message: "Le nom ne peut pas dépasser 50 caractères" })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message: "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes",
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: "Veuillez fournir une adresse email valide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
  @MinLength(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères",
  })
  @MaxLength(128, {
    message: "Le mot de passe ne peut pas dépasser 128 caractères",
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&)",
  })
  password: string;

  @IsInt({ message: "L'âge doit être un nombre entier" })
  @Min(13, { message: "L'âge minimum est de 13 ans" })
  @Max(120, { message: "L'âge maximum est de 120 ans" })
  @IsNotEmpty({ message: "L'âge est obligatoire" })
  age: number;
}
