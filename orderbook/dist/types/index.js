"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginschema = exports.signupschema = void 0;
const zod_1 = require("zod");
exports.signupschema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8)
});
exports.loginschema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
