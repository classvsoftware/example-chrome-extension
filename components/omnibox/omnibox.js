import { initializeComponent, showToast } from "/scripts/shared.js";

initializeComponent();

chrome.omnibox.onInputStarted.addListener(() => {
  showToast({
    body: `Omnibox onInputStarted`,
  });
});

chrome.omnibox.onInputCancelled.addListener(() => {
  showToast({
    body: `Omnibox onInputCancelled`,
  });
});

chrome.omnibox.onDeleteSuggestion.addListener(() => {
  showToast({
    body: `Omnibox onDeleteSuggestion`,
  });
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  showToast({
    body: `Omnibox onInputEntered:
    
    ${text}`,
  });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  showToast({
    body: `Omnibox onInputChanged:
      
    ${text}`,
  });
});
