import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Mark } from '../marks/mark.entity';
import { Class } from '../classes/class.entity';
import { CourseModule } from '../modules/module.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  studentId: string;

  @Column({ nullable: true })
  classId: string;

  @ManyToOne(() => Class, c => c.students, { nullable: true, onDelete: 'SET NULL' })
  class: Class;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Mark, mark => mark.student, { cascade: true })
  marks: Mark[];

  @ManyToMany(() => CourseModule, m => m.students)
  @JoinTable({ name: 'student_modules' })
  modules: CourseModule[];
}
