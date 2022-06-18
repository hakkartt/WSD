import { Application, Session } from "./deps.js";
import { router } from "./routes/routes.js";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import {
  errorMiddleware,
  requestTimingMiddleware,
  authMiddleware,
  serveStaticFilesMiddleware,
} from "./middlewares/middlewares.js";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

app.use(
  viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views",
  })
);

app.use(errorMiddleware);
app.use(requestTimingMiddleware);
app.use(authMiddleware);
app.use(serveStaticFilesMiddleware);

app.use(router.routes());

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port });
}

export { app };
