// Supabase stub - funcionalidade desabilitada
// Para reativar, configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = {
  from: () => ({
    select: () => ({ data: [], error: null, order: function() { return this; } }),
    insert: () => ({ data: null, error: null, select: function() { return this; }, single: function() { return this; } }),
    update: () => ({ data: null, error: null, eq: function() { return this; }, select: function() { return this; }, single: function() { return this; } }),
    delete: () => ({ data: null, error: null, eq: function() { return this; }, in: function() { return this; } }),
  }),
};
