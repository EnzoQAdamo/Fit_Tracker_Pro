import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, Phone, Calendar, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { StudentService } from '../services/studentService';
import { StudentWithLatestMeasurement } from '../types';
import { StudentForm } from './StudentForm';
import { StudentProfile } from './StudentProfile';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<StudentWithLatestMeasurement[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithLatestMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentWithLatestMeasurement | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithLatestMeasurement | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await StudentService.getStudentsWithLatestMeasurement();
      setStudents(data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleSaveStudent = () => {
    setShowForm(false);
    setEditingStudent(null);
    loadStudents();
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno? Todas as medições também serão removidas.')) {
      try {
        await StudentService.deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert('Erro ao excluir aluno.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
          <p className="text-gray-600">
            {students.length} aluno{students.length !== 1 ? 's' : ''} cadastrado{students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Aluno</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">ID: {student.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setEditingStudent(student);
                      setShowForm(true);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(student.date_of_birth), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </div>

              {student.latest_measurement ? (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Última Medição</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Peso:</span>
                      <span className="ml-1 font-medium">{student.latest_measurement.weight}kg</span>
                    </div>
                    <div>
                      <span className="text-gray-600">% Gordura:</span>
                      <span className="ml-1 font-medium">{student.latest_measurement.body_fat_percentage}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {format(new Date(student.latest_measurement.measured_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">Nenhuma medição registrada</p>
                </div>
              )}

              <button
                onClick={() => setSelectedStudent(student)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Ver Perfil Completo
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Tente buscar com outros termos'
              : 'Comece cadastrando seu primeiro aluno'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Cadastrar Primeiro Aluno
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <StudentForm
          student={editingStudent || undefined}
          onSave={handleSaveStudent}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
        />
      )}

      {selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={loadStudents}
        />
      )}
    </div>
  );
};