(function () {
  "use strict";

  var boxes = document.querySelectorAll(".ba");

  Array.prototype.forEach.call(boxes, function (box) {
    var range = box.querySelector(".ba__range");
    if (!range) return;

    var apply = function () {
      box.style.setProperty("--pos", range.value + "%");
    };

    range.addEventListener("input", apply);
    apply();
  });
})();
