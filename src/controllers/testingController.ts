import { Request, Response } from 'express'; 

export function getTestingApi(req: Request, res: Response): void {
    res.status(200).json({
        message: 'tesing API is working',
        data: {
            name: 'Testing API',
            description: 'This is a sample testing API endpoint.',
            status: 'active'
        }
    })
}
