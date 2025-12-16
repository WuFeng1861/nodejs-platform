import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { Code } from './entities/code.entity';
import { JscFile } from './entities/jsc-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Code, JscFile])],
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
