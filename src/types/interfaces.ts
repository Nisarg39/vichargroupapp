export interface StudentData {
    name: string;
    email: string;
    phone: string;
    referralCode: string;
    gender?: string;
    dob?: string;
    address?: string;
    city?: string;
    area?: string;
    state?: string;
    purchases: Array<{
        product: {
            _id: string;
            name: string;
            image: string;
            price: number;
            subjects: Array<{
                _id: string;
                name: string;
                image: string;
                chapters: Array<{
                    id: number;
                    name: string;
                    image: string;
                }>;
            }>;
            reviews: number;
            lessons: string;
            students: string;
            type: string;
        };
        progress?: number;
    }>;
}