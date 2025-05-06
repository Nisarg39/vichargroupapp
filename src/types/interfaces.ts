export interface StudentData {
    name: string;
    email: string;
    phone: string;
    referralCode: string;
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