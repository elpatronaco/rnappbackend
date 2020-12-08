import * as mongoose from 'mongoose'
import { IUser } from './users'

// TODO: add a user object (or just the pk)
export interface ILog extends mongoose.Document {
  event: string
  logDate: Date
  //user: IUser
}

export const LogSchema = new mongoose.Schema({
  event: { required: true },
  logDate: { required: true }
})

const Log = mongoose.model<ILog>('Log', LogSchema)
export default Log
