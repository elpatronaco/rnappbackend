import * as mongoose from 'mongoose'

export interface ILoginData {
  email: string
  password: string
}

export interface IUserData extends ILoginData {
  name: string
  birthdate?: Date
}

export interface IUser extends mongoose.Document, IUserData {}

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: { unique: true },
  },
  password: { type: String, required: true },
  name: { type: String, required: true },
  birthdate: { type: Date, required: false },
})

const User = mongoose.model<IUser>('users', UserSchema)
export default User
