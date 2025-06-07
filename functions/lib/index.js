"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const functions = __importStar(require("firebase-functions"));
const genius_lyrics_1 = __importDefault(require("genius-lyrics"));
const app = (0, express_1.default)();
app.get("/genius-api", async (req, res) => {
    const music = req.query.music;
    let songs = [];
    if (!(music === null || music === void 0 ? void 0 : music.trim())) {
        songs = [];
        return res.send("");
    }
    const GeniusClient = new genius_lyrics_1.default.Client("-riMsB6htPjCj--rQmpY4EyFTwRViRwcOgmnaBhUfOENWwrZVbBGP5sFB1RH6xcE");
    try {
        const searches = await GeniusClient.songs.search(music);
        songs = searches.slice(0, 5).map((song) => {
            let result = `${song.title} by ${song.artist.name}`;
            if (result.endsWith(" by Najwa")) {
                result = result.replace("Najwa", "Najwa Nimri");
            }
            return result;
        });
    }
    catch (error) {
        console.error("Genius autocomplete error:", error);
        songs = [];
    }
    return res.send(songs);
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map