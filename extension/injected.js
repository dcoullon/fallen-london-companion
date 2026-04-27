// Runs in the page's main world so it can intercept the game's fetch calls.
(function () {
  // ── Intercept fetch ───────────────────────────────────────────────────────
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url =
      typeof args[0] === "string" ? args[0] : (args[0] && args[0].url) || "";

    if (url.includes("choosebranch") || url.includes("storylet/begin") || url.includes("character/myself")) {
      const type = url.includes("choosebranch") ? "choosebranch"
                 : url.includes("storylet/begin") ? "storylet-begin"
                 : "myself";
      response.clone().json().then((data) => {
        window.postMessage({ source: "fl-helper", type, data }, "*");
      }).catch(() => {});
    }

    return response;
  };

  // ── Intercept XMLHttpRequest (fallback) ───────────────────────────────────
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._flUrl = url;
    return originalOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (this._flUrl && (this._flUrl.includes("choosebranch") || this._flUrl.includes("storylet/begin") || this._flUrl.includes("character/myself"))) {
      const type = this._flUrl.includes("choosebranch") ? "choosebranch"
                 : this._flUrl.includes("storylet/begin") ? "storylet-begin"
                 : "myself";
      this.addEventListener("load", () => {
        try {
          const data = JSON.parse(this.responseText);
          window.postMessage({ source: "fl-helper", type, data }, "*");
        } catch (err) {}
      });
    }

    return originalSend.apply(this, args);
  };
})();
