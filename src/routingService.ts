import { Hospital, Department, Doctor, Trip, TripDay, Visit } from './types';

// Precise coordinates for Białystok (Start and end point of every trip)
export const BIALYSTOK_COORDS = { lat: 53.1325, lng: 23.1688, city: 'Białystok' };

/**
 * Calculates the Haversine distance in kilometers between two coordinates.
 */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimates driving travel time in minutes based on Haversine distance.
 * Assumes average speed of 75 km/h + 20% routing overhead factor.
 */
export function estimateTravelTimeMinutes(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const distanceKm = haversineDistance(lat1, lng1, lat2, lng2);
  const hours = distanceKm / 75;
  const overheadHours = hours * 1.2;
  const mins = Math.round(overheadHours * 60);
  return mins < 10 && distanceKm > 1 ? 15 : mins; // minimum realistic travel time between different points
}

/**
 * Fetches the travel times matrix from OSRM table API.
 * Returns a matrix of travel times in minutes.
 * If API fails, falls back gracefully to Haversine estimations.
 */
export async function getTravelTimeMatrix(
  locations: { lat: number; lng: number }[]
): Promise<number[][]> {
  if (locations.length <= 1) return [[0]];
  
  try {
    const coordsString = locations.map(loc => `${loc.lng},${loc.lat}`).join(';');
    const url = `https://router.project-osrm.org/table/v1/driving/${coordsString}?annotations=duration`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM matrix status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && Array.isArray(data.durations)) {
      // OSRM returns duration in seconds, convert to minutes
      return data.durations.map((row: number[]) => 
        row.map(sec => Math.round(sec / 60))
      );
    }
    throw new Error('OSRM returned invalid durations format');
  } catch (error) {
    // Haversine fallback matrix calculation
    const matrix: number[][] = [];
    for (let i = 0; i < locations.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < locations.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else {
          matrix[i][j] = estimateTravelTimeMinutes(
            locations[i].lat,
            locations[i].lng,
            locations[j].lat,
            locations[j].lng
          );
        }
      }
    }
    return matrix;
  }
}

/**
 * Helper to get the department priority rating.
 * Order:
 * 1. Kardiochirurgia
 * 2. Neurochirurgia
 * 3. Chirurgia naczyniowa
 * 4. Torakochirurgia
 * 5. Urologia
 * 6. Chirurgia onkologiczna
 * 7. Pozostałe oddziały zabiegowe
 * 8. Blok Operacyjny
 * 9. Sterylizatornia
 * 10. Pozostałe
 */
export function getDepartmentPriority(name: string): number {
  const lower = name.toLowerCase();
  if (lower.includes('kardiochir') || lower.includes('cardio')) return 1;
  if (lower.includes('neurochir') || lower.includes('neuro')) return 2;
  if (lower.includes('naczyn') || lower.includes('vas')) return 3;
  if (lower.includes('torako') || lower.includes('klatki') || lower.includes('ths') || lower.includes('piers')) return 4;
  if (lower.includes('urol') || lower.includes('uro')) return 5;
  if (lower.includes('onkolog') || lower.includes('onko')) return 6;
  if (lower.includes('chir') || lower.includes('zabieg') || lower.includes('oper')) {
    if (lower.includes('blok oper') || lower.includes('operating block') || lower.includes('virtual_blok')) return 8;
    return 7; // other surgical
  }
  if (lower.includes('steryl') || lower.includes('steril') || lower.includes('virtual_steryliz')) return 9;
  return 10;
}

/**
 * Helper to get the department points based on business weight.
 */
export function getDepartmentPoints(name: string): number {
  const lower = name.toLowerCase();
  if (lower.includes('kardiochir') || lower.includes('cardio')) return 5;
  if (lower.includes('naczyn') || lower.includes('vas')) return 5;
  if (lower.includes('torako') || lower.includes('klatki') || lower.includes('ths') || lower.includes('piers')) return 5;
  if (lower.includes('urol') || lower.includes('uro')) return 5;
  if (lower.includes('neurochir') || lower.includes('neuro')) return 4;
  if (lower.includes('onkolog') || lower.includes('onko')) return 4;
  if (lower.includes('chirurgii ogólnej') || lower.includes('chirurgiczny ogólny') || lower.includes('chirurgia ogólna')) return 3;
  if (
    lower.includes('chir') ||
    lower.includes('ortoped') ||
    lower.includes('ginekolog') ||
    lower.includes('okulist') ||
    lower.includes('laryngolog') ||
    lower.includes('zabieg') ||
    lower.includes('oper')
  ) {
    if (lower.includes('blok oper') || lower.includes('operating block') || lower.includes('virtual_blok')) return 2;
    return 3;
  }
  if (lower.includes('steryl') || lower.includes('steril') || lower.includes('virtual_steryliz')) return 1;
  return 0;
}

