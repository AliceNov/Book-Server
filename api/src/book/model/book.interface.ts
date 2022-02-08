import { Review } from "src/review/model/review.interface";

export interface Book {
    id?: number;
    title?: string;
    author?: string;
    description?: string;
    publishedDate?: Date;
    cover?: string;
    review?: Review[];
}