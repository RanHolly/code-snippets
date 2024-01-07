import { connect, set } from "mongoose";

export class MongoConnect {
  constructor() {
    set(`strictQuery`, true); // Failure to comply with the schema type will result in an error when creating/saving/changing
    this.run();
  }

  private run() {
    const dbName = process.env.DB_NAME;
    const uri = process.env.DB_URI;

    if (!dbName || !uri) throw new TypeError(`On startup, it was discovered that you did not enter DB_NAME/DB_URI. Look in .env`);

    connect(uri).then(() => console.log(`Database ${dbName} connected!`)).catch(console.error);
  }
}