// Scanner wrapper — mounts the existing Scanner page inside DashboardLayout
// The legacy page used setActivePage/setDiagnosisResult props; we adapt those
// to useNavigate so the tool-to-dashboard navigation works correctly.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../Scanner';
import { INITIAL_HISTORY } from '../../data/historyData';

export default function ScannerDash() {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('');

  // Mock setDiagnosisResult — result is stored in sessionStorage so
  // the Diagnosis page (if navigated to) can pick it up.
  const handleDiagnosisResult = (result) => {
    if (result) sessionStorage.setItem('agrix_diag', JSON.stringify(result));
    navigate('/dashboard/alerts');
  };

  const handleSaveHistory = (result) => {
    // In a real app this would call an API; here we just discard.
  };

  return (
    <Scanner
      selectedCrop={selectedCrop}
      setSelectedCrop={setSelectedCrop}
      setDiagnosisResult={handleDiagnosisResult}
      setActivePage={() => {}}
      onSaveHistory={handleSaveHistory}
    />
  );
}
