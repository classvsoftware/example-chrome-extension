import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

const authenticatedView = document.querySelector("#authenticated");
const unauthenticatedView = document.querySelector("#unauthenticated");
const identity = document.querySelector("#identity");

function login(token) {
  authenticatedView.classList.remove("hidden");
  unauthenticatedView.classList.add("hidden");

  fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token="${token}`,
    {
      method: "GET",
      async: true,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      contentType: "json",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      identity.innerHTML = JSON.stringify(data, null, 2);
    });
}

function logout() {
  authenticatedView.classList.add("hidden");
  unauthenticatedView.classList.remove("hidden");
  identity.innerText = "";
}

chrome.identity.getAuthToken({ interactive: false }, (token) => {
  if (!token) {
    logout();
  } else {
    console.log(token);
    login(token);
  }
});

document.querySelector("#login").addEventListener("click", () => {
  chrome.identity.getAuthToken(
    {
      interactive: true,
    },
    (token) => {
      if (token) {
        chrome.identity.getProfileUserInfo(
          { accountStatus: "ANY" },
          console.log
        );
        login(token);
      }
    }
  );
});

document.querySelector("#profileinfo").addEventListener("click", () => {
  chrome.identity.getProfileUserInfo({ accountStatus: "ANY" }, console.log);
});

document.querySelector("#logout").addEventListener("click", () => {
  chrome.identity.getAuthToken(
    {
      interactive: false,
    },
    (token) => {
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);

      chrome.identity.removeCachedAuthToken({ token: token }, () => {});

      logout();
    }
  );
});
