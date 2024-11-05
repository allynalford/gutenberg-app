export class EnvChecker {
    private requiredEnvVariables = [
        { key: 'GROQ', message: '56 character API key', validate: (value: string) => value && value.length === 56 },
        { key: 'PORT', message: 'ExpressJS server local development port', defaultValue: '3000' },
    ];

    // Method to validate if all required environment variables are set
    public checkEnvVariables(): void {
        let missingVariables: string[] = [];

        this.requiredEnvVariables.forEach(envVar => {
            const value = process.env[envVar.key] || envVar.defaultValue;
            if (!value || (envVar.validate && !envVar.validate(value))) {
                missingVariables.push(`${envVar.message} [${envVar.key}]`);
            }
        });

        if (missingVariables.length > 0) {
            throw new Error(`Missing or invalid environment variables:\n${missingVariables.join('\n')}`);
        }else{
            console.info('All required .env environment variables found')
        }
    }
}