// WebSocket 接続を作成
const socket = new WebSocket("ws://localhost:3000");

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
