import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

const outgoingLogContainer = document.querySelector("#outgoing-log");
const incomingLogContainer = document.querySelector("#incoming-log");

let count = 0;

document.querySelector("#reset").addEventListener("click", () => {
  outgoingLogContainer.innerHTML = "";
  incomingLogContainer.innerHTML = "";
});

document.querySelector("#send-message").addEventListener("click", () => {
  const msg = {
    id: "BACKGROUND_MESSAGE_RELAY",
    count: ++count,
  };

  chrome.runtime.sendMessage(msg, (response) => {
    incomingLogContainer.innerHTML += `<div class="card">
        <pre class="card-header bg-success text-white">${response.text}</pre>
        <pre class="card-body">${JSON.stringify(response, null, 2)}</pre>
      </div>`;
  });

  outgoingLogContainer.innerHTML += `<div class="card">
  <pre class="card-header bg-primary text-white">Sending message ${count}</pre>
  <pre class="card-body">${JSON.stringify(msg, null, 2)}</pre>
</div>`;
});

document.querySelector("#connect-port").addEventListener("click", () => {
  const port = chrome.runtime.connect({ name: "BACKGROUND_PORT_RELAY" });

  port.onMessage.addListener((msg) => {
    incomingLogContainer.innerHTML += `<div class="card">
        <pre class="card-header bg-success text-white">${msg.text}</pre>
        <pre class="card-body">${JSON.stringify(msg, null, 2)}</pre>
    </div>`;
  });

  const interval = setInterval(() => {
    const msg = {
      count: ++count,
    };
    port.postMessage(msg);

    outgoingLogContainer.innerHTML += `<div class="card">
        <pre class="card-header bg-primary text-white">Sending message ${count}</pre>
        <pre class="card-body">${JSON.stringify(msg, null, 2)}</pre>
    </div>`;
  }, 300);

  setTimeout(() => {
    clearInterval(interval);

    port.disconnect();
  }, 3000);
});
