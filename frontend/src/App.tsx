import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';

import { GoiTopBar } from './components/layout/GoiTopBar';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { NoticeTicker } from './components/layout/NoticeTicker';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NationalDashboardPage } from './pages/NationalDashboardPage';
import { ModelCurriculumPage } from './pages/ModelCurriculumPage';
import { UploadCurriculumPage } from './pages/UploadCurriculumPage';
import { CurriculumBuilderPage } from './pages/CurriculumBuilderPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ReviewerQueuePage } from './pages/ReviewerQueuePage';
import { EmergingTechPage } from './pages/EmergingTechPage';
import { CoPoMappingPage } from './pages/CoPoMappingPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    // Check logged in user session
    api.getMe()
      .then(setUser)
      .catch(() => {
        // Fallback default demo user (Super Admin)
        setUser({ id: 1, email: 'admin@aicte.gov.in', full_name: 'Dr. K. S. Sharma (AICTE Super Admin)', role: 'super_admin' });
      });

    api.getNationalAnalytics().then(setAnalytics).catch(console.error);
    api.getNotices().then(setNotices).catch(console.error);
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', pass);
    const res = await api.login(formData);
    localStorage.setItem('cisp_token', res.access_token);
    setUser(res.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('cisp_token');
    setUser(null);
  };

  const handleQuickLogin = async (role: string) => {
    const roleEmails: Record<string, string> = {
      super_admin: 'admin@aicte.gov.in',
      reviewer: 'reviewer@aicte.gov.in',
      university_admin: 'admin@iitb.ac.in',
      faculty: 'faculty@iitb.ac.in',
      public: 'public@aicte.gov.in'
    };
    const rolePasses: Record<string, string> = {
      super_admin: 'admin123',
      reviewer: 'reviewer123',
      university_admin: 'uni123',
      faculty: 'faculty123',
      public: 'public123'
    };
    const email = roleEmails[role] || 'admin@aicte.gov.in';
    const pass = rolePasses[role] || 'admin123';

    try {
      await handleLogin(email, pass);
    } catch (e) {
      // Direct mock user fallback if API token fails
      setUser({ id: 1, email, full_name: `Demo User (${role})`, role });
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-black">
        <GoiTopBar />
        <Header user={user} onLogout={handleLogout} onQuickLogin={handleQuickLogin} />
        <Navbar userRole={user?.role} />
        <NoticeTicker notices={notices} />

        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage analytics={analytics} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} onQuickLogin={handleQuickLogin} />} />
            <Route path="/dashboard" element={<NationalDashboardPage />} />
            <Route path="/model-curriculum" element={<ModelCurriculumPage />} />
            <Route path="/upload" element={<UploadCurriculumPage />} />
            <Route path="/builder" element={<CurriculumBuilderPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/reviewer" element={<ReviewerQueuePage />} />
            <Route path="/emerging-tech" element={<EmergingTechPage />} />
            <Route path="/co-po-mapping" element={<CoPoMappingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit-logs" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
