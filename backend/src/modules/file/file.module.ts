import { Module } from "@nestjs/common";
import { ViewFileController } from "./file.controller";
import { ViewFileService } from "./file.service";

@Module({
  controllers: [ViewFileController],
  providers: [ViewFileService],
})
export class ViewFileModule {}
