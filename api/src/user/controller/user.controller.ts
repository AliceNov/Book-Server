import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User, UserRole } from '../model/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    @Post()
    create(@Body()user: User): Observable<User> {
        return this.userService.create(user).pipe(
            map((user: User) => user)
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<{access_token: string}> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {access_token: jwt};
            })
        )
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    /*@hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }*/

    @Get()
    index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return this.userService.paginate({
            page: Number(page),
            limit: Number(limit),
            route: 'http://localhost:3000/users'
        });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Delete(':id')
    deleteOne(@Param('id')id: string): Observable<DeleteResult> {
        return this.userService.deleteOne(Number(id))
    }

    @Put(':id')
    updateOne(@Param('id') id: string,@Body() user: User): Observable<UpdateResult> {
        return this.userService.updateOne(Number(id), user);
    }
}
