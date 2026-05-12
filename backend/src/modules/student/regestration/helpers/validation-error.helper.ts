import { UnprocessableEntityException } from "@nestjs/common";

export class ValidationErrorHelper {
  static throw(errors: Record<string, string[]>): never {
    throw new UnprocessableEntityException({
      status: 'error',
      message: ['Validation failed.'],
      data: null,
      errors,
    });
  }

  static field(field: string, message: string): never {
    return ValidationErrorHelper.throw({ [field]: [message] });
  }
}