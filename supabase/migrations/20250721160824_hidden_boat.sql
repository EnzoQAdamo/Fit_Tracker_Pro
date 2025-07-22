/*
  # Criação do Sistema de Gerenciamento de Alunos para Personal Trainers

  1. Novas Tabelas
    - `students` - Dados pessoais dos alunos
      - `id` (uuid, chave primária)
      - `name` (text) - Nome completo
      - `email` (text) - E-mail de contato
      - `phone` (text) - Telefone
      - `date_of_birth` (date) - Data de nascimento
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `measurements` - Histórico de medições corporais
      - `id` (uuid, chave primária)
      - `student_id` (uuid, foreign key)
      - `weight` (numeric) - Peso em kg
      - `height` (numeric) - Altura em cm
      - `body_fat_percentage` (numeric) - % de gordura corporal
      - Circunferências opcionais em cm
      - `measured_at` (timestamp) - Data da medição
      - `notes` (text, opcional) - Observações

  2. Segurança
    - RLS habilitado em ambas as tabelas
    - Políticas para usuários autenticados
    - Índices para otimização de consultas

  3. Funcionalidades
    - Cadastro completo de alunos
    - Histórico de medições com evolução
    - Busca e filtros otimizados
*/

-- Tabela de alunos
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de medições
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  weight numeric(5,2) NOT NULL CHECK (weight > 0),
  height numeric(5,2) NOT NULL CHECK (height > 0),
  body_fat_percentage numeric(4,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
  chest_circumference numeric(5,2) CHECK (chest_circumference > 0),
  waist_circumference numeric(5,2) CHECK (waist_circumference > 0),
  hip_circumference numeric(5,2) CHECK (hip_circumference > 0),
  arm_circumference numeric(5,2) CHECK (arm_circumference > 0),
  thigh_circumference numeric(5,2) CHECK (thigh_circumference > 0),
  measured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  notes text
);

-- Habilitar RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

-- Políticas para students
CREATE POLICY "Usuários autenticados podem ver todos os alunos"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir alunos"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar alunos"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar alunos"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para measurements
CREATE POLICY "Usuários autenticados podem ver todas as medições"
  ON measurements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir medições"
  ON measurements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar medições"
  ON measurements
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar medições"
  ON measurements
  FOR DELETE
  TO authenticated
  USING (true);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS students_name_idx ON students(name);
CREATE INDEX IF NOT EXISTS students_email_idx ON students(email);
CREATE INDEX IF NOT EXISTS measurements_student_id_idx ON measurements(student_id);
CREATE INDEX IF NOT EXISTS measurements_measured_at_idx ON measurements(measured_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();