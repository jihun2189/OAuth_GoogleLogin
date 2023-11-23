import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository : Repository<User>
    ) {}

    // 유저 생성 후 DB 저장
    createUser(user) : Promise<User> {
        return this.userRepository.save(user)
    }

    // 한 명의 유저 찾기
    async getUser(email : string) {
        const result = await this.userRepository.findOne({
            where : { email },
        });
        return result;
    }

    // 유저 정보 업데이트, username과 password만 변경
    async updateUser(email : string, _user) { // email과 body의 user정보(업데이트 할 때 입력받은 정보)
        const user : User = await this.getUser(email); // db에서 email로 user를 불러옴
        console.log(_user); // 입력받은 user 정보

        user.username = _user.username; // 바꿈
        user.password = _user.password;
        console.log(user); // 바뀐 user 정보

        this.userRepository.save(user); // 바뀐 user 저장
    }

    // DB에서 유저 정보 삭제
    deleteUser(email : any) {
        return this.userRepository.delete({ email }); // email : email 을 줄여 쓴거
    }

    /** 구글의 OAuth 인증의 정보를 기반으로 회원가입, 
     * email로 기존 가입 여부를 확인해 가입되어 있으면 유저 정보를 반환, 아니면 회원 정보를 유저 테이블에 저장
     * @param email 
     * @param username 
     * @param providerId 
     * @returns 유저 정보
     */
    async findByEmailOrSave(email, username, providerId): Promise<User> {
        const foundUser = await this.getUser(email); // email로 유저를 찾음
        if(foundUser){ // 찾았으면 유저정보 반환
            return foundUser;
        }

        const newUser = await this.userRepository.save({ // 유저 정보 없으면 저장
            email,
            username,
            providerId,
        });
        return newUser; // 저장 후 유저 정보 반환
    }
}
