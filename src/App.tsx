import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { MakerModal } from '@/components/calendar/MakerModal';
import { PendingChangesDialog } from '@/components/calendar/PendingChangesDialog';
import { RejectModal } from '@/components/calendar/RejectModal';
import { generateCalendarData } from '@/utils/calendar';

const App = () => {
  const [userRole, setUserRole] = useState('maker');
  const [selectedDate, setSelectedDate] = useState(null);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [showMakerModal, setShowMakerModal] = useState(false);
  const [makerDescription, setMakerDescription] = useState('');
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRejectItem, setSelectedRejectItem] = useState(null);
  const [processedItems, setProcessedItems] = useState([]);
  const [calendarData, setCalendarData] = useState(generateCalendarData());

  const handleDateClick = (monthIndex, dayIndex) => {
    if (userRole !== 'maker' || calendarData[monthIndex].days[dayIndex].empty) return;
    
    setSelectedDateInfo({
      monthIndex,
      dayIndex,
      date: `${calendarData[monthIndex].name} ${calendarData[monthIndex].days[dayIndex].day}`,
      currentStatus: calendarData[monthIndex].days[dayIndex].isWorkingDay
    });
    setShowMakerModal(true);
  };

  const handleMakerSubmit = () => {
    const { monthIndex, dayIndex } = selectedDateInfo;
    const newCalendarData = [...calendarData];
    const day = newCalendarData[monthIndex].days[dayIndex];
    day.isWorkingDay = !day.isWorkingDay;
    day.isPending = true;
    setPendingChanges([...pendingChanges, {
      id: Date.now(),
      month: monthIndex,
      day: dayIndex,
      date: selectedDateInfo.date,
      oldStatus: !day.isWorkingDay,
      newStatus: day.isWorkingDay,
      description: makerDescription,
      comment: '',
      status: 'pending'
    }]);
    setCalendarData(newCalendarData);
    setShowMakerModal(false);
    setMakerDescription('');
  };

  const handleItemAction = (id, approved, comment) => {
    setPendingChanges(prevChanges => 
      prevChanges.map(change => 
        change.id === id 
          ? { 
              ...change, 
              status: approved ? 'approved' : 'rejected',
              comment: comment 
            }
          : change
      )
    );
  };

  const handleApproveAll = () => {
    setPendingChanges(prevChanges =>
      prevChanges.map(change =>
        change.status === 'pending'
          ? { ...change, status: 'approved', comment: '' }
          : change
      )
    );
  };

  const handleRejectClick = (id) => {
    setSelectedRejectItem(id);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (rejectReason.trim()) {
      handleItemAction(selectedRejectItem, false, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedRejectItem(null);
    }
  };

  const submitChanges = () => {
    const processedChanges = pendingChanges.filter(change => change.status !== 'pending');
    if (processedChanges.length > 0) {
      const newCalendarData = [...calendarData];
      processedChanges.forEach(change => {
        const day = newCalendarData[change.month].days[change.day];
        day.isPending = false;
        day.isApproved = change.status === 'approved';
        day.isRejected = change.status === 'rejected';
        day.comment = change.comment;
      });
      
      setCalendarData(newCalendarData);
      setPendingChanges(prevChanges => 
        prevChanges.filter(change => change.status === 'pending')
      );
      setProcessedItems([...processedItems, ...processedChanges]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar Approval System</h1>
        <div className="space-x-4">
          <Button 
            variant={userRole === 'maker' ? 'default' : 'outline'}
            onClick={() => setUserRole('maker')}
          >
            Maker Mode
          </Button>
          <Button 
            variant={userRole === 'checker' ? 'default' : 'outline'}
            onClick={() => setUserRole('checker')}
          >
            Checker Mode
          </Button>
          {userRole === 'checker' && (
            <Button
              onClick={() => setShowPendingDialog(true)}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Pending for Approval ({pendingChanges.filter(c => c.status === 'pending').length})
            </Button>
          )}
        </div>
      </div>

      <CalendarGrid 
        calendarData={calendarData}
        handleDateClick={handleDateClick}
      />

      <PendingChangesDialog 
        showPendingDialog={showPendingDialog}
        setShowPendingDialog={setShowPendingDialog}
        pendingChanges={pendingChanges}
        handleRejectClick={handleRejectClick}
        handleItemAction={handleItemAction}
        handleApproveAll={handleApproveAll}
        submitChanges={submitChanges}
        setPendingChanges={setPendingChanges}
      />

      <RejectModal 
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        handleRejectConfirm={handleRejectConfirm}
        setSelectedRejectItem={setSelectedRejectItem}
      />

      <MakerModal 
        showMakerModal={showMakerModal}
        setShowMakerModal={setShowMakerModal}
        selectedDateInfo={selectedDateInfo}
        makerDescription={makerDescription}
        setMakerDescription={setMakerDescription}
        handleMakerSubmit={handleMakerSubmit}
      />
    </div>
  );
};

export default App;