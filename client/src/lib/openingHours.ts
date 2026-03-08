// ============================================================
// BEZMASAJIDLA.CZ — Opening Hours Utility
// Parses Czech opening hours strings and determines open/closed status
// Shows "otevírá v ..." for closed restaurants
// ============================================================

/** Day names in Czech, indexed 0=Sunday..6=Saturday */
const DAY_NAMES = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
const DAY_FULL = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

/** Map Czech day abbreviations to JS day index (0=Sun) */
const DAY_MAP: Record<string, number> = {
  "Ne": 0, "Po": 1, "Út": 2, "St": 3, "Čt": 4, "Pá": 5, "So": 6,
};

interface TimeSlot {
  days: number[]; // JS day indices (0=Sun)
  open: number;   // minutes from midnight
  close: number;  // minutes from midnight
}

/** Parse time string "HH:MM" to minutes from midnight */
function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Expand day range "Po–Pá" to array of day indices */
function expandDayRange(range: string): number[] {
  range = range.trim();

  // Single day
  if (DAY_MAP[range] !== undefined) {
    return [DAY_MAP[range]];
  }

  // Range like "Po–Pá" or "Po-Pá"
  const parts = range.split(/[–\-]/);
  if (parts.length === 2) {
    const start = DAY_MAP[parts[0].trim()];
    const end = DAY_MAP[parts[1].trim()];
    if (start === undefined || end === undefined) return [];

    const days: number[] = [];
    let current = start;
    while (true) {
      days.push(current);
      if (current === end) break;
      current = current === 6 ? 0 : current + 1;
      // Safety: prevent infinite loop
      if (days.length > 7) break;
    }
    return days;
  }

  return [];
}

/** Parse Czech opening hours string into structured time slots */
function parseHours(hoursStr: string): TimeSlot[] {
  if (!hoursStr) return [];

  const slots: TimeSlot[] = [];

  // Split by comma: "Po–Pá 11:00–22:00, So–Ne 12:00–22:00"
  const segments = hoursStr.split(",").map(s => s.trim());

  for (const segment of segments) {
    // Match pattern: "DayRange HH:MM–HH:MM"
    const match = segment.match(/^(.+?)\s+(\d{1,2}:\d{2})\s*[–\-]\s*(\d{1,2}:\d{2})$/);
    if (!match) continue;

    const dayPart = match[1];
    const openTime = parseTime(match[2]);
    const closeTime = parseTime(match[3]);

    // Day part can have multiple ranges separated by "+"
    // But typically it's a single range like "Po–Pá" or "Po–Ne"
    const dayRanges = dayPart.split(/[,+]/).map(s => s.trim());
    const days: number[] = [];
    for (const dr of dayRanges) {
      days.push(...expandDayRange(dr));
    }

    if (days.length > 0) {
      slots.push({ days, open: openTime, close: closeTime });
    }
  }

  return slots;
}

export interface OpenStatus {
  isOpen: boolean;
  /** Human-readable status text */
  statusText: string;
  /** Minutes until next opening (for sorting closed restaurants) */
  minutesUntilOpen: number | null;
}

/** Get the current open/closed status of a restaurant */
export function getOpenStatus(hoursStr: string): OpenStatus {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const slots = parseHours(hoursStr);
  if (slots.length === 0) {
    return { isOpen: false, statusText: "Otevírací doba neuvedena", minutesUntilOpen: null };
  }

  // Check if currently open
  for (const slot of slots) {
    if (slot.days.includes(currentDay)) {
      if (currentMinutes >= slot.open && currentMinutes < slot.close) {
        const closesIn = slot.close - currentMinutes;
        const closeHour = Math.floor(slot.close / 60);
        const closeMin = slot.close % 60;
        const closeStr = `${closeHour}:${closeMin.toString().padStart(2, "0")}`;

        if (closesIn <= 60) {
          return {
            isOpen: true,
            statusText: `Otevřeno · zavírá v ${closeStr}`,
            minutesUntilOpen: 0,
          };
        }
        return {
          isOpen: true,
          statusText: `Otevřeno · do ${closeStr}`,
          minutesUntilOpen: 0,
        };
      }
    }
  }

  // Restaurant is closed — find next opening
  let bestMinutesUntil = Infinity;
  let bestDayName = "";
  let bestOpenTime = "";

  for (let offset = 0; offset < 7; offset++) {
    const checkDay = (currentDay + offset) % 7;

    for (const slot of slots) {
      if (!slot.days.includes(checkDay)) continue;

      let minutesUntil: number;
      if (offset === 0 && slot.open > currentMinutes) {
        // Later today
        minutesUntil = slot.open - currentMinutes;
      } else if (offset > 0) {
        // Future day
        minutesUntil = (offset * 24 * 60) - currentMinutes + slot.open;
      } else {
        // Already passed today
        continue;
      }

      if (minutesUntil < bestMinutesUntil) {
        bestMinutesUntil = minutesUntil;
        const openHour = Math.floor(slot.open / 60);
        const openMin = slot.open % 60;
        bestOpenTime = `${openHour}:${openMin.toString().padStart(2, "0")}`;

        if (offset === 0) {
          bestDayName = "dnes";
        } else if (offset === 1) {
          bestDayName = "zítra";
        } else {
          bestDayName = `v ${DAY_NAMES[checkDay]}`;
        }
      }
    }
  }

  if (bestMinutesUntil < Infinity) {
    return {
      isOpen: false,
      statusText: `Zavřeno · otevírá ${bestDayName} v ${bestOpenTime}`,
      minutesUntilOpen: bestMinutesUntil,
    };
  }

  return {
    isOpen: false,
    statusText: "Zavřeno",
    minutesUntilOpen: null,
  };
}

/** Sort restaurants by next opening time (soonest first) */
export function sortByNextOpening<T extends { hours: string }>(restaurants: T[]): T[] {
  return [...restaurants].sort((a, b) => {
    const statusA = getOpenStatus(a.hours);
    const statusB = getOpenStatus(b.hours);

    // Open restaurants first
    if (statusA.isOpen && !statusB.isOpen) return -1;
    if (!statusA.isOpen && statusB.isOpen) return 1;

    // Among closed, sort by soonest opening
    if (!statusA.isOpen && !statusB.isOpen) {
      const mA = statusA.minutesUntilOpen ?? Infinity;
      const mB = statusB.minutesUntilOpen ?? Infinity;
      return mA - mB;
    }

    return 0;
  });
}
