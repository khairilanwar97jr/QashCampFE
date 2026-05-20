import React, { useState, useEffect, useMemo, useRef } from 'react';


// Official Qashcamp Package Name Mapping from DB IDs
const PACKAGE_NAMES = {
  1: 'Awan',
  2: 'Purnama',
  3: 'Senja',
  4: 'Lestari',
  5: 'Embun',
  6: 'Aurora',
  7: 'Rimbayu',
};

// Maximum contrast palette - zero overlapping hues
const PACKAGE_COLORS = {
  1: 'bg-sky-400',
  2: 'bg-purple-500',
  3: 'bg-orange-500',
  4: 'bg-emerald-600',
  5: 'bg-fuchsia-500',
  6: 'bg-red-500',
  7: 'bg-amber-900',
};

const addDays = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export default function QashcampLogisticsDashboard() {
    const API_URL = import.meta.env.VITE_API_URL;

  // =========================
  // ANIMATION
  // =========================
  const dashboardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => {
      if (dashboardRef.current) {
        observer.unobserve(dashboardRef.current);
      }
    };
  }, []);

  // =========================
  // STATE
  // =========================
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [liveBookings, setLiveBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    async function syncLogisticsTimeline() {
      setLoading(true);

      try {
        const queryYear = year;
        const queryMonth = month + 1;

        const response = await fetch(
          `${API_URL}/api/bookings/blocked-dates?year=${queryYear}&month=${queryMonth}`
        );

        const data = await response.json();

        if (data.success && data.bookings) {
          const actualArray = data.bookings.bookings || [];
          setLiveBookings(actualArray);
          setSelectedDate(null);
        }
      } catch (err) {
        console.error(
          "Failed to populate live dashboard calendar metrics:",
          err
        );
      } finally {
        setLoading(false);
      }
    }

    syncLogisticsTimeline();
  }, [year, month]);

  // =========================
  // CALENDAR MAP
  // =========================
  const calendarMap = useMemo(() => {
    const map = {};
    const separatedByPackage = {};

    if (liveBookings.length === 0) return map;

    liveBookings.forEach((b) => {
      if (!separatedByPackage[b.packageId]) {
        separatedByPackage[b.packageId] = [];
      }

      separatedByPackage[b.packageId].push({ ...b });
    });

    const sanitizedBookings = [];

    Object.keys(separatedByPackage).forEach((packageId) => {
      const bookings = separatedByPackage[packageId];

      bookings.sort((a, b) =>
        a.startDate.localeCompare(b.startDate)
      );

      const merged = [];
      let currentTimeline = bookings[0];

      for (let i = 1; i < bookings.length; i++) {
        const nextTimeline = bookings[i];

        if (nextTimeline.startDate <= currentTimeline.endDate) {
          if (nextTimeline.endDate > currentTimeline.endDate) {
            currentTimeline.endDate = nextTimeline.endDate;
          }
        } else {
          merged.push(currentTimeline);
          currentTimeline = nextTimeline;
        }
      }

      merged.push(currentTimeline);
      sanitizedBookings.push(...merged);
    });

    sanitizedBookings.forEach((booking) => {
      let current = booking.startDate;

      while (current <= booking.endDate) {
        if (!map[current]) {
          map[current] = { active: [], buffer: [] };
        }

        if (!map[current].active.includes(booking.packageId)) {
          map[current].active.push(booking.packageId);
        }

        current = addDays(current, 1);
      }

      for (let i = 1; i <= 2; i++) {
        const bufferDate = addDays(booking.endDate, i);

        if (!map[bufferDate]) {
          map[bufferDate] = { active: [], buffer: [] };
        }

        if (
          !map[bufferDate].active.includes(booking.packageId) &&
          !map[bufferDate].buffer.includes(booking.packageId)
        ) {
          map[bufferDate].buffer.push(booking.packageId);
        }
      }
    });

    return map;
  }, [liveBookings]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  );

  const emptySpaces = Array.from(
    { length: firstDayIndex },
    (_, i) => i
  );

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // =========================
  // SYNC BADGE
  // =========================
  const [isSyncing, setIsSyncing] = useState(loading);

