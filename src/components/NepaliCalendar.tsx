import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';

interface HolidayInfo {
  date: string; // Format: "MM-DD"
  name: string;
  description: string;
}

// Major Nepali Holidays when Capital Cargo is closed (2081-2082 BS / 2024-2025 AD)
const NEPALI_HOLIDAYS: HolidayInfo[] = [
  { date: '2025-04-14', name: 'Naya Barsa 2082 (New Year)', description: 'Nepali New Year 2082' },
  { date: '2025-05-22', name: 'Loktantra Diwas', description: 'Democracy Day' },
  { date: '2025-09-05', name: 'Teej', description: 'Women\'s Festival' },
  { date: '2025-10-01', name: 'Ghatasthapana (Dashain Begins)', description: 'Start of Dashain' },
  { date: '2025-10-10', name: 'Vijaya Dashami', description: 'Main day of Dashain' },
  { date: '2025-10-19', name: 'Laxmi Puja (Tihar)', description: 'Festival of Lights' },
  { date: '2025-11-02', name: 'Chhath', description: 'Sun God Festival' },
  { date: '2025-12-25', name: 'Christmas', description: 'Christmas Day' },
  { date: '2026-01-01', name: 'New Year', description: 'English New Year' },
  { date: '2026-02-26', name: 'Maha Shivaratri', description: 'Festival of Lord Shiva' },
  { date: '2026-03-14', name: 'Holi', description: 'Festival of Colors' },
];

const NepaliCalendar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
    
    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Get Nepali date using proper conversion
  const getNepaliDate = () => {
    const gregDate = currentDate;
    const bsYear = gregDate.getFullYear() + 57;
    const adMonth = gregDate.getMonth();
    const adDay = gregDate.getDate();
    let bsMonth = adMonth + 9;
    if (adDay < 14) bsMonth--;
    if (bsMonth > 12) bsMonth -= 12;
    return { year: bsYear, month: bsMonth, day: adDay };
  };

  const nepaliDate = getNepaliDate();
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Check today's date against Gregorian dates in our holiday list
  const today = currentDate.toISOString().split('T')[0];
  const todayHoliday = NEPALI_HOLIDAYS.find((h: HolidayInfo) => h.date === today);
  
  // Check if today is Saturday (6) - Capital Cargo is closed on Saturdays
  const dayOfWeek = currentDate.getDay();
  const isSaturday = dayOfWeek === 6;

  // Check if there's a holiday within next 7 days
  const upcomingHolidays = NEPALI_HOLIDAYS.filter((holiday: HolidayInfo) => {
    const holidayDate = new Date(holiday.date);
    const diffTime = holidayDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const isHolidayToday = !!todayHoliday || isSaturday;

  const nepaliMonths = [
    'बैशाख (Baisakh)', 'जेष्ठ (Jestha)', 'आषाढ (Ashadh)', 'श्रावण (Shrawan)',
    'भाद्र (Bhadra)', 'आश्विन (Ashwin)', 'कार्तिक (Kartik)', 'मंसिर (Mangsir)',
    'पौष (Poush)', 'माघ (Magh)', 'फाल्गुन (Falgun)', 'चैत्र (Chaitra)'
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center space-x-2 group"
        style={{ backgroundColor: '#F9B222' }}
        title="Nepali Calendar & Holidays"
      >
        <Calendar className="h-6 w-6 text-white" />
        <span className="text-white font-semibold text-sm hidden group-hover:inline-block">
          Calendar
        </span>
        {isHolidayToday && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Calendar Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{monthNames[currentMonth]} {currentYear}</h2>
                  <p className="text-blue-100 text-sm">
                    Nepali: {nepaliMonths[nepaliDate.month - 1]} {nepaliDate.year} BS
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-blue-800 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors font-semibold"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <button
                  onClick={() => {
                    setCurrentMonth(currentDate.getMonth());
                    setCurrentYear(currentDate.getFullYear());
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors font-semibold text-sm"
                >
                  Today
                </button>
                
                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors font-semibold"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Today's Status */}
              {isHolidayToday ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      {isSaturday ? (
                        <>
                          <h3 className="text-lg font-semibold text-red-800">
                            📅 Saturday - Weekend
                          </h3>
                          <p className="text-red-700 text-sm mt-1">
                            Office closed for weekend
                          </p>
                        </>
                      ) : todayHoliday ? (
                        <>
                          <h3 className="text-lg font-semibold text-red-800">
                            🎉 Holiday: {todayHoliday.name}
                          </h3>
                          <p className="text-red-700 text-sm mt-1">
                            {todayHoliday.description}
                          </p>
                        </>
                      ) : null}
                      <p className="text-red-600 font-medium mt-2">
                        ⚠️ Capital Cargo is CLOSED today
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-green-800">
                        ✅ We're Open Today!
                      </h3>
                      <p className="text-green-700 text-sm mt-1">
                        Office Hours: 10:00 AM - 5:00 PM (Sunday - Friday)
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        📞 +977-01-5367883, 01-5368837
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar Grid */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-7 gap-2">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={day} className={`text-center font-semibold text-sm py-2 ${index === 6 ? 'text-red-600' : 'text-gray-700'}`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }
                    
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
                    const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
                    const isSat = dayOfWeek === 6;
                    const holiday = NEPALI_HOLIDAYS.find((h: HolidayInfo) => h.date === dateStr);
                    
                    return (
                      <div
                        key={day}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative ${
                          isToday 
                            ? 'bg-blue-600 text-white font-bold shadow-lg' 
                            : holiday || isSat
                            ? 'bg-red-50 text-red-600 font-semibold'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className={isToday ? 'text-lg' : ''}>{day}</span>
                        {holiday && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                        )}
                        {isSat && !holiday && (
                          <span className="text-[8px] text-red-500">SAT</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                    <span>Holiday/Saturday</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Public Holiday</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Holidays */}
              {upcomingHolidays.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#0096C7' }}>
                    📅 Upcoming Holidays (Next 7 Days)
                  </h3>
                  <div className="space-y-3">
                    {upcomingHolidays.map((holiday: HolidayInfo, index: number) => {
                      const holidayDate = new Date(holiday.date);
                      const daysUntil = Math.ceil((holidayDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div
                          key={index}
                          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{holiday.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{holiday.description}</p>
                              <p className="text-xs text-yellow-700 mt-1 font-medium">
                                {daysUntil === 0 ? 'Today!' : `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}
                              </p>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
                              {holidayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Holidays List */}
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0096C7' }}>
                  🎊 All Public Holidays 2082 (2025-2026)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {NEPALI_HOLIDAYS.map((holiday: HolidayInfo, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{holiday.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{holiday.description}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📌 Important Information</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Capital Cargo is closed on Saturdays and all public holidays</li>
                  <li>During Dashain & Tihar, services may be limited for 7-10 days</li>
                  <li>For urgent shipments during holidays, please call us in advance</li>
                  <li>International flights may operate on different schedules</li>
                </ul>
              </div>

              {/* Contact CTA */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
                <p className="font-semibold mb-2">Need to ship during a holiday period?</p>
                <p className="text-sm text-blue-100 mb-3">Contact us in advance to arrange special handling</p>
                <a
                  href="tel:+97715367883"
                  className="inline-block px-6 py-2 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: '#F9B222' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9B222'}
                >
                  📞 Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NepaliCalendar;
