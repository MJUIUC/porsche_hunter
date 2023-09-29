import { Strategy as LocalStrategy } from 'passport-local';
import { prisma as PrismaClient } from "../PrismaClient";
import bcrypt from "bcrypt";

const localStrategy = new LocalStrategy({
    usernameField: "emailAddress",
    passwordField: "password",
}, async (
    emailAddress: string,
    password: string,
    done: any) => {
    try {
        const hunter = await PrismaClient.hunter.findUnique({
            where: {
                emailAddress,
            },
        });

        if (!hunter) {
            return done(null, false, { message: "No hunter with that email address exists." });
            // throw new Error("No hunter with that email address exists.");
        }

        const passwordMatches = await bcrypt.compare(password, hunter.password);

        if (!passwordMatches) {
            return done(null, false, { message: "Password is incorrect." });
            // throw new Error("Password is incorrect.");
        }
        // console.debug("Local strategy returning hunter.", hunter);
        return done(null, hunter);
    } catch (error) {
        // TODO: log error and throw generic error.
        throw error;
    }
});

export { localStrategy };
