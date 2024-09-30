import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { MeasurerPhotoService } from './measurer-photo.service'
import { MeasurerPhotoController } from './measurer-photo.controller'
import { Reading } from './entities/reading.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Reading])],
  controllers: [MeasurerPhotoController],
  providers: [MeasurerPhotoService],
})
export class MeasurerPhotoModule {}
