import { initializeBoilerplate, showToast } from "/scripts/shared.js";

initializeBoilerplate();

document.querySelector("#toolbar-image").addEventListener("click", () => {
  const randomHexColor =
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const canvas = new OffscreenCanvas(16, 16);
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, 16, 16);
  context.fillStyle = randomHexColor;
  context.fillRect(0, 0, 16, 16);
  const imageData = context.getImageData(0, 0, 16, 16);
  chrome.action.setIcon({ imageData: imageData }, () => {
    showToast({
      body: `Set tooltip icon to "${randomHexColor}"`,
    });
  });
});

document.querySelector("#tooltip-btn").addEventListener("click", () => {
  const title = document.querySelector("#tooltip").value;

  chrome.action.setTitle(
    {
      title,
    },
    () => {
      showToast({
        body: `Set tooltip text to "${title}"`,
      });
    }
  );
});
