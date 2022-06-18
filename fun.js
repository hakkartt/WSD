import { Client } from "https://deno.land/x/postgres@v0.13.0/mod.ts";

const client = new Client({
  hostname: "abul.db.elephantsql.com",
  database: "oizsoonc",
  user: "oizsoonc",
  password: "uUgB2_fSns-vRphLBgD3MYuZpgjx--Gi",
  port: 5432,
});


const findByNameLike = async (name) => {
  const likePart = `%${name}%`;
  await client.connect();
  const result = await client.queryObject(
    "SELECT * FROM names WHERE name ILIKE $1;",
    likePart
  );
  await client.end();
  return result.rows
};

export default findByName;
