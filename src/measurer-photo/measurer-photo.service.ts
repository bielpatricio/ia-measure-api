import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Reading } from './entities/reading.entity'

import { v4 as uuidv4 } from 'uuid'
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { promises as fs } from 'fs'
import * as path from 'path'
import { CreateReadingDto } from './dto/create-reading.dto'
import { ConfirmReadingDto } from './dto/confirm-reading.dto'

@Injectable()
export class MeasurerPhotoService {
  private readonly fileManager: GoogleAIFileManager
  private readonly genAI: GoogleGenerativeAI

  constructor(
    @InjectRepository(Reading)
    private readingRepository: Repository<Reading>,
  ) {
    this.fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY)
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }

  async uploadReading(createReadingDto: CreateReadingDto) {
    const { customer_code, measure_datetime, measure_type, image } =
      createReadingDto
    const measureDate = new Date(measure_datetime)
    if (isNaN(measureDate.getTime())) {
      throw new Error('Data de leitura inválida')
    }
    const startOfMonth = new Date(
      measureDate.getFullYear(),
      measureDate.getMonth(),
      1,
    )
    const endOfMonth = new Date(
      measureDate.getFullYear(),
      measureDate.getMonth() + 1,
      0,
    )
    const existingReading = await this.readingRepository.findOne({
      where: {
        customer_code,
        measure_type,
        measure_datetime: Between(startOfMonth, endOfMonth),
      },
    })
    if (existingReading) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      })
    }
    const tempFilePath = path.join('/tmp', `${uuidv4()}.jpg`)
    const buffer = Buffer.from(image, 'base64')
    await fs.writeFile(tempFilePath, buffer)
    const uploadResponse = await this.fileManager.uploadFile(tempFilePath, {
      mimeType: 'image/jpeg',
      displayName: `${customer_code}-${measureDate.toISOString()}`,
    })
    await fs.unlink(tempFilePath)

    let file = await this.fileManager.getFile(uploadResponse.file.name)
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10_000))
      file = await this.fileManager.getFile(uploadResponse.file.name)
    }
    if (file.state === FileState.FAILED) {
      throw new Error('O processamento da imagem falhou.')
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: 'Extraia o valor indicado pelo medidor nesta imagem.',
      },
    ])
    console.log(result.response.text())
    const measure_value = parseFloat(result.response.text())

    const newReading = this.readingRepository.create({
      ...createReadingDto,
      measure_uuid: uuidv4(),
      image_url: uploadResponse.file.uri,
      measure_value,
    })

    await this.readingRepository.save(newReading)

    return {
      image_url: newReading.image_url,
      measure_value: newReading.measure_value,
      measure_uuid: newReading.measure_uuid,
    }
  }

  async confirmReading(confirmReadingDto: ConfirmReadingDto) {
    const { measure_uuid, confirmed_value } = confirmReadingDto

    const reading = await this.readingRepository.findOne({
      where: { measure_uuid },
    })

    if (!reading) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      })
    }

    if (reading.has_confirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      })
    }

    reading.measure_value = confirmed_value
    reading.has_confirmed = true

    await this.readingRepository.save(reading)

    return { success: true }
  }

  async listReadings(customer_code: string, measure_type?: string) {
    const queryBuilder = this.readingRepository
      .createQueryBuilder('reading')
      .where('reading.customer_code = :customer_code', { customer_code })

    if (measure_type) {
      if (
        measure_type.toUpperCase() !== 'WATER' ||
        measure_type.toUpperCase() !== 'GAS'
      ) {
        throw new BadRequestException({
          error_code: 'INVALID_TYPE',
          error_description: 'Tipo de medição não permitida',
        })
      }

      queryBuilder.andWhere('reading.measure_type = :measure_type', {
        measure_type,
      })
    }

    const readings = await queryBuilder.getMany()

    if (!readings.length) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      })
    }

    return {
      customer_code,
      measures: readings.map((reading) => ({
        measure_uuid: reading.measure_uuid,
        measure_datetime: reading.measure_datetime,
        measure_type: reading.measure_type,
        has_confirmed: reading.has_confirmed,
        image_url: reading.image_url,
      })),
    }
  }
}
