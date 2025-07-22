import React from 'react';
import { Measurement, Student } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BodyMeasurementsPDFProps {
  student: Student;
  measurement: Measurement;
  gender?: 'male' | 'female';
  selectedCharts?: string[];
  measurements?: Measurement[];
}

export const BodyMeasurementsPDF: React.FC<BodyMeasurementsPDFProps> = ({ 
  student, 
  measurement, 
  gender = 'male',
  selectedCharts = [],
  measurements = []
}) => {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const renderChart = (dataKey: string, name: string, color: string, unit: string) => {
    if (!selectedCharts.includes(dataKey) || measurements.length < 2) return null;

    const chartData = measurements
      .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime())
      .map((m) => ({
        date: format(new Date(m.measured_at), 'dd/MM', { locale: ptBR }),
        [dataKey]: getValueFromMeasurement(m, dataKey),
      }))
      .filter(item => item[dataKey] !== null && item[dataKey] !== undefined);

    if (chartData.length === 0) return null;

    return (
      <div key={dataKey} className="mb-6 page-break-inside-avoid">
        <h4 className="text-md font-medium text-gray-900 mb-3">{name}</h4>
        <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '200px' }}>
          <svg width="100%" height="180" viewBox="0 0 400 180">
            {/* Grid lines */}
            <defs>
              <pattern id={`grid-${dataKey}`} width="40" height="18" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 18" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${dataKey})`} />
            
            {/* Chart line */}
            {chartData.length > 1 && (
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={chartData.map((item, index) => {
                  const x = (index / (chartData.length - 1)) * 360 + 20;
                  const minVal = Math.min(...chartData.map(d => d[dataKey]));
                  const maxVal = Math.max(...chartData.map(d => d[dataKey]));
                  const range = maxVal - minVal || 1;
                  const y = 160 - ((item[dataKey] - minVal) / range) * 120;
                  return `${x},${y}`;
                }).join(' ')}
              />
            )}
            
            {/* Data points */}
            {chartData.map((item, index) => {
              const x = (index / (chartData.length - 1)) * 360 + 20;
              const minVal = Math.min(...chartData.map(d => d[dataKey]));
              const maxVal = Math.max(...chartData.map(d => d[dataKey]));
              const range = maxVal - minVal || 1;
              const y = 160 - ((item[dataKey] - minVal) / range) * 120;
              
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r="3" fill={color} />
                  <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fill="#374151">
                    {item[dataKey]}{unit}
                  </text>
                  <text x={x} y="175" textAnchor="middle" fontSize="8" fill="#6B7280">
                    {item.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const getValueFromMeasurement = (measurement: Measurement, key: string) => {
    switch (key) {
      case 'peso': return measurement.weight;
      case 'gordura': return measurement.body_fat_percentage;
      case 'peito': return measurement.chest_circumference;
      case 'cintura': return measurement.waist_circumference;
      case 'quadril': return measurement.hip_circumference;
      case 'bracoEsquerdo': return measurement.arm_circumference_left;
      case 'bracoDireito': return measurement.arm_circumference_right;
      case 'coxaEsquerda': return measurement.thigh_circumference_left;
      case 'coxaDireita': return measurement.thigh_circumference_right;
      case 'panturrilhaEsquerda': return measurement.calf_circumference_left;
      case 'panturrilhaDireita': return measurement.calf_circumference_right;
      default: return null;
    }
  };

  return (
    <div id="pdf-content" className="bg-white p-8 max-w-4xl mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-blue-600 pb-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">FitTracker Pro</h1>
        <h2 className="text-xl font-semibold text-gray-800">Relatório de Medições Corporais</h2>
      </div>

      {/* Student Info */}
      <div className="mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações do Aluno</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome:</p>
              <p className="font-medium text-gray-900">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Idade:</p>
              <p className="font-medium text-gray-900">{calculateAge(student.date_of_birth)} anos</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data da Medição:</p>
              <p className="font-medium text-gray-900">
                {format(new Date(measurement.measured_at), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Measurements */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 font-medium">PESO</p>
            <p className="text-2xl font-bold text-blue-800">{measurement.weight}kg</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 font-medium">ALTURA</p>
            <p className="text-2xl font-bold text-green-800">{measurement.height}cm</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-sm text-orange-600 font-medium">IMC</p>
            <p className="text-2xl font-bold text-orange-800">{calculateBMI(measurement.weight, measurement.height)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-sm text-red-600 font-medium">% GORDURA</p>
            <p className="text-2xl font-bold text-red-800">{measurement.body_fat_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Body Illustration with Measurements */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Body SVG */}
          <svg width="250" height="400" viewBox="0 0 250 400" className="border border-gray-200 rounded-lg bg-gray-50">
            {/* Male Body Outline */}
            {gender === 'male' ? (
              <g fill="none" stroke="#374151" strokeWidth="2">
                {/* Head */}
                <circle cx="125" cy="30" r="20" />
                {/* Neck */}
                <line x1="125" y1="50" x2="125" y2="65" />
                {/* Shoulders */}
                <line x1="100" y1="65" x2="150" y2="65" />
                {/* Arms */}
                <line x1="100" y1="65" x2="85" y2="140" />
                <line x1="150" y1="65" x2="165" y2="140" />
                {/* Torso */}
                <line x1="110" y1="65" x2="110" y2="180" />
                <line x1="140" y1="65" x2="140" y2="180" />
                {/* Chest */}
                <ellipse cx="125" cy="95" rx="30" ry="15" />
                {/* Waist */}
                <ellipse cx="125" cy="155" rx="25" ry="12" />
                {/* Hips */}
                <ellipse cx="125" cy="190" rx="28" ry="15" />
                {/* Legs */}
                <line x1="115" y1="190" x2="110" y2="320" />
                <line x1="135" y1="190" x2="140" y2="320" />
                {/* Thighs */}
                <ellipse cx="115" cy="240" rx="12" ry="25" />
                <ellipse cx="135" cy="240" rx="12" ry="25" />
                {/* Calves */}
                <ellipse cx="110" cy="340" rx="10" ry="20" />
                <ellipse cx="140" cy="340" rx="10" ry="20" />
              </g>
            ) : (
              <g fill="none" stroke="#374151" strokeWidth="2">
                {/* Female Body Outline */}
                <circle cx="125" cy="30" r="18" />
                <line x1="125" y1="48" x2="125" y2="62" />
                <line x1="105" y1="62" x2="145" y2="62" />
                <line x1="105" y1="62" x2="92" y2="135" />
                <line x1="145" y1="62" x2="158" y2="135" />
                <line x1="112" y1="62" x2="112" y2="170" />
                <line x1="138" y1="62" x2="138" y2="170" />
                <ellipse cx="125" cy="90" rx="28" ry="14" />
                <ellipse cx="125" cy="150" rx="20" ry="10" />
                <ellipse cx="125" cy="185" rx="32" ry="18" />
                <line x1="117" y1="185" x2="112" y2="320" />
                <line x1="133" y1="185" x2="138" y2="320" />
                <ellipse cx="117" cy="240" rx="15" ry="26" />
                <ellipse cx="133" cy="240" rx="15" ry="26" />
                <ellipse cx="112" cy="340" rx="12" ry="20" />
                <ellipse cx="138" cy="340" rx="12" ry="20" />
              </g>
            )}
          </svg>

          {/* Measurement Labels */}
          {measurement.chest_circumference && (
            <div className="absolute top-20 left-6 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Peito: {measurement.chest_circumference}cm
            </div>
          )}
          
          {measurement.waist_circumference && (
            <div className="absolute top-32 left-6 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Cintura: {measurement.waist_circumference}cm
            </div>
          )}
          
          {measurement.hip_circumference && (
            <div className="absolute top-40 right-6 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Quadril: {measurement.hip_circumference}cm
            </div>
          )}
          
          {measurement.arm_circumference_left && (
            <div className="absolute top-26 left-1 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Braço E: {measurement.arm_circumference_left}cm
            </div>
          )}
          
          {measurement.arm_circumference_right && (
            <div className="absolute top-26 right-1 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Braço D: {measurement.arm_circumference_right}cm
            </div>
          )}
          
          {measurement.thigh_circumference_left && (
            <div className="absolute top-48 left-3 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Coxa E: {measurement.thigh_circumference_left}cm
            </div>
          )}
          
          {measurement.thigh_circumference_right && (
            <div className="absolute top-48 right-3 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Coxa D: {measurement.thigh_circumference_right}cm
            </div>
          )}
          
          {measurement.calf_circumference_left && (
            <div className="absolute bottom-12 left-3 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Panturrilha E: {measurement.calf_circumference_left}cm
            </div>
          )}
          
          {measurement.calf_circumference_right && (
            <div className="absolute bottom-12 right-3 bg-white px-1 py-0.5 rounded shadow text-xs font-medium">
              Panturrilha D: {measurement.calf_circumference_right}cm
            </div>
          )}
        </div>
      </div>

      {/* Detailed Measurements Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Medições Detalhadas</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Medidas Básicas</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span className="text-gray-600">Peso:</span>
                <span className="font-medium">{measurement.weight} kg</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span className="text-gray-600">Altura:</span>
                <span className="font-medium">{measurement.height} cm</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span className="text-gray-600">IMC:</span>
                <span className="font-medium">{calculateBMI(measurement.weight, measurement.height)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-gray-200">
                <span className="text-gray-600">% Gordura:</span>
                <span className="font-medium">{measurement.body_fat_percentage}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Tronco</h4>
            <div className="space-y-2">
              {measurement.chest_circumference && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Peito:</span>
                  <span className="font-medium">{measurement.chest_circumference} cm</span>
                </div>
              )}
              {measurement.waist_circumference && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Cintura:</span>
                  <span className="font-medium">{measurement.waist_circumference} cm</span>
                </div>
              )}
              {measurement.hip_circumference && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Quadril:</span>
                  <span className="font-medium">{measurement.hip_circumference} cm</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Membros</h4>
            <div className="space-y-2">
              {measurement.arm_circumference_left && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Braço Esquerdo:</span>
                  <span className="font-medium">{measurement.arm_circumference_left} cm</span>
                </div>
              )}
              {measurement.arm_circumference_right && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Braço Direito:</span>
                  <span className="font-medium">{measurement.arm_circumference_right} cm</span>
                </div>
              )}
              {measurement.thigh_circumference_left && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Coxa Esquerda:</span>
                  <span className="font-medium">{measurement.thigh_circumference_left} cm</span>
                </div>
              )}
              {measurement.thigh_circumference_right && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Coxa Direita:</span>
                  <span className="font-medium">{measurement.thigh_circumference_right} cm</span>
                </div>
              )}
              {measurement.calf_circumference_left && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Panturrilha Esquerda:</span>
                  <span className="font-medium">{measurement.calf_circumference_left} cm</span>
                </div>
              )}
              {measurement.calf_circumference_right && (
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span className="text-gray-600">Panturrilha Direita:</span>
                  <span className="font-medium">{measurement.calf_circumference_right} cm</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {measurement.notes && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Observações</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-700">{measurement.notes}</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {selectedCharts.length > 0 && measurements.length >= 2 && (
        <div className="mb-6 page-break-before-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Gráficos de Evolução
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {renderChart('peso', 'Evolução do Peso', '#3B82F6', 'kg')}
            {renderChart('gordura', 'Evolução da % de Gordura', '#EF4444', '%')}
            {renderChart('peito', 'Circunferência do Peito', '#F59E0B', 'cm')}
            {renderChart('cintura', 'Circunferência da Cintura', '#10B981', 'cm')}
            {renderChart('quadril', 'Circunferência do Quadril', '#8B5CF6', 'cm')}
            {renderChart('bracoEsquerdo', 'Circunferência do Braço Esquerdo', '#F97316', 'cm')}
            {renderChart('bracoDireito', 'Circunferência do Braço Direito', '#FB7185', 'cm')}
            {renderChart('coxaEsquerda', 'Circunferência da Coxa Esquerda', '#06B6D4', 'cm')}
            {renderChart('coxaDireita', 'Circunferência da Coxa Direita', '#0EA5E9', 'cm')}
            {renderChart('panturrilhaEsquerda', 'Circunferência da Panturrilha Esquerda', '#84CC16', 'cm')}
            {renderChart('panturrilhaDireita', 'Circunferência da Panturrilha Direita', '#22C55E', 'cm')}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
        <p>Relatório gerado em {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
        <p>FitTracker Pro - Sistema de Gerenciamento para Personal Trainers</p>
      </div>
    </div>
  );
};