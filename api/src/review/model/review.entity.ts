import { BookEntity } from "src/book/model/book.entity";
import { UserEntity } from "src/user/model/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.interface";

@Entity('review')
export class ReviewEntity implements Review{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({default: ''})
    body: string;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    created: Date;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    updated: Date;

    @BeforeUpdate()
    updateTimestam() {
        this.updated = new Date;
    }

    @Column()
    publishedDate: Date;

    @ManyToOne(type => UserEntity, user => user.review)
    author: UserEntity;

    @ManyToOne(type => BookEntity, book => book.review)
    book: BookEntity;
}