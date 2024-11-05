import { Request, Response, NextFunction } from 'express';


export class RootPathHandler {
    // Method to handle the root path and throw a 400 error for specific HTTP methods
    public handleRequest(req: Request, res: Response, next: NextFunction): void {
        const method = req.method.toUpperCase();
        const methodsToReject = ['GET', 'POST', 'DELETE', 'PATCH'];

        if (methodsToReject.includes(method)) {
            res.status(403).send()
        } else {
            next(); // If not one of the rejected methods, pass control to the next middleware or route handler
        }
    }

        // Method to handle non-existent routes
        public handleNotFound(req: Request, res: Response): void {
            res.status(403).send();
        }
}