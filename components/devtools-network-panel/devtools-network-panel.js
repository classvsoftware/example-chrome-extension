import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

const logContainer = document.querySelector("#network-log");

document.querySelector("#reset").addEventListener("click", () => {
  logContainer.innerHTML = "";
});

let count = 0;

chrome.devtools.network.onNavigated.addListener((url) => {
  count++;

  logContainer.innerHTML += `
    <div class="card text-white bg-primary">
      <div class="card-header text-start">
        Visited ${url}
      </div>
    </div>  
    `;
});

chrome.devtools.network.onRequestFinished.addListener((request) => {
  count++;

  logContainer.innerHTML += `
  <div class="card text-black bg-white">
    <div class="card-header cursor-pointer" id="heading${count}" 
      data-bs-toggle="collapse" data-bs-target="#collapse${count}">
      ${request.request.url}
    </div>

    <div id="collapse${count}" class="collapse overflow-x-scroll" data-bs-parent="#network-log">
      <div class="card-body">
        <pre>${JSON.stringify(request, null, 2)}</pre>
      </div>
    </div>
  </div>  
  `;
});
