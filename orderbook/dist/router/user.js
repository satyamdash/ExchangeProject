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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const middleware_1 = require("../middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Signup Route");
    const parsedData = types_1.signupschema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data" });
    }
    const userexists = yield db_1.prisma.user.findUnique({
        where: {
            email: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.email
        }
    });
    if (userexists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hasedPassword = yield bcrypt_1.default.hash(parsedData.data.password, 10);
    const user = yield db_1.prisma.user.create({
        data: {
            email: parsedData.data.email,
            name: parsedData.data.name,
            password: hasedPassword
        }
    });
    res.status(200).json({ message: "User has signed up" });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login Route");
    const parsedData = types_1.loginschema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid data" });
    }
    const userExists = yield db_1.prisma.user.findUnique({
        where: {
            email: parsedData.data.email,
        },
    });
    if (!userExists) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const passwordMatch = bcrypt_1.default.compare(parsedData.data.password, userExists.password);
    if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jsonwebtoken_1.default.sign({ id: userExists.id }, config_1.JWT_SECRET);
    res.json({ token: token });
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user route");
    // @ts-ignore
    console.log("--------------------------------");
    console.log(req.id);
    console.log("--------------------------------");
    const id = req.id;
    const user = yield db_1.prisma.user.findFirst({
        where: {
            id: id,
        },
        select: {
            email: true,
            name: true,
        },
    });
    res.json({ user: user });
}));
exports.userRouter = router;
