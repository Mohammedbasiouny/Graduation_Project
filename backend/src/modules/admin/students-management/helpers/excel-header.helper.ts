import { Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';


@Injectable()
export class ExcelHeaderHelper {

    normalize(text: string): string {
        return String(text ?? '')
            .normalize('NFC')
            .replaceAll(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
            .replaceAll(/\s+/g, ' ')
            .trim();
    }

    matchKey(text: string): string {
        const n = this.normalize(text).toLowerCase().replaceAll(/\s+/g, ' ');
        return n.replaceAll(/[^a-z0-9\u0600-\u06FF()\s]/g, '').replaceAll(/\s+/g, ' ').trim() || n;
    }

    buildHeaderMap(headerRow: ExcelJS.Row): Record<string, number> {
        const headerMap: Record<string, number> = {};

        headerRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
            const raw = this.normalize(cell.text);
            if (!raw) return;

            headerMap[raw] = colNum;
            headerMap[this.normalize(raw)] = colNum;
            headerMap[this.matchKey(raw)] = colNum;
            headerMap[raw.toLowerCase().replaceAll(/\s+/g, ' ').replaceAll(/[^a-z0-9 ()]/g, '')] = colNum;
        });

        return headerMap;
    }

    findColumnIndex(headerMap: Record<string, number>, possibleNames: string[]): number | null {
        const normalizedHeaders = new Map<string, number>();

        Object.entries(headerMap).forEach(([original, colNum]) => {
            const key = this.matchKey(original);
            normalizedHeaders.set(this.normalize(original), colNum);
            normalizedHeaders.set(key, colNum);
            normalizedHeaders.set(key?.replaceAll(/\s+/g, '') ?? '', colNum);
            normalizedHeaders.set(
                original.trim().toLowerCase().replaceAll(/\s+/g, ' ').replaceAll(/[^a-z0-9أ-ي()]/g, ''),
                colNum,
            );
        });

        for (const name of possibleNames) {
            const nameNorm = this.normalize(name);
            const normalizedMatch = normalizedHeaders.get(nameNorm);
            if (normalizedMatch !== undefined) return normalizedMatch;

            const nameKey = this.matchKey(name);
            const keyMatch = normalizedHeaders.get(nameKey);
            if (keyMatch !== undefined) return keyMatch;

            const noSpaces = nameKey?.replaceAll(/\s+/g, '') ?? '';
            const compactMatch = normalizedHeaders.get(noSpaces);
            if (compactMatch !== undefined) return compactMatch;

            for (const [normKey, colNum] of normalizedHeaders.entries()) {
                if (normKey.includes(nameKey) || nameKey.includes(normKey)) return colNum;
            }
        }

        return null;
    }
}