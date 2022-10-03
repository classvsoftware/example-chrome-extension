import { initializeComponent } from "/scripts/shared.js";

initializeComponent();

function getRandomBytes() {
  const rndArray = new Uint8Array(44);
  window.crypto.getRandomValues(rndArray);
  return rndArray;
}

function buf2Base64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function windowSha256(buffer) {
  const bytes = new TextEncoder().encode(buffer);
  return await window.crypto.subtle.digest("SHA-256", bytes);
}

const extensionRedirectUrl = chrome.identity.getRedirectURL();

const config = {
  domain: "dev-lzp3nmk4.us.auth0.com",
  clientId: "C4A0S2iCrMe4EQGOkkxGLkAxVdVXeMz2",
};

// Generate a codeChallenge Sha256 code challenge and verifier
// https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#create-code-verifier
const inputBytes = getRandomBytes();
const verifier = buf2Base64(inputBytes);

const shaHash = await windowSha256(verifier);
const codeChallenge = buf2Base64(shaHash);

// Now we make a request to authorise the user using chrome's identity framework.
// We get a code back.
const options = {
  client_id: config.clientId,
  redirect_uri: extensionRedirectUrl,
  response_type: "code",
  scope: "openid",
  code_challenge: codeChallenge,
  code_challenge_method: "S256",
};

document.querySelector("#auth0").addEventListener("click", () => {
  const authUrl = new URL(`https://${config.domain}/authorize`);

  for (const [key, value] of Object.entries(options)) {
    authUrl.searchParams.set(key, value);
  }

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

        const body = {
          redirect_uri: redirectUrl,
          grant_type: "authorization_code",
          client_id: config.clientId,
          code_verifier: verifier,
          code: code,
        };

        const authUrl = new URL(`https://${config.domain}/oauth/token`);

        const response = await fetch(authUrl, {
          method: "POST",
          body: new URLSearchParams(body),
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        });

        const accessTokenData = await response.json();

        const r = await fetch(`https://${config.domain}/userinfo`, {
          headers: {
            Authorization: "Bearer " + accessTokenData.access_token,
          },
        });

        document.querySelector("#auth0-data").innerText = JSON.stringify(
          await r.json(),
          null,
          2
        );
      }
    }
  );
});
