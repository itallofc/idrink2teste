import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'
  const type = searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check user role and redirect accordingly
      const role = data.user.user_metadata?.role
      
      // Create or update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name,
          phone: data.user.user_metadata?.phone,
          role: role || 'user',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        })
      
      if (profileError) {
        console.error('Error creating profile:', profileError)
      }

      // If merchant, create store if store_name was provided
      if (role === 'merchant' && data.user.user_metadata?.store_name) {
        const storeName = data.user.user_metadata.store_name
        const slug = storeName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        const { error: storeError } = await supabase
          .from('stores')
          .upsert({
            owner_id: data.user.id,
            name: storeName,
            slug: slug,
            phone: data.user.user_metadata?.phone,
            email: data.user.email,
            is_active: true,
            is_open: false,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'owner_id'
          })

        if (storeError) {
          console.error('Error creating store:', storeError)
        }
      }

      // Redirect based on role or next parameter
      let redirectUrl = next
      if (role === 'merchant') {
        redirectUrl = next === '/home' ? '/comerciante' : next
      }
      return NextResponse.redirect(`${origin}${redirectUrl}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?error=could_not_verify_email`)
}
