const kv = await Deno.openKv();

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 上限を含み、下限も含む
}

Deno.serve({port: 3000},(req) => {
    if (req.headers.get("upgrade") !== "websocket") {
        return new Response(null, { status: 501 });
    }
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", () => {
        console.log("a client connected!");
    });
    socket.addEventListener("message", async (event) => {
        console.log(event.data);

        const a = getRandomIntInclusive(1, 100);
        const b = getRandomIntInclusive(1, 100);

        const kv = await Deno.openKv();

        await kv.set(["question"], [a, b]);

        const entry = await kv.get(["question"]);
        console.log(entry.key);
        console.log(entry.value);
        console.log(entry.versionstamp);

        socket.send(JSON.stringify(entry));
    });
    return response;
});
