import { Global, Module } from '@nestjs/common';
import { ResponseHelper } from './response-helper';

@Global()
@Module({
  providers: [ResponseHelper],
  exports: [ResponseHelper],
})
export class ResponseHelperModule {}
