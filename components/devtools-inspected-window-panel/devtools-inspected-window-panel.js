import {
  initializeComponent,
  showWarningIfNotDevtools,
} from "/scripts/shared.js";

initializeComponent().then(() => {
  showWarningIfNotDevtools();
});
