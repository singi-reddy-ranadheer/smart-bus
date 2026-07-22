import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const ApiResponse = (data: any, message = 'Success', statusCode = 200) => ({
  success: true,
  message,
  data,
  statusCode,
});