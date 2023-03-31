import { IsString } from 'class-validator';

//условие отбора в виде query-фильтра
export class QueryUserDto {
  @IsString()
  query: string;
}





