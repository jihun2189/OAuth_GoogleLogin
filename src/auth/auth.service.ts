import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable() // 프로바이더로 사용
export class AuthService {
    constructor(private userService : UserService) {}

    /**
     * 회원가입, 이미 가입된 유저가 있으면 에러, 패스워드 암호화, return값에 password는 넣지 않음
     * @param userDto 입력한 user 정보
     * @returns user정보
     */
    async register(userDto : CreateUserDto) { 
        // 이미 가입된 유저가 있는지 체크
        const user = await this.userService.getUser(userDto.email)
        if(user){
            throw new HttpException(
                '해당 유저가 이미 있습니다.',
                HttpStatus.BAD_REQUEST,
            );
        }
        // 패스워드 암호화
        const encryptedPassword = bcrypt.hashSync(userDto.password,10);

        // 데이터베이스에 저장, 저장 중 에러가 나면 서버 에러 발생
        try {
            const user = await this.userService.createUser({
                ...userDto,
                password : encryptedPassword,
            });
            // 회원 가입 후 반환하는 값에는 password를 주지 않음
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('서버 에러', 500)
        }
    }

    /** 로그인 할 때 
     * email과 password로 user정보 가져오기, password 제외, 유저의 정보가 맞는지 검증
     * @param email 
     * @param password 
     * @returns user 정보
     */
    async validateUser(email : string, password : string) {
        const user = await this.userService.getUser(email);

        if(!user){
            return null;
        }
        // 이 경우, password는 user 객체의 password 속성이 되고, ...userInfo는 user 객체에서 password를 제외한 
        // 나머지 속성들이 됨. 이렇게 하면 userInfo에는 비밀번호를 제외한 다른 정보만 포함되게 됨
        const { password : hashedPassword, ...userInfo } = user; // hashedPassword = password와 같고 password를 제외한 나머지 데이터를 userInfo에 담는다
        
        // const userInfo = { ...user };
        // delete userInfo.password;
        // const hashedPassword = user.password; 

        // 패스워드를 따로 뽑아냄
        if(bcrypt.compareSync(password, hashedPassword)){ // 같으면 true
            return userInfo
        }
        return null;
    }
}
