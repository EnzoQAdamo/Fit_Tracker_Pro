import React, { useState, useEffect } from 'react';
import { X, Save, Weight, Activity, TrendingUp, Ruler } from 'lucide-react';
import { MeasurementService } from '../services/measurementService';
import { Measurement } from '../types';

interface MeasurementFormProps {
  studentId: string;
  measurement?: Measurement;
  onSave: () => void;
  onCancel: () => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  studentId,
  measurement,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    body_fat_percentage: '',
    chest_circumference: '',
    waist_circumference: '',
    hip_circumference: '',
    arm_circumference_left: '',
    arm_circumference_right: '',
    thigh_circumference_left: '',
    thigh_circumference_right: '',
    calf_circumference_left: '',
    calf_circumference_right: '',
    measured_at: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (measurement) {
      setFormData({
        weight: measurement.weight.toString(),
        height: measurement.height.toString(),
        body_fat_percentage: measurement.body_fat_percentage?.toString() || '',
        chest_circumference: measurement.chest_circumference?.toString() || '',
        waist_circumference: measurement.waist_circumference?.toString() || '',
        hip_circumference: measurement.hip_circumference?.toString() || '',
        arm_circumference_left: measurement.arm_circumference_left?.toString() || '',
        arm_circumference_right: measurement.arm_circumference_right?.toString() || '',
        thigh_circumference_left: measurement.thigh_circumference_left?.toString() || '',
        thigh_circumference_right: measurement.thigh_circumference_right?.toString() || '',
        calf_circumference_left: measurement.calf_circumference_left?.toString() || '',
        calf_circumference_right: measurement.calf_circumference_right?.toString() || '',
        measured_at: measurement.measured_at.split('T')[0],
        notes: measurement.notes || '',
      });
    }
  }, [measurement]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const measurementData = {
        student_id: studentId,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        chest_circumference: formData.chest_circumference ? parseFloat(formData.chest_circumference) : null,
        waist_circumference: formData.waist_circumference ? parseFloat(formData.waist_circumference) : null,
        hip_circumference: formData.hip_circumference ? parseFloat(formData.hip_circumference) : null,
        arm_circumference_left: formData.arm_circumference_left ? parseFloat(formData.arm_circumference_left) : null,
        arm_circumference_right: formData.arm_circumference_right ? parseFloat(formData.arm_circumference_right) : null,
        thigh_circumference_left: formData.thigh_circumference_left ? parseFloat(formData.thigh_circumference_left) : null,
        thigh_circumference_right: formData.thigh_circumference_right ? parseFloat(formData.thigh_circumference_right) : null,
        calf_circumference_left: formData.calf_circumference_left ? parseFloat(formData.calf_circumference_left) : null,
        calf_circumference_right: formData.calf_circumference_right ? parseFloat(formData.calf_circumference_right) : null,
        measured_at: new Date(formData.measured_at).toISOString(),
        notes: formData.notes || null,
      };

      if (measurement) {
        await MeasurementService.updateMeasurement(measurement.id, measurementData);
      } else {
        await MeasurementService.createMeasurement(measurementData);
      }
      
      onSave();
    } catch (error) {
      setError('Erro ao salvar medição. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {measurement ? 'Editar Medição' : 'Nova Medição'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Basic Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medições Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Weight className="h-4 w-4" />
                  <span>Peso (kg) *</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 70.5"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Activity className="h-4 w-4" />
                  <span>Altura (cm) *</span>
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 175.0"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>% Gordura Corporal</span>
                </label>
                <input
                  type="number"
                  name="body_fat_percentage"
                  value={formData.body_fat_percentage}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 15.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Medição *
                </label>
                <input
                  type="date"
                  name="measured_at"
                  value={formData.measured_at}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Circumferences */}
          <div className="space-y-4">
            <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 mb-4">
              <Ruler className="h-5 w-5" />
              <span>Circunferências (cm) - Opcionais</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peito
                </label>
                <input
                  type="number"
                  name="chest_circumference"
                  value={formData.chest_circumference}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 95.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura
                </label>
                <input
                  type="number"
                  name="waist_circumference"
                  value={formData.waist_circumference}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 80.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quadril
                </label>
                <input
                  type="number"
                  name="hip_circumference"
                  value={formData.hip_circumference}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 90.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Braço Esquerdo
                </label>
                <input
                  type="number"
                  name="arm_circumference_left"
                  value={formData.arm_circumference_left}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 35.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Braço Direito
                </label>
                <input
                  type="number"
                  name="arm_circumference_right"
                  value={formData.arm_circumference_right}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 35.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coxa Esquerda
                </label>
                <input
                  type="number"
                  name="thigh_circumference_left"
                  value={formData.thigh_circumference_left}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 55.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coxa Direita
                </label>
                <input
                  type="number"
                  name="thigh_circumference_right"
                  value={formData.thigh_circumference_right}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 55.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panturrilha Esquerda
                </label>
                <input
                  type="number"
                  name="calf_circumference_left"
                  value={formData.calf_circumference_left}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 38.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panturrilha Direita
                </label>
                <input
                  type="number"
                  name="calf_circumference_right"
                  value={formData.calf_circumference_right}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 38.0"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Adicione observações sobre a medição, objetivos, etc..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Salvando...' : 'Salvar Medição'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};