import express from "express";
import fs from "fs";
import { isAuthenticated } from "../AuthenticationMiddleware";
import { upload } from "../CDNMiddleware";
const router = express.Router();

// serve static files as cdn
router.use('/image', express.static("mini-cdn"));

// returns the json
router.get("/porsche_models", async (req, res) => {
    const models = JSON.parse(fs.readFileSync("./src/porsche_models.json", "utf8"));
    res.send(models);
});

router.post("/upload_image", isAuthenticated, upload.array('files'), async (req: any, res) => {
    if(!req.files) {
        res.send([]);
    } else {
        const files = req.files.map((file: any) => file.filename);
        res.send({ files });
    }
});

export {router};
