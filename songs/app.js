import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import renderMiddleware from "./middlewares/renderMiddleware.js";
import { executeQuery } from "./database/database.js";

const app = new Application();
const router = new Router();

app.use(renderMiddleware);

const getSongs = async () => {
  const songs = await executeQuery("SELECT * FROM songs");
  if (!songs) {
    return [];
  }
  return songs.rows;
};

const showForm = async ({ render }) => {
  render("index.eta", { songs: await getSongs(), name: "", rating: "" });
};

const submitForm = async ({ request, response, render }) => {

  const data = await getData(request);
  data.errors = validate(data);
  if (data.errors.length > 0) {
    render("index.eta",
           { songs: await getSongs(),
             name: data.name,
             rating: data.rating,
             errors: data.errors,
           });
  } else {
    addData(data.name, data.rating);
    response.redirect("/");
  }
};

const getData = async (request) => {
  const data = {
    name: "",
    email: "",
    errors: [],
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.name = params.get("name");
    data.rating = params.get("rating");
  }

  return data;
};

const validate = (data) => {
  const errors = [];
  if (!data.name || data.name.length < 5 || data.name.length > 20) {
    errors.push("Song name must be between 5 and 20 characters long");
  }

  if (!data.rating || isNaN(data.rating) || data.rating < 1 || data.rating > 10) {
    errors.push("Rating must be a number between 1 and 10");
  }

  return errors;
};

const addData = async (name, rating) => {
  await executeQuery("INSERT INTO songs (name, rating) VALUES ($1, $2);",
    name,
    rating
    );
}

router.get("/", showForm);
router.post("/", submitForm);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
