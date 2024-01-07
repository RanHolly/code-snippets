import { Users } from "./entity/users";
//other import entities

export const entity = [ Users ];

const collection = new Map<string, any>();

for (const Data of entity) {
    collection.set(Data.name.toLowerCase(), Data); //I recommend naming the classes after your table. Don't worry about Raised letters - they will be lowered.) For example - Users -> users.
}

export const collectionEntity = collection; //or other name;