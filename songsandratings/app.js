import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { executeQuery } from "./database/database.js";

const app = new Application();
const router = new Router();

const allSongs = async ({ response }) => {
  const result = await executeQuery("SELECT * FROM songs;");
  response.body = result.rows;
};

const songById = async ({ response, params }) => {
  const result = await executeQuery("SELECT * FROM songs WHERE id = $1;", params.id);
  response.body = result.rows[0];
};

const addSong = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const content = await body.value;
  await executeQuery(
    "INSERT INTO songs (name, rating) VALUES ($1, $2);",
    content.name,
    content.rating,
  );
  response.body = {status: "success"};
};

const deleteSongById = async ({ params, response }) => {
  await executeQuery(
    "DELETE FROM songs WHERE id = $1;",
    params.id
  );
  response.body = {status: "success"};
};

router.get("/songs", allSongs);
router.get("/songs/:id", songById);
router.post("/songs", addSong);
router.delete("/songs/:id", deleteSongById);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
