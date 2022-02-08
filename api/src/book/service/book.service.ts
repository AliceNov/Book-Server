import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, map, Observable, switchMap } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import { BookEntity } from '../model/book.entity';
import { Book } from '../model/book.interface';

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookEntity) private readonly bookRepository: Repository<BookEntity>,
    ) {}

    create(book: Book): Observable<Book> {
        return from(this.bookRepository.save(book));
    }

    findAll(): Observable<Book[]> {
        return from(this.bookRepository.find({
            relations: ['review']
        }))
    }

    findOne(id: number): Observable<Book> {
        return from(this.bookRepository.findOne(
            {id},
            {relations: ['review']}
        ))
    }

    findByReview(reviewId: number): Observable<Book[]> {
        return from(this.bookRepository.find({
            where: {
                review: reviewId
            },
            relations: ['review']
        }))
    }

    updateOne(id: number, book: Book): Observable<Book> {
        return from(this.bookRepository.update(id, book)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id: number): Observable<DeleteResult> {
        return from(this.bookRepository.delete(id));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<Book>> {
        return from(paginate<Book>(this.bookRepository, options, {
            relations: ['review']
        })).pipe(
            map((books: Pagination<Book>) => books)
        )
    }

    paginateByReview(options: IPaginationOptions, reviewId: number): Observable<Pagination<Book>> {
        return from(paginate<Book>(this.bookRepository, options, {
            relations: ['review'], 
            where: [{
                review: reviewId
            }]
        })).pipe(
            map((book: Pagination<Book>) => book)
        )
    }
}
