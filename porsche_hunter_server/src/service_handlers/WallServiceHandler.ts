import { Following, HuntResultsPost, Hunter } from '@prisma/client'
import { prisma as PrismaClient } from '../PrismaClient'
import { v4 as uuidv4 } from "uuid";
import { de } from 'date-fns/locale';

/**
 * renderProfileById
 * 
 * This function returns a profile object that consists of a hunter object and a list of posts.
 * @param hunterUuid
 * @returns {Promise<{hunter: Hunter, posts: HuntResultsPost[]}>}
*/
async function renderProfileById(hunterUuid: string){
    // A profile will consist of a hunter object and a list of posts.
    try {
        const hunter: Hunter = await PrismaClient.hunter.findUnique({
            where: {
                uuid: hunterUuid,
            },
        });

        if(!hunter){
            throw new Error("No hunter with that uuid exists.");
        }

        let posts: HuntResultsPost[] = await PrismaClient.huntResultsPost.findMany({
            where: {
                authorId: hunter.uuid,
            },
        });

        if(!posts){
            posts = [];
        }

        delete hunter.password;
        delete hunter.id;

        return {
            hunter: hunter,
            posts: posts
        };
    } catch (error) {
        console.log(error);
        return error;
    }
};

/**
 * createFollowRelationship
 * 
 * This function creates a follow relationship between two hunters.
 * @param followerUuid
 * @param followingUuid
 * @returns {Promise<Following>}
*/
async function createFollowRelationship(followerUuid: string, followingUuid: string){
    try {
        const follower = await PrismaClient.hunter.findUnique({
            where: {
                uuid: followerUuid,
            },
        });

        if(!follower){
            throw new Error(`No hunter with uuid: ${followerUuid} exists.`);
        }

        const following = await PrismaClient.hunter.findUnique({
            where: {
                uuid: followingUuid,
            },
        });

        if(!following){
            throw new Error(`No hunter with uuid: ${following} exists.`);
        }

        const relationshipUuid = uuidv4();
        const followRelationship = await PrismaClient.following.create(
            {
                data: {
                    uuid: relationshipUuid,
                    followerUuid: follower.uuid,
                    followingUuid: following.uuid,
                },
            }
        );

        return followRelationship;
    } catch (error) {
        console.log(error);
        return error;
    }
};

/**
 * renderFollowingListById
 * 
 * This function returns a list of hunters that the logged in hunter follows.
 * @param hunterUuid
 * @returns {Promise<Hunter[]>}
*/
async function renderFollowingListById(hunterUuid: string){
    try {
        const following: Following[] = await PrismaClient.following.findMany({
            where: {
                followerUuid: hunterUuid,
            },
        });

        if(!following){
            throw new Error(`Hunter with uuid: ${hunterUuid} is not following anyone.`);
        }

        const followingUuids: string[] = following.map((follow) => {
            return follow.followingUuid;
        });

        const followingHunters: Hunter[] = await PrismaClient.hunter.findMany({
            where: {
                uuid: {
                    in: followingUuids,
                },
            },
        });

        return followingHunters
    } catch (error) {
        console.log(error);
        return error;
    }
};

/**
 * renderWallById
 * 
 * This function returns a wall object that consists of a list of posts from all hunters that the logged in hunter follows.
 * 
*/
async function renderWallById(hunterUuid: string){
    return ["Wall Entry Objects"];
};

async function getHunterByName(hunterName: string){
    try {
        const hunter: Hunter = await PrismaClient.hunter.findUnique({
            where: {
                hunterName: hunterName,
            },
        });

        if(!hunter){
            throw new Error("No hunter with that name exists.");
        }

        delete hunter.password;
        return hunter;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export { renderProfileById, createFollowRelationship, renderFollowingListById, renderWallById, getHunterByName };
