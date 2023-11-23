import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

// PassportSerializer 는 serializeUser()와 deserializeUser()를 제공
// 세션을 저장하고 꺼내오는 방법

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private userService : UserService) {
        super();
    }

    /**
     * 세션에 유저 email 저장
     * @param user 유저 정보
     * @param done done 콜백은 두 개의 인수를 받음, 첫 번째 인수는 오류(Error)이며, 두 번째 인수는 세션에 저장할 값, 여기서는 email
     */
    serializeUser(user : any, done: (err: Error, user: any) => void): any { // 사용자를 세션에 저장할 때 호출되는 함수
        done(null, user.email);
    }

    /**
     * 세션에 저장된 식별자(payload)를 사용하여 데이터베이스에서 사용자 정보를 조회하고, 조회된 사용자 정보를 세션에 저장할 때 사용될 형태로 가공하여 done 콜백 함수에 전달
     * @param payload 세션에 저장된 식별자(email), 세션에서 꺼내온 값
     * @param done 세션에서 복원된 사용자 정보를 전달
     * @returns 유저 정보
     */
    async deserializeUser( // 세션에서 복원된 사용자 정보를 기반으로 실제 사용자 객체를 얻을 때 호출되는 함수
        payload: any,
        done: (err: Error, payload: any) => void,
    ): Promise<any> {
        const user = await this.userService.getUser(payload);

        // 유저 정보가 없는 경우 done() 함수에 에러 전달
        if(!user) {
            done(new Error('No User'), null);
            return;
        }
        const { password, ...userInfo } = user;

        // 유저 정보가 있다면 유저 정보 반환
        done(null, userInfo);
    }
}