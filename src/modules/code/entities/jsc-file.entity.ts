import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('jsc_files')
export class JscFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  fileName: string;

  @Column({ length: 1000 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

