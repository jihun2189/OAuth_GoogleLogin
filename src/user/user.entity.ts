import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // 엔터티(Entity)는 데이터베이스 테이블과 매핑되는 TypeScript 또는 JavaScript 클래스
export class User {
    @PrimaryGeneratedColumn()
    id? : number; // id는 pk이고 자동 증가하는 값

    @Column({ unique : true }) // 중복 데이터가 발생하면 저장되지 않고 에러 발생
    email : string;

    @Column({ nullable : true })
    password : string;

    @Column()
    username : string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) // 기본값 설정
    createdDt : Date;

    @Column({ nullable: true })
    providerId: string;


}