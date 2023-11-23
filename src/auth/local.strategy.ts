import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

// 이 코드는 Passport에서 제공하는 LocalStrategy를 확장하고 있는 LocalStrategy 클래스
// 여기서 LocalStrategy는 로컬 인증 전략을 구현하고 사용자의 정보를 유효성 검증
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService : AuthService)  {
        super({ usernameField: 'email' }); // 기본값이 username 이므로 email로 바꿔줌
    }

    /**
     * 유저 정보의 유효성을 검증 후 유저 정보 반환
     * @param email email
     * @param password password
     * @returns 유저정보
     */
    async validate(email : string, password: string): Promise<any> { // 유저 정보의 유효성 검증
        const user = await this.authService.validateUser(email, password);
        if(!user){
            return null;
        }
        return user;
    }
}