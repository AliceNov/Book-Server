import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../model/user.entity';
import { User, UserRole } from '../model/user.interface';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authservice: AuthService
    ) {}

    create(user: User): Observable<User> {
        return this.authservice.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;
                        return result;
                    })
                );
            })
        )
    }

    findOne(id: number): Observable<User>{
        return from(this.userRepository.findOne({id})).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {delete v.password});
                return users;
            })
        )
    }

    deleteOne(id: number): Observable<DeleteResult> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<UpdateResult> {
        delete user.email;
        return from(this.userRepository.update(id, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if(user) {
                    return this.authservice.generateJWT(user).pipe(
                        map((jwt: string) => jwt));
                } else {
                    return 'Warning: Wrong Credentials'
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findeByMail(email).pipe(
            switchMap((user: User) => 
            this.authservice.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }

    findeByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({email}));
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) =>{
               // usersPageable.items.forEach((v) => {delete v.password});
                return usersPageable;
            })
        )
    }
}
