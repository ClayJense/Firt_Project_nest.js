import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): number {
    return 2;
  }

  getUsers(): any[] {
    return [
      {
        id: 1,
        name: 'John Doe',
        age: 30,
      },
      {
        id: 2,
        name: 'Jane Doe',
        age: 25,
      },
    ];
  }
}
