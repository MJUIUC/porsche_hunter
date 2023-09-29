import express from "express";
const router = express.Router();
import * as HunterPostServiceHandler from "../service_handlers/HunterPostServiceHandler";
import { isAuthenticated } from "../AuthenticationMiddleware";

router.post("/publish_post", isAuthenticated, async (req: any, res) => {
    const { blogContent, captures, location, title, vehicleModel } = req.body;
    const authorId = req.user.uuid;
    try {
        const newHuntResultPost = await HunterPostServiceHandler.createHuntResultPost(
            authorId,
            title,
            location,
            blogContent,
            captures,
            vehicleModel,
            false
        );
        res.status(200).json(newHuntResultPost);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

router.put("/edit_post", isAuthenticated, async (req, res) => {
    let { uuid, title, location, blogContent, isPrivate } = req.body;
    try {
        const editedHuntResultPost = await HunterPostServiceHandler.updateHuntResultPost(
            uuid,
            title,
            location,
            blogContent,
            isPrivate
        );
        res.status(200).json(editedHuntResultPost);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

router.delete("/remove_post", isAuthenticated, async (req, res) => {
    let { uuid } = req.body;
    try {
        const deletedHuntResultPost = await HunterPostServiceHandler.deleteHuntResultPost(
            uuid
        );
        res.status(200).json(deletedHuntResultPost);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

router.get("/view_post/:postUuid", async (req, res) => {
    const { postUuid } = req.params;
    try {
        const huntResultPost = await HunterPostServiceHandler.getHuntResultPost(
            postUuid
        );
        res.status(200).json(huntResultPost);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

export {router};
