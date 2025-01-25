const kv = await Deno.openKv();
let correct = 0;

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 上限を含み、下限も含む
}

const questionGenerator = async () => {
    const a = getRandomIntInclusive(1, 100);
    const b = getRandomIntInclusive(1, 100);
    correct = a + b;

    await kv.set(["question"], [a, b]);

    const entry = await kv.get(["question"]);
    //console.log(entry.key);
    console.log(entry.value);
    //console.log(entry.versionstamp);
    return JSON.stringify(entry);
};

const checkAnswer = async (answer) => {
    if (Number(answer) === correct) {
        await kv.set(["result"], "Correct");
    } else {
        await kv.set(["result"], "Incorrect");
    }
    const result = await kv.get(["result"]);
    return JSON.stringify(result);
};

Deno.serve({ port: 3000 }, (req) => {
    if (req.headers.get("upgrade") !== "websocket") {
        return new Response(null, { status: 501 });
    }
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", () => {
        console.log("a client connected!");
    });
    socket.addEventListener("message", async (event) => {
        console.log(event.data);

        const result = await checkAnswer(event.data);
        console.log(result);
        socket.send(result);

        const question = await questionGenerator();
        console.log(question);
        socket.send(question);
    });
    return response;
});
