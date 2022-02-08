import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ReviewEntity } from './model/review.entity';
import { ReviewController } from './controller/review.controller';
import { ReviewService } from './service/review.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([ReviewEntity]),
        UserModule,
        AuthModule
    ],
    controllers: [ReviewController],
    providers: [ReviewService]
})
export class ReviewModule {}