useEffect(() => {
  let timer;

  if (loading) {
    setIsSyncing(true);
  } else {
    // Delay disappear
    timer = setTimeout(() => {
      setIsSyncing(false);
    }, 2000); // 2 seconds before disappear
  }

  return () => clearTimeout(timer);
}, [loading]);

  return (
    <div
      ref={dashboardRef}
      className={`w-full py-12 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform
      ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-20 scale-95'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto bg-white border border-neutral-100 rounded-2xl shadow-sm p-4 md:p-6 text-black font-sans">

        {/* HEADER */}
        <header
          className="px-6 pt-8 pb-6 border-b border-[#e8e1cd] mb-6"
          style={{
            backgroundColor: '#f9f3e3',
            backgroundImage:
              'radial-gradient(#e5dcb8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            fontFamily: "'Fredoka One', cursive",
            color: "#597E52"
          }}
        >
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.1em] uppercase">
            Booked Package
          </h1>

          <p className="text-[#b8951d] text-xs mt-1 font-black uppercase tracking-[0.2em]">
            Overview & Schedule
          </p>
        </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: Calendar Interface */}
<div className="md:col-span-7 lg:col-span-8 w-full p-6 md:p-8 rounded-3xl bg-[#F9F3E3] border border-[#E8E1CD] shadow-sm">
  <div className="flex items-center justify-between mb-6">

<div>
  <h2 className="text-lg md:text-xl font-black tracking-tight text-black flex items-center gap-3">
    {monthNames[month]} {year}
    
    {/* It will ONLY show if isSyncing is true */}
<span
  className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded transition-all duration-700
  ${
    isSyncing
      ? 'opacity-100 translate-y-0 bg-yellow-400 text-black'
      : 'opacity-0 -translate-y-2 pointer-events-none bg-yellow-400 text-black'
  }`}
>
  <div className="w-2.5 h-2.5 border-[2px] border-black/20 border-t-black rounded-full animate-spin"></div>
  Syncing
</span>
  </h2>
</div>
    <div className="flex gap-2">
      <button 
        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-sm font-bold hover:bg-neutral-50 active:bg-neutral-100 transition"
      >
        ←
      </button>
      <button 
        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-sm font-bold hover:bg-neutral-50 active:bg-neutral-100 transition"
      >
        →
      </button>
    </div>
  </div>

  <div className="grid grid-cols-7 gap-1 md:gap-2 text-center font-bold text-[11px] md:text-xs uppercase tracking-wider text-neutral-400 mb-4">
    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
  </div>

  <div className="grid grid-cols-7 gap-y-3 gap-x-1 md:gap-2">
    {emptySpaces.map((space) => (
      <div key={`empty-${space}`} className="aspect-square"></div>
    ))}

    {daysArray.map((day) => {
      const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendarMap[dayString] || { active: [], buffer: [] };
      
      const activeCount = dayData.active.length;
      const hasBuffer = dayData.buffer.length > 0;
      const hasActivity = activeCount > 0 || hasBuffer;
      const isSelected = selectedDate?.date === dayString;

      let ringStyle = 'border-transparent';
      if (!isSelected) {
        if (activeCount > 0 && activeCount <= 3) {
          ringStyle = 'border-2 border-yellow-400'; 
        } else if (activeCount > 3) {
          ringStyle = 'border-2 border-black'; 
        } else if (hasBuffer) {
          ringStyle = 'border border-dashed border-neutral-300'; 
        }
      }

      let bgStyle = 'bg-white';
      let textStyle = 'text-black font-medium'; 

      if (isSelected) {
        if (activeCount > 0) {
          bgStyle = 'bg-neutral-900 scale-105 shadow-md'; 
          textStyle = activeCount > 3 ? 'text-yellow-400 font-black' : 'text-white font-bold';
        } else if (hasBuffer) {
          bgStyle = 'bg-neutral-200 scale-105'; 
          textStyle = 'text-neutral-900 font-bold';
        } else {
          bgStyle = 'bg-yellow-400 scale-105 shadow-sm';
          textStyle = 'text-black font-black';
        }
      } else {
        if (hasActivity) {
          bgStyle = 'bg-neutral-50 group-hover:bg-neutral-100 cursor-pointer shadow-sm';
          textStyle = activeCount > 3 ? 'text-black font-black' : 'text-neutral-700 font-bold';
        } else {
          bgStyle = 'bg-white hover:bg-yellow-50 border border-neutral-100 cursor-pointer';
          textStyle = 'text-black font-medium';
        }
      }

      return (
        <button
          key={day}
          onClick={() => setSelectedDate({ date: dayString, ...dayData })}
          className="aspect-square relative flex flex-col items-center justify-center rounded-xl transition group w-full"
        >
          <div className={`w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center rounded-full md:rounded-xl transition-all ${ringStyle} ${bgStyle}`}>
            <span className={`text-xs md:text-sm transition-colors ${textStyle}`}>
              {day}
            </span>
            
            {!isSelected && (
              <div className="flex gap-0.5 mt-0.5 justify-center items-center h-1 max-w-full overflow-hidden px-0.5">
                {dayData.active.map((id) => (
                  <span 
                    key={`dot-a-${id}`} 
                    className={`w-1 h-1 rounded-full ${PACKAGE_COLORS[id] || 'bg-neutral-400'}`} 
                  />
                ))}
                {dayData.buffer.map((id) => (
                  <span 
                    key={`dot-b-${id}`} 
                    className={`w-1 h-1 rounded-full ${PACKAGE_COLORS[id] || 'bg-neutral-400'} opacity-35 ring-[0.5px] ring-black/10`} 
                  />
                ))}
              </div>
            )}
          </div>
        </button>
      );
    })}
  </div>
</div>

        {/* RIGHT COMPONENT: Logistics Inspector Panel */}
<div className="md:col-span-5 lg:col-span-4 w-full md:mt-14">
  {selectedDate ? (
    <div className="p-5 bg-[#fcfaf5] text-[#5e5847] rounded-xl shadow-sm border border-[#e8e1cd] animate-fadeIn w-full">
      <div className="flex justify-between items-center mb-5 border-b border-[#e8e1cd] pb-4">
        <div>
          <h4 className="text-xs font-black tracking-widest text-[#b8951d] uppercase">Fleet Status Summary</h4>
          <p className="text-sm font-bold text-[#2d2a25] mt-1">{selectedDate.date}</p>
        </div>
        <button 
          onClick={() => setSelectedDate(null)}
          className="w-7 h-7 flex items-center justify-center bg-[#e8e1cd] rounded-full text-xs text-[#5e5847] hover:bg-[#dcd3bc] transition"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {selectedDate.active.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-[#a89d80] uppercase tracking-widest mb-3">Booked Packages</p>
            <div className="flex flex-wrap gap-2">
              {selectedDate.active.map((id) => (
                <span key={id} className="text-xs px-3 py-1.5 font-bold bg-[#efeadd] text-[#5e5847] border border-[#e8e1cd] rounded-lg shadow-sm flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${PACKAGE_COLORS[id]}`} />
                  {PACKAGE_NAMES[id]}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedDate.buffer.length > 0 && (
          <div className="pt-4 border-t border-[#e8e1cd]">
            <p className="text-[10px] font-black text-[#a89d80] uppercase tracking-widest mb-3">Turnaround / Gear Reset</p>
            <div className="flex flex-wrap gap-2">
              {selectedDate.buffer.map((id) => (
                <span key={id} className="text-xs px-3 py-1.5 font-bold bg-transparent text-[#a89d80] border border-[#e8e1cd] rounded-lg flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${PACKAGE_COLORS[id]} opacity-30`} />
                  {PACKAGE_NAMES[id]} Clean Window
                </span>
              ))}
            </div>
          </div>
        )}

{selectedDate.active.length === 0 && selectedDate.buffer.length === 0 && (
  <div className="text-center py-6">
    {/* Refined Sage Green Badge */}
    <div className="inline-block px-4 py-1.5 bg-[#d7e4d7] text-[#2d5236] border border-[#c5d3c5] text-[10px] font-black rounded-full mb-3 tracking-[0.2em] uppercase shadow-sm">
      Available
    </div>
    <p className="text-xs text-[#877e68] leading-relaxed max-w-[200px] mx-auto font-medium">
      System is clear. All equipment is ready for the next deployment.
    </p>
  </div>
)}
      </div>
    </div>
  ) : (
    <div className="hidden md:flex flex-col items-center justify-center p-8 bg-[#f9f3e3]/50 border border-dashed border-[#e8e1cd] rounded-xl min-h-[220px] text-center">
      <span className="text-3xl mb-3 opacity-50">📅</span>
      <p className="text-[10px] font-black text-[#a89d80] uppercase tracking-[0.2em]">Logistics Inspector</p>
      <p className="text-xs text-[#877e68] mt-2 max-w-[180px]">Select a date on the calendar to view current operational status.</p>
    </div>
  )}
</div>

      </div>
    </div>
    </div>
  );
}