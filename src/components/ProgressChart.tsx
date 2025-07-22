import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Measurement } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProgressChartProps {
  measurements: Measurement[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ measurements }) => {
  const chartData = measurements
    .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime())
    .map((measurement) => ({
      date: format(new Date(measurement.measured_at), 'dd/MM', { locale: ptBR }),
      peso: measurement.weight,
      gordura: measurement.body_fat_percentage,
      cintura: measurement.waist_circumference,
      peito: measurement.chest_circumference,
      quadril: measurement.hip_circumference,
      braco: measurement.arm_circumference,
      coxa: measurement.thigh_circumference,
    }));

  const createChart = (dataKey: string, name: string, color: string, unit: string) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="text-md font-medium text-gray-900 mb-3">{name}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '12px'
            }}
            formatter={(value: any) => [`${value}${unit}`, name]}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Gráficos de Evolução</h3>
      
      {/* Gráficos em grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peso */}
        {createChart('peso', 'Evolução do Peso', '#3B82F6', 'kg')}
        
        {/* % Gordura */}
        {createChart('gordura', 'Evolução da % de Gordura', '#EF4444', '%')}
        
        {/* Peito */}
        {createChart('peito', 'Circunferência do Peito', '#F59E0B', 'cm')}
        
        {/* Cintura */}
        {createChart('cintura', 'Circunferência da Cintura', '#10B981', 'cm')}
        
        {/* Quadril */}
        {createChart('quadril', 'Circunferência do Quadril', '#8B5CF6', 'cm')}
        
        {/* Braço Esquerdo */}
        {createChart('bracoEsquerdo', 'Circunferência do Braço Esquerdo', '#F97316', 'cm')}
        
        {/* Braço Direito */}
        {createChart('bracoDireito', 'Circunferência do Braço Direito', '#FB7185', 'cm')}
        
        {/* Coxa Esquerda */}
        {createChart('coxaEsquerda', 'Circunferência da Coxa Esquerda', '#06B6D4', 'cm')}
        
        {/* Coxa Direita */}
        {createChart('coxaDireita', 'Circunferência da Coxa Direita', '#0EA5E9', 'cm')}
        
        {/* Panturrilha Esquerda */}
        {createChart('panturrilhaEsquerda', 'Circunferência da Panturrilha Esquerda', '#84CC16', 'cm')}
        
        {/* Panturrilha Direita */}
        {createChart('panturrilhaDireita', 'Circunferência da Panturrilha Direita', '#22C55E', 'cm')}
      </div>

      {/* Estatísticas de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData.length > 1 && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Variação de Peso</h4>
              <p className="text-2xl font-bold text-blue-600">
                {(chartData[chartData.length - 1].peso - chartData[0].peso).toFixed(1)}kg
              </p>
              <p className="text-xs text-blue-700">
                Desde a primeira medição
              </p>
            </div>

            {chartData[chartData.length - 1].gordura && chartData[0].gordura && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Variação % Gordura</h4>
                <p className="text-2xl font-bold text-red-600">
                  {(chartData[chartData.length - 1].gordura - chartData[0].gordura).toFixed(1)}%
                </p>
                <p className="text-xs text-red-700">
                  Desde a primeira medição
                </p>
              </div>
            )}

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Total de Medições</h4>
              <p className="text-2xl font-bold text-green-600">
                {measurements.length}
              </p>
              <p className="text-xs text-green-700">
                Registradas no sistema
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};