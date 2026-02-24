import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

//    @Get()
//   insert(){
//     return "Working";
//   }
  @Get('insert')
  async insert() {
    return this.testService.insertUser();
  }

  @Get('all')
  async getAll() {
    return this.testService.getUsers();
  }
}