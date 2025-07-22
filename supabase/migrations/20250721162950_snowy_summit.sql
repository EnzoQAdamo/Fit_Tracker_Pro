/*
  # Adicionar panturrilha e dividir medidas em direita/esquerda

  1. Alterações na tabela measurements
    - Adicionar `calf_circumference_left` (numeric(5,2))
    - Adicionar `calf_circumference_right` (numeric(5,2))
    - Renomear `arm_circumference` para `arm_circumference_left`
    - Adicionar `arm_circumference_right` (numeric(5,2))
    - Renomear `thigh_circumference` para `thigh_circumference_left`
    - Adicionar `thigh_circumference_right` (numeric(5,2))

  2. Constraints
    - Adicionar checks para valores positivos nas novas colunas
*/

-- Adicionar novas colunas
DO $$
BEGIN
  -- Adicionar panturrilha esquerda
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'calf_circumference_left'
  ) THEN
    ALTER TABLE measurements ADD COLUMN calf_circumference_left numeric(5,2);
  END IF;

  -- Adicionar panturrilha direita
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'calf_circumference_right'
  ) THEN
    ALTER TABLE measurements ADD COLUMN calf_circumference_right numeric(5,2);
  END IF;

  -- Adicionar braço direito
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'arm_circumference_right'
  ) THEN
    ALTER TABLE measurements ADD COLUMN arm_circumference_right numeric(5,2);
  END IF;

  -- Adicionar coxa direita
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'thigh_circumference_right'
  ) THEN
    ALTER TABLE measurements ADD COLUMN thigh_circumference_right numeric(5,2);
  END IF;
END $$;

-- Renomear colunas existentes para _left
DO $$
BEGIN
  -- Renomear arm_circumference para arm_circumference_left
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'arm_circumference'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'arm_circumference_left'
  ) THEN
    ALTER TABLE measurements RENAME COLUMN arm_circumference TO arm_circumference_left;
  END IF;

  -- Renomear thigh_circumference para thigh_circumference_left
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'thigh_circumference'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'measurements' AND column_name = 'thigh_circumference_left'
  ) THEN
    ALTER TABLE measurements RENAME COLUMN thigh_circumference TO thigh_circumference_left;
  END IF;
END $$;

-- Adicionar constraints para valores positivos
DO $$
BEGIN
  -- Constraint para panturrilha esquerda
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'measurements' AND constraint_name = 'measurements_calf_circumference_left_check'
  ) THEN
    ALTER TABLE measurements ADD CONSTRAINT measurements_calf_circumference_left_check 
    CHECK (calf_circumference_left > 0);
  END IF;

  -- Constraint para panturrilha direita
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'measurements' AND constraint_name = 'measurements_calf_circumference_right_check'
  ) THEN
    ALTER TABLE measurements ADD CONSTRAINT measurements_calf_circumference_right_check 
    CHECK (calf_circumference_right > 0);
  END IF;

  -- Constraint para braço direito
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'measurements' AND constraint_name = 'measurements_arm_circumference_right_check'
  ) THEN
    ALTER TABLE measurements ADD CONSTRAINT measurements_arm_circumference_right_check 
    CHECK (arm_circumference_right > 0);
  END IF;

  -- Constraint para coxa direita
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'measurements' AND constraint_name = 'measurements_thigh_circumference_right_check'
  ) THEN
    ALTER TABLE measurements ADD CONSTRAINT measurements_thigh_circumference_right_check 
    CHECK (thigh_circumference_right > 0);
  END IF;
END $$;