import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

let clientId = "1e741b3b909282a50fe8";
let extensionRedirectUri = chrome.identity.getRedirectURL();

document.querySelector("#github").addEventListener("click", () => {
  const authUrl = new URL("https://github.com/login/oauth/authorize");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", extensionRedirectUri);

  chrome.identity.launchWebAuthFlow(
    {
      url: authUrl.href,
      interactive: true,
    },
    async (redirectUrl) => {
      if (redirectUrl) {
        const queryString = new URL(redirectUrl).search;
        const params = new URLSearchParams(queryString);
        const code = params.get("code");

        const authUrl = new URL("https://github.com/login/oauth/access_token");
        authUrl.searchParams.append("client_id", clientId);
        authUrl.searchParams.append("redirect_uri", extensionRedirectUri);
        authUrl.searchParams.append(
          "client_secret",
          // This token was revoked.
          // Use PKCE to avoid including this in extension source.
          "42d9bd039058a07593850233333f2df032b42311"
        );
        authUrl.searchParams.append("code", code);

        const response = await fetch(authUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        });

        const accessTokenData = await response.json();

        const r = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: "Bearer " + accessTokenData.access_token,
          },
        });

        document.querySelector("#github-data").innerText = JSON.stringify(
          await r.json(),
          null,
          2
        );
      }
    }
  );
});
