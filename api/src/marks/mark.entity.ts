import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Mark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column('float')
  score: number;

  @Column('float', { default: 100 })
  maxScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Student, student => student.marks, { onDelete: 'CASCADE' })
  student: Student;

  @Column()
  studentId: string;
}
