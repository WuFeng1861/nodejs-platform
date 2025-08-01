import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('codes')
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 1000 })
  description: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ length: 100, default: 'javascript' })
  language: string;

  @Column({ type: 'text', nullable: true })
  parameters: string;

  @Column({ default: 0 })
  executeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}