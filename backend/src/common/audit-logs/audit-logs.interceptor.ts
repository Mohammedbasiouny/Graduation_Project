import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import {
    AuditAction,
    AuditLogInput,
    JwtUserPayload,
} from './audit-logs.types';
import { AuditLogsService } from './audit-logs.service';
import { I18nService } from 'nestjs-i18n';

type AuditErrorMessage = string | string[] | null;

@Injectable()
export class AuditLogsInterceptor implements NestInterceptor {
    constructor(
        private readonly auditLogsService: AuditLogsService,
        private readonly i18n: I18nService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        if (context.getType() !== 'http') {
            return next.handle();
        }

        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request & { user?: JwtUserPayload }>();
        const response = httpContext.getResponse<Response>();

        if (this.shouldSkipAuditLog(request)) {
            return next.handle();
        }

        return next.handle().pipe(
            tap({
                next: () => {
                    void this.logRequest(request, response.statusCode, 'SUCCESS');
                },
                error: (error: unknown) => {
                    void this.logRequest(
                        request,
                        this.extractErrorStatusCode(error, response.statusCode || 500),
                        'FAILED',
                        this.extractErrorMessage(error),
                    );
                },
            }),
        );
    }

    private async logRequest(
        request: Request & { user?: JwtUserPayload },
        statusCode: number,
        status: 'SUCCESS' | 'FAILED',
        errorMessage?: AuditErrorMessage,
    ): Promise<void> {
        const user = request.user;
        if (!user) return;
        const userId = user ? this.toNumber(user.id ?? user.sub) : null;
        const role = this.resolveRole(user);
        if (!role || role === 'student') return;

        const endpoint = request.originalUrl || request.url;
        const message = await this.buildAuditMessage(
            request.method,
            endpoint,
            status,
            errorMessage,
            this.getRequestLang(request),
        );

        const logPayload: AuditLogInput = {
            user_id: userId,
            role,
            action: this.mapMethodToAction(request.method),
            method: request.method,
            endpoint,
            ip_address: this.extractIp(request),
            user_agent: request.headers['user-agent'],
            status_code: statusCode,
            status,
            message: message,
        };

        await this.auditLogsService.createAuditLog(logPayload);
    }

    private shouldSkipAuditLog(request: Request): boolean {
        const path = request.path.toLowerCase();

        return (
            path.startsWith('/api/signin') ||
            path.startsWith('/api/signup') ||
            path.startsWith('/api/resend-activation') ||
            path.startsWith('/api/forgot-password') ||
            path.startsWith('/api/check-otp') ||
            path.startsWith('/api/reset-password') ||
            path.startsWith('/api/activate') ||
            path.startsWith('/api/verify-email-change') ||
            path.startsWith('/api/admin/audit-logs')
        );
    }

    private mapMethodToAction(method: string): AuditAction {
        switch (method.toUpperCase()) {
            case 'POST':
                return 'CREATE';
            case 'GET':
                return 'READ';
            case 'PUT':
            case 'PATCH':
                return 'UPDATE';
            case 'DELETE':
                return 'DELETE';
            default:
                return 'OTHER';
        }
    }

    private resolveRole(user: JwtUserPayload): string | null {
        if (user.role) return String(user.role).toLowerCase();
        if (Array.isArray(user.roles) && user.roles.length > 0) {
            return String(user.roles[0]).toLowerCase();
        }
        return null;
    }

    private toNumber(value: number | string | undefined): number | null {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : null;
        }

