import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

// TypeOrm 은 TypeScript와 JavaScript를 위한 객체 관계 매핑(Object-Relational Mapping) 라이브러리, 관계형 데이터베이스와의 상호작용을 쉽게 구현할 수 있게 도와줌
// TypeORM을 사용하면 JavaScript/TypeScript 클래스를 데이터베이스 테이블과 매핑할 수 있음
// 각 클래스의 인스턴스는 데이터베이스 레코드에 대응하며, TypeORM이 제공하는 다양한 기능을 사용하여 데이터를 쿼리하고 조작할 수 있음

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // 데이터베이스의 타입
      database: 'nest-auth-test.sqlite', // 데이터베이스 파일명
      entities: [User, ], // 엔티티 리스트
      synchronize: true, // 데이터베이스에 스키마를 동기화, 서버 기동 시 서버가 엔티티 객체를 읽어서 데이터베이스 스키마를 만들거나 변경, 개발용으로만 샤용해야 됨
      logging: true, // SQL 실행 로그 확인
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot(), // .env 파일을 읽어 오기 위해 설정
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
