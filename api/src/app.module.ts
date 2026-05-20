import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { MarksModule } from './marks/marks.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Student } from './students/student.entity';
import { Mark } from './marks/mark.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'marks.db',
      entities: [Student, Mark, User],
      synchronize: true,
    }),
    StudentsModule,
    MarksModule,
    ReportsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
