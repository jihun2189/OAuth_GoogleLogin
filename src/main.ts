import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 유효성 검증, 전역 파이프에 validationPipe 객체 추가
  app.use(cookieParser()); // 쿠키 파서 설정, 쿠키파서는 쿠리를 Request 객체에서 읽어오는데 사용하는 미들웨어
  app.use(
    session({
      secret: 'very-important-secret', // 세션 암호화에 사용되는 키 
      resave: false,                   // 세션을 항상 저장할지 여부, 인증이 되지 않은 사용자 정보도 빈 값으로 저장하브로 false로 설정
      saveUninitialized: false,        // 세션이 저장되기 전에는 초기화되지 않은 상태로 세션을 미리 만들어 저장
      cookie: { maxAge: 3600000 },
    }),
  );
  app.use(passport.initialize()); // passport 초기화 및 세션 저장소 초기화
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
