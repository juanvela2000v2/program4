import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm'; // O tu ORM de preferencia
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { JardinEntity } from 'src/models/jardin/jardin';

@Injectable()
@ValidatorConstraint({ name: 'UUIDExists', async: true })
export class UUIDExistsRule implements ValidatorConstraintInterface {
    constructor(
    private readonly entityManager: EntityManager
    ) {
        console.log("valida",entityManager);
    }

  async validate(value: any, args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = await this.entityManager.findOne(EntityClass, {
      where: { id: value },
    });
    return entity?false:true; 
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} con UUID ${args.value} no existe en la tabla`;
  }
}
