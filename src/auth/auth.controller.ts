import { Controller, Body, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { AuthenticatedGuard, LocalAuthGuard, LoginGuard, GoogleAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService) {}

    @Post('/register')
    // class-validator가 자동으로 유효성 검증
    async register(@Body() userDto : CreateUserDto){
        return await this.authService.register(userDto);
    }

    @Post('login') // 로그인 후 인증 결과를 쿠키에 추가
    async login(@Request() req, @Response() res){
        // validateuser를 호출해 password를 제외한 유저 정보 가져옴
        const userInfo = await this.authService.validateUser(
            req.body.email,
            req.body.password
        );

        // 유저 정보가 있으면 쿠키 정보를 Response에 저장
        if(userInfo){
            res.cookie('login', JSON.stringify(userInfo), {
                httpOnly: false, // 브라우저에서 읽을 수 있도록 함, test하려고
                // maxAge: 1000 * 60 * 60 * 24 * 7, // 7일동안 사용 가능, 단위는 밀리초
                maxAge : 1000
            });
        }
        return res.send({ message: 'login success' });
    }

    @UseGuards(LoginGuard)
    @Post('login2') // 로그인 후 인증 결과를 쿠키에 추가
    async login2(@Request() req, @Response() res) {
        // 쿠키 정보는 없지만 request에 user 정보가 있다면 응답값에 쿠키 정보 추가
        if(!req.cookies['login'] && req.user) {
            // 응답에 쿠키 정보 추가
            res.cookie('login', JSON.stringify(req.user), {
                httpOnly: true,
                // maxAge : 1000 * 60 * 60 * 24 * 7 이거는 7일
                maxAge : 1000 * 10 // 로그인 테스트를 고려해 임시로 10초로 설정
            });
        }
        return res.send({ message : 'login2 success '});
    }
     // 로그인을 한 때만 실행되는 메서드, 쿠키인증 test용
    @UseGuards(LoginGuard)
    @Get('test-guard')
    testGuard() {
        return '로그인 될 때만 이글이 보임';
    }

    // 세션 저장
    @UseGuards(LocalAuthGuard)
    @Post('login3')
    login3(@Request() req) {
        return req.user;
    }

    // 저장된 세션을 가지고 로그인
    @UseGuards(AuthenticatedGuard)
    @Get('test-guard2')
    testGuardWithSession(@Request() req) {
        return req.user;
    }

    // 구글 로그인으로 이동하는 라우터 메서드
    @Get('to-google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) { }

    // 구글 로그인 성공 시 실행하는 라우터 메서드
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Response() res) {
        const { user } = req;
        return res.send(user);
    }
}
