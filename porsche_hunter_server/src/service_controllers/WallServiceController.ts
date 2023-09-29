import express from "express";
import * as WallServiceHandler from "../service_handlers/WallServiceHandler";
import { isAuthenticated } from "../AuthenticationMiddleware";

const router = express.Router();

router.get("/render-wall", isAuthenticated, async (req:any, res, next) => {
    // A wall is a list of posts from all hunters that the logged in hunter follows.
    // Generally would limit the amount of posts returned, but for now just return all of them.
    try {
        const hunterUuid = req.user.uuid;
        const wall = await WallServiceHandler.renderWallById(hunterUuid);
        res.status(200).json(wall);
    } catch (error) {
        console.log(error);
        throw new Error("Error rendering wall.");
    }
});

router.get("/render-profile/:hunterName", async (req:any, res) => {
    // Generally would limit the amount of posts returned, but for now just return all of them.
    // Also, a profile is a simple construct of a hunter and a list of posts for now. Nothing to edit, update, or destroy with these.
    try {
        const { hunterName } = req.params;
        const hunter = await WallServiceHandler.getHunterByName(hunterName);
        const hunterUuid = hunter.uuid;
        const profile = await WallServiceHandler.renderProfileById(hunterUuid);
        res.status(200).json(profile);
    } catch (error) {
        console.log(error);
        throw new Error("Error rendering profile.");
    }
});

router.get("/render-following", async (req, res) => {
    // This returns a list of hunters that the logged in hunter follows.
    // For now, just return all of them.
    try {
        const following = await WallServiceHandler.renderFollowingListById(req.body.hunterUuid);
        res.status(200).json(following);
    } catch (error) {
        console.log(error);
        throw new Error("Error rendering following.");
    }
});

router.post("/follow-hunter", async (req, res) => {
    // A hunter can follow another hunter and see that respective hunter's posts on their own wall.
    // A hunter can see who they are following and unfollow them, but they cannot see who is following them.
    let {followerUuid, followingUuid} = req.body;
    try {
        const newFollow = await WallServiceHandler.createFollowRelationship(followerUuid, followingUuid);
        res.status(201).json(newFollow);
    } catch (error) {
        console.log(error);
        throw new Error("Error following hunter.");
    }
});

export {router};
