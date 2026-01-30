import React, { useState, useEffect } from 'react';
import ReportingDashboard from '../../components/ReportingDashboard';
import ProtectedRoute from '../../components/ProtectedRoute';
import { api } from '../../services/api';

interface Doctor {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
}

const ReportingPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Token Reports & Analytics</h1>
          </div>
        </div>

        <div className="container mx-auto px-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor (leave empty for all doctors)
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} {doctor.email ? `(${doctor.email})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ReportingDashboard doctorId={selectedDoctorId || undefined} />
      </div>
    </ProtectedRoute>
  );
};

export default ReportingPage;
