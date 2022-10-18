import { activeTab, initializeComponent, showToast } from "/scripts/shared.js";

initializeComponent().then(() => {
  //   showWarningIfNotPopup();
});

let stream = null;

const imgOutput = document.querySelector("#img-output");
const streamOutput = document.querySelector("#stream-output");
const downloadImageButton = document.querySelector("#download-image");
const downloadMhtmlButton = document.querySelector("#download-mhtml");
const captureVisibleTabButton = document.querySelector("#capture-visible-tab");
const pageCaptureButton = document.querySelector("#page-capture");
const tabCaptureButton = document.querySelector("#tab-capture");
const desktopCaptureButton = document.querySelector("#desktop-capture");

function reset() {
  window.URL.revokeObjectURL(downloadMhtmlButton.href);

  streamOutput.pause();

  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  imgOutput.src = "";
  streamOutput.src = "";
  downloadImageButton.href = "";
  downloadMhtmlButton.href = "";
  imgOutput.style.display = "none";
  streamOutput.style.display = "none";
  downloadImageButton.style.display = "none";
  downloadMhtmlButton.style.display = "none";
}

async function setImage() {
  reset();

  let imageData = await chrome.tabs.captureVisibleTab();

  showToast({
    body: `Captured screenshot of active tab`,
  });

  imgOutput.style.display = "block";
  imgOutput.src = imageData;
  downloadImageButton.href = imageData;
  downloadImageButton.style.display = "block";
}

async function setMhtml() {
  reset();

  chrome.pageCapture.saveAsMHTML(
    { tabId: (await activeTab())[0].id },
    (mhtmlBlob) => {
      const blobUrl = window.URL.createObjectURL(mhtmlBlob);

      showToast({
        body: `Captured MHTML of active tab`,
      });

      downloadMhtmlButton.href = blobUrl;
      downloadMhtmlButton.style.display = "block";
    }
  );
}

async function setTabStream() {
  reset();

  streamOutput.style.display = "block";

  chrome.tabCapture.capture(
    {
      audio: true,
      video: true,
    },
    (_stream) => {
      stream = _stream;
      streamOutput.srcObject = stream;
      streamOutput.play();
    }
  );
}

async function setDesktopStream() {
  reset();

  streamOutput.style.display = "block";

  chrome.desktopCapture.chooseDesktopMedia(
    ["screen", "window", "tab", "audio"],
    async (streamId) => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: streamId,
          },
        },
      });

      streamOutput.srcObject = stream;
      streamOutput.play();
    }
  );
}

captureVisibleTabButton.addEventListener("click", () => setImage());

pageCaptureButton.addEventListener("click", () => setMhtml());

tabCaptureButton.addEventListener("click", () => setTabStream());

desktopCaptureButton.addEventListener("click", () => setDesktopStream());

// pageCapture
// tabCapture
// desktopCapture
// window.tabs.captureVisibleTab
