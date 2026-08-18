import { SeedReport } from '../seedData';

export const SEED_REPORTS_BATCH_1: SeedReport[] = [
  // ==================== AUGUSTÓW ====================
  {
    id: 'aug_1',
    submit_date: '2026-05-10T10:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE',
    department_name: 'General surgery',
    doctor_name: 'Zdzisław Pyłko',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-10T09:00:00',
    meeting_end: '2026-05-10T09:30:00',
    notes: 'Discussed Scanlan instruments (specifically 18.5 cm blunt-tip scissors), Neos Sternfix, Orascoptic loupes (HDL 2.5x), and Endeavour MD lights. The doctor expressed that biological patches (Biosis) are rarely needed in his ward.',
    topics: [
      { title: 'Scanlan', comment: 'Discussed Scanlan instruments, specifically 18.5 cm blunt-tip scissors.', next_steps: 'Send a commercial offer for Scanlan instruments' },
      { title: 'Neos Sternfix', comment: 'Discussed Sternfix closure system.', next_steps: 'Organize a Sternfix presentation (PPP) with demo cases' },
      { title: 'Orascoptic', comment: 'Discussed Orascoptic loupes (HDL 2.5x) and Endeavour MD lights.', next_steps: 'Bring Orascoptic loupes and lights for OR testing' },
      { title: 'Biosis', comment: 'Doctor expressed that biological patches (Biosis) are rarely needed in his ward.' }
    ],
    tasks: [
      { description: 'Send a commercial offer for Scanlan instruments', due_date: '2026-05-20', is_done: true },
      { description: 'Organize a Sternfix presentation (PPP) with demo cases', due_date: '2026-05-25', is_done: false },
      { description: 'Bring Orascoptic loupes and lights for OR testing', due_date: '2026-05-28', is_done: false }
    ]
  },
  {
    id: 'aug_2',
    submit_date: '2026-05-10T11:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE',
    department_name: 'Operation room',
    doctor_name: 'Ewa Judycka',
    doctor_title: 'plg',
    doctor_position: 'HN',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-10T10:30:00',
    meeting_end: '2026-05-10T11:00:00',
    notes: 'Interested in Scanlan SU products like Vacustat and Surgiloop as an alternative to metal bulldog clamps.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in Vacustat and Surgiloop as an alternative to metal bulldog clamps.', next_steps: 'Send an offer for Vacustat and Surgiloop' },
      { title: 'Orascoptic', comment: 'Discussed loupes testing in Orthopedics.', next_steps: 'Arrange an appointment with dr Bacharewicz (Orthopedics) regarding Orascoptic loupes' }
    ],
    tasks: [
      { description: 'Send an offer for Vacustat and Surgiloop', due_date: '2026-05-18', is_done: true },
      { description: 'Arrange an appointment with dr Bacharewicz (Orthopedics) regarding Orascoptic loupes', due_date: '2026-05-22', is_done: false }
    ]
  },
  {
    id: 'aug_3',
    submit_date: '2026-05-10T12:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE',
    department_name: 'Sterilization department',
    doctor_name: 'Mariola Rychorowicz',
    doctor_title: 'plg',
    doctor_position: 'HN',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-10T11:30:00',
    meeting_end: '2026-05-10T12:00:00',
    notes: 'Showed interest in TipGuard protectors and steel/plastic trays.',
    topics: [
      { title: 'Scanlan SU', comment: 'Showed interest in TipGuard protectors and steel/plastic trays.', next_steps: 'Send a quote for TipGuard and trays' }
    ],
    tasks: [
      { description: 'Send a quote for TipGuard and trays', due_date: '2026-05-20', is_done: true }
    ]
  },
  {
    id: 'aug_4',
    submit_date: '2026-05-10T13:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE',
    department_name: 'Hospital Pharmacy',
    doctor_name: 'Beata Wutke',
    doctor_title: 'mgr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-10T12:30:00',
    meeting_end: '2026-05-10T13:00:00',
    notes: 'Follow up on the status of Orascoptic loupe procurement.',
    topics: [
      { title: 'Orascoptic', comment: 'Follow up on the status of Orascoptic loupe procurement.', next_steps: 'Follow up on the status of Orascoptic loupe procurement' }
    ],
    tasks: [
      { description: 'Follow up on the status of Orascoptic loupe procurement', due_date: '2026-05-25', is_done: false }
    ]
  },

  // ==================== BIAŁA PODLASKA ====================
  {
    id: 'bp_1',
    submit_date: '2026-05-12T10:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W BIAŁEJ PODLASKIEJ',
    department_name: 'General surgery',
    doctor_name: 'Adam Derlukiewicz',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-12T09:00:00',
    meeting_end: '2026-05-12T09:30:00',
    notes: 'Presented Scanlan robotic bulldog clamps, Biosis SIS matrix, and TisgenX patches.',
    topics: [
      { title: 'Scanlan', comment: 'Presented Scanlan robotic bulldog clamps.', next_steps: 'Arrange a PPP and subsequent clinical testing for robotic clamps' },
      { title: 'Biosis', comment: 'Presented Biosis SIS matrix and TisgenX patches.', next_steps: 'Arrange a PPP for Biosis and TisgenX' }
    ],
    tasks: [
      { description: 'Arrange a PPP and subsequent clinical testing for robotic clamps', due_date: '2026-05-26', is_done: false },
      { description: 'Arrange a PPP for Biosis and TisgenX', due_date: '2026-05-28', is_done: false }
    ]
  },
  {
    id: 'bp_2',
    submit_date: '2026-05-12T11:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W BIAŁEJ PODLASKIEJ',
    department_name: 'Urology',
    doctor_name: 'Krzysztof Pękała',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-12T10:30:00',
    meeting_end: '2026-05-12T11:00:00',
    notes: 'Expressed strong interest in Scanlan robotic bulldog clamps and Allium stents.',
    topics: [
      { title: 'Scanlan', comment: 'Expressed strong interest in Scanlan robotic bulldog clamps.', next_steps: 'Arrange a PPP for the whole team' },
      { title: 'Allium', comment: 'Discussed Allium stent range.', next_steps: 'Arrange a PPP for the whole team' }
    ],
    tasks: [
      { description: 'Arrange a PPP for the whole team regarding robotic clamps and Allium stents', due_date: '2026-05-30', is_done: false }
    ]
  },
  {
    id: 'bp_3',
    submit_date: '2026-05-12T12:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W BIAŁEJ PODLASKIEJ',
    department_name: 'Neuro surgery',
    doctor_name: 'Emilia Sołtan',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-12T11:30:00',
    meeting_end: '2026-05-12T12:00:00',
    notes: 'Interested in Scanlan neurosurgical instruments and Orascoptic loupes.',
    topics: [
      { title: 'Scanlan', comment: 'Interested in Scanlan neurosurgical instruments.', next_steps: 'Arrange a PPP for September' },
      { title: 'Orascoptic', comment: 'Interested in Orascoptic loupes.', next_steps: 'Arrange a PPP for September' }
    ],
    tasks: [
      { description: 'Arrange a PPP for September regarding Scanlan neuro tools and Orascoptic loupes', due_date: '2026-09-10', is_done: false }
    ]
  },
  {
    id: 'bp_4',
    submit_date: '2026-05-12T13:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W BIAŁEJ PODLASKIEJ',
    department_name: 'Oncology',
    doctor_name: 'Jakub Żołnierek',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-12T12:30:00',
    meeting_end: '2026-05-12T13:00:00',
    notes: 'Discussed Biosis matrix for reducing post-resection infectious complications.',
    topics: [
      { title: 'Biosis', comment: 'Discussed Biosis matrix for reducing post-resection infectious complications.', next_steps: 'Discuss the solution with the general surgery team' }
    ],
    tasks: [
      { description: 'Discuss the Biosis solution with the general surgery team', due_date: '2026-05-27', is_done: false }
    ]
  },
  {
    id: 'bp_5',
    submit_date: '2026-05-12T14:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W BIAŁEJ PODLASKIEJ',
    department_name: 'Operation room',
    doctor_name: 'Jerzy Prządka',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-12T13:30:00',
    meeting_end: '2026-05-12T14:00:00',
    notes: 'Confirmed a need for SutureBoots.',
    topics: [
      { title: 'Scanlan SU', comment: 'Confirmed a need for SutureBoots.', next_steps: 'Arrange a meeting after the summer holidays' }
    ],
    tasks: [
      { description: 'Arrange a meeting after the summer holidays regarding SutureBoots', due_date: '2026-09-01', is_done: false }
    ]
  },
  {
    id: 'bp_6',
    submit_date: '2026-05-12T15:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W BIAŁEJ PODLASKIEJ',
    department_name: 'Sterilization department',
    doctor_name: 'Dorota Maksymiuk',
    doctor_title: 'plg',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-12T14:30:00',
    meeting_end: '2026-05-12T15:00:00',
    notes: 'Showed interest in Surg-I-Band tapes and Siliclamps.',
    topics: [
      { title: 'Scanlan SU', comment: 'Showed interest in Surg-I-Band tapes and Siliclamps.', next_steps: 'Remind about the purchase after the holidays' }
    ],
    tasks: [
      { description: 'Remind about the purchase of Surg-I-Band and Siliclamps after the holidays', due_date: '2026-09-05', is_done: false }
    ]
  },

  // ==================== BIAŁYSTOK USK ====================
  {
    id: 'bs_usk_1',
    submit_date: '2026-05-15T09:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Urology',
    doctor_name: 'Jacek Kudelski',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T08:00:00',
    meeting_end: '2026-05-15T08:30:00',
    notes: 'Expects a pre-tender offer for Allium Triple J stents and is interested in testing BlueNeem OneStep Dilators and Scanlan bulldog clamps.',
    topics: [
      { title: 'Allium', comment: 'Expects a pre-tender offer for Allium Triple J stents.', next_steps: 'Prepare the "4+1" Triple J promotional offer' },
      { title: 'BlueNeem', comment: 'Interested in testing BlueNeem OneStep Dilators.', next_steps: 'Provide OneStep Dilators for testing' },
      { title: 'Scanlan', comment: 'Interested in testing Scanlan bulldog clamps.', next_steps: 'Coordinate with administration for urgent bulldog clamp testing before the end of June' }
    ],
    tasks: [
      { description: 'Prepare the "4+1" Triple J promotional offer', due_date: '2026-05-22', is_done: true },
      { description: 'Provide OneStep Dilators for testing', due_date: '2026-05-25', is_done: true },
      { description: 'Coordinate with administration for urgent bulldog clamp testing before the end of June', due_date: '2026-06-25', is_done: false }
    ]
  },
  {
    id: 'bs_usk_2',
    submit_date: '2026-05-15T10:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Michał Leoniuk',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T09:15:00',
    meeting_end: '2026-05-15T09:45:00',
    notes: 'Tentatively selected Orascoptic Phantom and Tempo models.',
    topics: [
      { title: 'Orascoptic', comment: 'Tentatively selected Orascoptic Phantom and Tempo models.', next_steps: 'Submit an official commercial offer to administration' }
    ],
    tasks: [
      { description: 'Submit an official commercial offer to administration for Orascoptic loupes', due_date: '2026-05-26', is_done: true }
    ]
  },
  {
    id: 'bs_usk_3',
    submit_date: '2026-05-15T11:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Robert Trzciński',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T10:00:00',
    meeting_end: '2026-05-15T10:30:00',
    notes: 'Loupes required declination angle corrections or vision adjustment (discussing team with dr Andruschuk, dr Mitrosz, prof Deja).',
    topics: [
      { title: 'Orascoptic', comment: 'Loupes required declination angle corrections or vision adjustment.', next_steps: 'Return loupes to the factory for correction' }
    ],
    tasks: [
      { description: 'Return loupes to the factory for declination angle correction', due_date: '2026-05-30', is_done: false }
    ]
  },
  {
    id: 'bs_usk_4',
    submit_date: '2026-05-15T12:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Adrian Stankiewicz',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T11:00:00',
    meeting_end: '2026-05-15T11:30:00',
    notes: 'Ergonomic fine-tuning of new loupes performed.',
    topics: [
      { title: 'Orascoptic', comment: 'Ergonomic fine-tuning of new loupes performed successfully.' }
    ],
    tasks: []
  },
  {
    id: 'bs_usk_5',
    submit_date: '2026-05-15T13:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Anna Lejko',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T12:00:00',
    meeting_end: '2026-05-15T12:30:00',
    notes: 'Successful initial SternFix closures performed (with dr Szymon Kocenda).',
    topics: [
      { title: 'Neos Sternfix', comment: 'Successful initial SternFix closures performed with dr Szymon Kocenda.' }
    ],
    tasks: []
  },
  {
    id: 'bs_usk_6',
    submit_date: '2026-05-15T14:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Tomasz Hirnle',
    doctor_title: 'prof.',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T13:00:00',
    meeting_end: '2026-05-15T13:30:00',
    notes: 'Attended a SternFix presentation and hands-on training.',
    topics: [
      { title: 'Neos Sternfix', comment: 'Attended a SternFix presentation and hands-on training.' }
    ],
    tasks: []
  },
  {
    id: 'bs_usk_7',
    submit_date: '2026-05-15T15:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Paulina Falkowska',
    doctor_title: 'plg',
    doctor_position: 'OR Nurse',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T14:00:00',
    meeting_end: '2026-05-15T14:30:00',
    notes: 'Reconciled SternFix implants used during evaluation.',
    topics: [
      { title: 'Neos Sternfix', comment: 'Reconciled SternFix implants used during evaluation.', next_steps: 'Deliver three missing size 1 clips' }
    ],
    tasks: [
      { description: 'Deliver three missing size 1 clips for SternFix evaluation', due_date: '2026-05-25', is_done: true }
    ]
  },
  {
    id: 'bs_usk_8',
    submit_date: '2026-05-15T16:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Thoracic surgery',
    doctor_name: 'Mirosław Kozłowski',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-15T15:00:00',
    meeting_end: '2026-05-15T15:30:00',
    notes: 'Expressed satisfaction with Scanlan instruments.',
    topics: [
      { title: 'Scanlan', comment: 'Expressed satisfaction with Scanlan instruments.', next_steps: 'Arrange a formal meeting and inspect instrument conditions with scrub nurses' }
    ],
    tasks: [
      { description: 'Arrange a formal meeting and inspect instrument conditions with scrub nurses', due_date: '2026-06-02', is_done: false }
    ]
  },
  {
    id: 'bs_usk_9',
    submit_date: '2026-05-16T10:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Vascular surgery',
    doctor_name: 'Jerzy Głowiński',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-16T09:00:00',
    meeting_end: '2026-05-16T09:30:00',
    notes: 'Selected specific Scanlan tools for evaluation and showed interest in vascular clamps, bulldog shunts, and Eurocor Freeway balloons.',
    topics: [
      { title: 'Scanlan', comment: 'Selected specific Scanlan tools for evaluation and vascular clamps / bulldog shunts.', next_steps: 'Schedule a post-holiday visit with the full demo case' },
      { title: 'Eurocor', comment: 'Showed interest in Eurocor Freeway balloons.', next_steps: 'Follow up on Freeway balloons for the autumn tender' }
    ],
    tasks: [
      { description: 'Schedule a post-holiday visit with the full Scanlan demo case', due_date: '2026-09-02', is_done: false },
      { description: 'Follow up on Freeway balloons for the autumn tender', due_date: '2026-09-15', is_done: false }
    ]
  },
  {
    id: 'bs_usk_10',
    submit_date: '2026-05-16T11:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Administration',
    doctor_name: 'Barbara Kowalewska',
    doctor_title: 'mgr',
    doctor_position: 'Specjalista',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-16T10:30:00',
    meeting_end: '2026-05-16T11:00:00',
    notes: 'Discussed the purchase pathway for Urology loupes and SternFix evaluation.',
    topics: [
      { title: 'Orascoptic', comment: 'Discussed the purchase pathway for Urology loupes and lights.', next_steps: 'Prepare two separate offers (<PLN 50k each) for Urology loupes/lights and draft a letter on functional connectivity' },
      { title: 'Neos Sternfix', comment: 'Discussed SternFix evaluation documentation.', next_steps: 'Process clip orders for SternFix' }
    ],
    tasks: [
      { description: 'Prepare two separate offers (<PLN 50k each) for Urology loupes/lights and draft letter on functional connectivity', due_date: '2026-05-28', is_done: true },
      { description: 'Process clip orders for SternFix with administration', due_date: '2026-05-25', is_done: true }
    ]
  },
  {
    id: 'bs_usk_11',
    submit_date: '2026-05-16T12:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Administration',
    doctor_name: 'Marta Radziszewska',
    doctor_title: 'mgr',
    doctor_position: 'Specjalista',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-16T11:30:00',
    meeting_end: '2026-05-16T12:00:00',
    notes: 'Discussed SternFix evaluation contract extension.',
    topics: [
      { title: 'Neos Sternfix', comment: 'Discussed SternFix evaluation contract extension.' }
    ],
    tasks: []
  },
  {
    id: 'bs_usk_12',
    submit_date: '2026-05-16T13:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Administration',
    doctor_name: 'Andrzej Nalewajko',
    doctor_title: 'mgr',
    doctor_position: 'Kierownik Zaopatrzenia',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-16T12:30:00',
    meeting_end: '2026-05-16T13:00:00',
    notes: 'Finalizing KPO loupe documentation.',
    topics: [
      { title: 'Orascoptic', comment: 'Finalizing KPO loupe documentation.' }
    ],
    tasks: []
  },
  {
    id: 'bs_usk_13',
    submit_date: '2026-05-16T14:00:00',
    status: 'accepted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Sterilization department',
    doctor_name: 'Anna Fiedoruk',
    doctor_title: 'mgr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-16T13:30:00',
    meeting_end: '2026-05-16T14:00:00',
    notes: 'Planning staff re-education on EasyTags and marking tapes.',
    topics: [
      { title: 'Scanlan SU', comment: 'Planning staff re-education on EasyTags and marking tapes.', next_steps: 'Remind about order from active tender' },
      { title: 'Scanlan', comment: 'Discussed vascular tools.', next_steps: 'Consult Prof. Głowiński regarding vascular tunnelers' }
    ],
    tasks: [
      { description: 'Remind about order from active tender for EasyTags and marking tapes', due_date: '2026-05-30', is_done: true },
      { description: 'Consult Prof. Głowiński regarding vascular tunnelers', due_date: '2026-06-05', is_done: false }
    ]
  }
];
