import bcrypt from "bcrypt";
import express from "express";
const router = express.Router();

import * as HunterAuthServiceHandler from "../service_handlers/HunterAuthServiceHandler";
import { Hunter } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { issueJWT } from "../jwtUtils";
import { isAuthenticated } from "../AuthenticationMiddleware";

router.post("/signup", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            hunterName,
            password,
            emailAddress,
            dateOfBirth,
        } = req.body;

        const newHunter: Hunter = await HunterAuthServiceHandler.createHunter(
            firstName,
            lastName,
            hunterName,
            password,
            emailAddress,
            dateOfBirth
        );

        const jwt = issueJWT(newHunter);
        
        res.status(201).json({hunter: newHunter, token: jwt.token, expiresIn: jwt.expires});
    } catch (error) {
        // TODO: log error and throw generic error.
        if (error instanceof PrismaClientValidationError) {
            res.status(500).send({error: "invalid input, check request body fields"})
        } else if (error instanceof PrismaClientKnownRequestError) {
            res.status(500).send({error: error.message})
        } else {
            console.log(error)
            res.status(500).send({error: "internal server error"})
        }
    }
});

router.get("/token-login", isAuthenticated, async (req: any, res: any) => {
    if (req.isAuthenticated()){
        res.status(200).send({authenticated: true, hunter: req.user})
    } else {
        res.status(401).send({authenticated: false})
    }
});

router.post("/login", async (req: any, res, next) => {
    const { emailAddress, password } = req.body;
    try {
        const hunter = await HunterAuthServiceHandler.getHunter(emailAddress);
        const passwordMatch = await bcrypt.compare(password, hunter.password);

        if (!passwordMatch) {
            return res.status(401).send({message: "password is incorrect"});
        }

        const jwt = issueJWT(hunter);
        delete hunter.password;
        res.status(200).json({hunter, token: jwt.token, expiresIn: jwt.expires});
    } catch (error) {
        res.status(401).json({message: "email or password incorrect or hunter does not exist"});
        console.debug(error);
    }
});

export {router};
