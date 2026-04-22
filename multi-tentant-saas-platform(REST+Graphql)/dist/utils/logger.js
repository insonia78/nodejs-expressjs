"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (message, data) => {
        console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : "");
    },
    error: (message, data) => {
        console.error(`[ERROR] ${message}`, data ? JSON.stringify(data) : "");
    },
    debug: (message, data) => {
        console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : "");
    }
};
//# sourceMappingURL=logger.js.map