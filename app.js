Deno.serve({ port: 3000 }, (req) => {
    console.log(req.url);

    if (req.url === "http://localhost:3000/") {
        if (req.headers.get("upgrade") !== "websocket") {
            return new Response(null, { status: 501 });
        }
        const { socket, response } = Deno.upgradeWebSocket(req);
        socket.addEventListener("open", async () => {
            console.log("a client connected!");
        });

        socket.onclose = async () => {
        };

        socket.addEventListener("message", async (event) => {
            console.log(event.data);

            socket.send("pong");
        });
        return response;
    }
});
