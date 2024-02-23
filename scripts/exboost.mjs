var e = {
    d: (t, n) => {
      for (var o in n)
        e.o(n, o) &&
          !e.o(t, o) &&
          Object.defineProperty(t, o, { enumerable: !0, get: n[o] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  },
  t = {};
e.d(t, { A: () => i });
var n = function (e, t, n, o) {
  return new (n || (n = Promise))(function (s, i) {
    function r(e) {
      try {
        c(o.next(e));
      } catch (e) {
        i(e);
      }
    }
    function a(e) {
      try {
        c(o.throw(e));
      } catch (e) {
        i(e);
      }
    }
    function c(e) {
      var t;
      e.done
        ? s(e.value)
        : ((t = e.value),
          t instanceof n
            ? t
            : new n(function (e) {
                e(t);
              })).then(r, a);
    }
    c((o = o.apply(e, t || [])).next());
  });
};
const o = "v1";
var s;
!(function (e) {
  (e.BACKGROUND = "BACKGROUND"),
    (e.CONTENT_SCRIPT = "CONTENT_SCRIPT"),
    (e.EXTENSION_PAGE = "EXTENSION_PAGE"),
    (e.POPUP = "POPUP"),
    (e.OPTIONS = "OPTIONS"),
    (e.SIDEBAR = "SIDEBAR"),
    (e.DEVELOPER_TOOLS = "DEVELOPER_TOOLS"),
    (e.UNIDENTIFIED_CONTEXT = "UNIDENTIFIED_CONTEXT");
})(s || (s = {}));
const i = new (class {
  constructor() {
    (this.version = "1.11.0"),
      (this.sessionId = null),
      (this.windowIsDefined = "undefined" != typeof window),
      (this.chromeGlobalIsDefined = "undefined" != typeof chrome),
      (this.isManifestV2 = "2" === chrome.runtime.getManifest().version),
      (this.usesExtensionProtocol =
        !!this.windowIsDefined &&
        "chrome-extension:" === window.location.protocol),
      (this.extensionId = null),
      this.chromeGlobalIsDefined && (this.extensionId = chrome.runtime.id),
      (!this.isManifestV2 &&
        !this.windowIsDefined &&
        this.chromeGlobalIsDefined) ||
      (this.isManifestV2 &&
        this.windowIsDefined &&
        window === chrome.extension.getBackgroundPage())
        ? (this.engineContext = s.BACKGROUND)
        : this.windowIsDefined &&
          this.chromeGlobalIsDefined &&
          this.usesExtensionProtocol
        ? (this.engineContext = s.EXTENSION_PAGE)
        : this.windowIsDefined &&
          this.chromeGlobalIsDefined &&
          !this.usesExtensionProtocol
        ? (this.engineContext = s.CONTENT_SCRIPT)
        : (this.engineContext = s.UNIDENTIFIED_CONTEXT),
      this.engineInit();
  }
  engineInit() {
    switch (this.engineContext) {
      case s.BACKGROUND:
        this.initBackground();
      case s.CONTENT_SCRIPT:
      case s.DEVELOPER_TOOLS:
      case s.EXTENSION_PAGE:
      case s.OPTIONS:
      case s.POPUP:
    }
  }
  renderSlotDataOrError(
    { exboostSlotId: e, target: t, containerClass: o, linkClass: s },
    i = {}
  ) {
    return n(this, void 0, void 0, function* () {
      const n = yield this.loadSlotDataOrError({ exboostSlotId: e });
      t.innerHTML = `<div class="exboost-container ${
        null != o ? o : ""
      }">\n      ${n.anchorData
        .map(
          (e) =>
            `<a class="exboost-link ${null != s ? s : ""}" href="${
              e.href
            }" target="_blank">${e.text}</a>`
        )
        .join("")}\n    </div>`;
    });
  }
  loadSlotDataOrError({ exboostSlotId: e }, t = {}) {
    return n(this, void 0, void 0, function* () {
      const n = {
          exboostSlotId: e,
          engineContext: this.engineContext,
          options: t,
        },
        o = yield chrome.runtime.sendMessage(n);
      if (!o.success) throw new Error("Failed to load ExBoost slot data");
      return o.exboostSlotData;
    });
  }
  initBackground() {
    (this.sessionId = crypto.randomUUID()),
      chrome.runtime.onMessage.addListener((e, t, n) => {
        if (!Object.keys(e).includes("exboostSlotId")) return;
        const s = [o, "links"].join("/"),
          i = new URLSearchParams({
            extensionId: this.extensionId,
            sessionId: this.sessionId,
            engineContext: e.engineContext,
            slotId: e.exboostSlotId,
            version: this.version,
            publisherExtensionName: chrome.runtime.getManifest().name,
          });
        return (
          fetch(
            `https://api.extensionboost.com/${s}?nonce=${Date.now()}&${i.toString()}`
          )
            .then((e) => {
              if (200 !== e.status) {
                const e = { success: !1, exboostSlotData: { anchorData: [] } };
                return Promise.resolve(e);
              }
              return e
                .json()
                .then((e) => ({ success: !0, exboostSlotData: e }));
            })
            .then((e) => n(e)),
          !0
        );
      });
  }
})();
var r = t.A;
export { r as default };
