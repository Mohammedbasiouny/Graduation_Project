export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'OTHER';

export interface JwtUserPayload {
    id?: number | string;
    sub?: number | string;
    role?: string;
    roles?: string[];
}

export interface AuditLogInput {
    user_id: number;
    role: string;
    action: AuditAction;
    method: string;
    endpoint: string;
    ip_address?: string;
    user_agent?: string;
    status_code: number;
    status: 'SUCCESS' | 'FAILED';
    message?: string | null;
}
