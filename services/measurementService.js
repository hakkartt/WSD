import { Client } from "https://deno.land/x/postgres@v0.13.0/mod.ts";

const client = new Client({
    hostname: "abul.db.elephantsql.com",
    database: "oizsoonc",
    user: "oizsoonc",
    password: "uUgB2_fSns-vRphLBgD3MYuZpgjx--Gi",
    port: 5432,
  });

const avgMeasurement = async () => {
  await client.connect();
  const all = await client.queryArray(
      "SELECT measurement FROM measurements WHERE measurement <= 1000 AND measurement >= 0;"
  );
  await client.end();
  if (all.rows.length > 0) {
    var sum = 0;
    for( var i = 0; i < all.rows.length; i++ ){
        sum += parseFloat( all.rows[i] );
    }
    const avg = sum / all.rows.length;
      return `Measurement average: ${avg}`
  }
  else {
      return "Not enough measurements for calculating the average."
  }
};

export { avgMeasurement };