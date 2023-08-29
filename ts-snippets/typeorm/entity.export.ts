import { Users } from "./entity/users";
//other entities

export const entity = [ Users ];

const collection = new Map<string, any>();

for (const Data of entity) {
    collection.set(Data.name.toLowerCase(), Data); //I recommend naming the classes after your table. Don't worry about Raised letters - they will be lowered.) For example - Users -> users.
}

export const entityCollection = collection; //or other name;