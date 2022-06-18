import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import renderMiddleware from "./middlewares/renderMiddleware.js";
import {
  isNumeric,
  isNumber,
  numberBetween,
  minLength,
  required,
  validate,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const validationRules = {
  name: [required, minLength(4)],
  yearOfBirth: [required, isNumeric],
  year_as_number: [isNumber, numberBetween(1900, 2000)],
};

const app = new Application();
const router = new Router();

app.use(renderMiddleware);

const showForm = ({ render }) => {
  render("index.eta", { errors: [], name: "", yearOfBirth: "" });
};

const submitForm = async ({ request, response, render }) => {
  const data = await getData(request);
  const [passes, errors] = await validate(data, validationRules);
  if (!passes) {
    data.errors = errors;
    render("index.eta", data);
  } else {
    response.redirect("/");
  }
};

const getData = async (request) => {
  const data = {
    name: "",
    yearOfBirth: "",
    year_as_number: null,
    errors: null,
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.name = params.get("name");
    data.yearOfBirth = params.get("yearOfBirth");
    try {
      data.year_as_number = Number(params.get("yearOfBirth"));
    } catch (e) {
      data.year_as_number = "Not a number";
    }
  }

  return data;
};

router.get("/", showForm);
router.post("/", submitForm);

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
