import { send } from "https://deno.land/x/oak@v9.0.1/mod.ts";

const serveStaticFiles = async (context, next) => {
    if (context.request.url.pathname.startsWith("/static")) {
      const path = (context.request.url.pathname.substring(7));
  
      await send(context, path, {
        root: `${Deno.cwd()}/static`,
      });
    } else {
      await next();
    }
  };

  export { serveStaticFiles };