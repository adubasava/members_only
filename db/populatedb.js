require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   firstname VARCHAR ( 40 ) NOT NULL,
   lastname VARCHAR ( 72 ) NOT NULL,
   email VARCHAR ( 72 ) NOT NULL UNIQUE,
   password VARCHAR ( 255 ) NOT NULL,
   status BOOLEAN DEFAULT 'False'
);

CREATE TABLE IF NOT EXISTS messages (
   message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   user_id INTEGER,
   title VARCHAR ( 100 ) NOT NULL,
   timestamp TIMESTAMPTZ DEFAULT NOW(),
   text VARCHAR ( 500 ) NOT NULL,
   CONSTRAINT fk_user
	  FOREIGN KEY(user_id) 
      REFERENCES users(id)
		  ON DELETE SET NULL
);

INSERT INTO users (firstname, lastname, email, password) 
VALUES
  ('John', 'Doe', 'john@mail.com', '123'),
  ('Mary', 'Poppins', 'mary@mail.com', '123'),
  ('Britney', 'Spears', 'britney@mail.com', '123');

  
INSERT INTO messages (user_id, title, text) 
VALUES
  ('1', 'Hi there!', 'Hello from John!'),
  ('2', 'Good morning!', 'Nice to meet you!'),
  ('3', 'New film', 'Does anyone has time to go to the cinema?');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
