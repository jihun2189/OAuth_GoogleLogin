import { Controller, Body, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(private userService : UserService) {} // 유저 서비스 주입

    // 유저 생성
    @Post('/create')
    createUser(@Body() user : CreateUserDto) {
        return this.userService.createUser(user) // 입력한 정보로 유저 생성
    }

    // 유저 1명 불러오기
    @Get('/getUser/:email')
    async getUser(@Param('email') email : string) {
        const user = await this.userService.getUser(email); // email을 가지고 유저 찾기
        console.log(user)
        return user;
    }

    // 유저 정보 업데이트
    @Put('/update/:email')
    updateUser(@Param('email') eamil : string, @Body() user : UpdateUserDto) {
        console.log(user);
        return this.userService.updateUser(eamil, user); // email로 유저를 찾고 입력한 정보로 업데이트
    }

    // 유저 정보 삭제
    @Delete('/delete/:email')
    deleteUser(@Param('email') email : string) {
        return this.userService.deleteUser(email); // email로 해당 유저 삭제
    }
}
