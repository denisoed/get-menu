import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

interface SupabaseServiceConfig {
  url?: string
  serviceRoleKey?: string
}

let cachedClient: SupabaseClient | null = null

function resolveSupabaseConfig(overrides?: SupabaseServiceConfig): Required<SupabaseServiceConfig> {
  const runtimeConfig = useRuntimeConfig()
  const config = {
    url: overrides?.url ?? runtimeConfig.supabase?.url,
    serviceRoleKey: overrides?.serviceRoleKey ?? runtimeConfig.supabase?.serviceRoleKey
  }

  if (!config.url || !config.serviceRoleKey) {
    throw new Error(
      'Supabase configuration is missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set for the server runtime.'
    )
  }

  return config as Required<SupabaseServiceConfig>
}

export function getSupabaseServiceClient(overrides?: SupabaseServiceConfig): SupabaseClient {
  if (cachedClient) {
    return cachedClient
  }

  const { url, serviceRoleKey } = resolveSupabaseConfig(overrides)

  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })

  return cachedClient
}

export function clearSupabaseServiceClientCache() {
  cachedClient = null
}
