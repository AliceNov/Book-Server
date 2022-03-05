import { Book } from "src/book/model/book.interface";
import { User } from "src/user/model/user.interface";

export interface Review {
    id?: number;
    title?: string;
    body?: string;
    created?: Date;
    updated?: Date;
    publishedDate?: Date;
    author?: User;
    book?: Book;
}