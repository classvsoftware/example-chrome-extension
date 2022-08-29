import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

let apis = [];

let values = [];

function getApiMethods(namespace, prefix) {
  for (let propertyName of Object.getOwnPropertyNames(namespace).sort()) {
    if (typeof namespace[propertyName] === "object") {
      getApiMethods(namespace[propertyName], `${prefix}.${propertyName}`);
      continue;
    }

    if (typeof namespace[propertyName] === "function") {
      apis.push({
        name: `${prefix}.${propertyName}()`,
        ref: namespace[propertyName],
      });
    } else {
      values.push({
        name: `${prefix}.${propertyName}`,
        ref: namespace[propertyName],
      });
    }
  }
}

getApiMethods(chrome, "chrome");

document.querySelector("#api-list").innerHTML = apis
  .map((x) => `<pre>${x.name}</pre>`)
  .join("");
document.querySelector("#values-list").innerHTML = values
  .map((x) => `<pre>${x.name}</pre><pre>${x.ref}</pre>`)
  .join("");
