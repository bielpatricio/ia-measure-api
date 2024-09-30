/* eslint-disable camelcase */
import { Test, TestingModule } from '@nestjs/testing'
import { MeasurerPhotoController } from './measurer-photo.controller'
import { MeasurerPhotoService } from './measurer-photo.service'
import { CreateReadingDto } from './dto/create-reading.dto'
import { ConfirmReadingDto } from './dto/confirm-reading.dto'

describe('MeasurerPhotoController', () => {
  let controller: MeasurerPhotoController
  let service: MeasurerPhotoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurerPhotoController],
      providers: [
        {
          provide: MeasurerPhotoService,
          useValue: {
            uploadReading: jest.fn(),
            confirmReading: jest.fn(),
            listReadings: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<MeasurerPhotoController>(MeasurerPhotoController)
    service = module.get<MeasurerPhotoService>(MeasurerPhotoService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('uploadReading', () => {
    it('should call uploadReading method from service with correct data', async () => {
      const dto: CreateReadingDto = {
        image: 'image_data',
        customer_code: '12345',
        measure_datetime: new Date(),
        measure_type: 'WATER',
      }

      await controller.uploadReading(dto)

      expect(service.uploadReading).toHaveBeenCalledWith(dto)
    })

    it('should handle errors thrown by the service', async () => {
      const dto: CreateReadingDto = {
        image: 'image_data',
        customer_code: '12345',
        measure_datetime: new Date(),
        measure_type: 'GAS',
      }

      jest
        .spyOn(service, 'uploadReading')
        .mockRejectedValue(new Error('Service Error'))

      await expect(controller.uploadReading(dto)).rejects.toThrow(
        'Service Error',
      )
    })

    it('should handle missing image field in dto', async () => {
      const dto = {
        customer_code: '12345',
        measure_datetime: new Date(),
        measure_type: 'GAS',
      } as CreateReadingDto

      await controller.uploadReading(dto)

      expect(service.uploadReading).toHaveBeenCalledWith(dto)
    })
  })

  describe('confirmReading', () => {
    it('should call confirmReading method from service with correct data', async () => {
      const dto: ConfirmReadingDto = {
        measure_uuid: 'uuid-9876',
        confirmed_value: 50,
      }

      await controller.confirmReading(dto)

      expect(service.confirmReading).toHaveBeenCalledWith(dto)
    })

    it('should handle missing confirmed_value field in dto', async () => {
      const dto = {
        measure_uuid: 'uuid-9876',
      } as ConfirmReadingDto

      await controller.confirmReading(dto)

      expect(service.confirmReading).toHaveBeenCalledWith(dto)
    })

    it('should handle service throwing an error', async () => {
      const dto: ConfirmReadingDto = {
        measure_uuid: 'uuid-9876',
        confirmed_value: 50,
      }

      jest
        .spyOn(service, 'confirmReading')
        .mockRejectedValue(new Error('Service Error'))

      await expect(controller.confirmReading(dto)).rejects.toThrow(
        'Service Error',
      )
    })
  })

  describe('listReadings', () => {
    it('should call listReadings method from service with correct data', async () => {
      const customer_code = '12345'
      const measure_type = 'WATER'

      await controller.listReadings(customer_code, measure_type)

      expect(service.listReadings).toHaveBeenCalledWith(
        customer_code,
        measure_type,
      )
    })

    it('should call listReadings with undefined measure_type if not provided', async () => {
      const customer_code = '12345'

      await controller.listReadings(customer_code)

      expect(service.listReadings).toHaveBeenCalledWith(
        customer_code,
        undefined,
      )
    })

    it('should handle invalid measure_type', async () => {
      const customer_code = '12345'
      const measure_type = 'INVALID_TYPE'

      await controller.listReadings(customer_code, measure_type)

      expect(service.listReadings).toHaveBeenCalledWith(
        customer_code,
        measure_type,
      )
    })

    it('should handle service throwing an error', async () => {
      const customer_code = '12345'

      jest
        .spyOn(service, 'listReadings')
        .mockRejectedValue(new Error('Service Error'))

      await expect(controller.listReadings(customer_code)).rejects.toThrow(
        'Service Error',
      )
    })
  })
})
