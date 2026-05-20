import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from '../students/student.entity';
import { CourseModule } from '../modules/module.entity';
import { Semester } from '../semesters/semester.entity';

@Entity()
export class Mark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  score: number;

  @Column('float', { default: 100 })
  maxScore: number;

  @Column({ nullable: true })
  studentId: string;

  @ManyToOne(() => Student, student => student.marks, { onDelete: 'CASCADE' })
  student: Student;

  @Column({ nullable: true })
  moduleId: string;

  @ManyToOne(() => CourseModule, m => m.marks, { nullable: true, onDelete: 'SET NULL' })
  module: CourseModule;

  @Column({ nullable: true })
  semesterId: string;

  @ManyToOne(() => Semester, s => s.marks, { nullable: true, onDelete: 'SET NULL' })
  semester: Semester;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
