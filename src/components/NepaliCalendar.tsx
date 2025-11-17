import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import bannerImg from '../assets/images/banner.png';
import { NepaliDate, toAD } from '@zener/nepali-datepicker-react';

interface HolidayInfo {
  bsDate: string; // Format: "YYYY-MM-DD" in BS
  name: string;
  description: string;
  adDate?: string; // Will be calculated
}

// Major Nepali Holidays when Capital Cargo is closed (BS 2081-2082)
// Using proper Nepali calendar dates
const NEPALI_HOLIDAYS_BS: HolidayInfo[] = [
  // BS 2081 (2024 AD - Poush to Chaitra)
  { bsDate: '2081-09-10', name: 'Christmas Day', description: 'Christmas Day' },
  { bsDate: '2081-09-17', name: 'English New Year', description: 'New Year\'s Day' },
  { bsDate: '2081-09-27', name: 'Prithvi Jayanti', description: 'National Unity Day' },
  { bsDate: '2081-10-16', name: 'Martyr\'s Day', description: 'Democracy Martyrs\' Day' },
  { bsDate: '2081-11-07', name: 'Maha Shivaratri', description: 'Great Night of Shiva' },
  { bsDate: '2081-11-24', name: 'International Women\'s Day', description: 'Women\'s Day' },
  { bsDate: '2081-12-01', name: 'Holi (Fagu Purnima)', description: 'Festival of Colors' },
  { bsDate: '2081-12-30', name: 'Ghode Jatra', description: 'Horse Festival' },
  
  // BS 2082 (2025-2026 AD)
  { bsDate: '2082-01-01', name: 'Naya Barsa 2082', description: 'Nepali New Year 2082' },
  { bsDate: '2082-01-18', name: 'Labour Day', description: 'International Workers\' Day' },
  { bsDate: '2082-01-29', name: 'Buddha Jayanti', description: 'Buddha\'s Birthday' },
  { bsDate: '2082-02-12', name: 'Republic Day', description: 'Nepal Republic Day' },
  { bsDate: '2082-04-27', name: 'Janai Purnima', description: 'Sacred Thread Festival' },
  { bsDate: '2082-05-04', name: 'Krishna Janmashtami', description: 'Lord Krishna\'s Birthday' },
  { bsDate: '2082-05-12', name: 'Gai Jatra', description: 'Cow Festival' },
  { bsDate: '2082-05-19', name: 'Teej (Haritalika)', description: 'Women\'s Festival' },
  { bsDate: '2082-05-23', name: 'Rishi Panchami', description: 'Day of Sages' },
  { bsDate: '2082-06-03', name: 'Constitution Day', description: 'Nepal Constitution Day' },
  { bsDate: '2082-06-15', name: 'Ghatasthapana', description: 'Start of Dashain Festival' },
  { bsDate: '2082-06-19', name: 'Fulpati', description: 'Seventh Day of Dashain' },
  { bsDate: '2082-06-20', name: 'Maha Ashtami', description: 'Eighth Day of Dashain' },
  { bsDate: '2082-06-21', name: 'Maha Navami', description: 'Ninth Day of Dashain' },
  { bsDate: '2082-06-22', name: 'Vijaya Dashami', description: 'Main Day of Dashain' },
  { bsDate: '2082-06-23', name: 'Ekadashi', description: 'Eleventh Day of Dashain' },
  { bsDate: '2082-06-24', name: 'Dwadashi', description: 'Twelfth Day of Dashain' },
  { bsDate: '2082-07-03', name: 'Dhanteras', description: 'Start of Tihar' },
  { bsDate: '2082-07-04', name: 'Kaag Tihar', description: 'Day of Crows' },
  { bsDate: '2082-07-05', name: 'Kukur Tihar', description: 'Day of Dogs' },
  { bsDate: '2082-07-06', name: 'Laxmi Puja', description: 'Main Day of Tihar - Festival of Lights' },
  { bsDate: '2082-07-07', name: 'Govardhan Puja', description: 'Day of Oxen' },
  { bsDate: '2082-07-08', name: 'Bhai Tika', description: 'Brother\'s Day - Last Day of Tihar' },
  { bsDate: '2082-07-21', name: 'Chhath Puja', description: 'Sun God Festival' },
];

// Convert BS dates to AD dates
const NEPALI_HOLIDAYS: HolidayInfo[] = NEPALI_HOLIDAYS_BS.map(holiday => {
  try {
    const adDateObj = toAD(holiday.bsDate);
    const adDate = `${adDateObj.year}-${String(adDateObj.month).padStart(2, '0')}-${String(adDateObj.date).padStart(2, '0')}`;
    return { ...holiday, adDate };
  } catch (error) {
    console.error(`Error converting ${holiday.bsDate}:`, error);
    return { ...holiday, adDate: holiday.bsDate };
  }
});

