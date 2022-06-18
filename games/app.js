import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import { executeQuery } from "./database/database.js";

const app = new Application();
const router = new Router();

const listGames = async ({ response }) => {
  const result = await executeQuery("SELECT * FROM games;");
  response.body = result.rows;
};

const addGame = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const content = await body.value;
  await executeQuery(
    "INSERT INTO games (name) VALUES ($1);",
    content.name,
  );
  response.body = {status: "success"};
};

const gameById = async ({ response, params }) => {
  const result = await executeQuery("SELECT * FROM games WHERE id = $1;", params.id);
  response.body = result.rows[0];
};

const deleteGameById = async ({ params, response }) => {
  await executeQuery(
    "DELETE FROM ratings WHERE game_id = $1;",
    params.id
  );
  await executeQuery(
    "DELETE FROM games WHERE id = $1;",
    params.id
  );
  response.body = {status: "success"};
};

const addRating = async ({ params, request, response }) => {
  const body = request.body({ type: "json" });
  const content = await body.value;
  await executeQuery(
    "INSERT INTO ratings (rating, game_id) VALUES ($1, $2);",
    content.rating,
    params.id,
  );
  response.body = {status: "success"};
};

const listRatings = async ({ params, response }) => {
  const result = await executeQuery(
    "SELECT * FROM ratings WHERE game_id = $1;",
    params.id,
  );
  response.body = result.rows;
};


router.get("/games", listGames);
router.post("/games", addGame);
router.get("/games/:id", gameById);
router.delete("/games/:id", deleteGameById);
router.post("/games/:id/ratings", addRating);
router.get("/games/:id/ratings", listRatings);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
