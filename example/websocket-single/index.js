module.exports = {
    onConnect(socket) {
        // 1秒后断开连接
        console.log('connect');
        setTimeout(() => {
            socket.disconnect();
        }, 1000);
    },
    onDisconnect(socket) {
        console.log('close');
    },
    onError(err, socket) {
        console.log('err:', err);
    }
};