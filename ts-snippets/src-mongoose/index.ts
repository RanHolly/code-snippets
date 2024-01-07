import { MongoConnect } from "./database/connect";
import { Database } from "./database";
import { Types } from "mongoose";

new MongoConnect();

/** This is just a small code example. This is not the final version of the code. 
 * 
 * \+ id and name you can change to any other. 
 * 
 * P.S. findOneOrCreate may change because the type `IUsers | Document<unknown, object, IUsers>` is not very convenient 
 */
async function example() {
  const db = new Database();

  const users = await db.findOneOrCreate({ id: `0` }, { _id: new Types.ObjectId(), id: `0`, nickname: `someNick` }, `users`);

  if (users.error) return console.error(users.error);
  if (users.created) return await example();
  console.log(users.res);
}

