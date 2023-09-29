/**
 * This module will generate a public and private keypair and save to the current directory
 * 
 * Make sure to save the private key elsewhere after generated!
 */
import { Hunter } from '@prisma/client';
import path from 'path';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as fs from 'fs';

async function genKeyPair() {
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1" 
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem' // Most common formatting choice
        }
    });

    try {
        // Create the public key file
        fs.writeFileSync(__dirname+'/id_rsa_pub.pem', keyPair.publicKey); 
    
        // Create the private key file
        fs.writeFileSync(__dirname+'/id_rsa_priv.pem', keyPair.privateKey);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

function getPublicKey() {
    return fs.readFileSync(path.join(__dirname, 'id_rsa_pub.pem'), 'utf8');
};

function issueJWT(hunter: Hunter) {
    const pathToKey = path.join(__dirname, 'id_rsa_priv.pem');
    const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
    const _id = hunter.uuid;

    const expiresIn = '1d';

    const payload = {
        sub: _id,
        iat: Date.now()
    };

    const signedToken = jwt.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

    return {
        token: 'Bearer ' + signedToken,
        expires: expiresIn
    };
};

export { issueJWT, genKeyPair, getPublicKey };
