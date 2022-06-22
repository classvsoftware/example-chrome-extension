import { initializeBoilerplate } from "/scripts/shared.js";

initializeBoilerplate({ title: "Inspect Extension Url" });

document.querySelector("#url").value = window.location.href;
document.querySelector("#protocol").value = window.location.protocol;
document.querySelector("#hostname").value = window.location.hostname;
document.querySelector("#pathname").value = window.location.pathname;
