import { ReviewEntity } from "src/review/model/review.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.interface";

@Entity()
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @OneToMany(type => ReviewEntity, reviewEntity => reviewEntity.author)
    review: ReviewEntity[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLocaleLowerCase();
    }
}