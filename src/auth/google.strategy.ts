import { Injectable } from "@nestjs/common";;
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private userService : UserService) {
        super({
            // 클라이언트에서 구글의 OAuth 인가 서버에 접속하려면 클라이언트 ID와 비밀번호가 필요함
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google', // 콜백 URL
            scope: ['email', 'profile'], // scope
        });
    }

    // OAuth 인증이 끝나고 콜백으로 실행되는 메서드
    async validate(accessToken: string, refreshToken: string, profile : Profile) { // Profile은 passport-google-oauth20에 있는 Profile타입의 인스턴스
        const { id, name, emails } = profile;
        console.log(`accessToken: ${accessToken}`);
        console.log(`refreshToken: ${refreshToken}`);
        console.log(`emails : ${emails}`)

        const providerId = id;
        const email = emails[0].value; // email을 여러개 사용할 것이 아니라 1개만 필요함

        const user : User = await this.userService.findByEmailOrSave(
            email,
            name.familyName + name.givenName,
            providerId
        );

        return user;
    }
}