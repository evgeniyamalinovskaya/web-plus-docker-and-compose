import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// добавляем проверку аутентификации
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

// теперь её можно использовать в контроллерах,
// например, не давать доступ к профилю,
// если пользователь не аутентифицирован.
