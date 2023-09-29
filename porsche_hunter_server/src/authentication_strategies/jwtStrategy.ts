import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma as PrismaClient } from "../PrismaClient";
import { getPublicKey } from "../jwtUtils";

const PUB_KEY = getPublicKey();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ["RS256"]
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload: any, done: any) => {
    console.debug("incomming jwt payload", jwtPayload);
    try {
        const hunter = await PrismaClient.hunter.findUnique({
            where: {
                uuid: jwtPayload.sub,
            },
        });

        if (!hunter) {
            throw new Error("No hunter with that uuid exists.");
        }

        return done(null, hunter);
    } catch (error) {
        console.debug(error);
        return done(null, false);
    }
});

export { jwtStrategy };
