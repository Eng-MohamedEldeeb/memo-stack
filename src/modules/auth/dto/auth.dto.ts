import { IUserInputs } from '../../../models/interfaces/user.interface'

export interface IConfirmEmailDto extends Pick<IUserInputs, 'email'> {}

export interface IRegisterDto extends IUserInputs {}

export interface ILoginDto extends Pick<IUserInputs, 'email' | 'password'> {}

export interface IForgotPasswordDto extends Pick<IUserInputs, 'email'> {}

export interface IResetPasswordDto
  extends Pick<IUserInputs, 'email' | 'confirmPassword' | 'otpCode'> {
  newPassword: string
}

export interface IDeleteAccountDto
  extends Pick<IUserInputs, 'email' | 'password'> {}

export interface IConfirmDeleteDto
  extends Pick<IUserInputs, 'email' | 'otpCode'> {}
