(function(){"use strict";function t(e){return e<=1?e:t(e-1)+t(e-2)}self.addEventListener("message",function(e){for(let s=0;s<e.data.taskNumber;s++)t(e.data.fibonacciNumber);self.postMessage("done"),self.close()})})();