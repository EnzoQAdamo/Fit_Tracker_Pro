import { supabase } from '../lib/supabase';
import { Measurement } from '../types';

export class MeasurementService {
  static async getMeasurementsByStudentId(studentId: string): Promise<Measurement[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('student_id', studentId)
      .eq('user_id', user.id)
      .order('measured_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createMeasurement(measurement: Omit<Measurement, 'id' | 'created_at'>): Promise<Measurement> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('measurements')
      .insert([{ ...measurement, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateMeasurement(id: string, updates: Partial<Measurement>): Promise<Measurement> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('measurements')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteMeasurement(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('measurements')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  static async getLatestMeasurement(studentId: string): Promise<Measurement | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('student_id', studentId)
      .eq('user_id', user.id)
      .order('measured_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
}