import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUserByContext = (
  ctx: ExecutionContext,
): CurrentUserType | undefined => {
  try {
    if (ctx.getType() === 'http') {
      const user = ctx.switchToHttp().getRequest().user;
      return user;
    }
  } catch (error) {
    console.error('Error getting user from context:', error);
  }

  return undefined;
};

export interface CurrentUserType {
    userId: string
    
}

export const CurrentUser = createParamDecorator(
    (ctx: ExecutionContext): CurrentUserType => {
        const user = getCurrentUserByContext(ctx);

        return user;
    }
)
