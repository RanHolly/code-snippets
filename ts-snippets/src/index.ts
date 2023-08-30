//Database usage example

import { Connect } from './typeorm/connection';
import { Database } from './typeorm/';

//connect database. One call in the root file is enough ... well, or wherever you want)
new Connect().connection();
//init database class
const db = new Database();

//And then we use the db methods in the places we need)
