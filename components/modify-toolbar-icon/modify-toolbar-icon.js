import { initializeBoilerplate, showToast } from "/scripts/shared.js";

initializeBoilerplate();

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

document
  .querySelector("#toolbar-image-random")
  .addEventListener("click", () => {
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
        body: `Set toolbar icon to "${randomHexColor}"`,
      });
    });
  });

document.querySelector("#toolbar-image-file").addEventListener("click", () => {
  const [file] = document.querySelector("#icon-file-input").files;

  if (file) {
    const canvas = new OffscreenCanvas(16, 16);
    const context = canvas.getContext("2d");

    var img = new Image();
    img.onload = function () {
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      chrome.action.setIcon(
        { imageData: context.getImageData(0, 0, 16, 16) },
        () => {
          showToast({
            body: `Updated toolbar icon`,
          });
        }
      );
    };

    img.src = URL.createObjectURL(file);
  }
});

document.querySelector("#toolbar-reset").addEventListener("click", () => {
  chrome.action.setIcon({ path: "/icons/codesearch_16x16.png" }, () => {
    showToast({
      body: `Reset toolbar icon`,
    });
  });

  chrome.action.setTitle(
    {
      title: "Browser Extension Explorer",
    },
    () => {
      showToast({
        body: `Reset tooltip text`,
      });
    }
  );
});
