import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Реализуем гарду для стратегии в контроллерах
@Injectable()
export class LocalGuard extends AuthGuard('local') {}
