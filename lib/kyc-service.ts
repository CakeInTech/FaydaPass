import { supabase } from './supabase'
import type { KYCUser, ConsentLog, VerificationSession } from './supabase'

export class KYCService {
  // Store verified user data with consent
  static async storeVerifiedUser(userData: {
    fayda_id: string
    name: string
    email?: string
    phone_number?: string
    picture?: string
    gender?: string
    birthdate?: string
    address?: string
    name_en?: string
    name_am?: string
  }, consentData: {
    ip_address?: string
    user_agent?: string
  }): Promise<{ user: KYCUser | null; error: string | null }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('kyc_users')
        .select('*')
        .eq('fayda_id', userData.fayda_id)
        .single()

      let user: KYCUser

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('kyc_users')
          .update({
            ...userData,
            verification_timestamp: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('fayda_id', userData.fayda_id)
          .select()
          .single()

        if (error) throw error
        user = data
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('kyc_users')
          .insert({
            ...userData,
            consent_given: true,
            consent_timestamp: new Date().toISOString(),
            verification_timestamp: new Date().toISOString()
          })
          .select()
          .single()

        if (error) throw error
        user = data
      }

      // Log consent
      await this.logConsent(user.id, {
        consent_type: 'kyc_verification',
        consent_given: true,
        consent_details: 'User completed Fayda KYC verification and consented to data storage',
        ip_address: consentData.ip_address,
        user_agent: consentData.user_agent
      })

      return { user, error: null }
    } catch (error) {
      console.error('Error storing verified user:', error)
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Log consent actions
  static async logConsent(userId: string, consentData: {
    consent_type: 'kyc_verification' | 'data_storage' | 'data_sharing'
    consent_given: boolean
    consent_details: string
    ip_address?: string
    user_agent?: string
  }): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('consent_logs')
        .insert({
          user_id: userId,
          ...consentData,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Error logging consent:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Create verification session
  static async createVerificationSession(sessionData: {
    session_id: string
    oauth_state: string
    code_verifier: string
  }): Promise<{ session: VerificationSession | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('verification_sessions')
        .insert({
          ...sessionData,
          status: 'initiated',
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        })
        .select()
        .single()

      if (error) throw error
      return { session: data, error: null }
    } catch (error) {
      console.error('Error creating verification session:', error)
      return { session: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update verification session
  static async updateVerificationSession(sessionId: string, updates: {
    user_id?: string
    status?: 'initiated' | 'completed' | 'failed' | 'expired'
    error_message?: string
  }): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('verification_sessions')
        .update(updates)
        .eq('session_id', sessionId)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Error updating verification session:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get user by Fayda ID
  static async getUserByFaydaId(faydaId: string): Promise<{ user: KYCUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('kyc_users')
        .select('*')
        .eq('fayda_id', faydaId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
      return { user: data, error: null }
    } catch (error) {
      console.error('Error getting user by Fayda ID:', error)
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get all verified users (for admin)
  static async getAllVerifiedUsers(limit = 50, offset = 0): Promise<{ users: KYCUser[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('kyc_users')
        .select('*')
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return { users: data || [], error: null }
    } catch (error) {
      console.error('Error getting all verified users:', error)
      return { users: [], error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get consent logs for a user
  static async getUserConsentLogs(userId: string): Promise<{ logs: ConsentLog[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('consent_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) throw error
      return { logs: data || [], error: null }
    } catch (error) {
      console.error('Error getting consent logs:', error)
      return { logs: [], error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.rpc('cleanup_expired_sessions')
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}