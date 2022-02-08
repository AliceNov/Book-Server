import { ReviewEntity } from "src/review/model/review.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.interface";

@Entity('book')
export class BookEntity implements Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column({default: ''})
    description: string;

    @Column({type:"date", default: ''})
    publishedDate: Date;

    @Column()
    cover: string;

    @OneToMany(type => ReviewEntity, reviewEntity => reviewEntity.book)
    review: ReviewEntity[];
}