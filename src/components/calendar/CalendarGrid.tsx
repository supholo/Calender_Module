import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CalendarGridProps {
  calendarData: any[];
  handleDateClick: (monthIndex: number, dayIndex: number) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarData, handleDateClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {calendarData.map((month, monthIndex) => (
        <Card key={month.name} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {month.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center font-semibold p-1">
                  {day}
                </div>
              ))}
              {month.days.map((day: any, dayIndex: number) => (
                <div
                  key={dayIndex}
                  onClick={() => handleDateClick(monthIndex, dayIndex)}
                  className={`
                    p-1 text-center cursor-pointer relative
                    ${day.empty ? 'invisible' : ''}
                    ${day.isWeekend ? 'text-red-500' : ''}
                    ${!day.isWorkingDay ? 'bg-gray-200' : ''}
                    ${day.isPending ? 'ring-2 ring-yellow-400' : ''}
                    ${day.isApproved ? 'ring-2 ring-green-400' : ''}
                    ${day.isRejected ? 'ring-2 ring-red-400' : ''}
                    hover:bg-gray-100 rounded
                  `}
                >
                  {day.day}
                  {day.isPending && (
                    <span className="absolute -top-1 -right-1">
                      <AlertCircle className="w-3 h-3 text-yellow-500" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}