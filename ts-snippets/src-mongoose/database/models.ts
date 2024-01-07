import { Users, IUsers } from "./model/users";

export const modelsMap = { users: Users };

export type ModelsName = keyof typeof modelsMap;
export interface ModelsTable {
  users: IUsers;
}