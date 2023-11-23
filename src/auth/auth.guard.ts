import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // 패스포트 패키지에 가드 사용

// 가드는 요청을 처리하기 전에 실행되는 미들웨어와 유사한 구성 요소
// 가드는 특정 조건을 검사하고, 요청을 허용 또는 거부하여 라우트 핸들러가 실행되기 전에 사전에 로직을 적용할 수 있음
// 인증, 권한 부여, 입력 유효성 검사 등 다양한 용도로 사용
// canActivate의 context는 현재 실행 중인 요청에 대한 세부 정보를 제공

@Injectable()
export class LoginGuard implements CanActivate { // 로그인 가드는 사용자가 로그인한 상태인지 확인
    constructor(private authService: AuthService) { }

    /**
     * 쿠키가 있으면 true, 없으면 user정보를 가져와서 인증 로직 실행, 사용자 정보가 없을 경우 인증실패로 false, 있을 경우 true반환
     * @param context context는 ExecutionContext 타입의 객체이며, 현재 요청에 대한 컨텍스트 정보를 제공
     * @returns 인증 성공시 true, 실패시 false
     */
    async canActivate(context: any): Promise<boolean> { 
        // ExecutionContext는 다양한 속성 및 메서드를 포함하며, 그 중에서도 주로 사용되는 것은 switchToHttp() 메서드
        // switchToHttp() 메서드는 현재의 실행 컨텍스트를 HTTP 컨텍스트로 전환합니다. 이후 .getRequest() 등의 메서드를 사용하여 HTTP 요청과 관련된 정보에 액세스할 수 있음
        // 컨텍스트에서 리퀘스트 정보를 가져옴
        const request = context.switchToHttp().getRequest();

        // 쿠키가 있으면 인증된 것,  == 로그인 된것
        if (request.cookies['login']) {
            return true;
        }

        // 쿠키가 없으면 로그인 시도 , body에 입력을 안 했을 경우(비어있는 경우)
        if (!request.body.email || !request.body.password) {
            return false;
        }

        // 인증 로직은 기존의 authService.validateUser 사용
        const user = await this.authService.validateUser(
            request.body.email,
            request.body.password,
        );

        // 유저 정보가 없으면 false 반환
        if (!user) {
            return false;
        }

        // 있으면 request에 user 정보를 추가하고 true 반환, 쿠키를 추가하는 코드는 서버의 응답시 실행되어야 함 그래서 request.user에 user 정보를 담음
        request.user = user;
        return true;
    }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { // 로그인용 가드
    /**
     * 로컬 전략 실행 후에 req로 받은 정보를 세션에 저장, 로컬 전략은 id, password로 인증을 처리, 인증 된 사용자가 있는 경우 true 아니면 false
     * @param context 
     * @returns true or false(인증 여부 결과)
     */
    async canActivate(context: any): Promise<boolean> { 
        const result = (await super.canActivate(context)) as boolean; // passport-local의 로직을 구현한 메서드를 실행, validate()

        // 로컬 스트래티지 실행 후 user정보가 오면 세션에 저장
        const request = context.switchToHttp().getRequest();
        await super.logIn(request); // 세션 저장, SessionSerializer의 serializeUser()를 실행해 유저 정보를 저장
        return result; //
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate { // 로그인 후 인증이 되었는지 확인
    /**
     * 세션에서 정보를 읽어서 인증 확인, 로그인 후 인증이 되었는지
     * @param context 
     * @returns true or false
     */
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated(); // 세션에서 정보를 읽어서 인증 확인, 
            // isAuthenticated() 메서드는 Passport에서 제공하는 메서드 중 하나로, 현재 사용자가 인증되었는지 여부를 확인하는데 사용
    }
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    async canActivate(context: any): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean // GoogleStrategy의 validate()를 실행
        const request = context.switchToHttp().getRequest();
        await super.logIn(request); 
        return result;
    }
}