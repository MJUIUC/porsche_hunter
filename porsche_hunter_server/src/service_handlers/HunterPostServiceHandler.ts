import { HuntResultsPost, Hunter, AutomobileCapture } from '@prisma/client'
import { prisma as PrismaClient } from '../PrismaClient'
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

/**
 * createHuntResultPost
 * 
 * Creates a new hunt result post in the database.
 * @param authorId The author's id.
 * @param title The hunt result post's title.
 * @param location The hunt result post's location.
 * @param blogContent The hunt result post's blog content.
 * @param isPrivate The hunt result post's privacy setting.
 * @returns The newly created hunt result post.
 * @throws An error if a hunt result post with the same title already exists.
 **/
async function createHuntResultPost(
    hunterId: string,
    title: string,
    location: string, // In the form of "latitude,longitude"
    blogContent: string,
    captures: object[],
    vehicleModel: any,
    isPrivate: boolean = false,
): Promise<any> {
    try {
        const newPostUuid = uuidv4();
        const newHuntResultPost: HuntResultsPost = await PrismaClient.huntResultsPost.create({
            data: {
                uuid: newPostUuid,
                authorId: hunterId,
                title,
                location,
                blogContent,
                isPrivate,
            },
        });

        // fail if any of the captures fail
        const resolvedCaptures = await Promise.all(captures.map(async (capture: any) => {
            return await PrismaClient.automobileCapture.create({
                data: {
                    uuid: uuidv4(),
                    huntResultPostId: newPostUuid,
                    authorId:  hunterId,
                    caption:   capture.caption,
                    imageUrl:  capture.url, 
                    model:     vehicleModel.model,
                    type :     vehicleModel.trim
                  }
                },
            );
        }));
        
        console.log(`Successfully created new hunt result post: ${newPostUuid}`);
        return {...newHuntResultPost, captures: resolvedCaptures};
    } catch (error) {
        console.log(error);
        throw new Error("Error creating new hunt result post.");
    }
}

/**
 * getHuntResultPost
 * 
 * Gets a hunt result post from the database.
 * @param uuid The hunt result post's uuid.
 * @returns The hunt result post.
 * @throws An error if a hunt result post with the given uuid does not exist.
 **/
async function getHuntResultPost(
    uuid: string,
): Promise<any> {
    try {
        const huntResultPost: HuntResultsPost= await PrismaClient.huntResultsPost.findUnique({
            where: {
                uuid,
            },
        });

        if (!huntResultPost) {
            throw new Error("No hunt result post with that uuid exists.");
        }

        const author: Hunter = await PrismaClient.hunter.findUnique({
            where: {
                uuid: huntResultPost.authorId,
            },
        });

        delete author.password;
        delete author.id;

        const captures: AutomobileCapture[] = await PrismaClient.automobileCapture.findMany({
            where: {
                huntResultPostId: uuid,
            },
        });

        const { model, type } = captures[0];
        const models = JSON.parse(fs.readFileSync("./src/porsche_models.json", "utf8"));

        const vehicleModel = models.find((m: any) => m.model === model && m.trim === type);

        return {...huntResultPost, author, captures: captures || [], vehicleModel};
    } catch (error) {
        console.log(error);
        throw new Error("Error getting hunt result post.");
    }
}

/**
 * getHuntResultPostsByAuthorId
 * 
 * Gets all hunt result posts from the database by author id.
 * @param authorId The author's id.
 * @returns The hunt result posts.
 * @throws An error if a hunt result post with the given author id does not exist.
 * */
async function getHuntResultPostsByAuthorId(
    authorId: string,
): Promise<HuntResultsPost[]> {
    try {
        const huntResultPosts: HuntResultsPost[] = await PrismaClient.huntResultsPost.findMany({
            where: {
                authorId,
            },
        });
        return huntResultPosts;
    } catch (error) {
        console.log(error);
        throw new Error("Error getting hunt result posts.");
    }
}

/**
 * updateHuntResultPost
 * 
 * Updates a hunt result post in the database.
 * @param uuid The hunt result post's uuid.
 * @param title The hunt result post's title.
 * @param location The hunt result post's location.
 * @param blogContent The hunt result post's blog content.
 * @param isPrivate The hunt result post's privacy setting.
 * @returns The updated hunt result post.
 * @throws An error if a hunt result post with the given uuid does not exist.
 **/
async function updateHuntResultPost(
    uuid: string,
    title: string,
    location: string, // In the form of "latitude,longitude"
    blogContent: string,
    isPrivate: boolean,
): Promise<HuntResultsPost> {
    try {
        const huntResultPost: HuntResultsPost = await PrismaClient.huntResultsPost.update({
            where: {
                uuid,
            },
            data: {
                title,
                location,
                blogContent,
                isPrivate,
            },
        });
        return huntResultPost;
    } catch (error) {
        console.log(error);
        throw new Error("Error updating hunt result post.");
    }
}

/**
 * deleteHuntResultPost
 * 
 * Deletes a hunt result post from the database.
 * @param uuid The hunt result post's uuid.
 * @returns The deleted hunt result post.
 * @throws An error if a hunt result post with the given uuid does not exist.
 **/
async function deleteHuntResultPost(
    uuid: string,
): Promise<any> {
    try {
        const huntResultPost: HuntResultsPost = await PrismaClient.huntResultsPost.delete({
            where: {
                uuid,
            },
        });
        return {message: `removed hunt result post with uuid: ${uuid}`};
    } catch (error) {
        console.log(error);
        throw new Error("Error deleting hunt result post.");
    }
}

export { createHuntResultPost, getHuntResultPost, getHuntResultPostsByAuthorId, updateHuntResultPost, deleteHuntResultPost };
