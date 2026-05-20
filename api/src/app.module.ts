import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { MarksModule } from './marks/marks.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AcademicYearModule } from './academic-year/academic-year.module';
import { SemestersModule } from './semesters/semesters.module';
import { ModulesModule } from './modules/modules.module';
import { ClassesModule } from './classes/classes.module';
import { Student } from './students/student.entity';
import { Mark } from './marks/mark.entity';
import { User } from './users/user.entity';
import { AcademicYear } from './academic-year/academic-year.entity';
import { Semester } from './semesters/semester.entity';
import { CourseModule } from './modules/module.entity';
import { Class } from './classes/class.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'marks_manager'),
        entities: [Student, Mark, User, AcademicYear, Semester, CourseModule, Class],
        synchronize: true,
      }),
    }),
    StudentsModule,
    MarksModule,
    ReportsModule,
    UsersModule,
    AuthModule,
    AcademicYearModule,
    SemestersModule,
    ModulesModule,
    ClassesModule,
  ],
})
export class AppModule {}
