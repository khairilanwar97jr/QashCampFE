import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CalendarDays,
  Info,
} from 'lucide-react';

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

const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getCurrentMonthStart = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
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
  const [currentDate, setCurrentDate] = useState(getCurrentMonthStart);
  const [selectedDate, setSelectedDate] = useState(null);
  const [liveBookings, setLiveBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreviousMonthAuth, setShowPreviousMonthAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const ADMIN_PASSCODE = 'CAMP97';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePreviousMonthRequest = () => {
    setPasswordInput('');
    setAuthError(false);
    setShowPreviousMonthAuth(true);
  };

  const handlePreviousMonthUnlock = (event) => {
    event.preventDefault();

    if (passwordInput !== ADMIN_PASSCODE) {
      setAuthError(true);
      return;
    }

    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setShowPreviousMonthAuth(false);
    setPasswordInput('');
    setAuthError(false);
  };

  // Get exact string for today's date (YYYY-MM-DD)
  const todayString = useMemo(() => {
    return getLocalDateString(new Date());
  }, []);

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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
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
      timer = setTimeout(() => {
        setIsSyncing(false);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div
      ref={dashboardRef}
      className={`w-full px-4 py-12 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform
      ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-20 scale-95'
      }`}
    >
      <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl border border-[#e8e1cd] bg-white text-black shadow-[0_18px_55px_rgba(25,28,26,0.12)] font-sans">

        {/* HEADER */}
        <header
          className="relative overflow-hidden px-6 py-7 md:px-8 md:py-8"
          style={{
            backgroundColor: '#191C1A',
            backgroundImage: 'linear-gradient(135deg, rgba(89,126,82,0.24), rgba(198,169,105,0.12))',
            fontFamily: "'Fredoka One', cursive",
            color: "#ffffff"
          }}
        >
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#C6A969]">
                Overview & Schedule
              </p>
              <h1 className="text-2xl font-black uppercase tracking-[0.1em] md:text-3xl">
                Booked Package
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur">
              <CalendarDays className="h-4 w-4 text-[#C6A969]" />
              Live booking calendar
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-12 md:p-6">
          
          {/* LEFT COMPONENT: Calendar Interface */}
          <div className="md:col-span-7 lg:col-span-8 w-full rounded-2xl border border-[#E8E1CD] bg-[#F9F3E3] p-4 shadow-sm md:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#b8951d]">
                  Current View
                </p>
                <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[#191C1A] md:text-3xl">
                  <span>{monthNames[month]} {year}</span>
                  
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest transition-all duration-700
                    ${
                      isSyncing
                        ? 'opacity-100 translate-y-0 bg-[#C6A969] text-black'
                        : 'opacity-0 -translate-y-2 pointer-events-none bg-[#C6A969] text-black'
                    }`}
                  >
                    <div className="h-2.5 w-2.5 animate-spin rounded-full border-[2px] border-black/20 border-t-black"></div>
                    Syncing
                  </span>
                </h2>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <button 
                  onClick={handlePreviousMonthRequest}
                  aria-label="Previous month"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8caa8] bg-white text-[0px] text-transparent shadow-sm transition before:text-xl before:font-black before:text-[#597E52] before:content-['‹'] hover:bg-[#fff7ed] active:scale-95"
                >
                  ←
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  aria-label="Next month"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8caa8] bg-white text-[0px] text-transparent shadow-sm transition before:text-xl before:font-black before:text-[#597E52] before:content-['›'] hover:bg-[#fff7ed] active:scale-95"
                >
                  →
                </button>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-[#e8e1cd] bg-white/70 p-3 text-[10px] font-black uppercase tracking-wider text-[#5e5847]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-[#e8e1cd]">
                <span className="h-2 w-2 rounded-full border-2 border-[#C6A969] bg-white" />
                Booked
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-[#e8e1cd]">
                <span className="h-2 w-2 rounded-full bg-black" />
                Heavy Booking
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-[#e8e1cd]">
                <span className="h-2 w-2 rounded-full border border-dashed border-neutral-500" />
                Buffer
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center font-black text-[10px] md:text-xs uppercase tracking-wider text-[#8f846a] mb-3">
              <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
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
                const isToday = dayString === todayString;

                // Border Ring Customization
                let ringStyle = 'border border-transparent';
                if (!isSelected) {
                  if (isToday) {
                    ringStyle = 'ring-2 ring-[#597E52] ring-offset-2 ring-offset-[#F9F3E3]';
                  } else if (activeCount > 0 && activeCount <= 3) {
                    ringStyle = 'border-2 border-[#C6A969]'; 
                  } else if (activeCount > 3) {
                    ringStyle = 'border-2 border-[#191C1A]'; 
                  } else if (hasBuffer) {
                    ringStyle = 'border border-dashed border-[#a89d80]'; 
                  }
                }

                // Background Customization
                let bgStyle = 'bg-white';
                let textStyle = 'text-[#191C1A] font-semibold'; 

                if (isSelected) {
                  if (activeCount > 0) {
                    bgStyle = 'bg-[#191C1A] scale-105 shadow-lg'; 
                    textStyle = activeCount > 3 ? 'text-[#C6A969] font-black' : 'text-white font-bold';
                  } else if (hasBuffer) {
                    bgStyle = 'bg-[#e8e1cd] scale-105'; 
                    textStyle = 'text-[#191C1A] font-bold';
                  } else {
                    bgStyle = 'bg-[#C6A969] scale-105 shadow-sm';
                    textStyle = 'text-[#191C1A] font-black';
                  }
                } else {
                  if (hasActivity) {
                    bgStyle = isToday ? 'bg-white cursor-pointer shadow-sm' : 'bg-white/90 group-hover:bg-white cursor-pointer shadow-sm';
                    textStyle = activeCount > 3 ? 'text-[#191C1A] font-black' : 'text-[#4c4638] font-bold';
                  } else {
                    bgStyle = isToday ? 'bg-[#dce9d8] hover:bg-[#d2e2cd] cursor-pointer' : 'bg-white hover:bg-[#fff7ed] cursor-pointer';
                    textStyle = isToday ? 'text-[#191C1A] font-black' : 'text-[#191C1A] font-semibold';
                  }
                }

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate({ date: dayString, ...dayData })}
                    className="aspect-square relative flex w-full flex-col items-center justify-center rounded-xl transition group"
                  >
                    <div className={`relative flex h-full min-h-[42px] w-full flex-col items-center justify-center rounded-xl transition-all group-hover:-translate-y-0.5 ${ringStyle} ${bgStyle}`}>
                      
                      {/* Visual marker label for Today when not selected */}
                      {isToday && !isSelected && (
                        <span className="absolute -top-2 z-10 rounded-full bg-[#597E52] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-tight text-white shadow-sm md:text-[8px]">
                          Today
                        </span>
                      )}

                      <span className={`text-xs md:text-sm transition-colors ${textStyle}`}>
                        {day}
                      </span>
                      
                      {!isSelected && (
                        <div className="mt-1 flex h-1.5 max-w-full items-center justify-center gap-0.5 overflow-hidden px-0.5">
                          {dayData.active.map((id) => (
                            <span 
                              key={`dot-a-${id}`} 
                              className={`h-1.5 w-1.5 rounded-full ${PACKAGE_COLORS[id] || 'bg-neutral-400'}`} 
                            />
                          ))}
                          {dayData.buffer.map((id) => (
                            <span 
                              key={`dot-b-${id}`} 
                              className={`h-1.5 w-1.5 rounded-full ${PACKAGE_COLORS[id] || 'bg-neutral-400'} opacity-35 ring-[0.5px] ring-black/10`} 
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
          <div className="md:col-span-5 lg:col-span-4 w-full">
            {selectedDate ? (
              <div className="w-full rounded-2xl border border-[#e8e1cd] bg-[#fcfaf5] p-5 text-[#5e5847] shadow-sm animate-fadeIn">
                <div className="mb-5 flex items-center justify-between border-b border-[#e8e1cd] pb-4">
                  <div>
                    <h4 className="text-xs font-black tracking-widest text-[#b8951d] uppercase">
                      Fleet Status Summary {selectedDate.date === todayString && " (Today)"}
                    </h4>
                    <p className="text-sm font-bold text-[#2d2a25] mt-1">{selectedDate.date}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedDate(null)}
                    aria-label="Close selected date details"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e1cd] text-[0px] text-transparent transition before:text-sm before:font-black before:text-[#5e5847] before:content-['×'] hover:bg-[#dcd3bc]"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {selectedDate.active.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-[#a89d80] uppercase tracking-widest mb-3">Booked Packages</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDate.active.flatMap((id) => {
                          const matchingBookings = liveBookings.filter(
                            (b) => b.packageId === id && selectedDate.date >= b.startDate && selectedDate.date <= b.endDate
                          );

                          if (matchingBookings.length === 0) {
                            return [
                              <span key={`fallback-${id}`} className="text-xs px-3 py-1.5 font-bold bg-[#efeadd] text-[#5e5847] border border-[#e8e1cd] rounded-lg shadow-sm flex items-center gap-2 max-w-full">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${PACKAGE_COLORS[id]}`} />
                                <span className="truncate">{PACKAGE_NAMES[id]}</span>
                              </span>
                            ];
                          }

                          return matchingBookings.map((booking) => (
                            <span key={`${id}-${booking.id}`} className="text-xs px-3 py-1.5 font-bold bg-[#efeadd] text-[#5e5847] border border-[#e8e1cd] rounded-lg shadow-sm flex items-center gap-2 max-w-full">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${PACKAGE_COLORS[id]}`} />
                              <span className="truncate">
                                {PACKAGE_NAMES[id]} : {booking.firstName}
                              </span>
                            </span>
                          ));
                        })}
                      </div>
                    </div>
                  )}

                  {selectedDate.buffer.length > 0 && (
                    <div className="pt-4 border-t border-[#e8e1cd]">
                      <p className="text-[10px] font-black text-[#a89d80] uppercase tracking-widest mb-3">Turnaround / Gear Reset</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDate.buffer.map((id) => (
                          <span key={id} className="text-xs px-3 py-1.5 font-bold bg-transparent text-[#a89d80] border border-[#e8e1cd] rounded-lg flex items-center gap-2 max-w-full">
                            <span className={`w-2 h-2 rounded-full ${PACKAGE_COLORS[id]} opacity-30 shrink-0`} />
                            <span className="truncate">{PACKAGE_NAMES[id]} Clean Window</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDate.active.length === 0 && selectedDate.buffer.length === 0 && (
                    <div className="text-center py-6">
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
              <div className="hidden min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8caa8] bg-[#f9f3e3]/70 p-8 text-center md:flex">
                <span className="text-3xl mb-3 opacity-50">📅</span>
                <p className="text-[10px] font-black text-[#a89d80] uppercase tracking-[0.2em]">Logistics Inspector</p>
                <p className="mt-2 max-w-[210px] text-xs leading-relaxed text-[#877e68]">Select a date on the calendar to view current operational status.</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-bold text-[#5e5847] ring-1 ring-[#e8e1cd]">
                  <Info className="h-3.5 w-3.5 text-[#C6A969]" />
                  Booking dots match package colors
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {showPreviousMonthAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-sm rounded-2xl border-2 border-[#bfa363] bg-[#C6A969] p-4"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
          >
            <div className="rounded-xl border border-[#e2c8aa] bg-[#fff7ed] p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-[#C6A969]">
                <span className="text-2xl" aria-hidden="true">🔒</span>
              </div>
              <h3 className="mb-1 text-lg font-bold text-black">Passcode Required</h3>
              <p className="mb-6 text-xs text-gray-500">
                Enter the terminal key to view a previous month.
              </p>

              <form onSubmit={handlePreviousMonthUnlock} className="space-y-4">
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter passcode..."
                  value={passwordInput}
                  onChange={(event) => {
                    setPasswordInput(event.target.value);
                    setAuthError(false);
                  }}
                  className="w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-center font-mono text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C6A969]"
                />

                {authError && (
                  <p className="text-xs font-semibold text-rose-600">⚠️ Invalid passcode token.</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPreviousMonthAuth(false);
                      setPasswordInput('');
                      setAuthError(false);
                    }}
                    className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl border border-black bg-black py-3 text-xs font-bold text-white active:translate-y-0.5"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
