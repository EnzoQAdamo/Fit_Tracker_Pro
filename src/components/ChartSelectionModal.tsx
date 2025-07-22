import React, { useState } from 'react';
import { X, Download, BarChart3 } from 'lucide-react';

interface ChartSelectionModalProps {
  onConfirm: (selectedCharts: string[]) => void;
  onCancel: () => void;
  availableCharts: string[];
}

export const ChartSelectionModal: React.FC<ChartSelectionModalProps> = ({
  onConfirm,
  onCancel,
  availableCharts
}) => {
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  const chartLabels: Record<string, string> = {
    peso: 'Evolução do Peso',
    gordura: 'Evolução da % de Gordura',
    peito: 'Circunferência do Peito',
    cintura: 'Circunferência da Cintura',
    quadril: 'Circunferência do Quadril',
    bracoEsquerdo: 'Circunferência do Braço Esquerdo',
    bracoDireito: 'Circunferência do Braço Direito',
    coxaEsquerda: 'Circunferência da Coxa Esquerda',
    coxaDireita: 'Circunferência da Coxa Direita',
    panturrilhaEsquerda: 'Circunferência da Panturrilha Esquerda',
    panturrilhaDireita: 'Circunferência da Panturrilha Direita'
  };

  const handleChartToggle = (chart: string) => {
    setSelectedCharts(prev => 
      prev.includes(chart) 
        ? prev.filter(c => c !== chart)
        : [...prev, chart]
    );
  };

  const handleSelectAll = () => {
    setSelectedCharts(availableCharts);
  };

  const handleDeselectAll = () => {
    setSelectedCharts([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Selecionar Gráficos</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Escolha quais gráficos deseja incluir no PDF:
          </p>

          <div className="flex justify-between mb-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Selecionar Todos
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              Desmarcar Todos
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {availableCharts.map((chart) => (
              <label
                key={chart}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCharts.includes(chart)}
                  onChange={() => handleChartToggle(chart)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 flex-1">
                  {chartLabels[chart] || chart}
                </span>
              </label>
            ))}
          </div>

          {selectedCharts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{selectedCharts.length}</strong> gráfico{selectedCharts.length !== 1 ? 's' : ''} selecionado{selectedCharts.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(selectedCharts)}
            disabled={selectedCharts.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>Gerar PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};