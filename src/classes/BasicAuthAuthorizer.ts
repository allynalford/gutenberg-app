
export class BasicAuthAuthorizer {

    constructor(){

    }

    public getUnauthorizedResponse(req: any) {
        return req.auth
            ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
            : 'No credentials provided'
    }
}