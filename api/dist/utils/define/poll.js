"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLL_LIST_MAX = exports.POLL_STATUS = void 0;
var POLL_STATUS;
(function (POLL_STATUS) {
    POLL_STATUS[POLL_STATUS["Ready"] = 1] = "Ready";
    POLL_STATUS[POLL_STATUS["Closed"] = 2] = "Closed";
    POLL_STATUS[POLL_STATUS["Rejected"] = 3] = "Rejected";
})(POLL_STATUS = exports.POLL_STATUS || (exports.POLL_STATUS = {}));
exports.POLL_LIST_MAX = 10;
//# sourceMappingURL=poll.js.map