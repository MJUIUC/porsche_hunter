import { prisma as PrismaClient } from "../PrismaClient";
import { v4 as uuidv4 } from "uuid";
import { Hunter } from "@prisma/client";
import bcrypt from "bcrypt";
import { format, parse } from 'date-fns';

/**
 * createHunter
 * 
 * Creates a new hunter in the database.
 * @param firstName The hunter's first name.
 * @param lastName The hunter's last name.
 * @param huntername The hunter's huntername.
 * @param password The hunter's password.
 * @param emailAddress The hunter's email address.
 * @param dateOfBirth The hunter's date of birth in the format dd-MM-yyyy.
 * @returns The newly created hunter.
 * @throws An error if a hunter with the same email address already exists.
*/
async function createHunter(
    firstName: string,
    lastName: string,
    hunterName: string,
    password: string,
    emailAddress: string,
    dateOfBirth: string
): Promise<Hunter> {
    const existingHunter = await PrismaClient.hunter.findUnique({
        where: {
            emailAddress,
        },
    });
    
    if (existingHunter) {
        throw new Error("A hunter with that email address already exists.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const uuid = uuidv4();
        
        // Parse the input date string into a Date object
        const parsedDate = parse(dateOfBirth, 'dd-MM-yyyy', new Date());

        // Format the parsed date as ISO 8601
        const isoDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        // console.log(isoDate);
        const newHunter = await PrismaClient.hunter.create({
            data: {
                uuid,
                firstName,
                lastName,
                hunterName,
                password: hashedPassword,
                emailAddress,
                dateOfBirth: isoDate,
            },
        });
        // TODO: Should log successful creation of new hunter.
        console.log(newHunter);
        return newHunter;
    } catch (error) {
        // TODO: Should log this error and not throw it. Instead, throw a generic error.
        console.log(error)
        throw error;
    }
};

/**
 * getHunter
 * 
 * Gets a hunter from the database.
 * @param emailAddress The hunter's email address.
 * @returns The hunter.
 * @throws An error if a hunter with the given huntername does not exist.
*/
async function getHunter(emailAddress: string): Promise<Hunter> {
    try {
        const hunter = await PrismaClient.hunter.findUnique({
            where: {
                emailAddress,
            },
        });

        if (!hunter) {
            throw new Error("No hunter with that email address exists.");
        }

        return hunter;
    } catch (error) {
        throw error;
    }
}


export { createHunter, getHunter };
