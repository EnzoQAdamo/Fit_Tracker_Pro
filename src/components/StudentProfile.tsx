import React, { useState, useEffect } from 'react';
import { X, Plus, TrendingUp, Weight, Activity, Calendar, Edit2, Trash2, Download } from 'lucide-react';
import { MeasurementService } from '../services/measurementService';
import { StudentWithLatestMeasurement, Measurement } from '../types';
import { MeasurementForm } from './MeasurementForm';
import { ProgressChart } from './ProgressChart';
import { BodyMeasurementsPDF } from './BodyMeasurementsPDF';
import { ChartSelectionModal } from './ChartSelectionModal';
import { generateStudentPDF } from '../utils/pdfGenerator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StudentProfileProps {
  student: StudentWithLatestMeasurement;
  onClose: () => void;
  onUpdate: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student, onClose, onUpdate }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [activeTab, setActiveTab] = useState<'measurements' | 'charts'>('measurements');
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [showChartSelection, setShowChartSelection] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  useEffect(() => {
    loadMeasurements();
  }, [student.id]);

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      const data = await MeasurementService.getMeasurementsByStudentId(student.id);
      setMeasurements(data);
    } catch (error) {
      console.error('Erro ao carregar medições:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeasurement = () => {
    setShowMeasurementForm(false);
    setEditingMeasurement(null);
    loadMeasurements();
    onUpdate();
  };

  const handleDeleteMeasurement = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta medição?')) {
      try {
        await MeasurementService.deleteMeasurement(id);
        loadMeasurements();
        onUpdate();
      } catch (error) {
        console.error('Erro ao excluir medição:', error);
        alert('Erro ao excluir medição.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!student.latest_measurement) {
      alert('Não há medições disponíveis para gerar o PDF.');
      return;
    }

    // Show chart selection modal if there are multiple measurements
    if (measurements.length >= 2) {
      setShowChartSelection(true);
      return;
    }

    // Generate PDF without charts if only one measurement
    await generatePDFWithCharts([]);
  };

  const generatePDFWithCharts = async (charts: string[]) => {
    try {
      setShowPDFPreview(true);
      // Wait for the component to render
      setTimeout(async () => {
        await generateStudentPDF(
          student, 
          student.latest_measurement!, 
          selectedGender,
          charts,
          measurements
        );
        setShowPDFPreview(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
      setShowPDFPreview(false);
    }
  };

  const getAvailableCharts = () => {
    if (measurements.length < 2) return [];
    
    const charts = [];
    const hasData = (key: string) => measurements.some(m => {
      switch (key) {
        case 'peso': return m.weight;
        case 'gordura': return m.body_fat_percentage;
        case 'peito': return m.chest_circumference;
        case 'cintura': return m.waist_circumference;
        case 'quadril': return m.hip_circumference;
        case 'bracoEsquerdo': return m.arm_circumference_left;
        case 'bracoDireito': return m.arm_circumference_right;
        case 'coxaEsquerda': return m.thigh_circumference_left;
        case 'coxaDireita': return m.thigh_circumference_right;
        case 'panturrilhaEsquerda': return m.calf_circumference_left;
        case 'panturrilhaDireita': return m.calf_circumference_right;
        default: return false;
      }
    });

    if (hasData('peso')) charts.push('peso');
    if (hasData('gordura')) charts.push('gordura');
    if (hasData('peito')) charts.push('peito');
    if (hasData('cintura')) charts.push('cintura');
    if (hasData('quadril')) charts.push('quadril');
    if (hasData('bracoEsquerdo')) charts.push('bracoEsquerdo');
    if (hasData('bracoDireito')) charts.push('bracoDireito');
    if (hasData('coxaEsquerda')) charts.push('coxaEsquerda');
    if (hasData('coxaDireita')) charts.push('coxaDireita');
    if (hasData('panturrilhaEsquerda')) charts.push('panturrilhaEsquerda');
    if (hasData('panturrilhaDireita')) charts.push('panturrilhaDireita');

    return charts;
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
            <p className="text-sm text-gray-600">
              {calculateAge(student.date_of_birth)} anos • {student.email}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {student.latest_measurement && (
              <div className="flex items-center space-x-2">
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value as 'male' | 'female')}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>PDF</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('measurements')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'measurements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Medições
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'charts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Gráficos de Evolução
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 h-96 overflow-y-auto">
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              {/* Add Measurement Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Histórico de Medições ({measurements.length})
                </h3>
                <button
                  onClick={() => setShowMeasurementForm(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Medição</span>
                </button>
              </div>

              {/* Measurements List */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : measurements.length > 0 ? (
                <div className="space-y-4">
                  {measurements.map((measurement) => (
                    <div key={measurement.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {format(new Date(measurement.measured_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingMeasurement(measurement);
                              setShowMeasurementForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMeasurement(measurement.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Weight className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Peso</p>
                            <p className="font-medium">{measurement.weight}kg</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Altura</p>
                            <p className="font-medium">{measurement.height}cm</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">% Gordura</p>
                            <p className="font-medium">{measurement.body_fat_percentage}%</p>
                          </div>
                        </div>
                        
                        {measurement.waist_circumference && (
                          <div>
                            <p className="text-xs text-gray-500">Cintura</p>
                            <p className="font-medium">{measurement.waist_circumference}cm</p>
                          </div>
                        )}
                        
                        {measurement.arm_circumference_left && (
                          <div>
                            <p className="text-xs text-gray-500">Braço E</p>
                            <p className="font-medium">{measurement.arm_circumference_left}cm</p>
                          </div>
                        )}
                      </div>

                      {measurement.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">{measurement.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma medição registrada
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Adicione a primeira medição para começar o acompanhamento
                  </p>
                  <button
                    onClick={() => setShowMeasurementForm(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Adicionar Primeira Medição
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'charts' && (
            <div>
              {measurements.length >= 2 ? (
                <ProgressChart measurements={measurements} />
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Gráficos indisponíveis
                  </h3>
                  <p className="text-gray-600">
                    São necessárias pelo menos 2 medições para gerar os gráficos de evolução
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden PDF Preview */}
      {showPDFPreview && student.latest_measurement && (
        <div className="fixed inset-0 z-50" style={{ left: '-9999px', top: '-9999px' }}>
          <BodyMeasurementsPDF 
            student={student} 
            measurement={student.latest_measurement} 
            gender={selectedGender}
            selectedCharts={selectedCharts}
            measurements={measurements}
          />
        </div>
      )}

      {/* Chart Selection Modal */}
      {showChartSelection && (
        <ChartSelectionModal
          availableCharts={getAvailableCharts()}
          onConfirm={(charts) => {
            setSelectedCharts(charts);
            setShowChartSelection(false);
            generatePDFWithCharts(charts);
          }}
          onCancel={() => setShowChartSelection(false)}
        />
      )}

      {/* Measurement Form Modal */}
      {showMeasurementForm && (
        <MeasurementForm
          studentId={student.id}
          measurement={editingMeasurement || undefined}
          onSave={handleSaveMeasurement}
          onCancel={() => {
            setShowMeasurementForm(false);
            setEditingMeasurement(null);
          }}
        />
      )}
    </div>
  );
};