        if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? null : parsed;
        }

        return null;
    }

    private extractIp(request: Request): string | undefined {
        const forwarded = request.headers['x-forwarded-for'];
        if (typeof forwarded === 'string') {
            return forwarded.split(',')[0]?.trim() || undefined;
        }

        if (Array.isArray(forwarded) && forwarded.length > 0) {
            return forwarded[0];
        }

        return request.ip;
    }

    private extractErrorStatusCode(error: unknown, fallbackStatusCode: number): number {
        if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status?: unknown }).status;
            if (typeof status === 'number') {
                return status;
            }
        }

        return fallbackStatusCode;
    }

    private extractErrorMessage(error: unknown): AuditErrorMessage {
        const responseMessage = this.getNestedMessage(error);
        if (responseMessage) {
            return responseMessage;
        }

        const topLevelMessage = this.extractMessage(error);
        if (topLevelMessage) {
            return topLevelMessage;
        }

        if (error instanceof Error) {
            return error.message;
        }

        return null;
    }

    private getNestedMessage(error: unknown): AuditErrorMessage {
        if (!(error && typeof error === 'object' && 'response' in error)) {
            return null;
        }

        const response = (error as { response?: unknown }).response;
        if (!(response && typeof response === 'object' && 'message' in response)) {
            return null;
        }

        return this.extractMessage((response as { message?: unknown }).message);
    }

    private extractMessage(message: unknown): AuditErrorMessage {
        if (typeof message === 'string') {
            return message;
        }

        if (Array.isArray(message)) {
            const messages = message
                .filter((item): item is string => typeof item === 'string')
                .map((item) => item.trim())
                .filter((item) => item.length > 0);

            if (messages.length > 0) {
                return messages;
            }
        }

        return null;
    }

    private async buildAuditMessage(
        method: string,
        endpoint: string,
        status: 'SUCCESS' | 'FAILED',
        errorMessage?: AuditErrorMessage,
        lang: string = 'ar',
    ): Promise<string> {
        const resourceKey = this.extractResourceName(endpoint);
        const resource = await this.translateResource(resourceKey, endpoint, lang);
        const successAction = await this.getLocalizedAction(
            this.getActionVerb(method, endpoint),
            'SUCCESS',
            lang,
        );
        const specialAction = this.getSpecialAction(endpoint);

        if (status === 'SUCCESS') {
            if (specialAction === 'imported' || specialAction === 'exported') {
                return `${successAction} ${resource}`.trim();
            }

            return this.renderAuditTemplate(
                'audit-logs.MESSAGE.SUCCESS_TEMPLATE',
                {
                    action: successAction,
                    resource,
                },
                lang,
                `${this.capitalizeFirstLetter(successAction)} ${resource}`,
            );
        }

        const reason = await this.translateErrorReasonIfNeeded(errorMessage, lang);
        const failureAction = await this.getLocalizedAction(
            this.getFailureVerb(method, endpoint),
            'FAILED',
            lang,
        );

        if (reason) {
            if (specialAction === 'imported' || specialAction === 'exported') {
                return `فشل ${failureAction} ${resource} بسبب ${reason}`.trim();
            }

            return this.renderAuditTemplate(
                'audit-logs.MESSAGE.FAILED_WITH_REASON_TEMPLATE',
                {
                    action: failureAction,
                    resource,
                    reason,
                },
                lang,
                `Failed to ${failureAction} ${resource} - ${reason}`,
            );
        }

        if (specialAction === 'imported' || specialAction === 'exported') {
            return `فشل ${failureAction} ${resource}`.trim();
        }

        return this.renderAuditTemplate(
            'audit-logs.MESSAGE.FAILED_TEMPLATE',
            {
                action: failureAction,
                resource,
            },
            lang,
            `Failed to ${failureAction} ${resource}`,
        );
    }

    private async translateResource(
        resource: string,
        endpoint: string,
        lang: string,
    ): Promise<string> {
        const isSingle = this.isSingleResource(endpoint);
        const key = this.toI18nResourceKey(resource);
        const formKey = isSingle ? 'one' : 'many';
        const translated = await this.tryTranslate(
            `audit-logs.RESOURCES.${key}.${formKey}`,
            lang,
        );

        if (translated) {
            return translated;
        }

        const fallback = this.humanizeResource(resource);
        if (lang === 'ar' && /[a-z]/i.test(fallback)) {
            return 'سجل';
        }

        return fallback;
    }

    private toI18nResourceKey(resource: string): string {
        return resource
            .trim()
            .toLowerCase()
            .replaceAll(' ', '_');
    }

    private async getLocalizedAction(
        action: string,
        mode: 'SUCCESS' | 'FAILED',
        lang: string,
    ): Promise<string> {
        const actionKey = this.toI18nActionKey(action);
        const key = `audit-logs.ACTION.${mode}.${actionKey}`;
        const translated = await this.tryTranslate(key, lang, { action });
        return translated ?? action;
    }

    private toI18nActionKey(action: string): string {
        return action
            .trim()
            .toLowerCase()
            .replaceAll(' ', '_');
    }

    private async renderAuditTemplate(
        key: string,
        args: Record<string, string>,
        lang: string,
        fallback: string,
    ): Promise<string> {
        const translated = await this.tryTranslate(key, lang, args);
        if (!translated) {
            return fallback;
        }
        return this.interpolateTemplate(translated, args);
    }

    private interpolateTemplate(
        template: string,
        args: Record<string, string>,
    ): string {
        let result = template;

        for (const [key, value] of Object.entries(args)) {
            result = result.replaceAll(
                new RegExp(String.raw`{{\s*${key}\s*}}|{\s*${key}\s*}`, 'g'),
                value,
            );
        }

        return result;
    }

    private async tryTranslate(
        key: string,
        lang: string,
        args?: Record<string, string>,
    ): Promise<string | null> {
        try {
            const translated = await this.i18n.translate(key, { lang, args });
            if (
                typeof translated === 'string' &&
                translated.trim().length > 0 &&
                translated !== key
            ) {
                return translated;
            }
        } catch {
            return null;
        }

        return null;
    }

    private getRequestLang(_request: Request): string {
        return 'ar';
    }

    private async translateErrorReasonIfNeeded(
        errorMessage?: AuditErrorMessage,
        lang: string = 'ar',
    ): Promise<string | null> {
        if (!errorMessage) return null;

        if (Array.isArray(errorMessage)) {
            const uniqueReasons = this.deduplicateReasons(errorMessage);
            const translatedReasons = await Promise.all(
                uniqueReasons.map((item) => this.translateSingleReason(item, lang)),
            );
            return translatedReasons.join('، ');
        }

        const reason = errorMessage.trim();
        if (!reason) return null;

        const reasons = reason
            .split('|')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        const uniqueReasons = this.deduplicateReasons(reasons);

        if (uniqueReasons.length > 1) {
            const translatedReasons = await Promise.all(
                uniqueReasons.map((item) => this.translateSingleReason(item, lang)),
            );
            return translatedReasons.join('، ');
        }

        return this.translateSingleReason(uniqueReasons[0] ?? reason, lang);
    }

    private deduplicateReasons(reasons: string[]): string[] {
        const seen = new Set<string>();
        const unique: string[] = [];

        for (const reason of reasons) {
            const normalized = this.trimTrailingPeriod(reason).toLowerCase();
            if (seen.has(normalized)) {
                continue;
            }

            seen.add(normalized);
            unique.push(reason);
        }

        return unique;
    }

    private async translateSingleReason(reason: string, lang: string): Promise<string> {
        // Check if it's an i18n key (contains dots)
        if (reason.includes('.')) {
            const translated = await this.tryTranslate(reason, lang);
            if (translated) return translated;
        }

        const trimmedReason = this.trimTrailingPeriod(reason);
        const lowerTrimmed = trimmedReason.toLowerCase();
        const candidates = [
            reason,
            trimmedReason,
            `${trimmedReason}.`,
            lowerTrimmed,
            `${lowerTrimmed}.`,
        ];

        for (const candidate of candidates) {
            const mapped = await this.tryTranslate(`audit-logs.ERRORS.${candidate}`, lang);
            if (mapped) return mapped;
        }

        return reason;
    }

    private trimTrailingPeriod(value: string): string {
        return value.trim().replace(/\.+$/, '');
    }

    private getActionVerb(method: string, endpoint: string): string {
        const specialAction = this.getSpecialAction(endpoint);
        if (specialAction) {
            return specialAction;
        }

        if (endpoint.toLowerCase().includes('change-email')) {
            return 'updated';
        }

        if (method.toUpperCase() === 'GET' && !this.isSingleResource(endpoint)) {
            return 'fetched_many';
        }

        switch (method.toUpperCase()) {
            case 'POST':
                return 'created';
            case 'GET':
                return 'fetched';
            case 'PUT':
            case 'PATCH':
                return 'updated';
            case 'DELETE':
                return 'deleted';
            default:
                return 'processed';
        }
    }

    private getFailureVerb(method: string, endpoint: string): string {
        const specialAction = this.getSpecialAction(endpoint);
        if (specialAction === 'logged in') return 'log in';
        if (specialAction === 'imported') return 'import';
        if (specialAction === 'exported') return 'export';

        switch (method.toUpperCase()) {
            case 'POST':
                return 'create';
            case 'GET':
                return 'fetch';
            case 'PUT':
            case 'PATCH':
                return 'update';
            case 'DELETE':
                return 'delete';
            default:
                return 'process';
        }
    }

    private getSpecialAction(endpoint: string): string | null {
        const lowerEndpoint = endpoint.toLowerCase();

        if (lowerEndpoint.includes('login') || lowerEndpoint.includes('signin')) {
            return 'logged in';
        }

        if (lowerEndpoint.includes('upload') || lowerEndpoint.includes('import')) {
            return 'imported';
        }

        if (lowerEndpoint.includes('download') || lowerEndpoint.includes('export')) {
            return 'exported';
        }

        return null;
    }

    private isSingleResource(endpoint: string): boolean {
        const rawPath = endpoint.split('?')[0] ?? endpoint;
        const segments = rawPath
            .split('/')
            .map((segment) => segment.trim())
            .filter(Boolean)
            .filter((segment) => segment !== 'api' && segment !== 'admin');
        const last = segments.at(-1);

        return !!last && this.isIdentifierSegment(last);
    }

    private extractResourceName(endpoint: string): string {
        const rawPath = endpoint.split('?')[0] ?? endpoint;
        
        // Special case: change-email endpoints deal with user email
        if (rawPath.toLowerCase().includes('change-email')) {
            return 'email';
        }

        const segments = rawPath
            .split('/')
            .map((segment) => segment.trim())
            .filter(Boolean)
            .filter((segment) => segment !== 'api' && segment !== 'admin');

        const resourceSegment =
            segments.find((segment) => !this.isIdentifierSegment(segment)) ??
            segments.at(-1) ??
            'record';

        return this.singularize(this.normalizeSegment(resourceSegment));
    }

    private normalizeSegment(segment: string): string {
        return segment
            .replaceAll('-', ' ')
            .replaceAll('_', ' ')
            .trim()
            .toLowerCase();
    }

    private humanizeResource(resource: string): string {
        return resource
            .replaceAll('_', ' ')
            .replaceAll('-', ' ')
            .trim()
            .toLowerCase();
    }

    private isIdentifierSegment(segment: string): boolean {
        return /^(\d+|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(
            segment,
        );
    }

    private singularize(resource: string): string {
        const words = resource.split(' ');
        const lastWord = words.at(-1) ?? '';

        if (lastWord.endsWith('ies')) {
            words[words.length - 1] = lastWord.slice(0, -3) + 'y';
        } else if (lastWord.endsWith('ses')) {
            words[words.length - 1] = lastWord.slice(0, -2);
        } else if (lastWord.endsWith('s') && lastWord.length > 1) {
            words[words.length - 1] = lastWord.slice(0, -1);
        }

        return words.join(' ');
    }

    private capitalizeFirstLetter(value: string): string {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
