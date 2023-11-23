import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // UserService에서 User entity를 사용(등록)
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] // 다른 모듈에서 UserModule을 import 하면 UserService를 주입 가능
})
export class UserModule {}