const NepaliCalendar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate] = useState(new Date());
  
  // Get current Nepali date using proper Nepali date library
  const today = new NepaliDate();
  
  // Debug: Log the actual values
  console.log('Today BS Date:', today.toString());
  console.log('Year:', today.getFullYear(), 'Month:', today.getMonth(), 'Date:', today.getDate());
  
  const todayYear = Number(today.getFullYear());
  const todayMonth = Number(today.getMonth());
  const todayDate = Number(today.getDate());
  
  console.log('Processed - Year:', todayYear, 'Month:', todayMonth, 'Date:', todayDate);
  
  // Initialize with today's actual BS date
  const [currentBSYear, setCurrentBSYear] = useState(() => {
    const y = Number(new NepaliDate().getFullYear());
    console.log('Initial Year:', y);
    return y;
  });
  const [currentBSMonth, setCurrentBSMonth] = useState(() => {
    const m = Number(new NepaliDate().getMonth());
    console.log('Initial Month:', m);
    return m;
  });
  
  // Reset to today's month when calendar is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentBSYear(todayYear);
      setCurrentBSMonth(todayMonth);
    }
  }, [isOpen, todayYear, todayMonth]);
  
  // Days in each Nepali month for specific years
  // Reference: Official Nepali calendar data (Baisakh to Chaitra)
  const nepaliMonthDays: { [year: number]: number[] } = {
    2070: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2071: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2072: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2074: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2076: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2078: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2081: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2084: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2085: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2086: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2087: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2088: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  };
  
  const getDaysInBSMonth = (year: number, month: number): number => {
    // month is 0-indexed (0-11)
    // Return the exact number of days for the year and month
    if (nepaliMonthDays[year] && nepaliMonthDays[year][month]) {
      return nepaliMonthDays[year][month];
    }
    // Fallback to approximate days per month
    const defaultDays = [31, 31, 32, 31, 32, 30, 30, 30, 29, 30, 29, 31];
    return defaultDays[month] || 30;
  };
  
  // Generate calendar days for the current BS month
  const generateCalendarDays = () => {
    try {
      // currentBSMonth is 0-11, but date string needs 1-12
      const monthForString = currentBSMonth + 1;
      const firstDayOfMonth = new NepaliDate(`${currentBSYear}-${String(monthForString).padStart(2, '0')}-01`);
      const firstDayAD = firstDayOfMonth.toADasDate();
      const startingDayOfWeek = firstDayAD.getDay(); // 0 = Sunday
      const daysInMonth = getDaysInBSMonth(currentBSYear, currentBSMonth);
      
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
    } catch (error) {
      console.error('Error generating calendar:', error);
      return [];
    }
  };

  const calendarDays = generateCalendarDays();
  
  // Nepali month names (0-indexed to match getMonth() which returns 0-11)
  const nepaliMonths: { [key: number]: string } = {
    0: 'बैशाख (Baisakh)',
    1: 'जेष्ठ (Jestha)',
    2: 'आषाढ (Ashadh)',
    3: 'श्रावण (Shrawan)',
    4: 'भाद्र (Bhadra)',
    5: 'आश्विन (Ashwin)',
    6: 'कार्तिक (Kartik)',
    7: 'मंसिर (Mangsir)',
    8: 'पौष (Poush)',
    9: 'माघ (Magh)',
    10: 'फाल्गुन (Falgun)',
    11: 'चैत्र (Chaitra)'
  };
  
  // Get current BS date as string for comparison
  const todayBSString = today.toString(); // Format: YYYY-MM-DD
  const todayADString = currentDate.toISOString().split('T')[0];
  
  // Check today's date against our holiday list
  const todayHoliday = NEPALI_HOLIDAYS.find((h: HolidayInfo) => 
    h.bsDate === todayBSString || h.adDate === todayADString
  );
  
  // Check if today is Saturday (6) - Capital Cargo is closed on Saturdays
  const dayOfWeek = currentDate.getDay();
  const isSaturday = dayOfWeek === 6;

  // Check if there's a holiday within next 7 days
  const upcomingHolidays = NEPALI_HOLIDAYS.filter((holiday: HolidayInfo) => {
    if (!holiday.adDate) return false;
    const holidayDate = new Date(holiday.adDate);
    const diffTime = holidayDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const isHolidayToday = !!todayHoliday || isSaturday;

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
          <div className="bg-primary-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Banner Image */}
            <div className="w-full rounded-t-2xl overflow-hidden">
              <img 
                src={bannerImg} 
                alt="Capital Cargo Banner" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Header */}
            <div style={{ zIndex: 100 }}
              className="sticky top-0 bg-gradient-to-r from-primary-blue to-blue-600 text-white p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {nepaliMonths[currentBSMonth]} {currentBSYear} BS
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Today: {today.format('MMMM DD, YYYY')} ({currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-accent-orange-hover rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    if (currentBSMonth === 0) {
                      setCurrentBSMonth(11);
                      setCurrentBSYear(currentBSYear - 1);
                    } else {
                      setCurrentBSMonth(currentBSMonth - 1);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <button
                  onClick={() => {
                    setCurrentBSMonth(todayMonth);
                    setCurrentBSYear(todayYear);
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-blue-700 rounded-lg transition-colors font-semibold text-sm"
                >
                  Today
                </button>
                
                <button
                  onClick={() => {
                    if (currentBSMonth === 11) {
                      setCurrentBSMonth(0);
                      setCurrentBSYear(currentBSYear + 1);
                    } else {
                      setCurrentBSMonth(currentBSMonth + 1);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
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
              <div className="bg-primary-white rounded-lg border border-blue-200 p-4">
                <div className="grid grid-cols-7 gap-2">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={day} className={`text-center font-semibold text-sm py-2 \${index === 6 ? 'text-red-600' : 'text-primary-blue'}`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }
                    
                    // Create BS date string for this day (month needs to be 1-12 for date string)
                    const bsDateStr = `${currentBSYear}-${String(currentBSMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = day === todayDate && currentBSMonth === todayMonth && currentBSYear === todayYear;
                    
                    // Get AD date for this BS date to check day of week
                    let dayOfWeek = 0;
                    try {
                      const bsDate = new NepaliDate(bsDateStr);
                      const adDate = bsDate.toADasDate();
                      dayOfWeek = adDate.getDay();
                    } catch {
                      dayOfWeek = 0;
                    }
                    
                    const isSat = dayOfWeek === 6;
                    const holiday = NEPALI_HOLIDAYS.find((h: HolidayInfo) => h.bsDate === bsDateStr);
                    
                    return (
                      <div
                        key={day}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative ${
                          isToday 
                            ? 'bg-primary-blue text-white font-bold shadow-lg' 
                            : holiday || isSat
                            ? 'bg-red-50 text-red-600 font-semibold'
                            : 'hover:bg-blue-50'
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
                <div className="mt-4 pt-4 border-t border-blue-200 flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary-blue rounded"></div>
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
                      if (!holiday.adDate) return null;
                      const holidayDate = new Date(holiday.adDate);
                      const daysUntil = Math.ceil((holidayDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                      
                      // Parse BS date for display
                      const bsDateParts = holiday.bsDate.split('-');
                      const bsMonthName = nepaliMonths[parseInt(bsDateParts[1]) - 1];
                      
                      return (
                        <div
                          key={index}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-primary-blue">{holiday.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{holiday.description}</p>
                              <p className="text-xs text-primary-blue mt-1 font-medium">
                                {daysUntil === 0 ? 'Today!' : `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-medium px-2 py-1 bg-blue-200 text-primary-blue rounded block mb-1">
                                {holidayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {bsMonthName?.split('(')[1]?.replace(')', '')} {bsDateParts[2]}
                              </span>
                            </div>
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
                  🎊 All Public Holidays 2081-2082 BS (2024-2026 AD)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {NEPALI_HOLIDAYS.map((holiday: HolidayInfo, index: number) => {
                    if (!holiday.adDate) return null;
                    
                    // Parse BS date for display
                    const bsDateParts = holiday.bsDate.split('-');
                    const bsMonthName = nepaliMonths[parseInt(bsDateParts[1]) - 1];
                    
                    return (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3 hover:border-primary-blue hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-primary-blue text-sm">{holiday.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{holiday.description}</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              BS: {bsMonthName?.split('(')[1]?.replace(')', '')} {bsDateParts[2]}, {bsDateParts[0]}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-200 text-primary-blue rounded whitespace-nowrap ml-2">
                            {new Date(holiday.adDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">📌 Important Information</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Capital Cargo is closed on Saturdays and all public holidays</li>
                  <li>During Dashain & Tihar, services may be limited for 7-10 days</li>
                  <li>For urgent shipments during holidays, please call us in advance</li>
                  <li>International flights may operate on different schedules</li>
                </ul>
              </div>

              {/* Contact CTA */}
              <div className="text-center p-4 bg-gradient-to-r from-primary-blue to-blue-600 rounded-lg text-white">
                <p className="font-semibold mb-2">Need to ship during a holiday period?</p>
                <p className="text-sm text-blue-100 mb-3">Contact us in advance to arrange special handling</p>
                <a
                  href="tel:+97715367883"
                  className="inline-block px-6 py-2 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: '#FFFFFF', color: '#0096C7' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9B222'; e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#0096C7'; }}
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
