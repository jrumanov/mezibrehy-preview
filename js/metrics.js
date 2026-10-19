(function () {
  "use strict";

  if (!window.fetch) return;

  var body = new URLSearchParams({
    page: window.location.pathname,
    referrer: document.referrer || ""
  });

  fetch("/metrics.php", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  }).catch(function () {
    // Visit counting is best-effort — never surface a failure to the visitor.
  });
})();
