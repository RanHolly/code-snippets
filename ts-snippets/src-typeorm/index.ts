//Database usage example

import { Connect } from "./database/connection";
import { Database } from "./database/";

//connect database. One call in the root file is enough ... well, or wherever you want)
new Connect().connection();
//init database class
const db = new Database();

//And then we use the db methods in the places we need)
