//Database usage example
const { connection } = require(`./typeorm/connection.js`);
const { Database } = require(`./typeorm`);

//connect database. One call in the root file is enough ... well, or wherever you want)
connection().then(() => {
  console.log(`Database is work`);
}).catch(e => console.error(e));
//init database class
const db = new Database();

//And then we use the db methods in the places we need)

(async () => {
  const checkUser = await db.fetchData(`id`, 1, `bakas`);
  if (checkUser.error) {
    console.error(checkUser);
    const newUser = await db.upsertData({ level: 1, xp: 2, balance: 1 }, `bakas`);
    console.log(newUser);
  } else {
    console.log(checkUser);
  }
})()