/**
 * Calculates hospital segment strictly based on clinical departments count (excluding Blok and Sterylizatornia).
 */
export function getHospitalSegment(hospitalId: string, allDepts: Department[]): 'A' | 'B' | 'C' {
  const hospDepts = allDepts.filter(d => d.hospital_id === hospitalId);
  const clinicalDepts = hospDepts.filter(d => {
    const lower = d.name.toLowerCase();
    const isSpecial = lower.includes('blok oper') || lower.includes('operating block') || lower.includes('steryl') || lower.includes('steril') || lower.includes('virtual_blok') || lower.includes('virtual_steryl');
    return !isSpecial;
  });
  const count = clinicalDepts.length;
  if (count > 2) return 'A';
  if (count === 2) return 'B';
  return 'C';
}

/**
 * Calculates total hospital potential points.
 */
export function getHospitalPoints(hospitalId: string, allDepts: Department[]): number {
  const hospDepts = allDepts.filter(d => d.hospital_id === hospitalId);
  const clinicalDeptsPoints = hospDepts.reduce((sum, d) => sum + getDepartmentPoints(d.name), 0);
  
  const hasBlok = hospDepts.some(d => {
    const lower = d.name.toLowerCase();
    return lower.includes('blok oper') || lower.includes('operating block') || lower.includes('virtual_blok');
  });
  const hasSteryl = hospDepts.some(d => {
    const lower = d.name.toLowerCase();
    return lower.includes('steryl') || lower.includes('steril') || lower.includes('virtual_steryliz');
  });

  let extraPoints = 0;
  if (!hasBlok) extraPoints += 2;
  if (!hasSteryl) extraPoints += 1;

  return clinicalDeptsPoints + extraPoints;
}


/**
 * Core Algorithm - Generate optimized trip plan based on medical rep guidelines.
 * Respects:
 * - 08:00 - 16:00 work day (max 480 mins including travel, visits & buffers)
 * - 30 min visits + 10 min logistics buffer (40 min per visit total)
 * - Segment-based frequencies (A: once a month, B: once per 1.5 months, C: once per 3 months)
 * - Staggered week assignments to spread visits
 * - Min 6, Max 10 visits per day (unless travel limits reduce it, or multi-city caps it at 6)
 * - Overnight stays if travel time from Białystok > 2.5 hours (max 1 overnight trip in 3 weeks, max 3 days in a row)
 * - Sunday-to-Monday overnight for remote starts
 * - Fridays as office-only days in Białystok
 * - Priority-based sorting of departments
 */
