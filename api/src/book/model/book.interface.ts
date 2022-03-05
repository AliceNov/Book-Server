import { Review } from "src/review/model/review.interface";

export interface Book {
    id?: number;
    title?: string;
    author?: string;
    description?: string;
    publishedDate?: string;
    cover?: string;
    review?: Review[];
}