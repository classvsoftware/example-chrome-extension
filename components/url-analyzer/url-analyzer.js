import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

document.querySelector("#url").value = window.location.href;
document.querySelector("#protocol").value = window.location.protocol;
document.querySelector("#hostname").value = window.location.hostname;
document.querySelector("#pathname").value = window.location.pathname;
