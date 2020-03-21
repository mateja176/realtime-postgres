import express from 'express';
import pg from 'pg';
import Pusher from 'pusher';

require('dotenv').config();

const app = express();

// declare variable to hold database connection
let pgClient;

// set the view engine to ejs
app.set('view engine', 'ejs');

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_CONNECTION_URL,
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Session middleware

const pusherOpts = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
};

function assertNonNullableObject<K extends string, V>(
  o: { [key in K]: V | undefined },
): asserts o is { [key in K]: V } {
  Object.entries(pusherOpts).forEach(([key, value]) => {
    if (value === undefined) {
      throw new Error(`Please provide "${key}" env variable`);
    }
  });
}

assertNonNullableObject(pusherOpts);

// Create an instance of Pusher
const pusher = new Pusher({
  ...pusherOpts,
  encrypted: true,
});

pool.connect((err, client) => {
  if (err) {
    console.log(err);
  }
  pgClient = client;
});

// listen on the app
app.listen(3000, () => {
  return console.log('Server is up on 3000');
});
