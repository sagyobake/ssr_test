// WebSocket 接続を作成
const socket = new WebSocket("wss://websocket-ssr-test.deno.dev/");

document.addEventListener("click", (e) => {
    console.log(e.target.id);
});

// 接続が開いたときのイベント
socket.addEventListener("open", (event) => {
    socket.send("ping");
});

// メッセージの待ち受け
socket.addEventListener("message", (event) => {
    console.log(event.data);
});
