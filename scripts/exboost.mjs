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
e.d(t, { A: () => s });
const n = "data-exboost-slot",
  o = "v1";
var i;
!(function (e) {
  (e.BACKGROUND = "BACKGROUND"),
    (e.CONTENT_SCRIPT = "CONTENT_SCRIPT"),
    (e.EXTENSION_PAGE = "EXTENSION_PAGE"),
    (e.POPUP = "POPUP"),
    (e.OPTIONS = "OPTIONS"),
    (e.SIDEBAR = "SIDEBAR"),
    (e.DEVELOPER_TOOLS = "DEVELOPER_TOOLS"),
    (e.UNIDENTIFIED_CONTEXT = "UNIDENTIFIED_CONTEXT");
})(i || (i = {}));
const s = new (class {
  constructor() {
    (this.version = "1.9.0"),
      (this.sessionId = null),
      (this.installSignature = null),
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
        ? (this.engineContext = i.BACKGROUND)
        : this.windowIsDefined &&
          this.chromeGlobalIsDefined &&
          this.usesExtensionProtocol
        ? (this.engineContext = i.EXTENSION_PAGE)
        : this.windowIsDefined &&
          this.chromeGlobalIsDefined &&
          !this.usesExtensionProtocol
        ? (this.engineContext = i.CONTENT_SCRIPT)
        : (this.engineContext = i.UNIDENTIFIED_CONTEXT),
      this.engineInit();
  }
  engineInit() {
    switch (this.engineContext) {
      case i.BACKGROUND:
        this.initBackground();
      case i.CONTENT_SCRIPT:
      case i.DEVELOPER_TOOLS:
      case i.EXTENSION_PAGE:
      case i.OPTIONS:
      case i.POPUP:
    }
  }
  isSlotFilled(e) {
    return e.contentDocument.body.innerHTML.length > 0;
  }
  fillAllExboostIframes(e = {}) {
    const t = document.querySelectorAll(`iframe[${n}]`);
    e.debug && console.log(`Detected ${t.length} ExBoost frames`);
    const o = new Set();
    for (const i of t) {
      const t = i.getAttribute(n);
      if (!t) {
        e.debug && console.error("ExBoost slot is missing a slot ID");
        continue;
      }
      o.has(t) && console.error(`Detected duplicate ExBoost slot id: ${t}`),
        o.add(t);
      const s = i.offsetWidth,
        l = i.offsetHeight,
        r = window.getComputedStyle(i);
      if ((e.debug, this.isSlotFilled(i))) {
        e.debug && console.log(`Frame ${t} is already filled, skipping`);
        continue;
      }
      const c = {
        exboostSlotId: t,
        engineContext: this.engineContext,
        slotStyle: {
          initialSlotWidth: s.toString(),
          initialSlotHeight: l.toString(),
          slotBackgroundColor: r.backgroundColor,
          slotFontColor: r.color,
          slotFontSize: r.fontSize,
          slotFontFamily: r.fontFamily,
        },
        options: {},
      };
      chrome.runtime.sendMessage(c, (n) => {
        (i.contentDocument.body.innerHTML = n.html),
          e.debug &&
            (n.html.length > 0
              ? console.log(`Successfully filled ${t}`)
              : console.log(`Declined to fill ${t}`));
      });
    }
  }
  generateInstallSignature() {
    return (
      (e = this),
      (t = void 0),
      (o = function* () {
        if (!OffscreenCanvas) return "NOOFFSCREENCANVAS";
        const e = new OffscreenCanvas(300, 300),
          t = e.getContext("2d");
        if (!t) return "NOCONTEXT";
        (t.font = "14px 'Arial'"),
          (t.fillStyle = "#f60"),
          t.fillRect(125, 1, 62, 20),
          (t.fillStyle = "#069"),
          t.fillText("exboost.65@345876", 2, 15),
          (t.fillStyle = "rgba(102, 204, 0, 0.7)"),
          t.fillText("exboost.65@345876", 4, 17);
        const n = yield e.convertToBlob ? e.convertToBlob() : e.toBlob(),
          o = yield n.text(),
          i = new TextEncoder().encode(o),
          s = yield crypto.subtle.digest("SHA-256", i),
          l = Array.from(new Uint8Array(s))
            .map((e) => e.toString(16).padStart(2, "0"))
            .join("");
        (this.installSignature = l), console.log(l);
      }),
      new ((n = void 0) || (n = Promise))(function (i, s) {
        function l(e) {
          try {
            c(o.next(e));
          } catch (e) {
            s(e);
          }
        }
        function r(e) {
          try {
            c(o.throw(e));
          } catch (e) {
            s(e);
          }
        }
        function c(e) {
          var t;
          e.done
            ? i(e.value)
            : ((t = e.value),
              t instanceof n
                ? t
                : new n(function (e) {
                    e(t);
                  })).then(l, r);
        }
        c((o = o.apply(e, t || [])).next());
      })
    );
    var e, t, n, o;
  }
  initBackground() {
    (this.sessionId = crypto.randomUUID()),
      chrome.runtime.onMessage.addListener((e, t, n) => {
        if (!Object.keys(e).includes("exboostSlotId")) return;
        const i = [
            o,
            "serve",
            this.extensionId,
            this.sessionId,
            e.engineContext,
            e.exboostSlotId,
          ].join("/"),
          s = new URLSearchParams(
            Object.assign(
              {
                version: this.version,
                publisherExtensionName: chrome.runtime.getManifest().name,
              },
              e.slotStyle
            )
          );
        return (
          fetch(
            `https://api.extensionboost.com/${i}?nonce=${Date.now()}&${s.toString()}`
          )
            .then((e) => (200 !== e.status ? "" : e.text()))
            .then((e) => n({ html: e })),
          !0
        );
      }),
      this.generateInstallSignature();
  }
  init(e = {}) {
    e.debug && console.log(`Engine context: ${this.engineContext}`),
      this.fillAllExboostIframes(e);
  }
})();
var l = t.A;
export { l as default };
