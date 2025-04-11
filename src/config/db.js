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
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config(); // For environment variables
// Get connection string from environment variables or use directly
const uri = process.env.MONGODB_URI;
// Replace <username>, <password>, and <cluster-url> with your actual values
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!uri) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        yield mongoose_1.default.connect(uri);
        console.log('MongoDB Atlas connected successfully');
    }
    catch (error) {
        console.error('MongoDB Atlas connection error:', error);
        process.exit(1);
    }
});
exports.default = connectDB;
