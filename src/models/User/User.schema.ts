import { Schema, UpdateQuery } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import { hashValue } from '../../utils/security/hash/security.service'
import { TUser } from '../interfaces/types/document.type'
import noteRepository from '../../common/repositories/note.repository'
import labelRepository from '../../common/repositories/label.repository'
import otpRepository from '../../common/repositories/otp.repository'
import { OtpType } from '../interfaces/enums/otp.enum'

export const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'fullName is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      trim: true,
    },
    changedCredentialsAt: {
      type: Date,
    },
    age: {
      type: Number,
      required: [true, 'birthDate is required'],
      min: 15,
    },
  },
  { timestamps: true },
)

userSchema
  .virtual('birthDate')
  .get(function (v) {
    return new Date().getFullYear() - new Date(v).getFullYear()
  })
  .set(function (v) {
    return this.set('age', new Date().getFullYear() - new Date(v).getFullYear())
  })

userSchema.pre('save', function (next) {
  if (this.isModified('password')) this.password = hashValue(this.password)

  return next()
})

userSchema.post('save', async function (res) {
  const userDoc: Pick<IUser, 'email'> = res
  await otpRepository.findOneAndDelete({
    filter: {
      email: userDoc.email,
      type: OtpType.confirm,
    },
  })
})

userSchema.pre('findOneAndUpdate', function (next) {
  const updatedData: UpdateQuery<IUser> | null = this.getUpdate()
  const keys = Object.keys(updatedData ?? {}) as (keyof IUser)[]

  if (updatedData && keys.includes('password'))
    this.setUpdate({
      password: hashValue(updatedData.password),
      $set: {
        changedCredentialsAt: Date.now(),
      },
    })

  return next()
})

userSchema.post('findOneAndDelete', async function (res: IUser, next) {
  Promise.allSettled([
    noteRepository.deleteMany({ createdBy: res._id }),

    labelRepository.deleteMany({ createdBy: res._id }),
  ])
})
