import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { AcademicYear } from '../academic-year/academic-year.entity';
import { Mark } from '../marks/mark.entity';

@Entity('semesters')
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  academicYearId: string;

  @ManyToOne(() => AcademicYear, ay => ay.semesters, { onDelete: 'CASCADE' })
  academicYear: AcademicYear;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Mark, m => m.semester)
  marks: Mark[];
}
