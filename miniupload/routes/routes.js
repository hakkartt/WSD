import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import * as formController from "./controllers/formController.js";

const router = new Router();

router.get("/", formController.viewForm)
    .post("/", formController.processUpload)
    .post("/files", formController.retrieveFile);

export { router };
