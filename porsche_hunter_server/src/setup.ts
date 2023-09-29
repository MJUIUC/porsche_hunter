import { genKeyPair } from "./jwtUtils";

async function setup(){
    const keyPairComplete = await genKeyPair();
    if (keyPairComplete) {
        console.log('service secret keys generated succesfully')
    } else {
        console.debug(keyPairComplete);
    }
    
}

setup();
