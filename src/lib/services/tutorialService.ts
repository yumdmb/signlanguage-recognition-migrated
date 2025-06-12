import { createClient } from '@/utils/supabase/client';
import type { 
  Tutorial, 
  TutorialWithProgress, 
  TutorialProgress,
  Database 
} from '@/types/database';

const supabase = createClient();

export class TutorialService {  // Get all tutorials with optional status for a user
  static async getTutorials(userId?: string, language?: 'ASL' | 'MSL'): Promise<TutorialWithProgress[]> {
    try {
      let query = supabase
        .from('tutorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (language) {
        query = query.eq('language', language);
      }

      const { data: tutorials, error } = await query;

      if (error) throw error;

      if (!tutorials) return [];

      // If userId provided, get status for each tutorial
      if (userId) {
        const { data: progressData } = await supabase
          .from('tutorial_progress')
          .select('tutorial_id, status')
          .eq('user_id', userId);

        const statusMap = new Map(
          progressData?.map(p => [p.tutorial_id, p.status]) || []
        );

        return tutorials.map(tutorial => ({
          ...tutorial,
          status: statusMap.get(tutorial.id) || 'not-started'
        }));
      }

      return tutorials.map(tutorial => ({ ...tutorial, status: 'not-started' as const }));} catch (error) {
      console.error('Error fetching tutorials:', error);
      
      // Provide more detailed error information
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: (error as any).message,
          code: (error as any).code,
          hint: (error as any).hint,
          details: (error as any).details
        });
      }
      
      throw error;
    }
  }
  // Get single tutorial by ID
  static async getTutorial(id: string, userId?: string): Promise<TutorialWithProgress | null> {
    try {
      const { data: tutorial, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!tutorial) return null;

      // Get status if userId provided
      if (userId) {
        const { data: progress } = await supabase
          .from('tutorial_progress')
          .select('status')
          .eq('user_id', userId)
          .eq('tutorial_id', id)
          .single();

        return {
          ...tutorial,
          status: progress?.status || 'not-started'
        };
      }

      return { ...tutorial, status: 'not-started' as const };
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      throw error;
    }
  }

  // Create new tutorial (admin only)
  static async createTutorial(
    tutorial: Database['public']['Tables']['tutorials']['Insert']
  ): Promise<Tutorial> {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .insert([tutorial])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tutorial:', error);
      throw error;
    }
  }

  // Update tutorial (admin only)
  static async updateTutorial(
    id: string, 
    updates: Database['public']['Tables']['tutorials']['Update']
  ): Promise<Tutorial> {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw error;
    }
  }

  // Delete tutorial (admin only)
  static async deleteTutorial(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw error;
    }
  }  // Start a tutorial (sets status to 'started')
  static async startTutorial(
    userId: string, 
    tutorialId: string
  ): Promise<TutorialProgress> {
    try {
      console.log('Starting tutorial with:', { userId, tutorialId });
      
      const { data, error } = await supabase
        .from('tutorial_progress')
        .upsert({
          user_id: userId,
          tutorial_id: tutorialId,
          status: 'started',
          last_watched_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Tutorial started successfully:', data);
      return data;    } catch (error) {
      console.error('Error starting tutorial:', error);
      console.error('Error details:', {
        message: (error as any)?.message,
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint
      });
      throw error;
    }
  }  // Mark tutorial as done (sets status to 'completed')
  static async markTutorialDone(
    userId: string, 
    tutorialId: string
  ): Promise<TutorialProgress> {
    try {
      console.log('Marking tutorial as done with:', { userId, tutorialId });
      
      // First, try to update the existing record
      const { data: updateData, error: updateError } = await supabase
        .from('tutorial_progress')
        .update({
          status: 'completed',
          last_watched_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('tutorial_id', tutorialId)
        .select()
        .single();

      if (updateError) {
        // If update fails (record doesn't exist), try to insert
        if (updateError.code === 'PGRST116') {
          console.log('No existing record found, creating new one...');
          const { data: insertData, error: insertError } = await supabase
            .from('tutorial_progress')
            .insert({
              user_id: userId,
              tutorial_id: tutorialId,
              status: 'completed',
              last_watched_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) {
            console.error('Insert error:', insertError);
            throw insertError;
          }
          
          console.log('Tutorial marked as done successfully (new record):', insertData);
          return insertData;
        } else {
          console.error('Update error:', updateError);
          throw updateError;
        }
      }
      
      console.log('Tutorial marked as done successfully (updated):', updateData);
      return updateData;
    } catch (error) {
      console.error('Error marking tutorial as done:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  // Get overall tutorial progress for a user
  static async getOverallProgress(userId: string): Promise<{ 
    totalStarted: number;
    totalCompleted: number;
    completionPercentage: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('status')
        .eq('user_id', userId);

      if (error) throw error;

      const totalStarted = data?.length || 0;
      const totalCompleted = data?.filter(p => p.status === 'completed').length || 0;
      const completionPercentage = totalStarted > 0 ? Math.round((totalCompleted / totalStarted) * 100) : 0;

      return {
        totalStarted,
        totalCompleted,
        completionPercentage
      };
    } catch (error) {
      console.error('Error fetching overall progress:', error);
      throw error;
    }
  }

  // Get user's tutorial progress
  static async getUserProgress(userId: string): Promise<TutorialProgress[]> {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_watched_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }
}