export async function generateOptimizedTrips(
  selectedHospitalIds: string[],
  allHospitals: Hospital[],
  allDepartments: Department[],
  allDoctors: Doctor[],
  startTripDate?: string, // YYYY-MM-DD (optional)
  planningDuration: string = 'all'
): Promise<{
  trips: Trip[];
  tripDays: TripDay[];
  visits: Visit[];
}> {
  // 1. Filter and enrich selected hospitals with coordinates
  const selectedHospitals = allHospitals
    .filter(h => selectedHospitalIds.includes(h.id))
    .map(h => {
      const dynamicSeg = getHospitalSegment(h.id, allDepartments);
      return {
        ...h,
        segment: dynamicSeg,
        lat: h.lat ?? BIALYSTOK_COORDS.lat,
        lng: h.lng ?? BIALYSTOK_COORDS.lng,
      };
    });

  if (selectedHospitals.length === 0) {
    return { trips: [], tripDays: [], visits: [] };
  }

  // Local timezone safe date string helper (prevents date shifts)
  const getLocalDateString = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper to calculate travel matrix dynamically
  const getDynamicTravelTime = async (
    h1: { lat: number; lng: number; city?: string }, 
    h2: { lat: number; lng: number; city?: string }
  ): Promise<number> => {
    if (h1.city && h2.city && h1.city === h2.city) return 10; // Within same city is fast (e.g., transitions)
    const mat = await getTravelTimeMatrix([
      { lat: h1.lat, lng: h1.lng },
      { lat: h2.lat, lng: h2.lng }
    ]);
    return mat[0][1];
  };

  // 2. Compile base visits per hospital and ensure mandatory units (Blok, Sterylizatornia)
  const hospitalBaseVisits: Record<string, {
    department_id: string;
    department_name: string;
    department_type: string;
    doctor_id: string | null;
    doctor_name: string;
    is_fixed_slot: boolean;
  }[]> = {};

  selectedHospitals.forEach(hosp => {
    const visitsList: typeof hospitalBaseVisits[string] = [];
    const hospDepts = allDepartments.filter(d => d.hospital_id === hosp.id);

    // Check presence of Sterylizatornia and Blok Operacyjny
    const hasSterylizatornia = hospDepts.some(d => {
      const nameLower = d.name.toLowerCase();
      return nameLower.includes('steryl') || nameLower.includes('steril');
    });
    const hasBlok = hospDepts.some(d => {
      const nameLower = d.name.toLowerCase();
      return nameLower.includes('blok oper') || nameLower.includes('operating block') || nameLower.includes('blok_oper');
    });

    const finalDepts = [...hospDepts];
    if (!hasSterylizatornia) {
      finalDepts.push({
        id: `virtual_steryliz_${hosp.id}`,
        hospital_id: hosp.id,
        name: 'Sterylizatornia (Standard)',
        type: 'sterylizatornia',
        created_at: new Date().toISOString()
      });
    }
    if (!hasBlok) {
      finalDepts.push({
        id: `virtual_blok_${hosp.id}`,
        hospital_id: hosp.id,
        name: 'Blok Operacyjny (Standard)',
        type: 'blok_operacyjny',
        created_at: new Date().toISOString()
      });
    }

    finalDepts.forEach(d => {
      const nameLower = d.name.toLowerCase();
      const isFixed = nameLower.includes('steryl') || nameLower.includes('steril') || nameLower.includes('blok oper') || nameLower.includes('operating block') || nameLower.includes('virtual_blok') || nameLower.includes('virtual_steryl');
      
      const deptType = (nameLower.includes('steryl') || nameLower.includes('steril')) ? 'sterylizatornia' : (nameLower.includes('blok oper') || nameLower.includes('operating block') ? 'blok_operacyjny' : 'standard');

      const deptDoctors = allDoctors.filter(doc => doc.hospital_id === hosp.id && doc.department_id === d.id);
      if (deptDoctors.length > 0) {
        const doc = deptDoctors[0];
        visitsList.push({
          department_id: d.id,
          department_name: d.name,
          department_type: deptType,
          doctor_id: doc.id,
          doctor_name: `${doc.title ? doc.title + ' ' : ''}${doc.first_name} ${doc.last_name}`,
          is_fixed_slot: isFixed,
        });
      } else {
        visitsList.push({
          department_id: d.id,
          department_name: d.name,
          department_type: deptType,
          doctor_id: null,
          doctor_name: 'TBD',
          is_fixed_slot: isFixed,
        });
      }
    });

    // Prioritize visits based on department priorities
    visitsList.sort((a, b) => {
      const pA = getDepartmentPriority(a.department_name);
      const pB = getDepartmentPriority(b.department_name);
      return pA - pB;
    });

    hospitalBaseVisits[hosp.id] = visitsList;
  });

  // 3. Determine start base date: find nearest upcoming Monday (today if today is Monday)
  let baseStartStr = startTripDate;
  if (!baseStartStr) {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diff = day === 1 ? 0 : (day === 0 ? 1 : 8 - day);
    const target = new Date(today);
    target.setDate(today.getDate() + diff);
    baseStartStr = getLocalDateString(target);
  }

  const baseStartDate = new Date(baseStartStr);

  // Determine planning weeks length
  let numWeeks = 4; // default
  if (planningDuration === '1_week') numWeeks = 1;
  else if (planningDuration === '1_month') numWeeks = 4;
  else if (planningDuration === '1_quarter') numWeeks = 13;
  else if (planningDuration === 'half_year') numWeeks = 26;
  else if (planningDuration === 'all') numWeeks = 4;

  // Stagger hospitals across weeks using stable mathematical indices to avoid overcrowding
  const weekHospitalsMap: Record<number, typeof selectedHospitals> = {};
  for (let w = 0; w < numWeeks; w++) {
    weekHospitalsMap[w] = [];
  }

  if (numWeeks === 1) {
    selectedHospitals.forEach(hosp => weekHospitalsMap[0].push(hosp));
  } else {
    // Group by segment to stagger evenly
    const segA = selectedHospitals.filter(h => (h.segment || 'C') === 'A');
    const segB = selectedHospitals.filter(h => (h.segment || 'C') === 'B');
    const segC = selectedHospitals.filter(h => (h.segment || 'C') === 'C');

    segA.forEach((hosp, i) => {
      for (let w = 0; w < numWeeks; w++) {
        if ((w + i) % 4 === 0) weekHospitalsMap[w].push(hosp);
      }
    });

    segB.forEach((hosp, i) => {
      for (let w = 0; w < numWeeks; w++) {
        if ((w + i) % 6 === 0) weekHospitalsMap[w].push(hosp);
      }
    });

    segC.forEach((hosp, i) => {
      for (let w = 0; w < numWeeks; w++) {
        if ((w + i) % 12 === 0) weekHospitalsMap[w].push(hosp);
      }
    });

    // Supplement weeks that have fewer than 4 hospitals so all 4 field days (Mon-Thu) can have targets
    for (let w = 0; w < numWeeks; w++) {
      if (weekHospitalsMap[w].length < 4 && selectedHospitals.length > weekHospitalsMap[w].length) {
        const currentIds = new Set(weekHospitalsMap[w].map(h => h.id));
        const candidates = selectedHospitals.filter(h => !currentIds.has(h.id));
        candidates.sort((a, b) => {
          const segA = a.segment || 'C';
          const segB = b.segment || 'C';
          const order: Record<string, number> = { 'A': 1, 'B': 2, 'C': 3 };
          if (order[segA] !== order[segB]) return order[segA] - order[segB];
          return getHospitalPoints(b.id, allDepartments) - getHospitalPoints(a.id, allDepartments);
        });
        for (const cand of candidates) {
          if (weekHospitalsMap[w].length >= 4) break;
          weekHospitalsMap[w].push(cand);
        }
      }
    }
  }

  const generatedTrips: Trip[] = [];
  const generatedTripDays: TripDay[] = [];
  const generatedVisits: Visit[] = [];

  // Track weeks that have overnights to ensure maximum 1 overnight trip per 3 weeks
  const overnightWeeks: number[] = [];

  // 4. Generate plan week-by-week
  for (let w = 0; w < numWeeks; w++) {
    const weekStartDate = new Date(baseStartDate);
    weekStartDate.setDate(baseStartDate.getDate() + w * 7);

    // Get due hospitals for this week
    const weekHospitals = [...(weekHospitalsMap[w] || [])];

    // Sort by segment priority (A -> B -> C) then by total potential points descending
    weekHospitals.sort((a, b) => {
      const segA = a.segment || 'C';
      const segB = b.segment || 'C';
      const order: Record<string, number> = { 'A': 1, 'B': 2, 'C': 3 };
      if (order[segA] !== order[segB]) {
        return order[segA] - order[segB];
      }
      const ptsA = getHospitalPoints(a.id, allDepartments);
      const ptsB = getHospitalPoints(b.id, allDepartments);
      return ptsB - ptsA;
    });

    const weekTripId = `trip_${w + 1}_${Date.now()}`;
    const daysList: TripDay[] = [];
    const visitsList: Visit[] = [];

    // Track unvisited hospitals for this week's report
    const unplannedHospitals: { name: string; reason: string }[] = [];

    // Determine if we can do overnights in this week (no overnights in last 2 weeks)
    const canDoOvernightThisWeek = !overnightWeeks.includes(w - 1) && !overnightWeeks.includes(w - 2);

    // Separate due hospitals into local vs. remote
    // Remote is travel time from Bialystok > 150 mins
    const localHospitals: typeof selectedHospitals = [];
    const remoteHospitals: typeof selectedHospitals = [];

    for (const h of weekHospitals) {
      const driveTime = await getDynamicTravelTime(BIALYSTOK_COORDS, h);
      if (driveTime > 150) {
        remoteHospitals.push(h);
      } else {
        localHospitals.push(h);
      }
    }

    let isOvernightWeek = false;
    if (remoteHospitals.length > 0) {
      if (canDoOvernightThisWeek) {
        isOvernightWeek = true;
        overnightWeeks.push(w);
      } else {
        // Log remote hospitals as unplanned because overnight limit is reached
        remoteHospitals.forEach(h => {
          unplannedHospitals.push({
            name: h.name,
            reason: 'Szpital oddalony o ponad 2.5h drogi w tygodniu, w którym wygasł limit noclegów (max raz na 3 tygodnie).'
          });
        });
      }
    }

    // Prepare active pools of hospitals to schedule
    const hospitalsToSchedule = isOvernightWeek 
      ? [...remoteHospitals, ...localHospitals] 
      : [...localHospitals];

    // Generate Monday-Thursday field days
    // We start and end based on travel positions
    const activeOvernightLocs: (string | null)[] = [null, null, null, null]; // Mon, Tue, Wed, Thu
    let overnightSundayLoc: string | null = null;

    // Check Sunday-Monday overnight requirement
    if (isOvernightWeek && remoteHospitals.length > 0) {
      const firstRemote = remoteHospitals[0];
      const driveTime = await getDynamicTravelTime(BIALYSTOK_COORDS, firstRemote);
      if (driveTime > 150) {
        overnightSundayLoc = firstRemote.city;
      }
    }

    // Plan each field day Mon-Thu (dayIndex 0 to 3)
    for (let d = 0; d < 4; d++) {
      const dayDate = new Date(weekStartDate);
      dayDate.setDate(weekStartDate.getDate() + d);
      const dayDateStr = getLocalDateString(dayDate);
      const dayId = `tripday_${weekTripId}_day_${d + 1}_${Date.now()}`;

      // 1. Identify starting location
      // If we stayed overnight yesterday, start locally. Otherwise, start in Białystok.
      let currentLoc: { lat: number; lng: number; city: string } = BIALYSTOK_COORDS;
      if (d > 0 && activeOvernightLocs[d - 1]) {
        // Find coordinate of the last visited hospital to stay in that city
        const lastOvernightCity = activeOvernightLocs[d - 1]!;
        const hospInCity = selectedHospitals.find(sh => sh.city === lastOvernightCity);
        currentLoc = hospInCity ? { lat: hospInCity.lat!, lng: hospInCity.lng!, city: lastOvernightCity } : BIALYSTOK_COORDS;
      } else if (d === 0 && overnightSundayLoc) {
        const hospInCity = selectedHospitals.find(sh => sh.city === overnightSundayLoc);
        currentLoc = hospInCity ? { lat: hospInCity.lat!, lng: hospInCity.lng!, city: overnightSundayLoc! } : BIALYSTOK_COORDS;
      }

      // 2. Select a seed hospital for today
      // Prefer hospitals in current city if starting from overnight hotel
      let seedIndex = -1;
      if (currentLoc.city !== 'Białystok') {
        seedIndex = hospitalsToSchedule.findIndex(h => h.city === currentLoc.city);
      }
      if (seedIndex === -1) {
        seedIndex = hospitalsToSchedule.findIndex(h => h.id !== ''); // pick next highest priority
      }

      if (seedIndex === -1 && selectedHospitals.length > 0) {
        // Fallback: check if there are selected hospitals not yet scheduled in this week
        const scheduledHospIdsInWeek = new Set(visitsList.map(v => v.hospital_id));
        const unscheduledHosp = selectedHospitals.find(sh => !scheduledHospIdsInWeek.has(sh.id));
        if (unscheduledHosp) {
          hospitalsToSchedule.push(unscheduledHosp);
          seedIndex = hospitalsToSchedule.length - 1;
        }
      }

      if (seedIndex === -1) {
        // No hospitals to schedule left for today, fill with local Białystok or skip
        daysList.push({
          id: dayId,
          trip_id: weekTripId,
          date: dayDateStr,
          overnight_location: null,
          overnight_sunday_location: d === 0 ? overnightSundayLoc : null,
          order: d + 1,
        });
        continue;
      }

      const seedHosp = hospitalsToSchedule.splice(seedIndex, 1)[0];
      const todayHospitals = [seedHosp];
      
      // Calculate how many visits we can pack
      const seedVisits = hospitalBaseVisits[seedHosp.id] || [];
      let totalVisitsPlanned = seedVisits.length;

      // 3. Check if we need to join another hospital
      // Criteria: seed visits < 6, seed hospital is not a large hospital (>= 6 clinical depts), and there are more hospitals left than remaining field days
      const seedClinicalCount = allDepartments.filter(d => d.hospital_id === seedHosp.id).filter(d => {
        const lower = d.name.toLowerCase();
        return !lower.includes('blok oper') && !lower.includes('operating block') && !lower.includes('steryl') && !lower.includes('steril') && !lower.includes('virtual_blok') && !lower.includes('virtual_steryl');
      }).length;
      const isLargeHospital = seedClinicalCount >= 6;

      const remainingFieldDays = 3 - d; // remaining days in week after today
      if (!isLargeHospital && totalVisitsPlanned < 6 && hospitalsToSchedule.length > remainingFieldDays) {
        // Find geographically closest hospital by travel time from seed
        let closestIdx = -1;
        let minDriveTime = Infinity;

        for (let i = 0; i < hospitalsToSchedule.length; i++) {
          const driveTime = await getDynamicTravelTime(seedHosp, hospitalsToSchedule[i]);
          if (driveTime < minDriveTime) {
            minDriveTime = driveTime;
            closestIdx = i;
          }
        }

        if (closestIdx !== -1) {
          const closestHosp = hospitalsToSchedule[closestIdx];
          const combinedVisits = totalVisitsPlanned + (hospitalBaseVisits[closestHosp.id] || []).length;
          
          // Verify if joining is feasible within work hours
          const driveStartToH1 = await getDynamicTravelTime(currentLoc, seedHosp);
          const driveH1ToH2 = await getDynamicTravelTime(seedHosp, closestHosp);
          
          // Determine overnight stay for today to find return drive end
          let driveEnd = 0;
          let willStayOvernight = false;
          if (isOvernightWeek && d < 2) { // Monday & Tuesday stays overnight in remote city
            const driveBialystokToH1 = await getDynamicTravelTime(BIALYSTOK_COORDS, seedHosp);
            if (driveBialystokToH1 > 150) {
              willStayOvernight = true;
            }
          }

          if (willStayOvernight) {
            driveEnd = 10; // 10 minutes local drive to hotel
          } else {
            driveEnd = await getDynamicTravelTime(closestHosp, BIALYSTOK_COORDS);
          }

          const multiCityCap = 6; // strictly limited to 6 if multi-city
          const visitsToPlan = Math.min(combinedVisits, multiCityCap);
          const totalTimeMinutes = driveStartToH1 + (visitsToPlan * 40) + driveH1ToH2 + driveEnd;

          if (totalTimeMinutes <= 480) {
            // Join successful!
            hospitalsToSchedule.splice(closestIdx, 1);
            todayHospitals.push(closestHosp);
            totalVisitsPlanned = combinedVisits;
          }
        }
      }

      // 4. Decide overnight stay for today
      let todayOvernightLoc: string | null = null;
      if (isOvernightWeek && d < 2) { // Mon, Tue can stay overnight. Wed must return. Thu starts and ends local.
        const driveBialystokToH1 = await getDynamicTravelTime(BIALYSTOK_COORDS, seedHosp);
        if (driveBialystokToH1 > 150) {
          todayOvernightLoc = seedHosp.city;
          activeOvernightLocs[d] = seedHosp.city;
        }
      }

      // 5. Conduct actual scheduling of visits with precise times
      const dayVisitsList: Array<{
        hospital_id: string;
        department_id: string;
        department_name: string;
        department_type: string;
        doctor_id: string | null;
        doctor_name: string;
        is_fixed_slot: boolean;
      }> = [];
      todayHospitals.forEach(hosp => {
        const hVisits = hospitalBaseVisits[hosp.id] || [];
        hVisits.forEach(v => {
          dayVisitsList.push({
            hospital_id: hosp.id,
            ...v
          });
        });
      });

      // Clamp visits based on hours and rules
      const isMultiCity = todayHospitals.length > 1;
      const visitCap = isMultiCity ? 6 : 10;
      
      // Simulate real timeline starting at 08:00 (0 mins)
      let timePointer = 0; // minutes from 08:00
      let scheduledVisitsCount = 0;

      const finalizedDayVisits: typeof dayVisitsList = [];

      for (let i = 0; i < dayVisitsList.length; i++) {
        if (scheduledVisitsCount >= visitCap) break;

        const currentVisit = dayVisitsList[i];
        const currentHosp = todayHospitals.find(h => h.id === currentVisit.hospital_id)!;

        // Check time feasibility
        // Drive to first hospital if first visit of first hospital
        let segmentDrive = 0;
        if (scheduledVisitsCount === 0) {
          segmentDrive = await getDynamicTravelTime(currentLoc, currentHosp);
        } else {
          const prevVisit = finalizedDayVisits[finalizedDayVisits.length - 1];
          if (prevVisit.hospital_id !== currentVisit.hospital_id) {
            // we transitioned hospital
            const prevHosp = todayHospitals.find(h => h.id === prevVisit.hospital_id)!;
            segmentDrive = await getDynamicTravelTime(prevHosp, currentHosp);
          }
        }

        // Return drive to end location after this visit
        let returnDrive = 0;
        if (todayOvernightLoc) {
          returnDrive = 10; // local hotel
        } else {
          returnDrive = await getDynamicTravelTime(currentHosp, BIALYSTOK_COORDS);
        }

        const costOfThisVisit = 40; // 30 min standard visit + 10 min buffer
        const simulatedTimeWithVisit = timePointer + segmentDrive + costOfThisVisit + returnDrive;

        if (simulatedTimeWithVisit <= 480) {
          // It fits! Schedule it
          timePointer += segmentDrive;
          
          // Format slot
          const startHours = 8 + Math.floor(timePointer / 60);
          const startMins = Math.round(timePointer % 60);
          const timeSlot = `${startHours.toString().padStart(2, '0')}:${startMins.toString().padStart(2, '0')}`;

          visitsList.push({
            id: `visit_${currentVisit.hospital_id}_${currentVisit.department_id}_${currentVisit.doctor_id || 'tbd'}_${Date.now()}_${w}_${d}_${scheduledVisitsCount}`,
            trip_day_id: dayId,
            hospital_id: currentVisit.hospital_id,
            department_id: currentVisit.department_id,
            doctor_id: currentVisit.doctor_id,
            is_fixed_slot: currentVisit.is_fixed_slot,
            time_slot: timeSlot,
          });

          finalizedDayVisits.push(currentVisit);
          timePointer += costOfThisVisit;
          scheduledVisitsCount++;
        } else {
          // If a visit doesn't fit, subsequent visits won't fit either. Log unvisited departments.
          unplannedHospitals.push({
            name: `${currentHosp.name} - ${currentVisit.department_name}`,
            reason: 'Brak wolnego czasu pracy w godzinach 08:00 - 16:00 z powodu długiego dojazdu.'
          });
        }
      }

      // Add to day list
      daysList.push({
        id: dayId,
        trip_id: weekTripId,
        date: dayDateStr,
        overnight_location: todayOvernightLoc,
        overnight_sunday_location: d === 0 ? overnightSundayLoc : null,
        order: d + 1,
      });
    }

    // 5. Add Friday as an Office Day (Białystok)
    const fridayDate = new Date(weekStartDate);
    fridayDate.setDate(weekStartDate.getDate() + 4);
    const fridayDateStr = getLocalDateString(fridayDate);
    const fridayId = `tripday_${weekTripId}_day_5_${Date.now()}`;

    daysList.push({
      id: fridayId,
      trip_id: weekTripId,
      date: fridayDateStr,
      overnight_location: null,
      overnight_sunday_location: null,
      order: 5,
    });

    // Save remaining unscheduled hospitals of the week as unplanned
    hospitalsToSchedule.forEach(h => {
      unplannedHospitals.push({
        name: h.name,
        reason: 'Ograniczenia logistyczne - nie zmieścił się w 4 terenowych dniach roboczych tygodnia.'
      });
    });

    // 6. Push finalized trip
    if (daysList.length > 0) {
      // Cast trip to save metadata inline
      const tripObj = {
        id: weekTripId,
        start_date: daysList[0].date,
        end_date: daysList[daysList.length - 1].date,
        status: 'draft',
        created_at: new Date().toISOString(),
        unplanned_hospitals: unplannedHospitals // saved metadata for report!
      } as any;

      generatedTrips.push(tripObj);
      generatedTripDays.push(...daysList);
      generatedVisits.push(...visitsList);
    }
  }

  return {
    trips: generatedTrips,
    tripDays: generatedTripDays,
    visits: generatedVisits,
  };
}
