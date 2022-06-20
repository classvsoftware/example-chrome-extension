export async function insertHeader() {
  const element = document.createElement("div");
  document.body.prepend(element);
  element.innerHTML = await fetch("/components/header/header.html").then((r) =>
    r.text()
  );
}
