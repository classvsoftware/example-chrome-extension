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
