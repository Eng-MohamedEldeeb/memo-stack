import joi from 'joi'
import {
  IConfirmDeleteDto,
  IConfirmEmailDto,
  IDeleteAccountDto,
  IForgotPasswordDto,
  ILoginDto,
  IResetPasswordDto,
  IRegisterDto,
} from '../dto/auth.dto'
import { generalFields } from '../../../common/validation/general-fields'

export const confirmEmailSchema = {
  body: joi
    .object<IConfirmEmailDto>()
    .keys({
      email: generalFields.email.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmEmail body is required',
    }),
}

export const registerSchema = {
  body: joi
    .object<IRegisterDto>()
    .keys({
      fullName: generalFields.fullName.required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.password
        .valid(joi.ref('password'))
        .required(),

      birthDate: generalFields.birthDate.required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'sign-up body is required',
    }),
}

export const loginSchema = {
  body: joi
    .object<ILoginDto>()
    .keys({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required()
    .messages({
      'any.required': 'login body is required',
    }),
}

export const forgotPasswordSchema = {
  body: joi
    .object<IForgotPasswordDto>()
    .keys({
      email: generalFields.email.required(),
    })
    .required()
    .messages({
      'any.required': 'forgotPassword body is required',
    }),
}

export const resetPasswordSchema = {
  body: joi
    .object<IResetPasswordDto>()
    .keys({
      email: generalFields.email.required(),
      newPassword: generalFields.password.required(),
      confirmPassword: generalFields.password
        .valid(joi.ref('newPassword'))
        .required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'resetPassword body is required',
    }),
}

export const deleteAccountSchema = {
  body: joi
    .object<IDeleteAccountDto>()
    .keys({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required()
    .messages({
      'any.required': 'deleteAccount body is required',
    }),
}

export const confirmDeleteSchema = {
  body: joi
    .object<IConfirmDeleteDto>()
    .keys({
      email: generalFields.email.required(),
      otpCode: generalFields.otpCode.required(),
    })
    .required()
    .messages({
      'any.required': 'confirmDelete body is required',
    }),
}
