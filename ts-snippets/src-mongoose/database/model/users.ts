import { Schema, Types, Model, model } from "mongoose";

//I came up with a user schema, where his id, nickname, level, experience and balance will be, so as not to repeat the example from the official mongoose documentation.

//here Users table Interface. Его можно реализовать в .d.ts, но я реализую его тут для сокращения количества файлов
interface IUsers { // For convenience, I put I at the beginning of the variable if it is an interface. Like here - IUsers
  _id: Types.ObjectId; // I don't remember the difference between Types and Schema.Types, but you can look in the mongoose documentation about this)
  id: string; // id user
  nickname: string; // nickname user
  level?: number;
  xp?: number;
  balance?: number;
}

const UsersSchema = new Schema<IUsers, Model<IUsers>>({
    _id: Schema.Types.ObjectId, // unique id for the DB (DB -> Database)
    id: { type: String, required: true }, // field for user id. I installed String because number is less than bigint (to “enable” support for BigInt, Long and other types, you need to install additional libraries)
    nickname: { type: String, required: true }, // Oh... yes. The required option means that this parameter will be required when creating a record in the table)
    level: { type: Number, default: 0 }, // the default option means that we can "skip" this argument when creating a record in the table
    xp: { type: Number, default: 0 },
    balance: { type: Number, default: 0 }
});

const Users = model(`users`, UsersSchema);

export { Users, IUsers };