import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/Common/ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import CandidateLayout from '../layouts/CandidateLayout';
import AdminLayout from '../layouts/AdminLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/Dashboard';
import Profile from '../pages/candidate/Profile';
import ApplicationForm from '../pages/candidate/ApplicationForm';
import ApplicationList from '../pages/candidate/ApplicationList';
import AdmissionResult from '../pages/candidate/AdmissionResult';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import UniversityManagement from '../pages/admin/UniversityManagement';
import MajorManagement from '../pages/admin/MajorManagement';
import SubjectCombinationManagement from '../pages/admin/SubjectCombinationManagement';
import ApplicationManagement from '../pages/admin/ApplicationManagement';
import ApplicationDetail from '../pages/admin/ApplicationDetail';
import UserManagement from '../pages/admin/UserManagement';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Route>

          {/* Candidate Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/profile" element={<Profile />} />
            <Route path="/candidate/application-form" element={<ApplicationForm />} />
            <Route path="/candidate/applications" element={<ApplicationList />} />
            <Route path="/candidate/result" element={<AdmissionResult />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/universities" element={<UniversityManagement />} />
            <Route path="/admin/majors" element={<MajorManagement />} />
            <Route path="/admin/subject-combinations" element={<SubjectCombinationManagement />} />
            <Route path="/admin/applications" element={<ApplicationManagement />} />
            <Route path="/admin/applications/:id" element={<ApplicationDetail />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;