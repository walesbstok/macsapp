import { Doctor, Meeting, Task, Department } from './types';
import { SEED_REPORTS_BATCH_1 } from './data/seedReportsBatch1';
import { SEED_REPORTS_BATCH_2 } from './data/seedReportsBatch2';
import { SEED_REPORTS_BATCH_3 } from './data/seedReportsBatch3';
import { SEED_REPORTS_BATCH_4 } from './data/seedReportsBatch4';

export interface SeedReport {
  id: string;
  submit_date: string;
  status: 'submitted' | 'accepted' | 'rejected';
  status_updated_by?: string;
  status_comment?: string;
  hospital_name: string;
  department_name: string;
  doctor_name: string;
  doctor_title?: string;
  doctor_position?: string;
  meeting_type: string;
  meeting_start: string;
  meeting_end: string;
  notes?: string;
  topics: {
    title: string;
    comment: string;
    next_steps?: string;
    person_to_contact?: string;
    deadline?: string;
  }[];
  tasks: {
    description: string;
    due_date: string;
    is_done: boolean;
  }[];
}

export const SEED_REPORTS: SeedReport[] = [
  // ==================== PDF 1: OLSZTYN & AUGUSTÓW ====================
  {
    id: '16286',
    submit_date: '2026-05-21T15:07:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W OLSZTYNIE',
    department_name: 'Urology',
    doctor_name: 'Adam Kałużny',
    doctor_title: 'DR',
    doctor_position: 'Normal',
    meeting_type: 'Normal',
    meeting_start: '2026-05-21T08:00:00',
    meeting_end: '2026-05-21T08:25:00',
    notes: 'Wysoce obiecujące spotkanie ws. Scanlan i Orascoptic. Pokazano narzędzia LC oraz lupy 3.0.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Pokazano kilka narzędzi Scanlan, doktor był bardzo zadowolony i chciałby je przetestować podczas operacji. Uzgodniono kontakt z Pielęgniarką Oddziałową Ewą Łazińską ws. dokumentów testowych.',
        next_steps: 'Wysłać katalog na email, ustalić z pielęgniarką oddziałową dokumenty do testów',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Orascoptic',
        comment: 'Przedstawiono lupy Orascoptic. Doktor obecnie pracuje na 3.5, prosił o ofertę na model 3.0 do zabiegów plastyki cewki moczowej.',
        next_steps: 'Wysłać ofertę na lupy 3.0, omówić z ordynatorem i dyrekcją potencjalne zamówienie',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać katalog Scanlan e-mailem oraz ustalić z piel. Ewą Łazińską dokumentację do testów', due_date: '2026-05-28', is_done: true },
      { description: 'Przygotować i przesłać ofertę na lupy Orascoptic 3.0 dla dr. Kałużnego', due_date: '2026-05-28', is_done: true },
      { description: 'Zaplanować wizytę z walizką demonstracyjną Scanlan na kolejny dyżur dr. Kałużnego', due_date: '2026-06-05', is_done: false }
    ]
  },
  {
    id: '16284',
    submit_date: '2026-05-21T14:44:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W OLSZTYNIE',
    department_name: 'Urology',
    doctor_name: 'Robert Liss',
    doctor_title: 'dr',
    doctor_position: 'HD',
    meeting_type: 'Normal',
    meeting_start: '2026-05-21T07:45:00',
    meeting_end: '2026-05-21T08:30:00',
    notes: 'Oferta stenty Allium oraz kaniule BlueNeem.',
    topics: [
      {
        title: 'Allium',
        comment: 'Rozmowa o pacjencie po przeszczepie nerki ze zwężeniem moczowodu. Doktor chce wdrożyć stenty Allium przy wsparciu proktora.',
        next_steps: 'Wysłać ofertę na 3 pacjentów Allium+BlueNeem',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Zainteresowanie narzędziami mikrochirurgicznymi LC. Doktor zasugerował również kontakt z dr. Kałużnym.',
        next_steps: 'Zorganizować zestaw mikro-narzędzi LC na kolejną wizytę',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać ofertę stenty Allium + BlueNeem dla 3 kwalifikowanych pacjentów', due_date: '2026-05-28', is_done: true },
      { description: 'Skompletować zestaw demonstracyjny Scanlan LC na kolejną wizytę w Olsztynie', due_date: '2026-06-04', is_done: false }
    ]
  },
  {
    id: '16282',
    submit_date: '2026-05-21T14:29:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    hospital_name: 'UNIWERSYTECKI SZPITAL KLINICZNY W OLSZTYNIE',
    department_name: 'General surgery',
    doctor_name: 'Marek Kowalczyk',
    doctor_title: 'DR',
    doctor_position: 'Normal',
    meeting_type: 'Normal',
    meeting_start: '2026-05-21T13:00:00',
    meeting_end: '2026-05-21T13:45:00',
    notes: 'Prezentacja siatek biologicznych Biosis.',
    topics: [
      {
        title: 'Biosis',
        comment: 'Doktor nie znał wcześniej siatek biologicznych. Przedstawiono badania nt. właściwości przeciwbakteryjnych i profilu wchłaniania.',
        next_steps: 'Przesłać publikacje naukowe i listę ośrodków stosujących Biosis',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Zaprezentowano wybrane narzędzia Scanlan. Szpital obecnie używa podstawowego sprzętu, brak budżetu na natychmiastowy zakup.',
        next_steps: 'Przypominać o narzędziach Scanlan przy okazji kolejnych przetargów',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać dr. Kowalczykowi publikacje ws. właściwości przeciwbakteryjnych Biosis', due_date: '2026-06-01', is_done: true },
      { description: 'Utrzymywać kontakt i ponowić temat Scanlan przy tworzeniu planu zakupowego', due_date: '2026-06-20', is_done: false }
    ]
  },
  {
    id: '16070',
    submit_date: '2026-05-13T12:50:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    status_comment: 'Super raport, świetna praca dopinająca oferty.',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE',
    department_name: 'General surgery',
    doctor_name: 'Zdzisław Pyłko',
    doctor_title: 'dr',
    doctor_position: 'Chief',
    meeting_type: 'Normal',
    meeting_start: '2026-05-13T07:45:00',
    meeting_end: '2026-05-13T08:15:00',
    notes: 'Odprawa lekarska i ustalenie potrzeb sprzętowych dla Augustowa.',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Dwóch chirurgów zainteresowanych kupnem nowych lup HDL 2.5x oraz źródła światła Endeavour MD.',
        next_steps: 'Zorganizować testy na bloku operacyjnym',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Zapotrzebowanie na nożyczki preparacyjne z powłoką SuperCut (np. 7007-211SC, 7007-218-3SC).',
        next_steps: 'Dostarczyć wzorce do testów na bloku',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan SU',
        comment: 'Zainteresowanie zaciskami silikonowymi Degania oraz klipsami jednorazowymi.',
        next_steps: 'Przygotować ofertę i specyfikację techniczną',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać ofertę cenową na lupy Orascoptic HDL 2.5x oraz światło Endeavour MD', due_date: '2026-05-20', is_done: true },
      { description: 'Zorganizować zestaw testowy nożyczek Scanlan SuperCut na blok operacyjny', due_date: '2026-05-25', is_done: true },
      { description: 'Omówić z pielęgniarką oddziałową bloku operacyjnego zamówienie na akcesoria jednorazowe Scanlan SU', due_date: '2026-05-29', is_done: false }
    ]
  },
  {
    id: '16071',
    submit_date: '2026-05-13T14:10:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W OLSZTYNIE',
    department_name: 'Urology',
    doctor_name: 'Janusz Banasik',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Ordynator',
    meeting_type: 'Normal',
    meeting_start: '2026-05-13T09:30:00',
    meeting_end: '2026-05-13T10:15:00',
    notes: 'Spotkanie z Ordynatorem nt. modernizacji sprzętu i spoinowania mostków Neos SternFix.',
    topics: [
      {
        title: 'Neos Sternfix',
        comment: 'Przedstawiono zalety biomechaniczne Neos SternFix w stosunku do tradycyjnych szwów stalowych.',
        next_steps: 'Zaplanować warsztaty Sawbones dla zespołu',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Omówienie zapotrzebowania na dedykowane narzędzia do urologii rekonstrukcyjnej.',
        next_steps: 'Przesłać kompletny katalog urologiczny Scanlan',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać Ordynatorowi Banasikowi kompletny katalog Scanlan Urology', due_date: '2026-05-20', is_done: true },
      { description: 'Ustalenie terminu warsztatów technicznych SternFix z udziałem lekarzy z oddziału', due_date: '2026-06-10', is_done: false }
    ]
  },

  // ==================== PDF 2: GDAŃSK UCK ====================
  {
    id: '16616',
    submit_date: '2026-06-01T21:45:00',
    status: 'accepted',
    status_updated_by: 'Aldona Kalinowska',
    status_comment: 'Rekomenduję powtórzenie prezentacji demonstracyjnej z całym zespołem kardiochirurgów.',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Cardiac surgery',
    doctor_name: 'Rafał Pawlaczyk',
    doctor_title: 'dr hab. med.',
    doctor_position: 'Zastępca Ordynatora',
    meeting_type: 'Normal',
    meeting_start: '2026-05-29T09:07:00',
    meeting_end: '2026-05-29T09:52:00',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Doktor zainteresowany lupami 3.5x. Przymierzał różne modele i powiększenia. Omówiono zniżki rezydenckie.',
        next_steps: 'Brakować stały kontakt, przesłać spersonalizowaną ofertę',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Neos Sternfix',
        comment: 'Wyjaśniono przypadek usunięcia systemu u pacjenta – powodem było zakażenie rany, a nie wada materiałowa systemu.',
        next_steps: 'Monitorować kolejne aplikacje SternFix na kardiochirurgii',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Utrzymywać kontakt z dr. Pawlaczykiem i przesłać ofertę na lupy 3.5x z rabatem rezydenckim', due_date: '2026-06-15', is_done: true },
      { description: 'Dostarczyć materiały kliniczne potwierdzające stabilność Neos SternFix przy powikłanych gojeniach', due_date: '2026-06-25', is_done: false }
    ]
  },
  {
    id: '16615',
    submit_date: '2026-06-01T21:42:00',
    status: 'accepted',
    status_updated_by: 'Aldona Kalinowska',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Sterilization department',
    doctor_name: 'Andrzej Tomasik',
    doctor_title: 'mgr',
    doctor_position: 'Kierownik Sterylizatorni',
    meeting_type: 'Presentation',
    meeting_start: '2026-06-01T11:30:00',
    meeting_end: '2026-06-01T11:57:00',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Przeprowadzono prezentację dla zespołu sterylizatorni dot. prawidłowego mycia i pielęgnacji narzędzi Scanlan Scanturian oraz rozwieraczy Genesee.',
        next_steps: 'Przesłać protokoły mycia oraz instrukcje konserwacji w języku polskim',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać mgr. Tomasikowi polskie instrukcje walidacji i konserwacji narzędzi Scanlan', due_date: '2026-06-15', is_done: true },
      { description: 'Sprawdzić stan mat sterylizacyjnych Scanturian po 2 tygodniach użytkowania', due_date: '2026-06-20', is_done: false }
    ]
  },
  {
    id: '16614',
    submit_date: '2026-06-01T21:41:00',
    status: 'accepted',
    status_updated_by: 'Aldona Kalinowska',
    status_comment: 'Wstępna zgoda na spotkanie w połowie lipca z walizką demonstracyjną.',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Cardiac surgery',
    doctor_name: 'Dariusz Jagielak',
    doctor_title: 'dr hab. n. med.',
    doctor_position: 'Kardiochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-05-29T11:02:00',
    meeting_end: '2026-05-29T11:06:00',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Zaprezentowano lupy i oświetlenie. Dr Jagielak oraz dr Magdalena wstępnie wybrali powiększenie 3.0 ze względu na większą głębię ostrości.',
        next_steps: 'Konieczna wizyta kontrolna z lupami 3.0',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przeprowadzić wizytę dopasowującą lupy Orascoptic 3.0 dla dr. Jagielaka i dr Magdaleny', due_date: '2026-07-15', is_done: false },
      { description: 'Przygotować wycenę indywidualną z ramkami XV1 i oświetleniem LED', due_date: '2026-07-18', is_done: false }
    ]
  },
  {
    id: '16612',
    submit_date: '2026-06-01T21:38:00',
    status: 'accepted',
    status_updated_by: 'Aldona Kalinowska',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Operation room',
    doctor_name: 'Ewa Główczewska',
    doctor_title: 'mgr',
    doctor_position: 'Oddziałowa Bloku Operacyjnego',
    meeting_type: 'Presentation',
    meeting_start: '2026-05-29T07:30:00',
    meeting_end: '2026-05-29T08:10:00',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Szkolenie instrumentariuszek z obsługi rozwieraczy Genesee MiniMax i rozwieraczy mostkowych.',
        next_steps: 'Utrzymywać stały kontakt z blokiem operacyjnym',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Utrzymywać kontakt z pielęgniarkami bloku kardiochirurgicznego nt. zużycia akcesoriów Scanlan', due_date: '2026-06-15', is_done: true },
      { description: 'Dostarczyć dodatkowe osłonki TipGuard do zabezpieczania końcówek mikronarzędzi', due_date: '2026-06-30', is_done: false }
    ]
  },
  {
    id: '16611',
    submit_date: '2026-06-01T21:34:00',
    status: 'accepted',
    status_updated_by: 'Aldona Kalinowska',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Administration',
    doctor_name: 'Daniel Dywelski',
    doctor_title: 'mgr',
    doctor_position: 'Specjalista ds. Zakupów',
    meeting_type: 'Normal',
    meeting_start: '2026-05-29T10:06:00',
    meeting_end: '2026-05-29T10:52:00',
    topics: [
      {
        title: 'Other',
        comment: 'Przekazano podpisane protokoły przeszkolenia personelu z ostatnich dwóch dni. Uzgodniono kryteria fakturowania i nadchodzące przetargi.',
        next_steps: 'Bieżący kontakt ws. dokumentacji przetargowej',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Pozostawać w kontakcie z mgr. Danielem Dywelskim ws. kryteriów przetargu na narzędzia specjalistyczne', due_date: '2026-06-15', is_done: true },
      { description: 'Przesłać uzupełnione formularze cenowe dla działu zamówień publicznych', due_date: '2026-06-22', is_done: false }
    ]
  },
  {
    id: '16610',
    submit_date: '2026-06-01T21:32:00',
    status: 'accepted',
    status_updated_by: 'Aldona Kalinowska',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Thoracic surgery',
    doctor_name: 'Żurek',
    doctor_title: 'dr',
    doctor_position: 'Torakochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-05-29T12:00:00',
    meeting_end: '2026-05-29T12:30:00',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Omówiono procedury robotyczne (Versius/DaVinci) i zastosowanie zacisków Scanlan Bulldog. Wyrażono chęć przetestowania zacisków naczyniowych.',
        next_steps: 'Umawiać testy zacisków Bulldog z prof. Rzymanem i dr. Sternau',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Neos Sternfix',
        comment: 'Omówiono system SternFix w chirurgii klatki piersiowej. Produkt wartościowy przy rzadkich rozległych resekcjach.',
        next_steps: 'Brak bezpośrednich zadań',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Zaplanować testy zacisków Scanlan Bulldog z prof. Rzymanem i dr. Sternau na operacjach robotycznych', due_date: '2026-06-15', is_done: true },
      { description: 'Przygotować dedykowaną ofertę na kleszczyki i zaciski naczyniowe do torakochirurgii', due_date: '2026-06-28', is_done: false }
    ]
  },

  // ==================== PDF 3: BIAŁYSTOK MSWIA & USK ====================
  {
    id: '16359',
    submit_date: '2026-05-24T18:49:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    status_comment: 'Świetny raport, dokładny opis planu działania.',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Urology',
    doctor_name: 'Tomasz Lemiesz',
    doctor_title: 'dr',
    doctor_position: 'Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-05-24T11:00:00',
    meeting_end: '2026-05-24T11:57:00',
    topics: [
      {
        title: 'BlueNeem',
        comment: 'Przypomniano o aktywnym przetargu na rozszerzadła OneStep Dilators oraz kaniule HydroTwister.',
        next_steps: 'Monitorować bieg przetargu',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Omówiono zaciski Bulldog do zabiegów cystektomii i rekonstrukcji cewki. Szpital planuje zakup robota Versius.',
        next_steps: 'Przypomnieć o zaciskach Bulldog przed uruchomieniem robota',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przypomnieć dr. Lemieszowi o aktywnym przetargu na rozszerzadła OneStep Dilators', due_date: '2026-05-31', is_done: true },
      { description: 'Przygotować specyfikację na zaciski Scanlan Bulldog pod kątem zabiegów robotycznych Versius', due_date: '2026-06-10', is_done: false }
    ]
  },
  {
    id: '16358',
    submit_date: '2026-05-24T18:40:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Urology',
    doctor_name: 'Adam Nowiński',
    doctor_title: 'dr',
    doctor_position: 'Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-05-24T11:53:00',
    meeting_end: '2026-05-24T11:57:00',
    notes: 'Spotkanie razem z dr. Gałkiem.',
    topics: [
      {
        title: 'BlueNeem',
        comment: 'Dr Gałek zadeklarował chęć zakupu prowadnic HydroTwister. Dr Nowiński bardzo chwalił rozszerzadła OneStep.',
        next_steps: 'Wysłać ofertę na rozszerzadła i przypomnieć o narzędziach Scanlan',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać ofertę na rozszerzadła OneStep oraz kaniule HydroTwister dla dr. Gałka i dr. Nowińskiego', due_date: '2026-05-31', is_done: true },
      { description: 'Dostarczyć próbne próbki stentu urologicznego do oceny klinicznej', due_date: '2026-06-15', is_done: false }
    ]
  },
  {
    id: '16357',
    submit_date: '2026-05-24T17:10:00',
    status: 'accepted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'General surgery',
    doctor_name: 'Krzysztof Pawłowski',
    doctor_title: 'dr n. med.',
    doctor_position: 'Chirurg Ogólny',
    meeting_type: 'Normal',
    meeting_start: '2026-05-24T10:00:00',
    meeting_end: '2026-05-24T10:30:00',
    topics: [
      {
        title: 'Biosis',
        comment: 'Prezentacja siatek biologicznych Biosis w rekonstrukcjach przepuklin powłok brzusznych w Polu skażonym.',
        next_steps: 'Przesłać próbkę materiału oraz kosztorys implantacji',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać dr. Pawłowskiemu ofertę i kalkulację kosztów siatki Biosis do rekonstrukcji rany powikłanej', due_date: '2026-06-05', is_done: true },
      { description: 'Zaplanować konsultację z proktorem ws. pierwszej kwalifikowanej operacji', due_date: '2026-06-25', is_done: false }
    ]
  },

  // ==================== PDF 4: SUWAŁKI WOJEWÓDZKI ====================
  {
    id: '18329',
    submit_date: '2026-08-05T12:20:00',
    status: 'submitted',
    hospital_name: 'SZPITAL WOJEWÓDZKI IM. DR. LUDWIKA RYDYGIERA W SUWAŁKACH',
    department_name: 'Urology',
    doctor_name: 'Krzysztof Pol',
    doctor_title: 'dr',
    doctor_position: 'Ordynator',
    meeting_type: 'Normal',
    meeting_start: '2026-08-05T11:00:00',
    meeting_end: '2026-08-05T12:15:00',
    notes: 'Prezentacja oddziałowa z udziałem lekarzy: dr Oskar Murawski, dr Michał Długi, dr Beata Karwowska-Bordzio.',
    topics: [
      {
        title: 'Allium',
        comment: 'Zaprezentowano stenty Allium i technikę implantacji. Zespół podjął decyzję o wytypowaniu 2-3 pacjentów do zabiegów demonstracyjnych.',
        next_steps: 'Follow up i ustalenie terminu zabiegów z udziałem proktora',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'Omówiono stenty Triple J. Lekarzom bardzo podobała się koncepcja dodatkowej pętli, poprosili o wycenę.',
        next_steps: 'Sprawdzić ofertę na Triple J',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Ordynator potwierdził zapotrzebowanie na nożyczki Scanlan do chirurgii otwartej.',
        next_steps: 'Przesłać ofertę cenową',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Skontaktować się z dr. Polem ws. wytypowania 2-3 pacjentów do zabiegu Allium', due_date: '2026-08-12', is_done: false },
      { description: 'Wysłać ofertę cenową na stenty Triple J oraz nożyczki Scanlan dla oddziału urologii w Suwałkach', due_date: '2026-08-12', is_done: false },
      { description: 'Potwierdzić dostępność proktora na planowany termin operacji Allium', due_date: '2026-08-20', is_done: false }
    ]
  },
  {
    id: '18328',
    submit_date: '2026-08-05T10:15:00',
    status: 'submitted',
    hospital_name: 'SZPITAL WOJEWÓDZKI IM. DR. LUDWIKA RYDYGIERA W SUWAŁKACH',
    department_name: 'General surgery',
    doctor_name: 'Piotr Kordowski',
    doctor_title: 'dr n. med.',
    doctor_position: 'Chirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-08-05T09:00:00',
    meeting_end: '2026-08-05T09:40:00',
    topics: [
      {
        title: 'Biosis',
        comment: 'Doktor zainteresowany matrycami Biosis przy chirurgii onkologicznej piersi i rekonstrukcji rany.',
        next_steps: 'Wysłać ofertę i opisy przypadków (case studies)',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Orascoptic',
        comment: 'Przymiarka lup Orascoptic 2.5x z oświetleniem Spark.',
        next_steps: 'Zorganizować kilkudniowy test w warunkach operacyjnych',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać dr. Kordowskiemu materiały naukowe Biosis oraz ofertę cenową', due_date: '2026-08-14', is_done: false },
      { description: 'Dostarczyć zestaw demonstracyjny Orascoptic 2.5x ze światłem Spark do testu w Suwałkach', due_date: '2026-08-22', is_done: false }
    ]
  },

  // ==================== PDF 5: AUGUSTÓW (AUG 2026) ====================
  {
    id: '18456',
    submit_date: '2026-08-07T13:45:00',
    status: 'submitted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ W AUGUSTOWIE',
    department_name: 'Operation room',
    doctor_name: 'Ewa Judycka',
    doctor_title: 'plg',
    doctor_position: 'Pielęgniarka Oddziałowa Bloku',
    meeting_type: 'Normal',
    meeting_start: '2026-08-06T11:30:00',
    meeting_end: '2026-08-06T12:00:00',
    topics: [
      {
        title: 'Scanlan SU',
        comment: 'Zainteresowanie odsysaczami Vacustat oraz taśmami Surgiloop. Otwarci na jednorazowe zaciski Bulldog.',
        next_steps: 'Wysłać ofertę na Vacustat i Surgiloop',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Orascoptic',
        comment: 'Skierowano do dr. Bacharewicza na ortopedii, specjalizującego się w chirurgii ręki i naczyniowej.',
        next_steps: 'Umawiać spotkanie z dr. Bacharewiczem',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać ofertę na Vacustat i taśmy Surgiloop do pielęgniarki oddziałowej Ewy Judyckiej', due_date: '2026-08-13', is_done: false },
      { description: 'Zaplanować spotkanie z dr. Bacharewiczem ws. lup Orascoptic dedykowanych do chirurgii ręki', due_date: '2026-08-13', is_done: false }
    ]
  },

  // ==================== PDF 6: ELBLĄG (WSZ ELBLĄG) ====================
  {
    id: '17201',
    submit_date: '2026-06-18T14:20:00',
    status: 'accepted',
    status_updated_by: 'Pawel Plesiak',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Urology',
    doctor_name: 'Jacek Grzechnik',
    doctor_title: 'dr n. med.',
    doctor_position: 'Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-06-18T10:00:00',
    meeting_end: '2026-06-18T10:45:00',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Prezentacja mikronarzędzi Scanlan do urologii. Doktor chwalił precyzję wykonania imadełek i nożyczek.',
        next_steps: 'Przesłać dedykowany katalog urologiczny i wycenę zestawu podstawowego',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Allium',
        comment: 'Omówienie stentów moczowodowych Allium przy nawracających zwężeniach moczowodu.',
        next_steps: 'Przesłać nagrania z operacji pokazowych',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać dr. Grzechnikowi katalog urologiczny Scanlan oraz materiały wideo Allium', due_date: '2026-06-25', is_done: true },
      { description: 'Zaplanować rozmowę ws. kwalifikacji pacjenta na zabieg ze stentem Allium w Elblągu', due_date: '2026-07-10', is_done: false }
    ]
  },
  {
    id: '17202',
    submit_date: '2026-06-18T15:00:00',
    status: 'accepted',
    hospital_name: 'WOJEWÓDZKI SZPITAL ZESPOLONY W ELBLĄGU',
    department_name: 'Urology',
    doctor_name: 'Piotr Stosik',
    doctor_title: 'dr',
    doctor_position: 'Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-06-18T11:00:00',
    meeting_end: '2026-06-18T11:30:00',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Przymiarka lup Orascoptic HDL 2.5x ze światłem Endeavour. Doktor ocenił pole widzenia bardzo wysoko.',
        next_steps: 'Przygotować wycenę indywidualną z grawerowaną ramką',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać wycenę na lupy Orascoptic HDL 2.5x ze światłem Endeavour dla dr. Stosika', due_date: '2026-06-25', is_done: true },
      { description: 'Ustalenie terminu finalnego zamówienia po zatwierdzeniu budżetu oddziału', due_date: '2026-07-15', is_done: false }
    ]
  },

  // ==================== PDF 7: EŁK (PRO-MEDICA) ====================
  {
    id: '17510',
    submit_date: '2026-06-25T13:10:00',
    status: 'accepted',
    hospital_name: 'PRO-MEDICA W EŁKU SP. Z O.O.',
    department_name: 'Urology',
    doctor_name: 'Grzegorz Sienkiewicz',
    doctor_title: 'dr',
    doctor_position: 'Ordynator',
    meeting_type: 'Normal',
    meeting_start: '2026-06-25T09:30:00',
    meeting_end: '2026-06-25T10:15:00',
    topics: [
      {
        title: 'BlueNeem',
        comment: 'Prezentacja zestawów rozszerzadeł OneStep Dilators oraz cewników Double J. Ordynator zadeklarował chęć wprowadzenia do stałych zakupów.',
        next_steps: 'Przesłać specyfikację do działu przetargów',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać specyfikację techniczną produktów BlueNeem do sekcji zamówień Pro-Medica w Ełku', due_date: '2026-07-02', is_done: true },
      { description: 'Dostarczyć próbne cewniki Double J do testów zabiegowych', due_date: '2026-07-20', is_done: false }
    ]
  },
  {
    id: '17511',
    submit_date: '2026-06-25T14:00:00',
    status: 'accepted',
    hospital_name: 'PRO-MEDICA W EŁKU SP. Z O.O.',
    department_name: 'General surgery',
    doctor_name: 'Wojciech Stankiewicz',
    doctor_title: 'dr n. med.',
    doctor_position: 'Chirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-06-25T10:30:00',
    meeting_end: '2026-06-25T11:00:00',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Przegląd imadełek Scanlan z wkładką twardą i nożyczek chirurgicznych. Szpital planuje doposażenie bloku.',
        next_steps: 'Przesłać wycenę na zestaw imadełek i nożyczek',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać zestawienie cenowe imadełek i nożyczek Scanlan dla dr. Stankiewicza', due_date: '2026-07-05', is_done: true },
      { description: 'Utrzymywać kontakt ws. rocznego planu zakupowego narzędzi w Ełku', due_date: '2026-07-25', is_done: false }
    ]
  },

  // ==================== PDF 8: GIŻYCKO ====================
  {
    id: '17801',
    submit_date: '2026-07-02T16:30:00',
    status: 'accepted',
    hospital_name: 'SZPITAL MIEJSKI W GIŻYCKU SP. Z O.O.',
    department_name: 'General surgery',
    doctor_name: 'Tomasz Kozłowski',
    doctor_title: 'dr',
    doctor_position: 'Ordynator',
    meeting_type: 'Normal',
    meeting_start: '2026-07-02T11:00:00',
    meeting_end: '2026-07-02T11:45:00',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Ordynator przetestował lupy Orascoptic 2.5x z ramką Victory. Podkreślił lekkość zestawu i czystość pola widzenia.',
        next_steps: 'Przygotować formalną ofertę dla szpitala w Giżycku',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Biosis',
        comment: 'Omówienie siatek Biosis w chirurgii nagłej.',
        next_steps: 'Przesłać ulotki informacyjne',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przygotować ofertę cenową na lupy Orascoptic 2.5x Victory dla dr. Kozłowskiego w Giżycku', due_date: '2026-07-10', is_done: true },
      { description: 'Dostarczyć ulotki Biosis i zaoferować szkolenie dla zespołu chirurgicznego', due_date: '2026-07-28', is_done: false }
    ]
  },

  // ==================== PDF 9: PISZ ====================
  {
    id: '18010',
    submit_date: '2026-07-10T12:15:00',
    status: 'accepted',
    hospital_name: 'SZPITAL POWIATOWY W PISZU',
    department_name: 'General surgery',
    doctor_name: 'Piotr Wysocki',
    doctor_title: 'dr',
    doctor_position: 'Chirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-07-10T09:00:00',
    meeting_end: '2026-07-10T09:35:00',
    topics: [
      {
        title: 'Biosis',
        comment: 'Doktor szuka optymalnych siatek biologicznych do trudnych rekonstrukcji rany operacyjnej. Zaprezentowano matryce Biosis.',
        next_steps: 'Przesłać kalkulację i protokół preparacji',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Wysłać dr. Wysockiemu protokół preparacji i kalkulację kosztów matryc Biosis w Piszu', due_date: '2026-07-17', is_done: true },
      { description: 'Zaplanować wizytę kontrolną przed planowaną operacją rekonstrukcyjną', due_date: '2026-08-05', is_done: false }
    ]
  },

  // ==================== PDF 10: TRÓJMIASTO (WEJHEROWO, GDYNIA, LĘBORK) ====================
  {
    id: '18150',
    submit_date: '2026-07-20T15:40:00',
    status: 'accepted',
    hospital_name: 'SZPITAL SPECJALISTYCZNY IM. F. CEYNOWY W WEJHEROWIE',
    department_name: 'Cardiac surgery',
    doctor_name: 'Janusz Rygiel',
    doctor_title: 'dr n. med.',
    doctor_position: 'Kardiochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-07-20T10:00:00',
    meeting_end: '2026-07-20T10:50:00',
    topics: [
      {
        title: 'Neos Sternfix',
        comment: 'Omówiono zalety zamykania klatki piersiowej systemem Neos SternFix u pacjentów z grupy wysokiego ryzyka (cukrzyca, otyłość).',
        next_steps: 'Zaplanować zabieg pokazowy na bloku operacyjnym w Wejherowie',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Zainteresowanie rozwieraczami mostkowymi Genesee.',
        next_steps: 'Dostarczyć rozwieracz na próbne testy',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Uzgodnić z dr. Rygielem termin pierwszej implantacji Neos SternFix w Wejherowie', due_date: '2026-07-27', is_done: true },
      { description: 'Zorganizować dostawę testową rozwieracza mostkowego Genesee dla bloku kardiochirurgii', due_date: '2026-08-10', is_done: false }
    ]
  },
  {
    id: '18151',
    submit_date: '2026-07-20T17:10:00',
    status: 'accepted',
    hospital_name: 'SZPITAL MORSKI IM. PCK W GDYNI',
    department_name: 'Thoracic surgery',
    doctor_name: 'Witold Szymański',
    doctor_title: 'dr',
    doctor_position: 'Torakochirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-07-20T12:00:00',
    meeting_end: '2026-07-20T12:40:00',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Prezentacja zacisków Bulldog Scanlan do zabiegów torakoskopowych VATS.',
        next_steps: 'Przesłać wycenę zacisków i zagiętych kleszczyków aplikacyjnych',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać dr. Szymańskiemu wycenę zacisków Scanlan Bulldog i aplikatorów VATS', due_date: '2026-07-28', is_done: true },
      { description: 'Ponowić kontakt ws. ewentualnego zapotrzebowania na lupy Orascoptic 3.0', due_date: '2026-08-15', is_done: false }
    ]
  },

  // ==================== PDF 11: BARTOSZYCE & DOBRE MIASTO ====================
  {
    id: '18220',
    submit_date: '2026-07-28T14:15:00',
    status: 'accepted',
    hospital_name: 'SZPITAL POWIATOWY W BARTOSZYCACH',
    department_name: 'General surgery',
    doctor_name: 'Robert Jankowski',
    doctor_title: 'dr',
    doctor_position: 'Chirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-07-28T09:30:00',
    meeting_end: '2026-07-28T10:10:00',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Omówienie potrzeb w zakresie wymiany zużytych narzędzi chirurgicznych.',
        next_steps: 'Przesłać propozycję pakietu regeneracyjnego i nowych narzędzi Scanlan',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać dr. Jankowskiemu w Bartoszycach ofertę na odnowienie zestawów chirurgicznych Scanlan', due_date: '2026-08-04', is_done: true },
      { description: 'Utrzymywać stałą łączność z pielęgniarką oddziałową chirurgii', due_date: '2026-08-18', is_done: false }
    ]
  },
  {
    id: '18221',
    submit_date: '2026-07-28T16:00:00',
    status: 'accepted',
    hospital_name: 'SZPITAL POWIATOWY W DOBRYM MIEŚCIE',
    department_name: 'General surgery',
    doctor_name: 'Andrzej Czerwiński',
    doctor_title: 'dr',
    doctor_position: 'Chirurg',
    meeting_type: 'Normal',
    meeting_start: '2026-07-28T11:30:00',
    meeting_end: '2026-07-28T12:00:00',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Przymiarka lup lekkich Orascoptic RDH 2.5x do procedur w Izbie Przyjęć i zabiegów ambulatorium.',
        next_steps: 'Przesłać ofertę indywidualną',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przesłać wycenę lup Orascoptic RDH 2.5x z ramką sportową dla dr. Czerwińskiego', due_date: '2026-08-05', is_done: true },
      { description: 'Sprawdzić status wniosku o dofinansowanie zakupu lup przez lekarza', due_date: '2026-08-20', is_done: false }
    ]
  },

  // ==================== PDF 12: FOLLOW-UP ROUND & RECENT VISITS (AUG 2026) ====================
  {
    id: '18501',
    submit_date: '2026-08-08T11:00:00',
    status: 'submitted',
    hospital_name: 'WOJEWÓDZKI SZPITAL SPECJALISTYCZNY W OLSZTYNIE',
    department_name: 'Urology',
    doctor_name: 'Adam Kałużny',
    doctor_title: 'DR',
    doctor_position: 'Normal',
    meeting_type: 'Normal',
    meeting_start: '2026-08-08T08:30:00',
    meeting_end: '2026-08-08T09:15:00',
    notes: 'Wizyta kontrolna (Follow-Up) po testach nożyczek Scanlan LC oraz lup Orascoptic 3.0.',
    topics: [
      {
        title: 'Scanlan',
        comment: 'Doktor potwierdził wybitną jakość cięcia nożyczek LC podczas dwóch zabiegów plastyki cewki. Zadeklarował chęć ujęcia ich w specyfikacji przetargowej.',
        next_steps: 'Przygotować opisy przedmiotu zamówienia (OPZ) dla działu aparatury',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Orascoptic',
        comment: 'Lupy 3.0 sprawdziły się znakomicie. Doktor zgłosił zapotrzebowanie na zestaw ze światłem bezprzewodowym Spark.',
        next_steps: 'Uaktualnić ofertę o światło Spark i przesłać do akceptacji',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Przygotować specyfikację techniczną (OPZ) nożyczek Scanlan LC dla WSS Olsztyn', due_date: '2026-08-15', is_done: false },
      { description: 'Wysłać zaktualizowaną ofertę Orascoptic 3.0 + Spark dla dr. Kałużnego', due_date: '2026-08-15', is_done: false },
      { description: 'Skonsultować termin ogłoszenia przetargu z działem aparatury medycznej', due_date: '2026-08-28', is_done: false }
    ]
  },
  {
    id: '18502',
    submit_date: '2026-08-08T14:30:00',
    status: 'submitted',
    hospital_name: 'UNIWERSYTECKIE CENTRUM KLINICZNE GDAŃSK',
    department_name: 'Cardiac surgery',
    doctor_name: 'Rafał Pawlaczyk',
    doctor_title: 'dr hab. med.',
    doctor_position: 'Zastępca Ordynatora',
    meeting_type: 'Normal',
    meeting_start: '2026-08-08T11:00:00',
    meeting_end: '2026-08-08T11:45:00',
    notes: 'Przekazanie zamówionego zestawu lup Orascoptic 3.5x oraz przegląd zapasu Neos SternFix.',
    topics: [
      {
        title: 'Orascoptic',
        comment: 'Dostarczono i idealnie dopasowano lupy Orascoptic 3.5x z ramką XV1. Doktor jest niezwykle zadowolony z ostrości widzenia.',
        next_steps: 'Udostępnić kartę gwarancyjną i instrukcję czyszczenia optyki',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Neos Sternfix',
        comment: 'Przegląd zapasów magazynowych na bloku kardiochirurgii. Zużycie stabilne, uzgodniono zamówienie uzupełniające 10 zestawów.',
        next_steps: 'Przesłać formularz zamówienia do działu logistyki UCK',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Dostarczyć komplet dokumentacji gwarancyjnej do lup dr. Pawlaczyka', due_date: '2026-08-14', is_done: false },
      { description: 'Przesłać do UCK Gdańsk zamówienie uzupełniające na 10 zestawów Neos SternFix', due_date: '2026-08-18', is_done: false }
    ]
  },
  {
    id: '18503',
    submit_date: '2026-08-09T09:15:00',
    status: 'submitted',
    hospital_name: 'SAMODZIELNY PUBLICZNY ZAKŁAD OPIEKI ZDROWOTNEJ MINISTERSTWA SPRAW WEWNĘTRZNYCH I ADMINISTRACJI W BIAŁYMSTOKU IM. MARIANA ZYNDRAMA-KOŚCIAŁKOWSKIEGO',
    department_name: 'Urology',
    doctor_name: 'Tomasz Lemiesz',
    doctor_title: 'dr',
    doctor_position: 'Urolog',
    meeting_type: 'Normal',
    meeting_start: '2026-08-08T13:30:00',
    meeting_end: '2026-08-08T14:15:00',
    notes: 'Omówienie wyników przetargu na rozszerzadła OneStep oraz przygotowanie do zabiegów z użyciem robota Versius.',
    topics: [
      {
        title: 'BlueNeem',
        comment: 'Przetarg rozstrzygnięty pomyślnie. Czekamy na podpisanie umowy na dostawę rozszerzadeł OneStep Dilators.',
        next_steps: 'Nadzorować proces podpisania umowy i dostawę pierwszej partii',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'Scanlan',
        comment: 'Przedstawiono walizkę pokazową z zaciskami naczyniowymi Scanlan Bulldog do operacji robotycznych.',
        next_steps: 'Zabezpieczyć zestaw testowy na pierwszy zabieg Versius',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Dopilnować formalności związanych z umową na dostawy BlueNeem OneStep w SPZOZ MSWiA Białystok', due_date: '2026-08-16', is_done: false },
      { description: 'Dostarczyć zestaw testowy zacisków Scanlan Bulldog na blok urologiczny przed pierwszą operacją robotyczną', due_date: '2026-08-25', is_done: false }
    ]
  },
  {
    id: '18504',
    submit_date: '2026-08-09T11:40:00',
    status: 'submitted',
    hospital_name: 'SZPITAL WOJEWÓDZKI IM. DR. LUDWIKA RYDYGIERA W SUWAŁKACH',
    department_name: 'Urology',
    doctor_name: 'Krzysztof Pol',
    doctor_title: 'dr',
    doctor_position: 'Ordynator',
    meeting_type: 'Normal',
    meeting_start: '2026-08-09T10:00:00',
    meeting_end: '2026-08-09T10:45:00',
    notes: 'Finalizacja wyboru pacjentów do zabiegów ze stentami Allium oraz akceptacja oferty na stenty Triple J.',
    topics: [
      {
        title: 'Allium',
        comment: 'Wytypowano 2 pacjentów ze zwężeniem moczowodu. Ustalono termin zabiegów proktorskich na 22 sierpnia.',
        next_steps: 'Zapewnić obecność proktora klinicznego i kompletny asortyment stentów Allium',
        person_to_contact: 'Łukasz W.'
      },
      {
        title: 'BlueNeem',
        comment: 'Ordynator zaakceptował ofertę na stenty Triple J z pętlą moczowodową. Zamówienie próbne w toku.',
        next_steps: 'Przesłać formularz do apteki szpitalnej',
        person_to_contact: 'Łukasz W.'
      }
    ],
    tasks: [
      { description: 'Potwierdzić przyjazd proktora na zabiegi implantacji stentów Allium w Suwałkach w dn. 22 sierpnia', due_date: '2026-08-17', is_done: false },
      { description: 'Przesłać zamówienie na stenty Triple J do apteki Szpitala Wojewódzkiego w Suwałkach', due_date: '2026-08-15', is_done: false }
    ]
  },
  ...SEED_REPORTS_BATCH_1,
  ...SEED_REPORTS_BATCH_2,
  ...SEED_REPORTS_BATCH_3,
  ...SEED_REPORTS_BATCH_4
];

export function processSeedReports(
  allHospitals: any[],
  initialDepartments: Department[]
): {
  doctors: Doctor[];
  meetings: Meeting[];
  tasks: Task[];
  departments: Department[];
} {
  const departments: Department[] = [...initialDepartments];
  const doctors: Doctor[] = [];
  const meetings: Meeting[] = [];
  const tasks: Task[] = [];

  const getDeptKeywords = (deptName: string): string[] => {
    const d = deptName.toLowerCase();
    if (d.includes('urol') || d.includes('uro')) return ['urolog', 'uro'];
    if (d.includes('cardiac') || d.includes('kardio')) return ['kardio'];
    if (d.includes('thoracic') || d.includes('klatki') || d.includes('torako')) return ['klatki', 'thorac', 'torako'];
    if (d.includes('sterili') || d.includes('steryliz') || d.includes('ste')) return ['steryliz', 'steril', 'ste'];
    if (d.includes('operation') || d.includes('operac') || d.includes('blok') || d.includes('or')) return ['blok', 'operac', 'or'];
    if (d.includes('admin') || d.includes('purchas') || d.includes('zakup') || d.includes('finans')) return ['admin', 'zaopatrz', 'zakup', 'finans'];
    if (d.includes('pharmac') || d.includes('aptek')) return ['aptek', 'pharmac'];
    if (d.includes('oncol') || d.includes('onkol')) return ['onkol', 'oncol'];
    if (d.includes('vascul') || d.includes('naczyn')) return ['naczyn', 'vascul'];
    if (d.includes('plast') || d.includes('opar')) return ['plast', 'opar'];
    if (d.includes('ophthalm') || d.includes('okulist')) return ['okulist'];
    if (d.includes('child') || d.includes('dzieci')) return ['dzieci', 'pediatr'];
    if (d.includes('neuro')) return ['neuro'];
    if (d.includes('general') || d.includes('chirurg')) return ['chirurg', 'ogóln', 'gen'];
    return [d];
  };

  const getPolishDeptName = (deptName: string): string => {
    const d = deptName.toLowerCase();
    if (d.includes('urol')) return 'Oddział Urologiczny';
    if (d.includes('cardiac') || d.includes('kardio')) return 'Kardiochirurgia';
    if (d.includes('thoracic') || d.includes('torako')) return 'Chirurgia Klatki Piersiowej';
    if (d.includes('sterili') || d.includes('steryliz') || d.includes('ste')) return 'Centralna Sterylizatornia';
    if (d.includes('operation') || d.includes('operac') || d.includes('or')) return 'Blok Operacyjny';
    if (d.includes('admin') || d.includes('purchas')) return 'Administracja';
    if (d.includes('pharmac') || d.includes('aptek')) return 'Apteka Szpitalna';
    if (d.includes('oncol') || d.includes('onkol')) return 'Oddział Onkologiczny';
    if (d.includes('vascul') || d.includes('naczyn')) return 'Oddział Chirurgii Naczyniowej';
    if (d.includes('plast')) return 'Oddział Chirurgii Plastycznej';
    if (d.includes('ophthalm') || d.includes('okulist')) return 'Oddział Okulistyczny';
    if (d.includes('child') || d.includes('dzieci')) return 'Oddział Chirurgii Dziecięcej';
    if (d.includes('neuro')) return 'Oddział Neurochirurgii';
    return 'Oddział Chirurgii Ogólnej';
  };

  SEED_REPORTS.forEach(rep => {
    // 1. Find Hospital
    const repHospNameUpper = rep.hospital_name.toUpperCase();
    let hosp = allHospitals.find(h => h.name.toUpperCase() === repHospNameUpper);
    if (!hosp) {
      hosp = allHospitals.find(h =>
        repHospNameUpper.includes(h.city.toUpperCase()) &&
        (repHospNameUpper.includes(h.name.substring(0, 15).toUpperCase()) || h.name.toUpperCase().includes(repHospNameUpper.substring(0, 15)))
      );
    }
    if (!hosp) {
      hosp = allHospitals.find(h => repHospNameUpper.includes(h.city.toUpperCase()));
    }
    if (!hosp) {
      hosp = allHospitals[0]; // fallback
    }

    // 2. Find or Create Department
    const hospDepts = departments.filter(d => d.hospital_id === hosp.id);
    const keywords = getDeptKeywords(rep.department_name);
    let dept = hospDepts.find(d => {
      const nameLower = d.name.toLowerCase();
      return keywords.some(kw => nameLower.includes(kw));
    });

    if (!dept) {
      const cleanPolishName = getPolishDeptName(rep.department_name);
      const isDiagnostyczny = cleanPolishName.includes('Steryliz') || cleanPolishName.includes('Apteka') || cleanPolishName.includes('Admin');
      const slug = rep.department_name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      dept = {
        id: `dept_${hosp.id}_${slug}`,
        hospital_id: hosp.id,
        name: cleanPolishName,
        type: isDiagnostyczny ? 'diagnostyczny' : 'zabiegowy',
        created_at: rep.submit_date
      };
      departments.push(dept);
    }

    // 3. Find or Create Doctor
    const nameParts = rep.doctor_name.split(' ');
    const firstName = nameParts[0] || 'Dr';
    const lastName = nameParts.slice(1).join(' ') || 'Lekarz';
    
    let doctor = doctors.find(d => d.hospital_id === hosp.id && d.last_name.toLowerCase() === lastName.toLowerCase());
    if (!doctor) {
      doctor = {
        id: `doc_${hosp.id}_${rep.id}`,
        first_name: firstName,
        last_name: lastName,
        title: rep.doctor_title || 'dr',
        hospital_id: hosp.id,
        department_id: dept.id,
        phone: '',
        email: '',
        specialization: rep.doctor_position || '',
        notes: '',
        created_at: rep.submit_date,
        updated_at: rep.submit_date
      };
      doctors.push(doctor);
    }

    // 4. Create Meeting
    const productTags = Array.from(new Set(rep.topics.map(t => t.title)));
    const topicsMarkdown = rep.topics.map(t => 
      `### ${t.title}\n${t.comment}${t.next_steps ? `\n\n**Następne kroki:** ${t.next_steps}` : ''}`
    ).join('\n\n');

    const fullContent = `${rep.notes ? `**Uwagi do spotkania:** ${rep.notes}\n\n` : ''}${topicsMarkdown}`;

    const meeting: Meeting = {
      id: `m_${rep.id}`,
      title: `Spotkanie: ${doctor.title} ${doctor.first_name} ${doctor.last_name}`,
      hospital_id: hosp.id,
      department_id: dept.id,
      doctor_id: doctor.id,
      doctor_ids: [doctor.id],
      representative_name: 'Łukasz W.',
      meeting_date: rep.meeting_start,
      meeting_type: (rep.meeting_type as any) || 'REGULAR',
      content_markdown: fullContent,
      product_tags: productTags,
      created_at: rep.submit_date,
      updated_at: rep.submit_date,
      closed_at: (rep.status === 'accepted' || rep.status === 'submitted') ? rep.submit_date : null
    };
    meetings.push(meeting);

    // 5. Create Tasks from explicit rep.tasks
    rep.tasks.forEach((t, idx) => {
      tasks.push({
        id: `t_${rep.id}_${idx + 1}`,
        meeting_id: meeting.id,
        description: t.description,
        due_date: t.due_date,
        is_done: t.is_done,
        created_at: rep.submit_date
      });
    });

    // 6. Create additional Follow-Up Tasks from rep.topics (next_steps)
    rep.topics.forEach((top, idx) => {
      if (top.next_steps && top.next_steps.trim().length > 3) {
        const shortSteps = top.next_steps.trim();
        const alreadyCovered = rep.tasks.some(t => t.description.toLowerCase().includes(shortSteps.toLowerCase().slice(0, 15)));
        if (!alreadyCovered) {
          const submitDate = new Date(rep.submit_date);
          let dueDate = top.deadline;
          if (!dueDate) {
            const d = new Date(submitDate);
            d.setDate(d.getDate() + 7 + idx * 3);
            dueDate = d.toISOString().split('T')[0];
          }
          tasks.push({
            id: `t_${rep.id}_top_${idx + 1}`,
            meeting_id: meeting.id,
            description: `[FU - ${top.title}] ${shortSteps}${top.person_to_contact ? ` (Osoba kontaktowa: ${top.person_to_contact})` : ''}`,
            due_date: dueDate,
            is_done: rep.status === 'accepted' ? (idx % 2 === 0) : false,
            created_at: rep.submit_date
          });
        }
      }
    });
  });

  return { doctors, meetings, tasks, departments };
}
