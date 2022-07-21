export async function sendStaticRedirectRequest() {
  fetch("https://httpbin.org/anything/static/redirectme").then(
    () => {},
    () => {}
  );
}

export async function sendStaticBlockRequest() {
  fetch("https://httpbin.org/anything/static/blockme").then(
    () => {},
    () => {}
  );
}

export async function sendDynamicRedirectRequest() {
  fetch("https://httpbin.org/anything/dynamic/redirectme").then(
    () => {},
    () => {}
  );
}

export async function sendDynamicBlockRequest() {
  fetch("https://httpbin.org/anything/dynamic/blockme").then(
    () => {},
    () => {}
  );
}
