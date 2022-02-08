import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from 'src/review/review.module';
import { BookEntity } from './model/book.entity';
import { BookController } from './controller/book.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BookService } from './service/book.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BookEntity]),
        ReviewModule,
        AuthModule
    ],
    controllers: [BookController],
    providers: [BookService]
})
export class BookModule {}
