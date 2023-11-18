import {ObjectId} from "typeorm";

interface JwtPayload {
    sub: ObjectId; // subject
    iat: number; // issued at
    // exp: number; // expiration time
    // ... other claims
    email: string;
}

interface JwtHeader {
    alg: string; // algorithm
    typ: string; // type
}

type JwtToken = {
    access_token: string;
}; // JWT token is just a string
