import { SeedReport } from '../seedData';

export const SEED_REPORTS_BATCH_3: SeedReport[] = [
  // ==================== EŁK PRO-MEDICA ====================
  {
    id: 'elk_pm_1',
    submit_date: '2026-06-01T10:00:00',
    status: 'accepted',
    hospital_name: '"PRO-MEDICA" W EŁKU SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'General surgery',
    doctor_name: 'Paweł Kucharski',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-01T09:00:00',
    meeting_end: '2026-06-01T09:30:00',
    notes: 'Admitted potential cases for Biosis biological mesh.',
    topics: [
      { title: 'Biosis', comment: 'Admitted potential cases for Biosis biological mesh.', next_steps: 'Talk with the Chief about a team PPP' }
    ],
    tasks: [
      { description: 'Talk with General Surgery Chief about a team PPP for Biosis', due_date: '2026-06-15', is_done: false }
    ]
  },
  {
    id: 'elk_pm_2',
    submit_date: '2026-06-01T11:00:00',
    status: 'accepted',
    hospital_name: '"PRO-MEDICA" W EŁKU SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'General surgery',
    doctor_name: 'Tomasz Lewandowski',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-01T10:30:00',
    meeting_end: '2026-06-01T11:00:00',
    notes: 'Follow up on Scanlan instruments.',
    topics: [
      { title: 'Scanlan', comment: 'Follow up on Scanlan instruments.' }
    ],
    tasks: []
  },
  {
    id: 'elk_pm_3',
    submit_date: '2026-06-01T12:00:00',
    status: 'accepted',
    hospital_name: '"PRO-MEDICA" W EŁKU SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'Operation room',
    doctor_name: 'Bogumił Porębny',
    doctor_title: 'dr',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-01T11:30:00',
    meeting_end: '2026-06-01T12:00:00',
    notes: 'Admitted Surg-I-Band could work but requires STE consultation.',
    topics: [
      { title: 'Scanlan SU', comment: 'Admitted Surg-I-Band could work but requires STE consultation.', next_steps: 'Follow up' }
    ],
    tasks: [
      { description: 'Follow up with STE regarding Surg-I-Band', due_date: '2026-06-18', is_done: false }
    ]
  },
  {
    id: 'elk_pm_4',
    submit_date: '2026-06-01T13:00:00',
    status: 'accepted',
    hospital_name: '"PRO-MEDICA" W EŁKU SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'Sterilization department',
    doctor_name: 'Halina Baran',
    doctor_title: 'plg',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-01T12:30:00',
    meeting_end: '2026-06-01T13:00:00',
    notes: 'Interested in Surg-I-Band and plastic trays.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in Surg-I-Band and plastic trays.', next_steps: 'Send offer; arrange a PPP' }
    ],
    tasks: [
      { description: 'Send offer and arrange a PPP for Surg-I-Band and plastic trays with plg Halina Baran', due_date: '2026-06-10', is_done: true }
    ]
  },

  // ==================== EŁK 118 MILITARY ====================
  {
    id: 'elk_118_1',
    submit_date: '2026-06-02T10:00:00',
    status: 'accepted',
    hospital_name: '118 SZPITAL WOJSKOWY Z PRZYCHODNIĄ SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W EŁKU',
    department_name: 'Neuro surgery',
    doctor_name: 'Michał Woźnica',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-02T09:00:00',
    meeting_end: '2026-06-02T09:30:00',
    notes: 'Demonstrated Orascoptic loupes/lights and TisgenX patches.',
    topics: [
      { title: 'Orascoptic', comment: 'Demonstrated Orascoptic loupes/lights.', next_steps: 'Follow up' },
      { title: 'TisgenX', comment: 'Demonstrated TisgenX patches.', next_steps: 'Follow up' }
    ],
    tasks: [
      { description: 'Follow up with dr Michał Woźnica regarding loupes and TisgenX', due_date: '2026-06-16', is_done: false }
    ]
  },
  {
    id: 'elk_118_2',
    submit_date: '2026-06-02T11:00:00',
    status: 'accepted',
    hospital_name: '118 SZPITAL WOJSKOWY Z PRZYCHODNIĄ SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W EŁKU',
    department_name: 'Vascular surgery',
    doctor_name: 'Marcin Osęka',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-02T10:30:00',
    meeting_end: '2026-06-02T11:00:00',
    notes: 'Scanlan instruments and TisgenX presented.',
    topics: [
      { title: 'Scanlan', comment: 'Presented Scanlan instruments.', next_steps: 'Arrange a post-vacation Scanlan PPP' },
      { title: 'TisgenX', comment: 'Presented TisgenX patches.' }
    ],
    tasks: [
      { description: 'Arrange a post-vacation Scanlan PPP in Vascular Surgery', due_date: '2026-09-08', is_done: false }
    ]
  },
  {
    id: 'elk_118_3',
    submit_date: '2026-06-02T12:00:00',
    status: 'accepted',
    hospital_name: '118 SZPITAL WOJSKOWY Z PRZYCHODNIĄ SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W EŁKU',
    department_name: 'General surgery',
    doctor_name: 'Magdalena Podlecka',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-02T11:30:00',
    meeting_end: '2026-06-02T12:00:00',
    notes: 'Interested in Scanlan and SternFix.',
    topics: [
      { title: 'Scanlan', comment: 'Interested in Scanlan instruments.', next_steps: 'Arrange post-vacation presentations' },
      { title: 'Neos Sternfix', comment: 'Interested in SternFix system.', next_steps: 'Arrange post-vacation presentations' }
    ],
    tasks: [
      { description: 'Arrange post-vacation presentations for Scanlan and SternFix', due_date: '2026-09-12', is_done: false }
    ]
  },
  {
    id: 'elk_118_4',
    submit_date: '2026-06-02T13:00:00',
    status: 'accepted',
    hospital_name: '118 SZPITAL WOJSKOWY Z PRZYCHODNIĄ SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W EŁKU',
    department_name: 'Oncology',
    doctor_name: 'Krzysztof Wróbel',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-02T12:30:00',
    meeting_end: '2026-06-02T13:00:00',
    notes: 'Agreed Biosis patches and Scanlan instruments have ward applications.',
    topics: [
      { title: 'Biosis', comment: 'Agreed Biosis patches have ward applications.', next_steps: 'Arrange a PPP for both Biosis and Scanlan' },
      { title: 'Scanlan', comment: 'Agreed Scanlan instruments have ward applications.', next_steps: 'Arrange a PPP for both Biosis and Scanlan' }
    ],
    tasks: [
      { description: 'Arrange a PPP for both Biosis and Scanlan in Oncology', due_date: '2026-09-15', is_done: false }
    ]
  },
  {
    id: 'elk_118_5',
    submit_date: '2026-06-02T14:00:00',
    status: 'accepted',
    hospital_name: '118 SZPITAL WOJSKOWY Z PRZYCHODNIĄ SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W EŁKU',
    department_name: 'Operation room',
    doctor_name: 'Joanna Sobocińska-Abdo',
    doctor_title: 'plg',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-02T13:30:00',
    meeting_end: '2026-06-02T14:00:00',
    notes: 'Agreed to send SSU quote to STE.',
    topics: [
      { title: 'Scanlan SU', comment: 'Agreed to send SSU quote to STE.', next_steps: 'Send offer to STE' }
    ],
    tasks: [
      { description: 'Send Scanlan Single-Use offer to Sterilization department', due_date: '2026-06-10', is_done: true }
    ]
  },
  {
    id: 'elk_118_6',
    submit_date: '2026-06-02T15:00:00',
    status: 'accepted',
    hospital_name: '118 SZPITAL WOJSKOWY Z PRZYCHODNIĄ SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W EŁKU',
    department_name: 'Sterilization department',
    doctor_name: 'Justyna Zielińska',
    doctor_title: 'plg',
    doctor_position: 'HN',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-02T14:30:00',
    meeting_end: '2026-06-02T15:00:00',
    notes: 'Most interested in EasyTag and TipGuard.',
    topics: [
      { title: 'Scanlan SU', comment: 'Most interested in EasyTag and TipGuard.', next_steps: 'Send SSU offer and prepare Sept/Oct tender' }
    ],
    tasks: [
      { description: 'Send SSU offer and prepare Sept/Oct tender with plg Justyna Zielińska', due_date: '2026-06-12', is_done: true }
    ]
  },

  // ==================== GDAŃSK UCK ====================
  {
    id: 'gd_uck_1',
    submit_date: '2026-06-05T10:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Cardiac surgery',
    doctor_name: 'Rafał Pawlaczyk',
    doctor_title: 'dr hab. med.',
    doctor_position: 'Vice Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-05T09:00:00',
    meeting_end: '2026-06-05T09:30:00',
    notes: 'Interested in 3.5x loupes and resident discounts.',
    topics: [
      { title: 'Orascoptic', comment: 'Interested in 3.5x loupes and resident discounts.', next_steps: 'Send offer' },
      { title: 'Neos Sternfix', comment: 'Discussed SternFix team demonstration.', next_steps: 'Repeat SternFix team demo' }
    ],
    tasks: [
      { description: 'Send offer for 3.5x loupes with resident discounts', due_date: '2026-06-15', is_done: true },
      { description: 'Repeat SternFix team demonstration in UCK Gdańsk Cardiac Surgery', due_date: '2026-06-25', is_done: false }
    ]
  },
  {
    id: 'gd_uck_2',
    submit_date: '2026-06-05T11:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Cardiac surgery',
    doctor_name: 'Dariusz Jagielak',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-05T10:30:00',
    meeting_end: '2026-06-05T11:00:00',
    notes: 'Preferred 3.0x magnification for depth of field.',
    topics: [
      { title: 'Orascoptic', comment: 'Preferred 3.0x magnification for depth of field.', next_steps: 'Follow-up visit with 3.0x loupes is required' }
    ],
    tasks: [
      { description: 'Conduct follow-up visit with 3.0x loupes for dr Jagielak', due_date: '2026-06-22', is_done: false }
    ]
  },
  {
    id: 'gd_uck_3',
    submit_date: '2026-06-05T12:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Thoracic surgery',
    doctor_name: 'Żurek',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-05T11:30:00',
    meeting_end: '2026-06-05T12:00:00',
    notes: 'Eager to see Scanlan robotic Bulldog clamps.',
    topics: [
      { title: 'Scanlan', comment: 'Eager to see Scanlan robotic Bulldog clamps.', next_steps: 'Appointment for testing; follow up with Prof. Rzyman and dr Sternau' }
    ],
    tasks: [
      { description: 'Arrange testing appointment for Scanlan robotic Bulldog clamps with dr Żurek, Prof. Rzyman, and dr Sternau', due_date: '2026-06-28', is_done: false }
    ]
  },
  {
    id: 'gd_uck_4',
    submit_date: '2026-06-05T13:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Sterilization department',
    doctor_name: 'Andrzej Tomasik',
    doctor_title: 'mgr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-05T12:30:00',
    meeting_end: '2026-06-05T13:00:00',
    notes: 'Conducted training on Genesee and Scanturian.',
    topics: [
      { title: 'Scanlan SU', comment: 'Conducted training on Genesee and Scanturian.' }
    ],
    tasks: []
  },
  {
    id: 'gd_uck_5',
    submit_date: '2026-06-05T14:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Operation room',
    doctor_name: 'Ewa Główczewska',
    doctor_title: 'mgr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-05T13:30:00',
    meeting_end: '2026-06-05T14:00:00',
    notes: 'Conducted Genesee and Scanturian training.',
    topics: [
      { title: 'Scanlan SU', comment: 'Conducted Genesee and Scanturian training.' }
    ],
    tasks: []
  },
  {
    id: 'gd_uck_6',
    submit_date: '2026-06-05T15:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Administration',
    doctor_name: 'Daniel Dywelski',
    doctor_title: 'mgr',
    doctor_position: 'Specjalista',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-05T14:30:00',
    meeting_end: '2026-06-05T15:00:00',
    notes: 'Agreed on invoice criteria.',
    topics: [
      { title: 'General', comment: 'Agreed on invoice criteria.', next_steps: 'Remain in touch for upcoming tenders' }
    ],
    tasks: [
      { description: 'Remain in touch for upcoming tenders with mgr Daniel Dywelski', due_date: '2026-07-01', is_done: false }
    ]
  },

  // ==================== GIŻYCKO ====================
  {
    id: 'giz_1',
    submit_date: '2026-06-08T10:00:00',
    status: 'accepted',
    hospital_name: 'GIŻYCKA OCHRONA ZDROWIA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'Urology',
    doctor_name: 'Viachaslau Sots',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-08T09:00:00',
    meeting_end: '2026-06-08T09:30:00',
    notes: 'Interested in Allium and BlueNeem portfolios.',
    topics: [
      { title: 'Allium', comment: 'Interested in Allium portfolio.', next_steps: 'Arrange September PPP and send refund info to dr Karczewski' },
      { title: 'BlueNeem', comment: 'Interested in BlueNeem portfolio.', next_steps: 'Arrange September PPP' }
    ],
    tasks: [
      { description: 'Arrange September PPP for Allium and BlueNeem in Giżycko Urology', due_date: '2026-09-05', is_done: false },
      { description: 'Send Allium refund information to dr Marek Karczewski', due_date: '2026-06-18', is_done: true }
    ]
  },
  {
    id: 'giz_2',
    submit_date: '2026-06-08T11:00:00',
    status: 'accepted',
    hospital_name: 'GIŻYCKA OCHRONA ZDROWIA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'General surgery',
    doctor_name: 'Jolanta Osieczko-Czyż',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-08T10:30:00',
    meeting_end: '2026-06-08T11:00:00',
    notes: 'Identified potential for patient-specific Biosis matrix orders.',
    topics: [
      { title: 'Biosis', comment: 'Identified potential for patient-specific Biosis matrix orders.', next_steps: 'Talk with OR HN' }
    ],
    tasks: [
      { description: 'Talk with OR Head Nurse regarding patient-specific Biosis matrix orders', due_date: '2026-06-20', is_done: false }
    ]
  },
  {
    id: 'giz_3',
    submit_date: '2026-06-08T12:00:00',
    status: 'accepted',
    hospital_name: 'GIŻYCKA OCHRONA ZDROWIA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'Operation room',
    doctor_name: 'Małgorzata Dziedzic',
    doctor_title: 'plg',
    doctor_position: 'HN',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-08T11:30:00',
    meeting_end: '2026-06-08T12:00:00',
    notes: 'Requested EasyTag and Biosis offers; suggested dr Rafał Winiarczyk for loupe/TisgenX.',
    topics: [
      { title: 'Scanlan SU', comment: 'Requested EasyTag offer.', next_steps: 'Send offers' },
      { title: 'Biosis', comment: 'Requested Biosis offer.', next_steps: 'Send offers' },
      { title: 'Orascoptic', comment: 'Suggested dr Rafał Winiarczyk for loupe/TisgenX presentation.', next_steps: 'Arrange Orthopedics meeting with dr Winiarczyk' }
    ],
    tasks: [
      { description: 'Send offers for EasyTag and Biosis to plg Małgorzata Dziedzic', due_date: '2026-06-15', is_done: true },
      { description: 'Arrange Orthopedics meeting with dr Rafał Winiarczyk for loupes and TisgenX', due_date: '2026-06-25', is_done: false }
    ]
  },
  {
    id: 'giz_4',
    submit_date: '2026-06-08T13:00:00',
    status: 'accepted',
    hospital_name: 'GIŻYCKA OCHRONA ZDROWIA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
    department_name: 'Sterilization department',
    doctor_name: 'Artur Maśliński',
    doctor_title: 'plg',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-08T12:30:00',
    meeting_end: '2026-06-08T13:00:00',
    notes: 'Great interest in Surg-I-Band and TipGuard.',
    topics: [
      { title: 'Scanlan SU', comment: 'Great interest in Surg-I-Band and TipGuard.', next_steps: 'Send SSU offer' }
    ],
    tasks: [
      { description: 'Send SSU offer for Surg-I-Band and TipGuard to plg Artur Maśliński', due_date: '2026-06-16', is_done: true }
    ]
  },

  // ==================== GRAJEWO ====================
  {
    id: 'gra_1',
    submit_date: '2026-06-10T10:00:00',
    status: 'accepted',
    hospital_name: 'SZPITAL OGÓLNY IM. DR WITOLDA GINELA W GRAJEWIE',
    department_name: 'General surgery',
    doctor_name: 'Antoni Czaczkowski',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-10T09:00:00',
    meeting_end: '2026-06-10T09:30:00',
    notes: 'Requested a Biosis offer for contaminated field indications.',
    topics: [
      { title: 'Biosis', comment: 'Requested a Biosis offer for contaminated field indications.', next_steps: 'Send Biosis offer' }
    ],
    tasks: [
      { description: 'Send Biosis offer for contaminated field indications to dr Czaczkowski', due_date: '2026-06-18', is_done: true }
    ]
  },

  // ==================== HAJNÓWKA ====================
  {
    id: 'haj_1',
    submit_date: '2026-06-12T10:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W HAJNÓWCE',
    department_name: 'Sterilization department',
    doctor_name: 'Ewa Kuszczuk',
    doctor_title: 'plg',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-12T09:00:00',
    meeting_end: '2026-06-12T09:30:00',
    notes: 'Interested in SurgiBand and TipGuard.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in SurgiBand and TipGuard.', next_steps: 'Send offer and sterility documentation for accreditation' }
    ],
    tasks: [
      { description: 'Send offer and sterility documentation for accreditation to plg Ewa Kuszczuk', due_date: '2026-06-20', is_done: true }
    ]
  },
  {
    id: 'haj_2',
    submit_date: '2026-06-12T11:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W HAJNÓWCE',
    department_name: 'Operation room',
    doctor_name: 'Lidia Szeszel',
    doctor_title: 'mgr',
    doctor_position: 'Head',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-12T10:30:00',
    meeting_end: '2026-06-12T11:00:00',
    notes: 'Confirmed SU items are handled by STE.',
    topics: [
      { title: 'Scanlan SU', comment: 'Confirmed SU items are handled by STE.' }
    ],
    tasks: []
  },
  {
    id: 'haj_3',
    submit_date: '2026-06-12T12:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W HAJNÓWCE',
    department_name: 'General surgery',
    doctor_name: 'Tomasz Sadowski',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-06-12T11:30:00',
    meeting_end: '2026-06-12T12:00:00',
    notes: 'Ward focus is laparoscopy; open surgery rare.',
    topics: [
      { title: 'Scanlan', comment: 'Ward focus is laparoscopy; open surgery rare.', next_steps: 'Follow up with dr Czapko on Wednesdays' }
    ],
    tasks: [
      { description: 'Follow up with dr Czapko on Wednesdays regarding laparoscopic instrument line', due_date: '2026-06-24', is_done: false }
    ]
  }
];
