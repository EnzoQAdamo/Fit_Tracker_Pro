import { supabase } from '../lib/supabase';
import { Student, Measurement, StudentWithLatestMeasurement } from '../types';

export class StudentService {
  static async getStudentsWithLatestMeasurement(): Promise<StudentWithLatestMeasurement[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        measurements!measurements_student_id_fkey(
          id,
          weight,
          height,
          body_fat_percentage,
          chest_circumference,
          waist_circumference,
          hip_circumference,
          arm_circumference_left,
          arm_circumference_right,
          thigh_circumference_left,
          thigh_circumference_right,
          calf_circumference_left,
          calf_circumference_right,
          measured_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(student => ({
      ...student,
      latest_measurement: student.measurements?.[0] || null,
      measurements_count: student.measurements?.length || 0
    }));
  }

  static async getStudentById(id: string): Promise<Student | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('students')
      .insert([{ ...student, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteStudent(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  static async searchStudents(query: string): Promise<StudentWithLatestMeasurement[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        measurements!measurements_student_id_fkey(
          id,
          weight,
          height,
          body_fat_percentage,
          chest_circumference,
          waist_circumference,
          hip_circumference,
          arm_circumference_left,
          arm_circumference_right,
          thigh_circumference_left,
          thigh_circumference_right,
          calf_circumference_left,
          calf_circumference_right,
          measured_at
        )
      `)
      .eq('user_id', user.id)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(student => ({
      ...student,
      latest_measurement: student.measurements?.[0] || null,
      measurements_count: student.measurements?.length || 0
    }));
  }
}