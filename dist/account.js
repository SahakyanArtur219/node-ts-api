"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
(0, vue_1.createApp)({
    setup() {
        const user = (0, vue_1.ref)(null);
        (0, vue_1.onMounted)(() => __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch('/account', {
                method: 'GET',
                credentials: 'include', // or send token if using JWT
            });
            if (res.ok) {
                user.value = yield res.json(); // e.g., { name: "Alice", email: "alice@example.com" }
            }
            else {
                window.location.href = 'login.html'; // not logged in
            }
        }));
        return { user };
    },
}).mount('#app');
