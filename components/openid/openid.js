import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

let clientId =
  "594787837490-j16e3chcsvich92viqjvcrs0mlee33lb.apps.googleusercontent.com";
let extensionRedirectUri = chrome.identity.getRedirectURL();
let nonce = Math.random().toString(36).substring(2, 15);

document.querySelector("#openid").addEventListener("click", () => {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "id_token");
  authUrl.searchParams.set("redirect_uri", extensionRedirectUri);
  // Add the OpenID scope. Scopes allow you to access the user’s information.
  authUrl.searchParams.set("scope", "openid profile email");
  authUrl.searchParams.set("nonce", nonce);
  // Show the consent screen after login.
  authUrl.searchParams.set("prompt", "consent");

  chrome.identity.launchWebAuthFlow(
    {
      url: authUrl.href,
      interactive: true,
    },
    (redirectUrl) => {
      if (redirectUrl) {
        // The ID token is in the URL hash
        const urlHash = redirectUrl.split("#")[1];
        const params = new URLSearchParams(urlHash);
        const jwt = params.get("id_token");

        // Parse the JSON Web Token
        const base64Url = jwt.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const token = JSON.parse(atob(base64));

        document.querySelector("#openid-data").innerText = JSON.stringify(
          token,
          null,
          2
        );
      }
    }
  );
});
