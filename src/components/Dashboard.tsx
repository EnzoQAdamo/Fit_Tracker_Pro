import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, Activity } from 'lucide-react';
import { StudentService } from '../services/studentService';
import { StudentWithLatestMeasurement } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentWithLatestMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    newThisMonth: 0,
    totalMeasurements: 0,
    averageProgress: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const studentsData = await StudentService.getStudentsWithLatestMeasurement();
      setStudents(studentsData);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const newThisMonth = studentsData.filter(
        student => new Date(student.created_at) >= firstDayOfMonth
      ).length;

      const totalMeasurements = studentsData.reduce(
        (sum, student) => sum + student.measurements_count, 0
      );

      setStats({
        totalStudents: studentsData.length,
        newThisMonth,
        totalMeasurements,
        averageProgress: studentsData.filter(s => s.measurements_count > 1).length,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Alunos',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.newThisMonth} este mês`,
    },
    {
      title: 'Medições Registradas',
      value: stats.totalMeasurements,
      icon: Activity,
      color: 'bg-green-500',
      change: 'Total no sistema',
    },
    {
      title: 'Com Progresso',
      value: stats.averageProgress,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: 'Alunos com múltiplas medições',
    },
    {
      title: 'Este Mês',
      value: stats.newThisMonth,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'Novos cadastros',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alunos Recentes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {students.slice(0, 5).map((student) => (
            <div key={student.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                  <p className="text-xs text-gray-400">
                    Cadastrado em {format(new Date(student.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {student.measurements_count} medições
                    </span>
                    {student.latest_measurement && (
                      <span className="text-xs text-gray-500">
                        Última: {format(new Date(student.latest_measurement.measured_at), 'dd/MM', { locale: ptBR })}
                      </span>
                    )}
                  </div>
                  {student.latest_measurement && (
                    <div className="text-xs text-gray-400 mt-1">
                      {student.latest_measurement.weight}kg • {student.latest_measurement.body_fat_percentage}% BF
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};