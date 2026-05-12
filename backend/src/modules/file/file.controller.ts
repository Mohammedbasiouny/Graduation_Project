import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { decryptFilePath } from "src/utils";
import { ViewFileService } from "./file.service";
import { JwtGuard } from "../auth/guard";

@Controller('')
export class ViewFileController {
  constructor(private readonly viewFileService: ViewFileService) { }
  @Get('files/:token')
  getFile(@Param('token') token: string, @Res() res: Response) {
    const filePath = decryptFilePath(token);

    return res.sendFile(filePath, {
      root: process.cwd(),
    });
  }
}
