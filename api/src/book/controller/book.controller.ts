import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/model/user.interface';
import { DeleteResult } from 'typeorm';
import { Book } from '../model/book.interface';
import { BookService } from '../service/book.service';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

//export const BOOK_URL = 'http://localhost:3000/api/books' 

@Controller('books')
export class BookController {

    constructor(private bookService: BookService, private configService: ConfigService) {}

    @Post()
    create(@Body() book: Book): Observable<Book> {
        return this.bookService.create(book);
    }

    @Get('')
    index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.bookService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: this.configService.get('BOOK_URL')
        })
    }

    @Get('review/:review')
    indexByReview(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Param('review') reviewId: number
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.bookService.paginateByReview({
            limit: Number(limit),
            page: Number(page),
            route: this.configService.get('BOOK_URL') + '/user/' + reviewId
        }, Number(reviewId))
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<Book> {
        return this.bookService.findOne(id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() book: Book): Observable<Book> {
        return this.bookService.updateOne(Number(id), book);
    }

    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@hasRoles(UserRole.ADMIN)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<DeleteResult> {
        return this.bookService.deleteOne(id)
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/coverimages',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`)
            }
        })
    }))
    uploadCover(@UploadedFile() file, @Param('id') id: number): Observable<Book> {
        return this.bookService.updateOne(id, {cover: file.filename})
    }

    @Get('cover-image/:imagename')
    findCoverImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/coverimages/' + imagename)))
    }
}
