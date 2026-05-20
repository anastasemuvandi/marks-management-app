import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Mark } from '../marks/mark.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  studentId: string;

  @Column({ nullable: true })
  group: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Mark, mark => mark.student, { cascade: true })
  marks: Mark[];
}
