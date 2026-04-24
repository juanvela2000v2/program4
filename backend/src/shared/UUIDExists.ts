import { registerDecorator, ValidationOptions } from "class-validator";
import { UUIDExistsRule } from "./UUIDExistsRule";

export function UUIDExists(entity: Function, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: UUIDExistsRule,
    });
  };
}
