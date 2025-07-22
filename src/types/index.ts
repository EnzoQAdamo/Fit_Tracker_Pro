export interface Student {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

export interface Measurement {
  id: string;
  student_id: string;
  user_id: string;
  weight: number;
  height: number;
  body_fat_percentage: number;
  chest_circumference?: number;
  waist_circumference?: number;
  hip_circumference?: number;
  arm_circumference_left?: number;
  arm_circumference_right?: number;
  thigh_circumference_left?: number;
  thigh_circumference_right?: number;
  calf_circumference_left?: number;
  calf_circumference_right?: number;
  measured_at: string;
  created_at: string;
  notes?: string;
}

export interface StudentWithLatestMeasurement extends Student {
  latest_measurement?: Measurement;
  measurements_count: number;
}