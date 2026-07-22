import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    readonly client: SupabaseClient;
    private readonly logger;
    constructor();
    getDb(): SupabaseClient<any, "public", "public", any, any>;
}
