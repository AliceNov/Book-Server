import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { map, Observable, switchMap } from "rxjs";
import { User } from "src/user/model/user.interface";
import { UserService } from "src/user/service/user.service";
import { Review } from "../model/review.interface";
import { ReviewService } from "../service/review.service";

@Injectable()
export class AuthorGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private reviewService: ReviewService
        ) {}

        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const request = context.switchToHttp().getRequest();

            const params = request.params;
            const reviewId: number = Number(params.id);
            const user: User = request.user;

            return this.userService.findOne(user.id).pipe(
                switchMap((user: User) => this.reviewService.findOne(reviewId).pipe(
                    map((review: Review) => {
                        let hasPermission = false;

                        if(user.id === review.author.id) {
                            hasPermission = true;
                        }

                        return user && hasPermission;
                    })
                ))
            )
        }
}