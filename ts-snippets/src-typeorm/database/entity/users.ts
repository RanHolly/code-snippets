import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"; //https://typeorm.io/entities

//I came up with a user scheme, where his id, nickname, level, experience and balance will be, so as not to repeat the example from the official typeorm documentation.
@Entity({ name: 'users' }) //name your database table.
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' }) //if your database supports this type column
    nickname!: string;

    @Column({ type: 'bigint', default: 0 }) //Will be set to default if you didn't specify anything when creating the table
    level?: number;

    @Column({ type: 'bigint', default: 0 })
    xp?: number;

    @Column({ type: 'bigint', default: 0 })
    balance?: number;
}