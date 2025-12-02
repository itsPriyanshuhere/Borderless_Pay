import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import config from '../config';

export interface AuthRequest extends Request {
    employerAddress?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, config.jwtSecret) as { address: string };
        req.employerAddress = decoded.address;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const authenticate = authMiddleware;

export const generateToken = (address: string): string => {
    return jwt.sign({ address }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);
};

// Verify Ethereum signature for wallet-based authentication
export const verifySignature = (message: string, signature: string, address: string): boolean => {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
        return false;
    }
};
