import passport from 'passport';
import { prisma as PrismaClient } from "./PrismaClient";
import { Hunter } from '@prisma/client';
import { jwtStrategy } from './authentication_strategies/jwtStrategy';

passport.serializeUser(async (hunter: Hunter, done: any) => {
    console.debug("Serializing user id.", hunter.uuid);
    done(null, {hunterUuid: hunter.uuid});
});

passport.deserializeUser(async (uuid: string, done: any) => {
    console.debug("hello?");
    try {
        const hunter = await PrismaClient.hunter.findUnique({
            where: {
                uuid,
            },
        });

        if (!hunter) {
            throw new Error("No hunter with that uuid exists.");
        }
        console.debug("Deserializing user.", hunter);
        return done(null, hunter.uuid);
    } catch (error) {
        console.debug(error);
        throw error;
    }
});

passport.use(jwtStrategy);

// Attempt to authenticate the request using the jwtStrategy.
function isAuthenticated(req: any, res: any, next: any) {
    passport.authenticate("jwt", { session: false }, (err: any, hunter: any, info: any) => {
        if (err) {
            console.debug(err);
            return res.status(401).send({authenticated: false});
        }
        if (!hunter) {
            console.debug(info);
            return res.status(401).send({authenticated: false});
        }
        delete hunter.password;
        req.user = hunter;
        console.log(`Hunter ${hunter.uuid} authenticated.`);
        next();
    })(req, res, next);
}

export { isAuthenticated, passport };
