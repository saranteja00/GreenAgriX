// History wrapper — mounts the existing History page inside DashboardLayout
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import History from '../History';
import { INITIAL_HISTORY } from '../../data/historyData';

export default function HistoryDash() {
  const navigate = useNavigate();
  const [historyItems] = useState(INITIAL_HISTORY);

  return (
    <History
      historyItems={historyItems}
      setActivePage={(page) => {
        if (page === 'scanner') navigate('/dashboard/scanner');
      }}
    />
  );
}
