const kv = await Deno.openKv();
await kv.set(["users"], {});

const setClients = async (socket) => {
    let users = await kv.get(["users"]);
    users[JSON.stringify(socket)] = "";
    await kv.set(["users"], {users});
};

Deno.serve({ port: 3000 }, (req) => {
    if (req.headers.get("upgrade") !== "websocket") {
        return new Response(null, { status: 501 });
    }
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", async () => {
        console.log("a client connected!");
        setClients(socket);
        console.log(await kv.get(["users"]));
    });

    socket.onclose = async () => {

    };

    socket.addEventListener("message", async (event) => {
        console.log(event.data);

        socket.send("pong");
    });
    return response;
});
