import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    // Supabase client ko function ke andar initialize karna hai
    // Environment variables se URL aur Service Role Key uthao
    const supabase = createClient(
      Deno.env.get('VITE_SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Service role key use karna zaroori hai
    );

    // URL se short_id nikalo, e.g., 'ss-006'
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const shortId = pathParts[pathParts.length - 1];

    if (!shortId) {
      return new Response(JSON.stringify({ error: 'Short ID is missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Database se real UUID fetch karo
    const { data, error } = await supabase
      .from('gallery')
      .select('id')
      .eq('short_id', shortId)
      .single();

    if (error || !data) {
      // Agar ID na mile to 404 page pe bhej do
      const notFoundUrl = `${url.origin}/404`; 
      return Response.redirect(notFoundUrl, 302);
    }

    // Real UUID mil gaya, ab uske URL pe redirect kardo
    const redirectUrl = `${url.origin}/gallery/${data.id}`;
    
    // 302 Temporary Redirect - browser ko batata hai ki is address pe jao
    return Response.redirect(redirectUrl, 302);

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
