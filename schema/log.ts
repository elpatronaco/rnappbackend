import * as mongoose from 'mongoose'
import { IUser } from './users'
export interface ILog extends mongoose.Document {
  event: string
  logDate: Date
  user: IUser
}

export const LogSchema = new mongoose.Schema({
  event: { type: String, required: true },
  logDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
})

const Log = mongoose.model<ILog>('log', LogSchema)
export default Log
