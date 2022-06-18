const time = async ({response}, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    response.body = (response.body).concat(" ", ms, "ms");
};

export { time };