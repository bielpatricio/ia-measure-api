/* eslint-disable camelcase */
import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { CreateReadingDto } from './dto/create-reading.dto'
import { MeasurerPhotoService } from './measurer-photo.service'
import { ConfirmReadingDto } from './dto/confirm-reading.dto'

@Controller('measurer-photo')
export class MeasurerPhotoController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly measurerPhotoService: MeasurerPhotoService) {}

  @Post('/upload')
  async uploadReading(@Body() createReadDto: CreateReadingDto) {
    return this.measurerPhotoService.uploadReading(createReadDto)
  }

  @Patch('/confirm')
  async confirmReading(@Body() confirmReadingDto: ConfirmReadingDto) {
    return this.measurerPhotoService.confirmReading(confirmReadingDto)
  }

  @Get('/:customer_code/list')
  async listReadings(
    @Param('customer_code') customer_code: string,
    @Query('measure_type') measure_type?: string,
  ) {
    return this.measurerPhotoService.listReadings(customer_code, measure_type)
  }
}
