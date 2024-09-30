import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Reading {
  @PrimaryGeneratedColumn('uuid')
  measure_uuid: string

  @Column({ nullable: false })
  customer_code: string

  @Column({ nullable: false, type: 'timestamp' })
  measure_datetime: Date

  @Column()
  measure_type: string

  @Column({ default: false })
  has_confirmed: boolean

  @Column({ nullable: false })
  image_url: string

  @Column('decimal')
  measure_value: number
}
