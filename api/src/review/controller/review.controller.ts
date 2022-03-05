import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Book } from 'src/book/model/book.interface';
import { User } from 'src/user/model/user.interface';
import { DeleteResult } from 'typeorm';
import { AuthorGuard } from '../guards/author.guard';
import { Review } from '../model/review.interface';
import { ReviewService } from '../service/review.service';

//export const REVIEW_URL = 'http://localhost:3000/api/reviews' 

@Controller('reviews')
export class ReviewController {

    constructor(private reviewService: ReviewService, private configService: ConfigService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body:{review: Review, book: Book, user: User}): Observable<Review> {
        const user: User = body.user;
        const rev = body.review;
        const book = body.book;
        return this.reviewService.create(user, book, rev);
    }

    @Get('')
    index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.reviewService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: this.configService.get('REVIEW_URL')
        })
    }

    @Get('user/:user')
    indexByUser(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Param('user') userId: number
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.reviewService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: this.configService.get('REVIEW_URL') + '/user/' + userId
        }, Number(userId))
    }

    @Get('book/:book')
    indexByBook(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Param('book') bookId: number
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.reviewService.paginateByBook({
            limit: Number(limit),
            page: Number(page),
            route: this.configService.get('REVIEW_URL') + '/user/' + bookId
        }, Number(bookId))
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<Review> {
        return this.reviewService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, AuthorGuard)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() review: Review): Observable<Review> {
        return this.reviewService.updateOne(Number(id), review);
    }
    
    @UseGuards(JwtAuthGuard, AuthorGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<DeleteResult> {
        return this.reviewService.deleteOne(id)
    }
}
