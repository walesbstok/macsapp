import { SeedReport } from '../seedData';

export const SEED_REPORTS_BATCH_2: SeedReport[] = [
  // ==================== BIAŁYSTOK WSZ ====================
  {
    id: 'bs_wsz_1',
    submit_date: '2026-05-18T10:00:00',
    status: 'accepted',
    hospital_name: 'SP ZOZ WOJEWÓDZKI SZPITAL ZESPOLONY IM. J. ŚNIADECKIEGO',
    department_name: 'Urology',
    doctor_name: 'Adam Ostasiewicz',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-18T09:00:00',
    meeting_end: '2026-05-18T09:30:00',
    notes: 'Requested a BUS stent offer after a patient migration issue; interested in HydroTwist wires and Orascoptic headlights.',
    topics: [
      { title: 'Allium', comment: 'Requested a BUS stent offer after a patient migration issue.', next_steps: 'Resend offers to his personal email' },
      { title: 'BlueNeem', comment: 'Interested in HydroTwist wires.', next_steps: 'Resend offers to his personal email' },
      { title: 'Orascoptic', comment: 'Interested in Orascoptic headlights.', next_steps: 'Resend offers to his personal email' }
    ],
    tasks: [
      { description: 'Resend BUS stent, HydroTwist, and Orascoptic headlight offers to dr Ostasiewicz email', due_date: '2026-05-25', is_done: true }
    ]
  },
  {
    id: 'bs_wsz_2',
    submit_date: '2026-05-18T11:00:00',
    status: 'accepted',
    hospital_name: 'SP ZOZ WOJEWÓDZKI SZPITAL ZESPOLONY IM. J. ŚNIADECKIEGO',
    department_name: 'Urology',
    doctor_name: 'Michał Wiński',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-18T10:30:00',
    meeting_end: '2026-05-18T11:00:00',
    notes: 'Interested in HydroTwist wires and clarified Allium removal techniques.',
    topics: [
      { title: 'BlueNeem', comment: 'Interested in HydroTwist wires.' },
      { title: 'Allium', comment: 'Clarified Allium removal techniques.' }
    ],
    tasks: []
  },

  // ==================== BIAŁYSTOK MSWiA ====================
  {
    id: 'bs_mswia_1',
    submit_date: '2026-05-19T10:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Urology',
    doctor_name: 'Tomasz Lemiesz',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-19T09:00:00',
    meeting_end: '2026-05-19T09:30:00',
    notes: 'Discussed HydroTwister wires and robotic bulldog clamps.',
    topics: [
      { title: 'BlueNeem', comment: 'Discussed HydroTwister wires.', next_steps: 'Remind about the active tender and bulldog clamps' },
      { title: 'Scanlan', comment: 'Discussed robotic bulldog clamps.', next_steps: 'Remind about the active tender and bulldog clamps' }
    ],
    tasks: [
      { description: 'Remind dr Lemiesz about active tender and Scanlan bulldog clamps', due_date: '2026-05-28', is_done: false }
    ]
  },
  {
    id: 'bs_mswia_2',
    submit_date: '2026-05-19T11:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Urology',
    doctor_name: 'Adam Nowiński',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-19T10:30:00',
    meeting_end: '2026-05-19T11:00:00',
    notes: 'Interested in OneStep Dilators and HydroTwister wires (discussing with dr Gałek).',
    topics: [
      { title: 'BlueNeem', comment: 'Interested in OneStep Dilators and HydroTwister wires.', next_steps: 'Send an offer for dilators' },
      { title: 'Scanlan', comment: 'Discussed Scanlan instruments.', next_steps: 'Remind about Scanlan instruments' }
    ],
    tasks: [
      { description: 'Send an offer for OneStep dilators to dr Nowiński', due_date: '2026-05-26', is_done: true },
      { description: 'Remind about Scanlan instruments', due_date: '2026-06-02', is_done: false }
    ]
  },

  // ==================== BIAŁYSTOK BCO ====================
  {
    id: 'bs_bco_1',
    submit_date: '2026-05-20T10:00:00',
    status: 'accepted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Operation room',
    doctor_name: 'Grzegorz Płoński',
    doctor_title: 'dr n. med.',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-20T09:00:00',
    meeting_end: '2026-05-20T09:30:00',
    notes: 'Interested in Scanlan SU TipGuard, Suture-Boots, and Degania products.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in TipGuard and Suture-Boots.' },
      { title: 'Biosis', comment: 'Discussed Biosis matrix application.', next_steps: 'Raise the Biosis matrix subject in Gynaecology and Breast surgery wards' }
    ],
    tasks: [
      { description: 'Raise the Biosis matrix subject in Gynaecology and Breast surgery wards', due_date: '2026-06-01', is_done: false }
    ]
  },
  {
    id: 'bs_bco_2',
    submit_date: '2026-05-20T11:00:00',
    status: 'accepted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Urology',
    doctor_name: 'Mariusz Ciemerych',
    doctor_title: 'dr n. med.',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-20T10:30:00',
    meeting_end: '2026-05-20T11:00:00',
    notes: 'Intends to revisit Allium stent orders.',
    topics: [
      { title: 'Allium', comment: 'Intends to revisit Allium stent orders.', next_steps: 'Perform regular visits at the turn of August/September' }
    ],
    tasks: [
      { description: 'Perform regular visits at the turn of August/September with dr Ciemerych', due_date: '2026-08-30', is_done: false }
    ]
  },
  {
    id: 'bs_bco_3',
    submit_date: '2026-05-20T12:00:00',
    status: 'accepted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Sterilization department',
    doctor_name: 'Bożena Budnik',
    doctor_title: 'mgr',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-20T11:30:00',
    meeting_end: '2026-05-20T12:00:00',
    notes: 'Interested in Suture-Boots and TipGuards.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in Suture-Boots and TipGuards.', next_steps: 'Follow up for a potential trial order' }
    ],
    tasks: [
      { description: 'Follow up with Bożena Budnik for a potential trial order of Suture-Boots and TipGuards', due_date: '2026-06-05', is_done: false }
    ]
  },
  {
    id: 'bs_bco_4',
    submit_date: '2026-05-20T13:00:00',
    status: 'accepted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Transplant surgery',
    doctor_name: 'Piotr Stępniewski',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-20T12:30:00',
    meeting_end: '2026-05-20T13:00:00',
    notes: 'Confirmed the growing use of biological patches.',
    topics: [
      { title: 'Biosis', comment: 'Confirmed the growing use of biological patches.', next_steps: 'Arrange a meeting with the full department' },
      { title: 'Scanlan', comment: 'Discussed Scanlan vascular range.', next_steps: 'Visit with a Scanlan demo case' }
    ],
    tasks: [
      { description: 'Arrange a meeting with the full Transplant Surgery department', due_date: '2026-06-03', is_done: false },
      { description: 'Visit Transplant Surgery with a Scanlan demo case', due_date: '2026-06-10', is_done: false }
    ]
  },

  // ==================== BIELSK PODLASKI ====================
  {
    id: 'bielsk_1',
    submit_date: '2026-05-22T10:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W BIELSKU PODLASKIM',
    department_name: 'General surgery',
    doctor_name: 'Andrzej Kurzyła',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-22T09:00:00',
    meeting_end: '2026-05-22T09:30:00',
    notes: 'Interested in person-to-person Scanlan instrument presentation.',
    topics: [
      { title: 'Scanlan', comment: 'Interested in person-to-person Scanlan instrument presentation.', next_steps: 'Arrange a PPP for instruments' }
    ],
    tasks: [
      { description: 'Arrange a PPP for Scanlan instruments with dr Kurzyła', due_date: '2026-06-02', is_done: false }
    ]
  },
  {
    id: 'bielsk_2',
    submit_date: '2026-05-22T11:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W BIELSKU PODLASKIM',
    department_name: 'Operation room',
    doctor_name: 'Janusz Artur Kumpiecki',
    doctor_title: 'mgr',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-22T10:30:00',
    meeting_end: '2026-05-22T11:00:00',
    notes: 'Noted satisfaction with existing Scanlan vascular tools.',
    topics: [
      { title: 'Scanlan', comment: 'Noted satisfaction with existing Scanlan vascular tools.', next_steps: 'Verify any tool service/repair needs during the next visit' }
    ],
    tasks: [
      { description: 'Verify any tool service/repair needs during the next visit', due_date: '2026-06-15', is_done: false }
    ]
  },
  {
    id: 'bielsk_3',
    submit_date: '2026-05-22T12:00:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W BIELSKU PODLASKIM',
    department_name: 'Sterilization department',
    doctor_name: 'Maciejewska',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-22T11:30:00',
    meeting_end: '2026-05-22T12:00:00',
    notes: 'Interested in Surg-I-Band and TipGuard.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in Surg-I-Band and TipGuard.', next_steps: 'Meet with the Head Sterilization Nurse' }
    ],
    tasks: [
      { description: 'Meet with the Head Sterilization Nurse in Bielsk Podlaski', due_date: '2026-06-08', is_done: false }
    ]
  },

  // ==================== CIECHANÓW ====================
  {
    id: 'ciech_1',
    submit_date: '2026-05-25T10:00:00',
    status: 'accepted',
    hospital_name: 'SPECJALISTYCZNY SZPITAL WOJEWÓDZKI W CIECHANOWIE',
    department_name: 'Child surgery',
    doctor_name: 'Robert Oczkowski',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-25T09:00:00',
    meeting_end: '2026-05-25T09:30:00',
    notes: 'Presented Neos Cranial Loop/Cover and Biosis matrix.',
    topics: [
      { title: 'Neos Cranial', comment: 'Presented Neos Cranial Loop/Cover.', next_steps: 'Arrange a post-vacation meeting for Cranial Loop' },
      { title: 'Biosis', comment: 'Presented Biosis matrix.', next_steps: 'Arrange a PPP for Biosis' }
    ],
    tasks: [
      { description: 'Arrange a post-vacation meeting for Cranial Loop and a PPP for Biosis with dr Oczkowski', due_date: '2026-09-08', is_done: false }
    ]
  },
  {
    id: 'ciech_2',
    submit_date: '2026-05-25T11:00:00',
    status: 'accepted',
    hospital_name: 'SPECJALISTYCZNY SZPITAL WOJEWÓDZKI W CIECHANOWIE',
    department_name: 'General surgery',
    doctor_name: 'Mariusz Rolewski',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-25T10:30:00',
    meeting_end: '2026-05-25T11:00:00',
    notes: 'Interested in TisgenX for GI surgery and Biosis for hernia repair; focused on Scanlan Node Grasper.',
    topics: [
      { title: 'TisgenX', comment: 'Interested in TisgenX for GI surgery.', next_steps: 'Arrange a post-vacation meeting for TisgenX' },
      { title: 'Biosis', comment: 'Interested in Biosis for hernia repair.', next_steps: 'Arrange a PPP for Biosis' },
      { title: 'Scanlan', comment: 'Focused on Scanlan Node Grasper.' }
    ],
    tasks: [
      { description: 'Arrange a post-vacation meeting for TisgenX and a PPP for Biosis', due_date: '2026-09-10', is_done: false }
    ]
  },
  {
    id: 'ciech_3',
    submit_date: '2026-05-25T12:00:00',
    status: 'accepted',
    hospital_name: 'SPECJALISTYCZNY SZPITAL WOJEWÓDZKI W CIECHANOWIE',
    department_name: 'Urology',
    doctor_name: 'Witold Kondracki',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-25T11:30:00',
    meeting_end: '2026-05-25T12:00:00',
    notes: 'Allium stents presented.',
    topics: [
      { title: 'Allium', comment: 'Allium stents presented.', next_steps: 'Meet with Chief dr Stanisław Szemplinski to arrange a team PPP' }
    ],
    tasks: [
      { description: 'Meet with Chief dr Stanisław Szemplinski to arrange a team PPP for Allium stents', due_date: '2026-06-12', is_done: false }
    ]
  },
  {
    id: 'ciech_4',
    submit_date: '2026-05-25T13:00:00',
    status: 'accepted',
    hospital_name: 'SPECJALISTYCZNY SZPITAL WOJEWÓDZKI W CIECHANOWIE',
    department_name: 'Operation room',
    doctor_name: 'Mirosława Bastecka',
    doctor_title: 'plg',
    doctor_position: 'HN',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-25T12:30:00',
    meeting_end: '2026-05-25T13:00:00',
    notes: 'Categorically rejected Surg-I-Band but interested in TipGuard and EasyTag.',
    topics: [
      { title: 'Scanlan SU', comment: 'Categorically rejected Surg-I-Band but interested in TipGuard and EasyTag.', next_steps: 'Send an offer for TipGuard and EasyTag' }
    ],
    tasks: [
      { description: 'Send an offer for TipGuard and EasyTag to plg Bastecka', due_date: '2026-06-02', is_done: true }
    ]
  },
  {
    id: 'ciech_5',
    submit_date: '2026-05-25T14:00:00',
    status: 'accepted',
    hospital_name: 'SPECJALISTYCZNY SZPITAL WOJEWÓDZKI W CIECHANOWIE',
    department_name: 'Sterilization department',
    doctor_name: 'Bożena Michniak',
    doctor_title: 'mgr',
    doctor_position: 'Kierownik',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-25T13:30:00',
    meeting_end: '2026-05-25T14:00:00',
    notes: 'Interested in plastic eye surgery trays, TipGuards, and SecureBoots.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in plastic eye surgery trays, TipGuards, and SecureBoots.', next_steps: 'Send an offer for plastic trays and TipGuards' }
    ],
    tasks: [
      { description: 'Send an offer for plastic eye surgery trays, TipGuards, and SecureBoots', due_date: '2026-06-03', is_done: true }
    ]
  },

  // ==================== ELBLĄG MIEJSKI ====================
  {
    id: 'elb_m_1',
    submit_date: '2026-05-28T10:00:00',
    status: 'accepted',
    hospital_name: 'SZPITAL MIEJSKI ŚW. JANA PAWŁA II W ELBLĄGU',
    department_name: 'General surgery',
    doctor_name: 'Mirosław Kulmaczewski',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-28T09:00:00',
    meeting_end: '2026-05-28T09:30:00',
    notes: 'Interested in a Scanlan demo trial and Orascoptic loupes (5.5x).',
    topics: [
      { title: 'Scanlan', comment: 'Interested in a Scanlan demo trial.', next_steps: 'Arrange OR meeting/trial' },
      { title: 'Orascoptic', comment: 'Interested in Orascoptic loupes (5.5x).', next_steps: 'Send loupe offer for 5.5x' }
    ],
    tasks: [
      { description: 'Arrange OR meeting and trial for Scanlan instruments', due_date: '2026-06-10', is_done: false },
      { description: 'Send 5.5x Orascoptic loupe offer to dr Kulmaczewski', due_date: '2026-06-05', is_done: true }
    ]
  },
  {
    id: 'elb_m_2',
    submit_date: '2026-05-28T11:00:00',
    status: 'accepted',
    hospital_name: 'SZPITAL MIEJSKI ŚW. JANA PAWŁA II W ELBLĄGU',
    department_name: 'Child surgery',
    doctor_name: 'Bartosz Gawiński',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-28T10:30:00',
    meeting_end: '2026-05-28T11:00:00',
    notes: 'Interested in Scanlan VATS instruments and Orascoptic flip-up loupes.',
    topics: [
      { title: 'Scanlan', comment: 'Interested in Scanlan VATS instruments.', next_steps: 'Monitor VATS system purchase' },
      { title: 'Orascoptic', comment: 'Interested in Orascoptic flip-up loupes (3.5x).', next_steps: 'Send offer for 3.5x flip-up loupes' }
    ],
    tasks: [
      { description: 'Send offer for 3.5x flip-up loupes to dr Gawiński', due_date: '2026-06-04', is_done: true },
      { description: 'Monitor VATS system purchase in Elbląg Miejski', due_date: '2026-06-20', is_done: false }
    ]
  },
  {
    id: 'elb_m_3',
    submit_date: '2026-05-28T12:00:00',
    status: 'accepted',
    hospital_name: 'SZPITAL MIEJSKI ŚW. JANA PAWŁA II W ELBLĄGU',
    department_name: 'Child surgery',
    doctor_name: 'Eva Semaskevic',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-28T11:30:00',
    meeting_end: '2026-05-28T12:00:00',
    notes: 'Interested in 3.5x loupes.',
    topics: [
      { title: 'Orascoptic', comment: 'Interested in 3.5x loupes at resident pricing.', next_steps: 'Send a resident-priced offer for 3.5x loupes' }
    ],
    tasks: [
      { description: 'Send a resident-priced offer for 3.5x loupes to dr Eva Semaskevic', due_date: '2026-06-04', is_done: true }
    ]
  },
  {
    id: 'elb_m_4',
    submit_date: '2026-05-28T13:00:00',
    status: 'accepted',
    hospital_name: 'SZPITAL MIEJSKI ŚW. JANA PAWŁA II W ELBLĄGU',
    department_name: 'General surgery',
    doctor_name: 'Magdalena Prusak',
    doctor_title: 'dr',
    doctor_position: 'Vice Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-28T12:30:00',
    meeting_end: '2026-05-28T13:00:00',
    notes: 'Interested in trialing Scanlan instruments.',
    topics: [
      { title: 'Scanlan', comment: 'Interested in trialing Scanlan instruments.', next_steps: 'Arrange a PPP with a demo case' }
    ],
    tasks: [
      { description: 'Arrange a PPP with a demo case for dr Magdalena Prusak', due_date: '2026-06-12', is_done: false }
    ]
  },

  // ==================== ELBLĄG WSZ ====================
  {
    id: 'elb_wsz_1',
    submit_date: '2026-05-29T09:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Urology',
    doctor_name: 'Tomasz Drabarek',
    doctor_title: 'dr n. med.',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T08:30:00',
    meeting_end: '2026-05-29T09:00:00',
    notes: 'Scheduled an Allium stent presentation for the team on October 1st.',
    topics: [
      { title: 'Allium', comment: 'Scheduled an Allium stent presentation for the team on October 1st.', next_steps: 'Conduct team presentation on October 1st' }
    ],
    tasks: [
      { description: 'Conduct team presentation on Allium stents in Elbląg WSZ on October 1st', due_date: '2026-10-01', is_done: false }
    ]
  },
  {
    id: 'elb_wsz_2',
    submit_date: '2026-05-29T10:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Vascular surgery',
    doctor_name: 'Dariusz Kubiak',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T09:30:00',
    meeting_end: '2026-05-29T10:00:00',
    notes: 'Positive reaction to Orascoptic loupes/lamps; requested vacuostats in future tenders and TisgenX patches for inventory.',
    topics: [
      { title: 'Orascoptic', comment: 'Positive reaction to Orascoptic loupes/lamps.', next_steps: 'Send offers for loupes' },
      { title: 'Scanlan SU', comment: 'Requested vacuostats in future tenders.' },
      { title: 'TisgenX', comment: 'Requested TisgenX patches for inventory.', next_steps: 'Send TisgenX offer to OR HN and Pharmacy' },
      { title: 'Scanlan', comment: 'Discussed vascular demo tools.', next_steps: 'Deliver a Scanlan demo case' }
    ],
    tasks: [
      { description: 'Send offers for loupes and TisgenX (to OR HN and Pharmacy)', due_date: '2026-06-08', is_done: true },
      { description: 'Deliver a Scanlan demo case to dr Kubiak', due_date: '2026-06-15', is_done: false }
    ]
  },
  {
    id: 'elb_wsz_3',
    submit_date: '2026-05-29T11:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Neuro surgery',
    doctor_name: 'Jakub Ładyński',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T10:30:00',
    meeting_end: '2026-05-29T11:00:00',
    notes: 'Interested in TisgenX (dura reconstruction), Orascoptic loupes, and Scanlan Legacy instruments.',
    topics: [
      { title: 'TisgenX', comment: 'Interested in TisgenX for dura reconstruction.', next_steps: 'Revisit the topic after the holiday season' },
      { title: 'Orascoptic', comment: 'Interested in Orascoptic loupes.', next_steps: 'Revisit the topic after the holiday season' },
      { title: 'Scanlan', comment: 'Interested in Scanlan Legacy instruments.' }
    ],
    tasks: [
      { description: 'Revisit TisgenX and Orascoptic loupes with dr Ładyński after holidays', due_date: '2026-09-08', is_done: false }
    ]
  },
  {
    id: 'elb_wsz_4',
    submit_date: '2026-05-29T12:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Neuro surgery',
    doctor_name: 'Safwan Bayassi',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T11:30:00',
    meeting_end: '2026-05-29T12:00:00',
    notes: 'Interested in trialing Scanlan microsurgery and variable magnification loupes; requested TisgenX and Cranial Loop offers.',
    topics: [
      { title: 'Scanlan', comment: 'Interested in trialing Scanlan microsurgery tools.', next_steps: 'Coordinate Scanlan demo visit with the Chief' },
      { title: 'Orascoptic', comment: 'Interested in variable magnification loupes (4x/5x/6x).', next_steps: 'Send offers for 4x/5x/6x loupes' },
      { title: 'TisgenX', comment: 'Requested TisgenX offer.', next_steps: 'Send offer for TisgenX' },
      { title: 'Neos Cranial', comment: 'Requested Cranial Loop offer.', next_steps: 'Send offer for Cranial Loop' }
    ],
    tasks: [
      { description: 'Send offers for TisgenX, Cranial Loop, and 4x/5x/6x loupes to dr Safwan Bayassi', due_date: '2026-06-08', is_done: true },
      { description: 'Coordinate Scanlan demo visit with Neurosurgery Chief', due_date: '2026-06-18', is_done: false }
    ]
  },
  {
    id: 'elb_wsz_5',
    submit_date: '2026-05-29T13:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Gynecology',
    doctor_name: 'Krzysztof Zieliński',
    doctor_title: 'dr',
    doctor_position: 'Lekarz',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T12:30:00',
    meeting_end: '2026-05-29T13:00:00',
    notes: 'Discussed Biosis matrix and TisgenX for rectovaginal fistulas.',
    topics: [
      { title: 'Biosis', comment: 'Discussed Biosis matrix for rectovaginal fistulas.', next_steps: 'Follow up' },
      { title: 'TisgenX', comment: 'Discussed TisgenX application in fistulas.', next_steps: 'Follow up' }
    ],
    tasks: [
      { description: 'Follow up with dr Zieliński regarding Biosis and TisgenX for fistulas', due_date: '2026-06-15', is_done: false }
    ]
  },
  {
    id: 'elb_wsz_6',
    submit_date: '2026-05-29T14:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Oncology',
    doctor_name: 'Marek Pietruszka',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T13:30:00',
    meeting_end: '2026-05-29T14:00:00',
    notes: 'Interested in biological grafts for oncology/breast procedures.',
    topics: [
      { title: 'Biosis', comment: 'Interested in biological grafts for oncology and breast procedures.', next_steps: 'Call to arrange a formal meeting' }
    ],
    tasks: [
      { description: 'Call dr Marek Pietruszka to arrange a formal meeting on Biosis', due_date: '2026-06-05', is_done: false }
    ]
  },
  {
    id: 'elb_wsz_7',
    submit_date: '2026-05-29T15:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Sterilization department',
    doctor_name: 'Jarosław Czapliński',
    doctor_title: 'mgr',
    doctor_position: 'Coordinator',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T14:30:00',
    meeting_end: '2026-05-29T15:00:00',
    notes: 'Interested in Surg-I-Band and TipGuard.',
    topics: [
      { title: 'Scanlan SU', comment: 'Interested in Surg-I-Band and TipGuard.', next_steps: 'Must talk with OR HN and department heads to set items in tender' }
    ],
    tasks: [
      { description: 'Talk with OR HN and department heads to set Surg-I-Band and TipGuard in upcoming tender', due_date: '2026-06-25', is_done: false }
    ]
  },
  {
    id: 'elb_wsz_8',
    submit_date: '2026-05-29T16:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Operation room',
    doctor_name: 'Mariola Żyłowska',
    doctor_title: 'plg',
    doctor_position: 'HN',
    meeting_type: 'REGULAR',
    meeting_start: '2026-05-29T15:30:00',
    meeting_end: '2026-05-29T16:00:00',
    notes: 'Impressed by Scanlan quality but limited by budget.',
    topics: [
      { title: 'Scanlan', comment: 'Impressed by Scanlan quality but limited by budget.' }
    ],
    tasks: []
  }
];
