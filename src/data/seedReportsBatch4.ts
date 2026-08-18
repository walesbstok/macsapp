import { SeedReport } from '../seedData';

export const SEED_REPORTS_BATCH_4: SeedReport[] = [
  // ==================== AUGUSTÓW (06.08.2026) ====================
  {
    id: 'rep_20260806_aug_rychorowicz',
    submit_date: '2026-08-06T14:00:00',
    status: 'submitted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE',
    department_name: 'Sterilization department',
    doctor_name: 'Mariola Rychorowicz',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-06T11:30:00',
    meeting_end: '2026-08-06T12:00:00',
    notes: 'Rozmowa o narzędziach jednorazowych i asortymencie sterylizacyjnym.',
    topics: [
      {
        title: 'Scanlan / TipGuard & Sita sterylizacyjne',
        comment: 'Z zaprezentowanego portfolio pielęgniarka wybrała Tipgard jako najbardziej przydatny produkt z całej oferty. Duże zainteresowanie wzbudziły również sita i tacki sterylizacyjne ze stali oraz tworzywa sztucznego. Poprosiła o przesłanie wyceny na wszystkie te produkty.',
        next_steps: 'Wysłać ofertę na osłonki TipGuard oraz sita/tacki sterylizacyjne',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Wysłać ofertę na TipGuard oraz tacki stalowe i plastikowe dla piel. Marioli Rychorowicz',
        due_date: '2026-08-13',
        is_done: false
      }
    ]
  },

  // ==================== BIAŁYSTOK - BCO (11.08.2026) ====================
  {
    id: 'rep_20260811_bco_rogowski',
    submit_date: '2026-08-11T14:10:00',
    status: 'submitted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Oncology',
    doctor_name: 'Karol Rogowski',
    doctor_title: 'dr',
    doctor_position: 'Chirurg Onkolog',
    meeting_type: 'Normal',
    meeting_start: '2026-08-11T08:30:00',
    meeting_end: '2026-08-11T09:00:00',
    notes: 'Krótka rozmowa przed wejściem doktora na blok operacyjny.',
    topics: [
      {
        title: 'Biosis',
        comment: 'Skupiono się na siatkach biologicznych do ogólnego zastosowania w procedurach onkologicznych, ze szczególnym uwzględnieniem pól skażonych lub zagrożonych infekcją. Doktor potwierdził potencjalne miejsce dla produktu, lecz zasugerował zorganizowanie oficjalnego spotkania z ordynatorem/kierownikiem oddziału.',
        next_steps: 'Umówić spotkanie z ordynatorem ws. siatek Biosis',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Umówić spotkanie z ordynatorem chirurgii onkologicznej BCO i przedstawić siatki biologiczne Biosis',
        due_date: '2026-08-18',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260811_bco_budnik',
    submit_date: '2026-08-11T14:20:00',
    status: 'submitted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Sterilization department',
    doctor_name: 'Bożena Budnik',
    doctor_title: 'mgr',
    doctor_position: 'Koordynator Sterylizatorni',
    meeting_type: 'Normal',
    meeting_start: '2026-08-11T09:15:00',
    meeting_end: '2026-08-11T09:45:00',
    notes: 'Sytuacja zbliżona do rozmowy z kierownictwem bloku. Wymagana zgoda dyrekcji na spotkania.',
    topics: [
      {
        title: 'Scanlan SU / Suture Boots & TipGuards',
        comment: 'Pani Budnik wyraziła zainteresowanie osłonkami Suture Boots oraz Tip Guards. Na ten moment posiadają zabezpieczony asortyment, lecz w przypadku regularnego podtrzymywania relacji istnieje szansa na start w przetargu lub zamówienie próbne. Omówiono kwestie zabezpieczeń i etykietowania narzędzi.',
        next_steps: 'Odwiedzać sterylizatornię przy okazji wizyt na innych oddziałach BCO',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Odwiedzić koordynator Bożenę Budnik przy okazji kolejnej wizyty na oddziałach BCO',
        due_date: '2026-08-25',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260811_bco_ciemerych',
    submit_date: '2026-08-11T14:30:00',
    status: 'submitted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Urology',
    doctor_name: 'Mariusz Ciemerych',
    doctor_title: 'dr n. med.',
    doctor_position: 'Ordynator (Chief)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-11T10:00:00',
    meeting_end: '2026-08-11T10:45:00',
    notes: 'Rozmowa z ordynatorem ws. implantacji stentów Allium.',
    topics: [
      {
        title: 'Allium',
        comment: 'Ordynator pamięta wcześniejsze rozmowy i miał wcześniej wytypowanych pacjentów. Aktualnie nie widzi bezpośrednich wskazań na oddziale. Próbował kierować pacjentów do MSWiA, lecz tam również nie podjęto zabiegu. Nie odrzuca tematu, lecz potrzebna jest prezentacja procedury dla całego zespołu urologicznego.',
        next_steps: 'Zorganizować i zaplanować prezentację procedur implantacji stentów Allium dla zespołu',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Zaplanować i przygotować prezentację procedur stentów Allium dla dr. Ciemerycha i zespołu urologii BCO',
        due_date: '2026-08-20',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260811_bco_wierzbicka',
    submit_date: '2026-08-11T14:40:00',
    status: 'submitted',
    hospital_name: 'BIAŁOSTOCKIE CENTRUM ONKOLOGII IM. M. SKŁODOWSKIEJ-CURIE W BIAŁYMSTOKU',
    department_name: 'Operation room',
    doctor_name: 'Beata Wierzbicka',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa Bloku (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-11T11:00:00',
    meeting_end: '2026-08-11T11:30:00',
    notes: 'Przegląd zapotrzebowania na drobny asortyment zabiegowy.',
    topics: [
      {
        title: 'Scanlan SU / Siliclips, Suture Boots & Markery',
        comment: 'Oddział widzi zastosowanie dla Suture Boots oraz klipsów silikonowych Siliclips, pod warunkiem wcześniejszego przetestowania na bloku. Interesujące wydały się także markery chirurgiczne. Zakupy nie są planowane natychmiastowo, należy ponowić temat przy kolejnych odwiedzinach.',
        next_steps: 'Przypomnieć o testach przy kolejnej wizycie na bloku',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Przypomnieć piel. Beacie Wierzbickiej o testach Siliclips, Suture Boots i markerów podczas wizyty w BCO',
        due_date: '2026-08-25',
        is_done: false
      }
    ]
  },

  // ==================== BIAŁYSTOK - OMEDA (12.08.2026) ====================
  {
    // MERGED: Scanlan + Biosis for dr Andrzej Kupisz
    id: 'rep_20260812_omeda_kupisz',
    submit_date: '2026-08-12T13:00:00',
    status: 'submitted',
    hospital_name: 'NIEPUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ HUMANA MEDICA OMEDA',
    department_name: 'General surgery',
    doctor_name: 'Andrzej Kupisz',
    doctor_title: 'dr',
    doctor_position: 'Chirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-08-12T08:30:00',
    meeting_end: '2026-08-12T09:15:00',
    notes: 'Połączenie tematów: Narzędzia Scanlan oraz Siatki biologiczne Biosis w OMEDA.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Narzędzia Scanlan zostały ocenione bardzo wysoko pod względem jakości, natomiast placówka została przejęta przez grupę PZU Zdrowie, która centralnie zarządza zakupami i przetargami.',
        next_steps: 'Odwiedzać okresowo i monitorować ścieżkę zakupową w PZU Zdrowie',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Biosis',
        comment: 'Rozmowa o wykorzystaniu siatek biologicznych do plastyki przepuklin u pacjentów ze skażonym polem operacyjnym lub wysokim ryzykiem infekcji. Oddział stosuje matryce biologiczne w takich przypadkach w ramach obowiązującej umowy. Nie wykluczają zmian w przyszłości.',
        next_steps: 'Utrzymywać relacje i ponawiać kontakt',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Odwiedzić dr. Kupisza w Humana Medica Omeda, monitorować zapotrzebowanie na Biosis i narzędzia Scanlan',
        due_date: '2026-09-02',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Scanlan + Biosis for plg Arletta Zakrzewska
    id: 'rep_20260812_omeda_zakrzewska',
    submit_date: '2026-08-12T13:10:00',
    status: 'submitted',
    hospital_name: 'NIEPUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ HUMANA MEDICA OMEDA',
    department_name: 'Operation room',
    doctor_name: 'Arletta Zakrzewska',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa Bloku (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-12T09:30:00',
    meeting_end: '2026-08-12T10:00:00',
    notes: 'Połączenie tematów: Procedury zakupowe PZU Zdrowie, narzędzia chirurgiczne oraz siatki biologiczne.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Pielęgniarka potwierdziła, że decyzje zakupowe i umowy ramowe na instrumentarium są podejmowane centralnie przez PZU Zdrowie.',
        next_steps: 'Odwiedzać sporadycznie w celu monitorowania umów ramowych',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Biosis',
        comment: 'W kwestii siatek biologicznych oddział korzysta z dotychczasowych dostawców zakontraktowanych przez centralę i na ten moment nie planuje testowania zamienników.',
        next_steps: 'Podtrzymywać kontakt z blokiem operacyjnym',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Odwiedzać blok operacyjny Omeda okresowo, weryfikować odnawianie umów ramowych w PZU Zdrowie',
        due_date: '2026-09-10',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Allium + Scanlan for dr Rafał Derewicz
    id: 'rep_20260812_omeda_derewicz',
    submit_date: '2026-08-12T13:20:00',
    status: 'submitted',
    hospital_name: 'NIEPUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ HUMANA MEDICA OMEDA',
    department_name: 'Urology',
    doctor_name: 'Rafał Derewicz',
    doctor_title: 'dr',
    doctor_position: 'Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-08-12T10:15:00',
    meeting_end: '2026-08-12T10:45:00',
    notes: 'Połączenie tematów: Stenty urologiczne Allium oraz Narzędzia Scanlan do uretroplastyki.',
    topics: [
      {
        title: 'Allium',
        comment: 'W ośrodku Omeda nie są wykonywane procedury kwalifikujące się do zastosowania stentów Allium, dlatego temat stentów nie leży w obszarze bieżącego zainteresowania placówki.',
        next_steps: 'Podtrzymywać okazjonalny kontakt',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Zaprezentowano katalog narzędzi Scanlan do plastyki cewki moczowej (uretroplastyki). Doktor wykazał duże zainteresowanie instrumentarium, wskazując na potrzebę takich narzędzi, z uwzględnieniem ograniczeń budżetowych PZU Zdrowie.',
        next_steps: 'Utrzymywać kontakt ws. zapotrzebowania na narzędzia do uretroplastyki',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Utrzymywać kontakt z dr. Derewiczem ws. narzędzi Scanlan dedykowanych do plastyki cewki moczowej',
        due_date: '2026-09-05',
        is_done: false
      }
    ]
  },

  // ==================== BIAŁYSTOK - SPZOZ MSWiA (11.08.2026) ====================
  {
    // MERGED: Degania + Scanlan SU + Biosis for plg Marzena Dunda
    id: 'rep_20260811_mswia_dunda',
    submit_date: '2026-08-11T15:00:00',
    status: 'submitted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Operation room',
    doctor_name: 'Marzena Dunda',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa Bloku (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-11T12:00:00',
    meeting_end: '2026-08-11T12:45:00',
    notes: 'Połączenie tematów: Pętle Degania, asortyment jednorazowy Scanlan SU oraz siatki Biosis.',
    topics: [
      {
        title: 'Degania',
        comment: 'Bardzo wysoka ocena pętli naczyniowych Degania ze strony personelu i operatorów. Ustalono, że optymalnym rozwiązaniem będzie uwzględnienie produktu w najbliższym postępowaniu przetargowym.',
        next_steps: 'Przesłać opis przedmiotu zamówienia i wycenę do przetargu',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan SU',
        comment: 'Pielęgniarka oddziałowa bardzo pozytywnie oceniła TipGuards oraz widzi zapotrzebowanie na zaciski Siliclamps, odsysacze Vacustat i taśmy do oznaczania narzędzi. Poprosiła o kompletną wycenę i opisy przetargowe.',
        next_steps: 'Przesłać ofertę cenową i opisy do przetargu',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Biosis',
        comment: 'Potwierdzono regularne stosowanie siatek przepuklinowych na chirurgii ogólnej. Nowy ordynator oddziału intensywnie rozwija profil zabiegowy, warto skonsultować z nim bezpośrednio wdrożenie matryc Biosis.',
        next_steps: 'Umówić spotkanie z nowym ordynatorem chirurgii ogólnej MSWiA Białystok',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Przesłać do piel. Marzeny Dundy opisy i wyceny przetargowe na pętle Degania',
        due_date: '2026-08-18',
        is_done: false
      },
      {
        description: 'Przesłać wycenę i opisy przetargowe na TipGuards, Siliclamps, Vacustat oraz taśmy znakujące',
        due_date: '2026-08-18',
        is_done: false
      },
      {
        description: 'Umówić spotkanie z nowym ordynatorem chirurgii ogólnej MSWiA Białystok ws. matryc biologicznych Biosis',
        due_date: '2026-08-25',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260811_mswia_krasowska',
    submit_date: '2026-08-11T15:15:00',
    status: 'submitted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Sterilization department',
    doctor_name: 'Anna Krasowska',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa Sterylizatorni (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-11T13:00:00',
    meeting_end: '2026-08-11T13:30:00',
    notes: 'Rozmowa o zabezpieczeniach narzędzi i organizacji sterylizacji.',
    topics: [
      {
        title: 'Scanlan SU / Zabezpieczenia',
        comment: 'Pielęgniarka zwróciła uwagę na osłonki Tip Guards, prezentując własne dotychczasowe rozwiązania ochronne z drenów. Zauważyła w katalogu asortyment dedykowany na blok operacyjny, sugerując bezpośredni kontakt z blokiem.',
        next_steps: 'Skontaktować się bezpośrednio z blokiem operacyjnym ws. zabezpieczeń',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Skonsultować z blokiem operacyjnym MSWiA asortyment zabezpieczeń i osłonek zidentyfikowany przez sterylizatornię',
        due_date: '2026-08-18',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Allium + BlueNeem + Scanlan for dr Tomasz Lemiesz
    id: 'rep_20260811_mswia_lemiesz',
    submit_date: '2026-08-11T15:30:00',
    status: 'submitted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Urology',
    doctor_name: 'Tomasz Lemiesz',
    doctor_title: 'dr',
    doctor_position: 'Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-08-11T13:45:00',
    meeting_end: '2026-08-11T14:30:00',
    notes: 'Połączenie tematów: Stenty Allium, aktywny przetarg BlueNeem oraz chirurgia robotyczna Scanlan.',
    topics: [
      {
        title: 'Allium',
        comment: 'Omówiono wskazania kliniczne do implantacji stentów Allium w celu zwiększenia częstotliwości ich stosowania w oddziale. Doktor zadeklarował większą otwartość i zwrócenie uwagi na kwalifikację pacjentów.',
        next_steps: 'Omówić procedury z całym zespołem urologicznym',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'Przypomniano o aktywnym przetargu obejmującym prowadniki i rozszerzadła BlueNeem. Doktor potwierdził możliwość zamawiania w miarę bieżących potrzeb oddziału.',
        next_steps: 'Przypominać o aktywnym przetargu i asortymencie',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan Robotic',
        comment: 'Poruszono temat planowanego zakupu robota chirurgicznego. Procedury przetargowe przesunięte na kolejny rok. Po uruchomieniu systemu zaplanowano testy zacisków Scanlan Bulldog.',
        next_steps: 'Monitorować harmonogram wdrożenia robota chirurgicznego',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Omówić procedury kwalifikacji do stentów Allium z zespołem urologicznym MSWiA',
        due_date: '2026-08-25',
        is_done: false
      },
      {
        description: 'Przypominać o możliwości zamawiania prowadników i rozszerzadeł BlueNeem z aktywnego przetargu',
        due_date: '2026-08-25',
        is_done: false
      },
      {
        description: 'Monitorować status zakupu robota w MSWiA i przygotować zaciski Scanlan Bulldog do testów',
        due_date: '2026-09-15',
        is_done: false
      }
    ]
  },

  // ==================== BIAŁYSTOK - USK BIAŁYSTOK (10-12.08.2026) ====================
  {
    id: 'rep_20260812_usk_frank',
    submit_date: '2026-08-12T14:00:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Marek Frank',
    doctor_title: 'dr',
    doctor_position: 'Kardiochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-08-12T11:15:00',
    meeting_end: '2026-08-12T11:45:00',
    notes: 'Weryfikacja lup Orascoptic po serwisie oraz temat oświetlenia.',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Wspólnie z doktorem sprawdzono lupy po przeróbce serwisowej. Doktor jest względnie zadowolony, dostrzega drobne półcienie, lecz zdecydował się przetestować lupy w warunkach operacyjnych. Poruszył także kwestię lampy czołowej omawianej wcześniej z Aldoną.',
        next_steps: 'Zweryfikować ustalenia z Aldoną ws. zakupu lampy dla Doroty Frank',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Zweryfikować z Aldoną stan ustaleń i ofertę na lampę dla Doroty Frank',
        due_date: '2026-08-18',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260810_usk_falkowska',
    submit_date: '2026-08-10T14:00:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Paulina Falkowska',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Bloku Operacyjnego',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T09:00:00',
    meeting_end: '2026-08-10T09:30:00',
    notes: 'Odbiór zestawu demonstracyjnego NEOS Sternfix po zakończeniu umowy użyczenia.',
    topics: [
      {
        title: 'Neos Sternfix',
        comment: 'Odebrano zestaw instrumentarium NEOS Sternfix po okresie testowym. Omówiono ścieżkę zakupu zestawu na stałe. Pielęgniarka skierowała do prof. Hirnle i zespołu operacyjnego w celu potwierdzenia satysfakcji z użytkowania systemu.',
        next_steps: 'Skonsultować zakup z prof. Hirnle',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Skonsultować z prof. Hirnle i zespołem kardiochirurgii opinię po testach i formalności zakupu Sternfix',
        due_date: '2026-08-10',
        is_done: true
      }
    ]
  },
  {
    id: 'rep_20260810_usk_hirnle_1',
    submit_date: '2026-08-10T14:15:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Tomasz Hirnle',
    doctor_title: 'prof. dr hab.',
    doctor_position: 'Kierownik Kliniki (Chief)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T09:45:00',
    meeting_end: '2026-08-10T10:15:00',
    notes: 'Rozmowa o wykupie instrumentarium Sternfix po umowie bezpłatnego użyczenia.',
    topics: [
      {
        title: 'Neos Sternfix',
        comment: 'Rozmowa dotyczyła zakupu instrumentarium Sternfix. Profesor zadeklarował zebranie opinii od lekarzy, którzy przeprowadzali procedury z użyciem systemu i podjęcie decyzji zakupowej.',
        next_steps: 'Uzyskać decyzję po wewnętrznej konsultacji zespołu',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Uzyskać ostateczną decyzję prof. Hirnle ws. zakupu instrumentarium Sternfix',
        due_date: '2026-08-12',
        is_done: true
      }
    ]
  },
  {
    id: 'rep_20260812_usk_hirnle_2',
    submit_date: '2026-08-12T14:30:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Tomasz Hirnle',
    doctor_title: 'prof. dr hab.',
    doctor_position: 'Kierownik Kliniki (Chief)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-12T10:00:00',
    meeting_end: '2026-08-12T10:30:00',
    notes: 'Spotkanie podsumowujące: Pozytywna decyzja o zakupie instrumentarium Sternfix.',
    topics: [
      {
        title: 'Neos Sternfix',
        comment: 'Profesor skonsultował się z kardiochirurgami operującymi systemem Sternfix. Opinie zespołu są bardzo wysokie. Zapadła formalna decyzja o zakupie zestawu instrumentarium na własność kliniki.',
        next_steps: 'Skontaktować się z pielęgniarką Pauliną Falkowską ws. finalizacji procedury zamówienia',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Skontaktować się z piel. Pauliną Falkowską i działem zamówień ws. zakupu instrumentarium Sternfix',
        due_date: '2026-08-14',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260810_usk_andrushchuk',
    submit_date: '2026-08-10T14:45:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Uladzimir Andrushchuk',
    doctor_title: 'dr',
    doctor_position: 'Kardiochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T10:30:00',
    meeting_end: '2026-08-10T11:00:00',
    notes: 'Korekta parametrów lup operacyjnych Orascoptic.',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Kąty nachylenia teleskopów zostały skorygowane i wyeliminowano efekt półksiężyca, jednak odległość robocza nie uległa zmianie. Doktor poprosił o weryfikację zlecenia serwisowego i ewentualne odesłanie do ponownego ustawienia dystansu roboczego.',
        next_steps: 'Sprawdzić zlecenie serwisowe i uzgodnić dalsze kroki korekty z serwisem',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Zweryfikować zlecenie serwisowe lup dr. Andrushchuka i ustalić procedurę korekty odległości roboczej',
        due_date: '2026-08-14',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Orascoptic + Neos Sternfix for prof. Marek Deja
    id: 'rep_20260810_usk_deja',
    submit_date: '2026-08-10T15:00:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Marek Deja',
    doctor_title: 'prof. dr hab.',
    doctor_position: 'Kardiochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T11:15:00',
    meeting_end: '2026-08-10T12:00:00',
    notes: 'Połączenie tematów: Weryfikacja lup Orascoptic oraz wsparcie aplikacyjne Neos Sternfix.',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Profesor zweryfikował lupy po naprawie i ocenił, że zgłoszone mankamenty zostały usunięte. Ostateczną ocenę wyda po zabiegu operacyjnym. Ustalono kontakt telefoniczny na środę 12 sierpnia.',
        next_steps: 'Zadzwonić w środę 12 sierpnia i podsumować testy w warunkach bloku',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Neos Sternfix',
        comment: 'Profesor zna system Sternfix, czeka na odpowiedniego pacjenta ze wskazaniem do implantów zamiast drutów. Zaproponowano obecność i wsparcie kliniczne podczas pierwszej operacji.',
        next_steps: 'Zaplanować dzień na bloku z asystą przy zespoleniu mostka Sternfix',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Zadzwonić w środę 12 sierpnia do prof. Dei ws. testów lup Orascoptic podczas operacji',
        due_date: '2026-08-12',
        is_done: false
      },
      {
        description: 'Zaplanować wsparcie kliniczne na bloku przy zabiegu zespolenia mostka implantami Sternfix',
        due_date: '2026-08-25',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Orascoptic + Neos Sternfix for dr Robert Trzciński
    id: 'rep_20260810_usk_trzcinski',
    submit_date: '2026-08-10T15:15:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Cardiac surgery',
    doctor_name: 'Robert Trzciński',
    doctor_title: 'dr',
    doctor_position: 'Kardiochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T12:15:00',
    meeting_end: '2026-08-10T13:00:00',
    notes: 'Połączenie tematów: Dostarczenie lup Orascoptic po korekcie oraz doświadczenia z systemem Sternfix.',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Dostarczono lupy po przeróbce. Sprawdzono kąty nachylenia, pole widzenia, głębię ostrości i odległość roboczą. Doktor bardzo zadowolony z dopasowania. Przetestuje je w ciągu 2 dni, kontakt zaplanowano na środę.',
        next_steps: 'Zadzwonić w środę 12 sierpnia w celu zebrania opinii po zabiegach',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Neos Sternfix',
        comment: 'Doktor asystował przy zabiegu implantacji Sternfix z innym kardiochirurgiem. Bardzo chwali łatwość aplikacji i stabilność zespolenia. Przebieg pooperacyjny pacjenta bez powikłań.',
        next_steps: 'Podczas kolejnej rozmowy dopytać o kwalifikację kolejnego pacjenta i asystę',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Zadzwonić do dr. Trzcińskiego w środę 12 sierpnia ws. działania lup Orascoptic',
        due_date: '2026-08-12',
        is_done: false
      },
      {
        description: 'Skonsultować z dr. Trzcińskim kwalifikację pacjenta do Sternfix i zaplanować asystę na bloku',
        due_date: '2026-08-25',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Allium + BlueNeem for dr hab. n. med. Jacek Kudelski
    id: 'rep_20260810_usk_kudelski',
    submit_date: '2026-08-10T15:30:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Urology',
    doctor_name: 'Jacek Kudelski',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Kierownik Kliniki (Chief)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T13:15:00',
    meeting_end: '2026-08-10T14:00:00',
    notes: 'Połączenie tematów: Wskazania do stentów Allium oraz asortyment BlueNeem w przetargu.',
    topics: [
      {
        title: 'Allium',
        comment: 'Rozmowa przypominająca o wskazaniach klinicznych do stentów Allium. Doktor zadeklarował przegląd przypadków i otwartość na częstszą kwalifikację pacjentów.',
        next_steps: 'Omówić temat z zespołem i wytypować lekarzy najbardziej otwartych na wdrożenia',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'W nawiązaniu do przetargu przypomniano o prowadnikach HydroTwist i stentach Triple J. Doktor zasugerował uzgodnienie szczegółowej specyfikacji przetargowej z dr. Głuchowskim.',
        next_steps: 'Omówić zapisy przetargowe z dr. Głuchowskim',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Porozmawiać z zespołem urologicznym USK o wskazaniach do stentów Allium i wytypować operatorów',
        due_date: '2026-08-20',
        is_done: false
      },
      {
        description: 'Skonsultować z dr. Głuchowskim uwzględnienie prowadników HydroTwist i stentów Triple J w przetargu',
        due_date: '2026-08-20',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Allium + BlueNeem for dr Janusz Głuchowski
    id: 'rep_20260810_usk_gluchowski',
    submit_date: '2026-08-10T15:45:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Urology',
    doctor_name: 'Janusz Głuchowski',
    doctor_title: 'dr',
    doctor_position: 'Chirurg Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T14:15:00',
    meeting_end: '2026-08-10T14:45:00',
    notes: 'Połączenie tematów: Stenty Allium oraz przetarg BlueNeem (stenty powlekane i Triple J).',
    topics: [
      {
        title: 'Allium',
        comment: 'Doktor przygotowuje się do listopadowego egzaminu specjalizacyjnego. Wszystkie kwestie przetargowe i nowe wdrożenia kliniczne zostały odłożone do czasu zakończenia egzaminu.',
        next_steps: 'Zadzwonić na początku listopada i umówić spotkanie po egzaminie',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'Przypomniano o stentach powlekanych i Triple J do ujęcia w przetargu oddziałowym. Zgodnie z ustaleniami temat zostanie podjęty po sesji egzaminacyjnej w listopadzie.',
        next_steps: 'Kontakt w listopadzie ws. procedury przetargowej',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Zadzwonić na początku listopada do dr. Głuchowskiego i umówić spotkanie przetargowe po egzaminie',
        due_date: '2026-11-05',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260810_usk_glowinski',
    submit_date: '2026-08-10T16:00:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W BIAŁYMSTOKU',
    department_name: 'Vascular surgery',
    doctor_name: 'Jerzy Głowiński',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Kierownik Kliniki (Kierownik)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-10T15:00:00',
    meeting_end: '2026-08-10T15:45:00',
    notes: 'Prezentacja narzędzi naczyniowych Scanlan zaplanowana na wrzesień.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Wznowiono rozmowy dotyczące mikroinstrumentarium naczyniowego Scanlan. Poinformowano o dostępności walizki demonstracyjnej we wrześniu. Ustalono termin oficjalnej prezentacji w klinice na 14 września.',
        next_steps: 'Przygotować walizkę demonstracyjną do prezentacji 14 września',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Przygotować walizkę demonstracyjną Scanlan i przeprowadzić prezentację w klinice naczyniowej USK 14 września',
        due_date: '2026-09-14',
        is_done: false
      }
    ]
  },

  // ==================== BIAŁYSTOK - WSZZ ŚNIADECKIEGO (12.08.2026) ====================
  {
    // MERGED: Allium + BlueNeem for plg Barbara Gryniewicz
    id: 'rep_20260812_wszz_gryniewicz',
    submit_date: '2026-08-12T15:00:00',
    status: 'submitted',
    hospital_name: 'SP ZOZ WOJEWÓDZKI SZPITAL ZESPOLONY IM. J. ŚNIADECKIEGO',
    department_name: 'Urology',
    doctor_name: 'Barbara Gryniewicz',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-12T12:00:00',
    meeting_end: '2026-08-12T12:45:00',
    notes: 'Połączenie tematów: Opisy przetargowe na stenty Allium oraz prowadniki i rozszerzadła BlueNeem.',
    topics: [
      {
        title: 'Allium',
        comment: 'Rozmowa o przygotowaniach do nadchodzącego przetargu na stenty moczowodowe. Pielęgniarka oddziałowa poprosiła o przesłanie szczegółowych opisów parametrów technicznych do SIWZ.',
        next_steps: 'Przesłać opisy przetargowe stentów Allium',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'Omówiono zapotrzebowanie na prowadniki hydrofilne HydroTwist oraz rozszerzadła jednokrokowe (OneStep). Pielęgniarka poprosiła o przesłanie opisów i kart katalogowych drogą mailową.',
        next_steps: 'Przesłać opisy i specyfikacje BlueNeem do przetargu',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Przesłać opisy techniczne stentów Allium do SIWZ dla piel. Barbary Gryniewicz',
        due_date: '2026-08-18',
        is_done: false
      },
      {
        description: 'Przesłać specyfikację prowadników HydroTwist i rozszerzadeł OneStep BlueNeem na e-mail',
        due_date: '2026-08-18',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Allium + BlueNeem for dr Adam Ostasiewicz
    id: 'rep_20260812_wszz_ostasiewicz',
    submit_date: '2026-08-12T15:15:00',
    status: 'submitted',
    hospital_name: 'SP ZOZ WOJEWÓDZKI SZPITAL ZESPOLONY IM. J. ŚNIADECKIEGO',
    department_name: 'Urology',
    doctor_name: 'Adam Ostasiewicz',
    doctor_title: 'dr',
    doctor_position: 'Chirurg Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-08-12T13:00:00',
    meeting_end: '2026-08-12T13:45:00',
    notes: 'Połączenie tematów: Przełożony zabieg implantacji stentu Allium oraz przetarg BlueNeem.',
    topics: [
      {
        title: 'Allium',
        comment: 'Zabieg implantacji stentu planowany na 1 sierpnia został przesunięty z uwagi na konieczność rozcięcia zwężeń u pacjenta. Wdrożenie stentu zaplanowano na kolejny tydzień lub za dwa tygodnie. Doktor poinformuje o wyznaczonym terminie operacji.',
        next_steps: 'Zadzwonić i potwierdzić termin obecności na bloku operacyjnym',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'Potwierdzono zainteresowanie rozszerzadłami One Step oraz prowadnikami hydrofilnymi w planowanym przetargu oddziałowym. Szczegóły ujęcia asortymentu należy uzgodnić z pielęgniarką oddziałową.',
        next_steps: 'Skonsultować szczegóły z pielęgniarką oddziałową',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Skontaktować się z dr. Ostasiewiczem ws. nowego terminu implantacji stentu Allium na bloku operacyjnym',
        due_date: '2026-08-19',
        is_done: false
      },
      {
        description: 'Uzgodnić z oddziałową urologii ujęcie rozszerzadeł OneStep i prowadników BlueNeem w przetargu',
        due_date: '2026-08-19',
        is_done: false
      }
    ]
  },

  // ==================== GRAJEWO (06.08.2026) ====================
  {
    id: 'rep_20260806_grajewo_czaczkowski',
    submit_date: '2026-08-06T15:00:00',
    status: 'submitted',
    hospital_name: 'SZPITAL OGÓLNY IM. DR WITOLDA GINELA W GRAJEWIE',
    department_name: 'General surgery',
    doctor_name: 'Antoni Czaczkowski',
    doctor_title: 'dr',
    doctor_position: 'Ordynator (Chief)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-06T13:00:00',
    meeting_end: '2026-08-06T13:30:00',
    notes: 'Prezentacja matryc biologicznych Biosis w polach skażonych.',
    topics: [
      {
        title: 'Biosis',
        comment: 'Materiały biologiczne są dobrze znane ordynatorowi. Szczegółowo omówiono zastosowanie matrycy w polach zakażonych, szybki czas przygotowania do implantacji oraz integrację z tkankami pacjenta. Doktor bardzo pozytywnie przyjął argumentację i poprosił o przesłanie oferty cenowej drogą mailową.',
        next_steps: 'Wysłać ofertę na siatki biologiczne Biosis',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Wysłać ofertę cenową na matryce biologiczne Biosis do dr. Antoniego Czaczkowskiego w Grajewie',
        due_date: '2026-08-13',
        is_done: false
      }
    ]
  },

  // ==================== SIEDLCE (13-14.08.2026) ====================
  {
    // MERGED: Scanlan + Scanlan SU for plg Monika Czarnocka
    id: 'rep_20260813_siedlce_czarnocka',
    submit_date: '2026-08-13T14:30:00',
    status: 'submitted',
    hospital_name: 'MAZOWIECKI SZPITAL WOJEWÓDZKI IM. ŚW. JANA PAWŁA II W SIEDLCACH SP. Z O.O.',
    department_name: 'Operation room',
    doctor_name: 'Monika Czarnocka',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa Bloku (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-13T09:00:00',
    meeting_end: '2026-08-13T09:45:00',
    notes: 'Połączenie tematów: Ścieżka zakupowa narzędzi Scanlan oraz testy zacisków Bulldog i Suture Boots.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Blok operacyjny jest dysponentem narzędzi i realizuje zakupy na bezpośredni wniosek ordynatorów oddziałów zabiegowych. W celu wdrożenia narzędzi wielorazowych należy przedstawić ofertę ordynatorom.',
        next_steps: 'Omówić zakup narzędzi Scanlan bezpośrednio z ordynatorami oddziałów',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan SU',
        comment: 'Pielęgniarka oddziałowa wyraziła duże zainteresowanie jednorazowymi zaciskami naczyniowymi Bulldog oraz osłonkami Suture Boots. Wyraziła chęć przeprowadzenia prób klinicznych na bloku operacyjnym.',
        next_steps: 'Zorganizować testy zacisków Bulldog i Suture Boots na bloku operacyjnym',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Zorganizować i dostarczyć próbki zacisków Scanlan Bulldog i Suture Boots do testów na bloku w Siedlcach',
        due_date: '2026-08-20',
        is_done: false
      },
      {
        description: 'Przedstawić ofertę katalogową narzędzi Scanlan ordynatorom oddziałów zabiegowych w Siedlcach',
        due_date: '2026-08-27',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Biosis + Orascoptic + Scanlan for dr Wiktor Jodkowski
    id: 'rep_20260813_siedlce_jodkowski',
    submit_date: '2026-08-13T14:45:00',
    status: 'submitted',
    hospital_name: 'MAZOWIECKI SZPITAL WOJEWÓDZKI IM. ŚW. JANA PAWŁA II W SIEDLCACH SP. Z O.O.',
    department_name: 'Pediatric surgery',
    doctor_name: 'Wiktor Jodkowski',
    doctor_title: 'dr',
    doctor_position: 'Ordynator (Chief)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-13T10:00:00',
    meeting_end: '2026-08-13T10:45:00',
    notes: 'Połączenie tematów: Siatki Biosis, optyka Orascoptic oraz instrumentarium chirurgiczne Scanlan.',
    topics: [
      {
        title: 'Biosis',
        comment: 'Ordynator zna siatki biologiczne, lecz ze względu na profil wiekowy pacjentów rzadko miewa wskazania do implantacji. Zainteresował się jednak zastosowaniem w powikłanych zakażeniach i poprosił o przesłanie oferty cenowej e-mailem.',
        next_steps: 'Przesłać cennik i materiały Biosis drogą mailową',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Orascoptic',
        comment: 'Lupy i światło czołowe zyskały pozytywną ocenę techniczną, lecz w bieżącej specyfice zabiegów oddziału nie są wymagane powiększenia optyczne.',
        next_steps: 'Brak dalszych działań w zakresie lup na tym oddziale',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Doktor zidentyfikował narzędzia przydatne w zabiegach pediatrycznych, lecz oddział nie ma obecnie wolnego budżetu. Warto monitorować temat w perspektywie kolejnych planów zakupowych.',
        next_steps: 'Utrzymywać kontakt i przypominać o narzędziach Scanlan',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Wysłać ofertę cenową i karty charakterystyki matryc Biosis do dr. Wiktora Jodkowskiego',
        due_date: '2026-08-20',
        is_done: false
      },
      {
        description: 'Przypominać o ofercie narzędzi Scanlan przy planowaniu kolejnych budżetów oddziału',
        due_date: '2026-09-15',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260813_siedlce_radzikowska',
    submit_date: '2026-08-13T15:00:00',
    status: 'submitted',
    hospital_name: 'MAZOWIECKI SZPITAL WOJEWÓDZKI IM. ŚW. JANA PAWŁA II W SIEDLCACH SP. Z O.O.',
    department_name: 'Pediatric surgery',
    doctor_name: 'Małgorzata Radzikowska',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa (HN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-13T11:00:00',
    meeting_end: '2026-08-13T11:30:00',
    notes: 'Zapytanie o narzędzia do zabiegów w trybie chirurgii jednego dnia.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Pielęgniarka oddziałowa zapytała o dedykowane instrumentarium do procedur jednodniowych. Przekazano katalogi papierowe do wyboru asortymentu oraz uzgodniono przesłanie wersji elektronicznej.',
        next_steps: 'Przesłać link do elektronicznego katalogu Scanlan na e-mail',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Wysłać link do interaktywnego katalogu Scanlan do piel. Małgorzaty Radzikowskiej',
        due_date: '2026-08-18',
        is_done: false
      }
    ]
  },
  {
    id: 'rep_20260814_siedlce_wisniewska',
    submit_date: '2026-08-14T11:00:00',
    status: 'submitted',
    hospital_name: 'MAZOWIECKI SZPITAL WOJEWÓDZKI IM. ŚW. JANA PAWŁA II W SIEDLCACH SP. Z O.O.',
    department_name: 'Sterilization department',
    doctor_name: 'Katarzyna Wiśniewska',
    doctor_title: 'plg',
    doctor_position: 'Zastępca Pielęgniarki Oddziałowej (vHN)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-14T09:30:00',
    meeting_end: '2026-08-14T10:15:00',
    notes: 'Prezentacja portfolio sterylizacyjnego na próbkach fizycznych.',
    topics: [
      {
        title: 'Scanlan SU / EasyTags, TipGuards & SurgyBands',
        comment: 'Zaprezentowano próbki asortymentu ochronnego. Wyraźne zainteresowanie wzbudziły etykiety Easy Tags, perforowane osłonki Tip Guards oraz opaski silikonowe SurgyBands. Przy wycenie należy bezwzględnie dołączyć badania walidacji sterylizacji opasek SurgyBands.',
        next_steps: 'Przesłać wycenę EasyTags, TipGuards i SurgyBands wraz z badaniami sterylności',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Przesłać wycenę na EasyTags, perforowane TipGuards i SurgyBands z załączonymi wynikami badań sterylizacji',
        due_date: '2026-08-21',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Allium + Scanlan robotic + Scanlan open + BlueNeem for dr Piotr Kania
    id: 'rep_20260813_siedlce_kania',
    submit_date: '2026-08-13T15:30:00',
    status: 'submitted',
    hospital_name: 'MAZOWIECKI SZPITAL WOJEWÓDZKI IM. ŚW. JANA PAWŁA II W SIEDLCACH SP. Z O.O.',
    department_name: 'Urology',
    doctor_name: 'Piotr Kania',
    doctor_title: 'dr',
    doctor_position: 'Zastępca Ordynatora (hd)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-13T12:00:00',
    meeting_end: '2026-08-13T13:00:00',
    notes: 'Połączenie tematów: Stenty Allium (URS/BUS/TPS), zaciski da Vinci Bulldog, narzędzia otwarte Scanlan oraz rozszerzadła BlueNeem.',
    topics: [
      {
        title: 'Allium',
        comment: 'Oddział posiada na stanie magazynowym stenty URS, BUS oraz TPS i wykonuje implantacje w razie wskazań. Doktor wyraził potrzebę zapoznania się z szerszymi materiałami klinicznymi i opisami procedur, w których stent Allium przyniósł optymalne rezultaty.',
        next_steps: 'Zorganizować spotkanie i dostarczyć materiały kliniczne o procedurach Allium',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan Robotic & Open',
        comment: 'Oddział bardzo często operuje w asyście robota da Vinci. Doktor zadeklarował chęć zakupu zacisków naczyniowych BullDog dedykowanych do chirurgii robotycznej (niewymagających trzymania przez asystenta) i chętnie przetestuje je na bloku. W kwestii narzędzi do chirurgii otwartej temat pozostaje otwarty w miarę dostępności środków.',
        next_steps: 'Zorganizować testy zacisków Scanlan da Vinci Bulldog na bloku',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'Podczas omawiania stentów poruszono kwestię akcesoriów pomocniczych. Doktor wyraził zainteresowanie rozszerzadłami jednokrokowymi (OneStep) oraz hydrofilnymi prowadnikami.',
        next_steps: 'Zorganizować próbki testowe rozszerzadeł i prowadników BlueNeem',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Dostarczyć dr. Kani publikacje i opisy procedur implantacji stentów Allium',
        due_date: '2026-08-20',
        is_done: false
      },
      {
        description: 'Zorganizować testy zacisków Scanlan da Vinci Bulldog do operacji robotycznych na bloku w Siedlcach',
        due_date: '2026-08-27',
        is_done: false
      },
      {
        description: 'Przygotować i dostarczyć zestaw testowy rozszerzadeł OneStep i prowadników hydrofilnych BlueNeem',
        due_date: '2026-08-27',
        is_done: false
      }
    ]
  },
  {
    // MERGED: Biosis + TisgenX + Scanlan + Orascoptic for dr Piotr Sienkiewicz
    id: 'rep_20260813_siedlce_sienkiewicz',
    submit_date: '2026-08-13T16:00:00',
    status: 'submitted',
    hospital_name: 'MAZOWIECKI SZPITAL WOJEWÓDZKI IM. ŚW. JANA PAWŁA II W SIEDLCACH SP. Z O.O.',
    department_name: 'Vascular surgery',
    doctor_name: 'Piotr Sienkiewicz',
    doctor_title: 'dr',
    doctor_position: 'Zastępca Ordynatora (hd)',
    meeting_type: 'Normal',
    meeting_start: '2026-08-13T13:30:00',
    meeting_end: '2026-08-13T14:30:00',
    notes: 'Połączenie tematów: Narzędzia naczyniowe i tunelizatory Scanlan, lampa Orascoptic Endeavour oraz matryce Biosis/TisgenX.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Bardzo pozytywny odbiór instrumentarium Scanlan. Doktor wyraził chęć przetestowania wybranych narzędzi podczas operacji naczyniowych. Szczególne zainteresowanie wzbudziły tunelizatory, a zwłaszcza zielone koszulki z tworzywa w największym rozmiarze. Ustalono spotkanie z walizką demonstracyjną w celu doboru narzędzi do testów.',
        next_steps: 'Przesłać wycenę i umówić spotkanie z walizką demonstracyjną Scanlan',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Orascoptic',
        comment: 'Duże zainteresowanie wzbudziło oświetlenie czołowe Endeavour. Doktor przymierzył lampę do swoich okularów operacyjnych i poprosił o przesłanie wyceny.',
        next_steps: 'Wysłać ofertę na światło czołowe Orascoptic Endeavour',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Biosis & TisgenX',
        comment: 'Zespół testował w przeszłości matryce biologiczne w chirurgii przepuklin i zespoleniach naczyniowych, zrezygnował z nich na rzecz siatek syntetycznych i standardowych procedur. Na ten moment brak planów testowania matryc biologicznych.',
        next_steps: 'Monitorować okazjonalnie',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      {
        description: 'Przesłać wycenę na światło czołowe Orascoptic Endeavour do dr. Piotra Sienkiewicza',
        due_date: '2026-08-20',
        is_done: false
      },
      {
        description: 'Umówić spotkanie z walizką demonstracyjną Scanlan i dostarczyć próbniki tunelizatorów naczyniowych',
        due_date: '2026-09-05',
        is_done: false
      }
    ]
  }
];
