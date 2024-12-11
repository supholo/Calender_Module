export const generateCalendarData = () => {
  const year = new Date().getFullYear();
  const months = [];
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthData = {
      name: new Date(year, month).toLocaleString('default', { month: 'long' }),
      days: []
    };
    
    for (let i = 0; i < firstDay; i++) {
      monthData.days.push({ day: '', empty: true });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      monthData.days.push({
        day,
        isWeekend,
        isWorkingDay: !isWeekend,
        isPending: false,
        isApproved: false,
        isRejected: false,
        comment: ''
      });
    }
    months.push(monthData);
  }
  return months;
};