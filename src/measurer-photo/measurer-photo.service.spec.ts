import { Test, TestingModule } from '@nestjs/testing'
import { MeasurerPhotoService } from './measurer-photo.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Reading } from './entities/reading.entity'
import { Repository } from 'typeorm'

describe('MeasurerPhotoService', () => {
  let service: MeasurerPhotoService
  let repository: Repository<Reading>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurerPhotoService,
        {
          provide: getRepositoryToken(Reading),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<MeasurerPhotoService>(MeasurerPhotoService)
    repository = module.get<Repository<Reading>>(getRepositoryToken(Reading))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
