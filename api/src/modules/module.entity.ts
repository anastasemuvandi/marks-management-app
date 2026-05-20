import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Mark } from '../marks/mark.entity';
import { Student } from '../students/student.entity';

@Entity('modules')
export class CourseModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Mark, m => m.module)
  marks: Mark[];

  @ManyToMany(() => Student, s => s.modules)
  students: Student[];
}
