import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export const ZodValidationPipe = (schema: ZodSchema): PipeTransform => {
    return {
        transform(value: unknown) {
            try {
                return schema.parse(value);
            } catch (err) {
                if (err instanceof ZodError) {
                    throw new BadRequestException({
                        message: 'Validation error',
                        errors: err.flatten(),
                    });
                }

                throw err;
            }
        },
    };
};
