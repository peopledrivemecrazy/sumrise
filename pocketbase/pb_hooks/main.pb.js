routerAdd("GET", "/ping", (e) => {
    return e.json(200, { message: "pong" });
});
