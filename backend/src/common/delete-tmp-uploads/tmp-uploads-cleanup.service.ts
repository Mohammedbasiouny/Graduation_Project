import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { access, readdir, rm, stat, unlink } from 'node:fs/promises';
import * as path from 'node:path';

const TMP_UPLOADS_PATH = path.join(process.cwd(), 'uploads', 'tmp');
const MAX_FILE_AGE_MS = 24 * 60 * 60 * 1000; // 1 minute 
const DELETABLE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.pdf']);

@Injectable()
export class TmpUploadsCleanupService implements OnModuleInit {
    private readonly logger = new Logger(TmpUploadsCleanupService.name);

    async onModuleInit(): Promise<void> {
        await this.cleanupOldFiles();
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleHourlyCleanup(): Promise<void> {
        await this.cleanupOldFiles();
    }

    private async cleanupOldFiles(): Promise<void> {
        const now = Date.now();

        if (!(await this.pathExists(TMP_UPLOADS_PATH))) {
            return;
        }

        const deletedCount = await this.deleteOldFilesRecursively(TMP_UPLOADS_PATH, now);

        if (deletedCount > 0) {
            this.logger.log(`Deleted ${deletedCount} expired file(s) from uploads/tmp.`);
        }
    }

    private async deleteOldFilesRecursively(directoryPath: string, now: number): Promise<number> {
        let deletedCount = 0;
        const entries = await readdir(directoryPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(directoryPath, entry.name);

            if (entry.isDirectory()) {
                deletedCount += await this.deleteOldFilesRecursively(entryPath, now);
                await this.removeIfDirectoryIsEmpty(entryPath);
                continue;
            }

            if (!entry.isFile()) {
                continue;
            }

            const extension = path.extname(entry.name).toLowerCase();
            if (!DELETABLE_EXTENSIONS.has(extension)) {
                continue;
            }

            try {
                const fileStats = await stat(entryPath);
                if (now - fileStats.mtimeMs >= MAX_FILE_AGE_MS) {
                    await unlink(entryPath);
                    deletedCount += 1;
                }
            } catch (error) {
                this.logger.warn(`Failed to process tmp file ${entryPath}: ${(error as Error).message}`);
            }
        }

        return deletedCount;
    }

    private async removeIfDirectoryIsEmpty(directoryPath: string): Promise<void> {
        const remainingEntries = await readdir(directoryPath);

        if (remainingEntries.length === 0) {
            await rm(directoryPath, { recursive: true, force: true });
        }
    }

    private async pathExists(targetPath: string): Promise<boolean> {
        try {
            await access(targetPath);
            return true;
        } catch {
            return false;
        }
    }
}
