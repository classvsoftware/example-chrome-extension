console.log("keepalive BS");

// chrome.runtime.onConnect.addListener((port) => {
//   console.log("port");
//   if (port.name !== "KEEPALIVE") {
//     return;
//   }

//   port.onDisconnect.addListener(deleteTimer);
//   port._timer = setTimeout(forceReconnect, 60 * 1000, port);
// });
// function forceReconnect(port) {
//   deleteTimer(port);
//   port.disconnect();
// }
// function deleteTimer(port) {
//   if (port._timer) {
//     clearTimeout(port._timer);
//     delete port._timer;
//   }
// }
