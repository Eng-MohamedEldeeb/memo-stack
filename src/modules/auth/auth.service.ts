import otpRepository from '../../common/repositories/otp.repository'
import userRepository from '../../common/repositories/user.repository'
import { throwError } from '../../utils/handlers/error-message.handler'
import { compareValues } from '../../utils/security/hash/security.service'
import { signToken } from '../../utils/security/token/token.service'
import {
  IConfirmDeleteDto,
  IConfirmEmailDto,
  IDeleteAccountDto,
  IForgotPasswordDto,
  ILoginDto,
  IResetPasswordDto,
  IRegisterDto,
} from './dto/auth.dto'
import { OtpType } from '../../models/interfaces/enums/otp.enum'

class AuthService {
  private readonly userRepository = userRepository
  private readonly otpRepository = otpRepository

  readonly confirmEmail = async (confirmEmailDto: IConfirmEmailDto) => {
    const userExists = await this.userRepository.findOne({
      filter: { email: confirmEmailDto.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (userExists)
      return throwError({ msg: 'user already exists', status: 409 })

    const otpExists = await this.otpRepository.findOne({
      filter: { email: confirmEmailDto.email },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (otpExists)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: confirmEmailDto.email,
      type: OtpType.confirm,
    })
  }

  readonly register = async (registerDto: IRegisterDto) => {
    const { fullName, email, password, birthDate, otpCode } = registerDto

    const otpExists = await this.otpRepository.findOne({
      filter: { email, type: OtpType.confirm },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!otpExists) return throwError({ msg: 'code is expired', status: 400 })

    const validOtp = compareValues({
      value: otpCode,
      hashedValue: otpExists.otpCode,
    })

    if (!validOtp) return throwError({ msg: 'in-valid code', status: 400 })

    await this.userRepository.create({
      fullName,
      email,
      password,
      birthDate,
    })
  }

  readonly login = async (loginDto: ILoginDto) => {
    const { email, password } = loginDto

    const userExists = await this.userRepository.findOne({
      filter: { email },
      projection: { _id: 1, email: 1, password: 1 },
      options: { lean: true },
    })

    if (!userExists)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: userExists.password,
    })

    if (!isMatchedPasswords)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const accessToken = signToken({
      payload: {
        _id: userExists._id,
      },
      options: {
        expiresIn: '7d',
      },
    })

    return accessToken
  }

  readonly forgotPassword = async (forgotPasswordDto: IForgotPasswordDto) => {
    const userExists = await this.userRepository.findOne({
      filter: { email: forgotPasswordDto.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!userExists) throw { msg: 'in-valid email', status: 400 }

    const otpExists = await this.otpRepository.findOne({
      filter: { email: forgotPasswordDto.email, type: OtpType.forgot },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (otpExists)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: forgotPasswordDto.email,
      type: OtpType.forgot,
    })
  }

  readonly resetPassword = async (resetPasswordDto: IResetPasswordDto) => {
    const { email, newPassword, confirmPassword, otpCode } = resetPasswordDto

    const userExists = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!userExists) throw { msg: 'in-valid email', status: 400 }

    const otpExists = await this.otpRepository.findOne({
      filter: { email, type: OtpType.forgot },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!otpExists) return throwError({ msg: 'code is expired', status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: otpExists.otpCode,
    })

    if (!isMatchedOtp)
      return throwError({ msg: 'code is in-valid', status: 400 })

    await this.userRepository.findByIdAndUpdate({
      _id: userExists._id,
      data: {
        password: newPassword,
        changedCredentialsAt: Date.now(),
      },
      options: {
        lean: true,
        new: true,
      },
    })
  }

  readonly deleteAccount = async (deleteAccountDto: IDeleteAccountDto) => {
    const { email, password } = deleteAccountDto
    const userExists = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1, password: 1 },
      options: { lean: true },
    })

    if (!userExists)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: userExists.password,
    })

    if (!isMatchedPasswords)
      return throwError({ msg: 'in-valid email or password', status: 400 })

    const otpExists = await this.otpRepository.findOne({
      filter: { email: userExists.email, type: OtpType.verifyDeleting },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (otpExists)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: userExists.email,
      type: OtpType.verifyDeleting,
    })
  }

  readonly confirmDeleting = async (confirmDeletingDto: IConfirmDeleteDto) => {
    const { email, otpCode } = confirmDeletingDto

    const otpExists = await this.otpRepository.findOne({
      filter: {
        email,
        type: OtpType.verifyDeleting,
      },
    })

    if (!otpExists) return throwError({ msg: 'code is expired', status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: otpExists.otpCode,
    })

    if (!isMatchedOtp) return throwError({ msg: 'in-valid code', status: 400 })

    await this.userRepository.findOneAndDelete({
      filter: { email },
    })
  }
}

export default new AuthService()
