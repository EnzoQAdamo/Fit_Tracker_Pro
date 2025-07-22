/*
  # Adicionar isolamento de dados por usuário

  1. Modificações nas tabelas existentes
    - Adicionar coluna `user_id` na tabela `students`
    - Adicionar coluna `user_id` na tabela `measurements`
    - Criar índices para otimizar consultas por usuário

  2. Atualizar políticas RLS
    - Modificar políticas para filtrar por `user_id`
    - Garantir que cada personal trainer veja apenas seus próprios dados

  3. Funções auxiliares
    - Função para obter o ID do usuário autenticado
*/

-- Adicionar coluna user_id na tabela students
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE students ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Adicionar coluna user_id na tabela measurements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE measurements ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Criar índices para otimizar consultas por usuário
CREATE INDEX IF NOT EXISTS students_user_id_idx ON students(user_id);
CREATE INDEX IF NOT EXISTS measurements_user_id_idx ON measurements(user_id);

-- Remover políticas antigas
DROP POLICY IF EXISTS "Allow anonymous read access to students" ON students;
DROP POLICY IF EXISTS "Allow anonymous insert access to students" ON students;
DROP POLICY IF EXISTS "Allow anonymous update access to students" ON students;
DROP POLICY IF EXISTS "Allow anonymous delete access to students" ON students;

DROP POLICY IF EXISTS "Allow anonymous read access to measurements" ON measurements;
DROP POLICY IF EXISTS "Allow anonymous insert access to measurements" ON measurements;
DROP POLICY IF EXISTS "Allow anonymous update access to measurements" ON measurements;
DROP POLICY IF EXISTS "Allow anonymous delete access to measurements" ON measurements;

-- Criar novas políticas RLS para students
CREATE POLICY "Users can read own students"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own students"
  ON students
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar novas políticas RLS para measurements
CREATE POLICY "Users can read own measurements"
  ON measurements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements"
  ON measurements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements"
  ON measurements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own measurements"
  ON measurements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);