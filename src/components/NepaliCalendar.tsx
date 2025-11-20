import React, { useState, useEffect, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import bannerImg from '../assets/images/banner.png';

const NepaliCalendar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate] = useState(new Date());
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  
  const dayOfWeek = currentDate.getDay();
  const isSaturday = dayOfWeek === 6;
  
  // Format current date for display
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Load the Nepali Calendar widget when modal opens
  useEffect(() => {
    if (!isOpen || !widgetContainerRef.current) return;

    const container = widgetContainerRef.current;

    // Create iframe to isolate the widget
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '350px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    
    container.appendChild(iframe);

    // Write the widget code into the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
              background: transparent;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            var nc_ev_width = 'responsive';
            var nc_ev_height = 303;
            var nc_ev_def_lan = 'np';
            var nc_ev_api_id = 449202501119704;
          </script>
          <script type="text/javascript" src="https://www.ashesh.com.np/calendar-event/ev.js"></script>
        </body>
        </html>
      `);
      iframeDoc.close();
    }

    return () => {
      // Cleanup
      container.innerHTML = '';
    };
  }, [isOpen]);

  return (
    <>
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
        {isSaturday && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-primary-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="w-full rounded-t-2xl overflow-hidden">
              <img src={bannerImg} alt="Capital Cargo Banner" className="w-full h-auto object-cover" />
            </div>
            
            <div className="sticky top-0 bg-gradient-to-r from-primary-blue to-blue-600 text-white p-4 md:p-6 z-10">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold">
                    Nepali Calendar & Holidays
                  </h2>
                  <p className="text-blue-100 text-xs md:text-sm mt-1">
                    Today: {formattedDate}
                  </p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {isSaturday ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-red-800">📅 Saturday - Weekend</h3>
                      <p className="text-red-700 text-sm mt-1">Office closed for weekend</p>
                      <p className="text-red-600 font-medium mt-2">⚠️ Capital Cargo is CLOSED today</p>
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
                      <h3 className="text-lg font-semibold text-green-800">✅ We're Open Today!</h3>
                      <p className="text-green-700 text-sm mt-1">Office Hours: 10:00 AM - 5:00 PM (Sunday - Friday)</p>
                      <p className="text-green-600 text-sm mt-1">📞 +977-01-5367883, 01-5368837</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Events & Holidays Widget */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-accent-orange rounded-lg p-4">
                <h3 className="text-lg font-bold text-accent-orange mb-3 flex items-center gap-2">
                  🗓️ Upcoming Events & Holidays
                </h3>
                <div ref={widgetContainerRef} className="nepali-calendar-widget"></div>
                <div id="ncwidgetlink" className="text-xs text-gray-500 mt-2">
                  Powered by © <a href="https://www.ashesh.com.np/nepali-calendar/" id="nclink" title="Nepali calendar" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">Nepali Calendar</a>
                </div>
              </div>

              {/* Hamropatro Calendar Widget */}
              <div className="bg-white rounded-lg border border-blue-200 p-2 md:p-4 overflow-hidden">
                <div className="flex justify-center items-center">
                  <iframe 
                    src="https://www.hamropatro.com/widgets/calender-full.php" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginWidth={0} 
                    marginHeight={0} 
                    style={{ 
                      border: 'none', 
                      overflow: 'hidden', 
                      width: '100%',
                      maxWidth: '800px',
                      height: '840px'
                    }} 
                    allowTransparency={true}
                    title="Hamropatro Nepali Calendar"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">📌 Important Information</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Capital Cargo is closed on Saturdays and all public holidays</li>
                  <li>During Dashain & Tihar, services may be limited for 7-10 days</li>
                  <li>For urgent shipments during holidays, please call us in advance</li>
                  <li>Calendar provided by Hamropatro with accurate holiday information</li>
                </ul>
              </div>

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
