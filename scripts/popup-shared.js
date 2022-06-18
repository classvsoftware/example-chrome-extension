async function addPopupNavbar() {
  document.body.innerHTML =
    (await fetch("/templates/popup-navbar.html").then((r) => r.text())) +
    document.body.innerHTML;

  document.querySelector("#url").value = window.location.href;
}

addPopupNavbar();
