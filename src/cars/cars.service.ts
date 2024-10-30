import { HttpException, Injectable, NotFoundException, Controller } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Repository } from 'typeorm';
import { Car } from 'src/database/entities/car-entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  async create(createCarDto: CreateCarDto, currentUser: any) {
    try {

      const { userId } = currentUser;

      const newCar = this.carsRepository.create({
        ...createCarDto,
        user: { id: userId },
      });

      await this.carsRepository.save(newCar);

      return newCar;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async findAll() {
    try {
      const cars = await this.carsRepository.find();

      return cars;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async findOne(id: string) {
    const carId = await this.carsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!carId) {
      throw new NotFoundException();
    }

    return carId;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    try {
      const car = await this.findOne(id);

      if (!car) {
        throw new NotFoundException();
      }

      const carUpdated = this.carsRepository.merge(car, updateCarDto);

      await this.carsRepository.save(carUpdated);

      return carUpdated;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error.',
        error.status || 500,
      );
    }
  }

  async remove(id: string) {
    const car = await this.findOne(id);

    if (!car) {
      throw new NotFoundException();
    }

    await this.carsRepository.delete(id);

    return {
      message: 'Deleted!',
      data: car,
    };
  }
}
