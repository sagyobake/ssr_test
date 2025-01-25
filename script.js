// WebSocket 接続を作成
const socket = new WebSocket("ws://localhost:3000");

const send = document.getElementById("send");
send.addEventListener("click", (e) => {
    const answer = document.getElementById("answer").value;
    socket.send(answer);
    //socket.send(JSON.stringify({ answer: 100 }));
});

// 接続が開いたときのイベント
socket.addEventListener("open", (event) => {
    socket.send("ping");
});

// メッセージの待ち受け
socket.addEventListener("message", (event) => {
    const kv = JSON.parse(event.data);
    console.log(Object.keys(kv));

    const result = document.getElementById("result");
    result.textContent = kv["result"];

    const a = document.getElementById("a");
    const b = document.getElementById("b");
    a.textContent = kv["value"][0];
    b.textContent = kv["value"][1];
});
