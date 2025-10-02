// Shared type declarations for Supabase Edge Functions (Deno environment)

declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
  }
  
  export const env: Env;
}

// Module declarations for npm specifier imports
declare module "npm:resend@2.0.0" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(params: {
        from: string;
        to: string[];
        subject: string;
        html: string;
      }): Promise<{
        id: string;
        [key: string]: any;
      }>;
    };
  }
}

// Module declarations for Deno standard library
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: { port?: number; hostname?: string }
  ): void;
}

// Module declarations for Supabase client
declare module "https://esm.sh/@supabase/supabase-js@2.7.1" {
  export interface SupabaseClient {
    from(table: string): any;
  }
  
  export function createClient(
    supabaseUrl: string, 
    supabaseKey: string, 
    options?: any
  ): SupabaseClient;
}