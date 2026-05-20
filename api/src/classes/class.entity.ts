import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  level: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Student, s => s.class)
  students: Student[];
}
