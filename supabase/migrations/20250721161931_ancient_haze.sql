/*
  # Fix RLS policies for anonymous access

  1. Security Changes
    - Update RLS policies to allow anonymous access for development
    - Allow anonymous users to perform CRUD operations on students and measurements tables
    - This is for development purposes - in production, proper authentication should be implemented

  2. Policy Updates
    - Drop existing restrictive policies
    - Create new policies that allow anonymous access
    - Maintain data integrity while allowing development access
*/

-- Drop existing policies for students table
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os alunos" ON students;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir alunos" ON students;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar alunos" ON students;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar alunos" ON students;

-- Create new policies for students table that allow anonymous access
CREATE POLICY "Allow anonymous read access to students"
  ON students
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to students"
  ON students
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to students"
  ON students
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to students"
  ON students
  FOR DELETE
  TO anon
  USING (true);

-- Drop existing policies for measurements table
DROP POLICY IF EXISTS "Usuários autenticados podem ver todas as medições" ON measurements;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir medições" ON measurements;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar medições" ON measurements;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar medições" ON measurements;

-- Create new policies for measurements table that allow anonymous access
CREATE POLICY "Allow anonymous read access to measurements"
  ON measurements
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert access to measurements"
  ON measurements
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to measurements"
  ON measurements
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to measurements"
  ON measurements
  FOR DELETE
  TO anon
  USING (true);