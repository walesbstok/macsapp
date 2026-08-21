package com.example.macscrm.data.local

import com.example.macscrm.data.local.entity.MeetingEntity
import com.example.macscrm.data.local.entity.TaskEntity

object InitialVisitsProvider {

    fun getInitialMeetings(): List<MeetingEntity> {
        val list = mutableListOf<MeetingEntity>()

        fun add(
            id: String,
            title: String,
            date: String,
            type: String,
            hospitalId: String,
            departmentId: String?,
            doctorId: String?,
            doctorIds: List<String>,
            productTags: List<String>,
            content: String,
            managerComment: String = "",
            approvalStatus: String = "PENDING",
            repName: String = "Łukasz W.",
            closedAt: String? = null,
            createdAt: String = "",
            updatedAt: String = ""
        ) {
            list.add(
                MeetingEntity(
                    id = id,
                    title = title,
                    meetingDate = date,
                    hospitalId = hospitalId,
                    departmentId = departmentId,
                    doctorId = doctorId,
                    doctorIds = doctorIds,
                    productTags = productTags,
                    contentMarkdown = content,
                    meetingType = type,
                    closedAt = closedAt ?: date,
                    createdAt = createdAt.ifEmpty { date },
                    updatedAt = updatedAt.ifEmpty { date },
                    approvalStatus = approvalStatus,
                    managerComment = managerComment,
                    representativeName = repName
                )
            )
        }

        add(
            id = "m_16070",
            title = "Spotkanie: dr Zdzisław Pyłko",
            date = "2026-05-13 07:45:00",
            type = "REGULAR",
            hospitalId = "hosp_28",
            departmentId = "dept_28_1",
            doctorId = "doc_hosp_28_aug_1",
            doctorIds = listOf("doc_hosp_28_aug_1"),
            productTags = listOf("ORASCOPTIC", "SCANLAN", "SSU"),
            content = """**Uwagi do spotkania:** Odprawa lekarska i ustalenie potrzeb sprzętowych dla Augustowa.

### Orascoptic
Dwóch chirurgów zainteresowanych kupnem nowych lup HDL 2.5x oraz źródła światła Endeavour MD.

**Następne kroki:** Zorganizować testy na bloku operacyjnym

### Scanlan
Zapotrzebowanie na nożyczki preparacyjne z powłoką SuperCut (np. 7007-211SC, 7007-218-3SC).

**Następne kroki:** Dostarczyć wzorce do testów na bloku

### Scanlan SU
Zainteresowanie zaciskami silikonowymi Degania oraz klipsami jednorazowymi.

**Następne kroki:** Przygotować ofertę i specyfikację techniczną""",
            createdAt = "2026-05-13T12:50:00",
            updatedAt = "2026-05-13T12:50:00"
        )

        add(
            id = "m_16071",
            title = "Spotkanie: dr hab. n. med. Janusz Banasik",
            date = "2026-05-13 09:30:00",
            type = "REGULAR",
            hospitalId = "hosp_69",
            departmentId = "dept_69_1",
            doctorId = "doc_hosp_69_16071",
            doctorIds = listOf("doc_hosp_69_16071"),
            productTags = listOf("NEOS SternFix", "SCANLAN"),
            content = """**Uwagi do spotkania:** Spotkanie z Ordynatorem nt. modernizacji sprzętu i spoinowania mostków Neos SternFix.

### Neos Sternfix
Przedstawiono zalety biomechaniczne Neos SternFix w stosunku do tradycyjnych szwów stalowych.

**Następne kroki:** Zaplanować warsztaty Sawbones dla zespołu

### Scanlan
Omówienie zapotrzebowania na dedykowane narzędzia do urologii rekonstrukcyjnej.

**Następne kroki:** Przesłać kompletny katalog urologiczny Scanlan""",
            createdAt = "2026-05-13T14:10:00",
            updatedAt = "2026-05-13T14:10:00"
        )

        add(
            id = "m_16282",
            title = "Spotkanie: DR Marek Kowalczyk",
            date = "2026-05-21 13:00:00",
            type = "REGULAR",
            hospitalId = "hosp_65",
            departmentId = "dept_65_1",
            doctorId = "doc_hosp_65_16282",
            doctorIds = listOf("doc_hosp_65_16282"),
            productTags = listOf("BIOSIS", "SCANLAN"),
            content = """**Uwagi do spotkania:** Prezentacja siatek biologicznych Biosis.

### Biosis
Doktor nie znał wcześniej siatek biologicznych. Przedstawiono badania nt. właściwości przeciwbakteryjnych i profilu wchłaniania.

**Następne kroki:** Przesłać publikacje naukowe i listę ośrodków stosujących Biosis

### Scanlan
Zaprezentowano wybrane narzędzia Scanlan. Szpital obecnie używa podstawowego sprzętu, brak budżetu na natychmiastowy zakup.

**Następne kroki:** Przypominać o narzędziach Scanlan przy okazji kolejnych przetargów""",
            createdAt = "2026-05-21T14:29:00",
            updatedAt = "2026-05-21T14:29:00"
        )

        add(
            id = "m_16284",
            title = "Spotkanie: dr Robert Liss",
            date = "2026-05-21 07:45:00",
            type = "REGULAR",
            hospitalId = "hosp_69",
            departmentId = "dept_69_1",
            doctorId = "doc_hosp_69_16284",
            doctorIds = listOf("doc_hosp_69_16284"),
            productTags = listOf("ALLIUM", "SCANLAN", "BLUENEEN"),
            content = """**Uwagi do spotkania:** Oferta stenty Allium oraz kaniule BlueNeem.

### Allium
Rozmowa o pacjencie po przeszczepie nerki ze zwężeniem moczowodu. Doktor chce wdrożyć stenty Allium przy wsparciu proktora.

**Następne kroki:** Wysłać ofertę na 3 pacjentów Allium+BlueNeem

### Scanlan
Zainteresowanie narzędziami mikrochirurgicznymi LC. Doktor zasugerował również kontakt z dr. Kałużnym.

**Następne kroki:** Zorganizować zestaw mikro-narzędzi LC na kolejną wizytę""",
            createdAt = "2026-05-21T14:44:00",
            updatedAt = "2026-05-21T14:44:00"
        )

        add(
            id = "m_16286",
            title = "Spotkanie: DR Adam Kałużny",
            date = "2026-05-21 08:00:00",
            type = "REGULAR",
            hospitalId = "hosp_69",
            departmentId = "dept_69_1",
            doctorId = "doc_hosp_69_16286",
            doctorIds = listOf("doc_hosp_69_16286"),
            productTags = listOf("SCANLAN", "ORASCOPTIC"),
            content = """**Uwagi do spotkania:** Wysoce obiecujące spotkanie ws. Scanlan i Orascoptic. Pokazano narzędzia LC oraz lupy 3.0.

### Scanlan
Pokazano kilka narzędzi Scanlan, doktor był bardzo zadowolony i chciałby je przetestować podczas operacji. Uzgodniono kontakt z Pielęgniarką Oddziałową Ewą Łazińską ws. dokumentów testowych.

**Następne kroki:** Wysłać katalog na email, ustalić z pielęgniarką oddziałową dokumenty do testów

### Orascoptic
Przedstawiono lupy Orascoptic. Doktor obecnie pracuje na 3.5, prosił o ofertę na model 3.0 do zabiegów plastyki cewki moczowej.

**Następne kroki:** Wysłać ofertę na lupy 3.0, omówić z ordynatorem i dyrekcją potencjalne zamówienie""",
            createdAt = "2026-05-21T15:07:00",
            updatedAt = "2026-05-21T15:07:00"
        )

        add(
            id = "m_16357",
            title = "Spotkanie: dr n. med. Krzysztof Pawłowski",
            date = "2026-05-24 10:00:00",
            type = "REGULAR",
            hospitalId = "hosp_31",
            departmentId = "dept_31_1",
            doctorId = "doc_hosp_31_16357",
            doctorIds = listOf("doc_hosp_31_16357"),
            productTags = listOf("BIOSIS"),
            content = """### Biosis
Prezentacja siatek biologicznych Biosis w rekonstrukcjach przepuklin powłok brzusznych w Polu skażonym.

**Następne kroki:** Przesłać próbkę materiału oraz kosztorys implantacji""",
            createdAt = "2026-05-24T17:10:00",
            updatedAt = "2026-05-24T17:10:00"
        )

        add(
            id = "m_16358",
            title = "Spotkanie: dr Adam Nowiński",
            date = "2026-05-24 11:53:00",
            type = "REGULAR",
            hospitalId = "hosp_31",
            departmentId = "dept_31_2",
            doctorId = "doc_hosp_31_bs_mswia_2",
            doctorIds = listOf("doc_hosp_31_bs_mswia_2"),
            productTags = listOf("BLUENEEN", "SCANLAN"),
            content = """**Uwagi do spotkania:** Spotkanie razem z dr. Gałkiem.

### BlueNeem
Dr Gałek zadeklarował chęć zakupu prowadnic HydroTwister. Dr Nowiński bardzo chwalił rozszerzadła OneStep.

**Następne kroki:** Wysłać ofertę na rozszerzadła i przypomnieć o narzędziach Scanlan""",
            createdAt = "2026-05-24T18:40:00",
            updatedAt = "2026-05-24T18:40:00"
        )

        add(
            id = "m_16359",
            title = "Spotkanie: dr Tomasz Lemiesz",
            date = "2026-05-24 11:00:00",
            type = "REGULAR",
            hospitalId = "hosp_31",
            departmentId = "dept_31_2",
            doctorId = "doc_hosp_31_bs_mswia_1",
            doctorIds = listOf("doc_hosp_31_bs_mswia_1"),
            productTags = listOf("SCANLAN", "BLUENEEN"),
            content = """### BlueNeem
Przypomniano o aktywnym przetargu na rozszerzadła OneStep Dilators oraz kaniule HydroTwister.

**Następne kroki:** Monitorować bieg przetargu

### Scanlan
Omówiono zaciski Bulldog do zabiegów cystektomii i rekonstrukcji cewki. Szpital planuje zakup robota Versius.

**Następne kroki:** Przypomnieć o zaciskach Bulldog przed uruchomieniem robota""",
            createdAt = "2026-05-24T18:49:00",
            updatedAt = "2026-05-24T18:49:00"
        )

        add(
            id = "m_16610",
            title = "Spotkanie: dr Żurek Lekarz",
            date = "2026-05-29 12:00:00",
            type = "REGULAR",
            hospitalId = "hosp_87",
            departmentId = "dept_87_3",
            doctorId = "doc_hosp_87_16610",
            doctorIds = listOf("doc_hosp_87_16610"),
            productTags = listOf("SCANLAN", "NEOS SternFix"),
            content = """### Scanlan
Omówiono procedury robotyczne (Versius/DaVinci) i zastosowanie zacisków Scanlan Bulldog. Wyrażono chęć przetestowania zacisków naczyniowych.

**Następne kroki:** Umawiać testy zacisków Bulldog z prof. Rzymanem i dr. Sternau

### Neos Sternfix
Omówiono system SternFix w chirurgii klatki piersiowej. Produkt wartościowy przy rzadkich rozległych resekcjach.

**Następne kroki:** Brak bezpośrednich zadań""",
            createdAt = "2026-06-01T21:32:00",
            updatedAt = "2026-06-01T21:32:00"
        )

        add(
            id = "m_16611",
            title = "Spotkanie: mgr Daniel Dywelski",
            date = "2026-05-29 10:06:00",
            type = "REGULAR",
            hospitalId = "hosp_87",
            departmentId = "dept_87_4",
            doctorId = "doc_hosp_87_16611",
            doctorIds = listOf("doc_hosp_87_16611"),
            productTags = listOf("OTHER"),
            content = """### Other
Przekazano podpisane protokoły przeszkolenia personelu z ostatnich dwóch dni. Uzgodniono kryteria fakturowania i nadchodzące przetargi.

**Następne kroki:** Bieżący kontakt ws. dokumentacji przetargowej""",
            createdAt = "2026-06-01T21:34:00",
            updatedAt = "2026-06-01T21:34:00"
        )

        add(
            id = "m_16612",
            title = "Spotkanie: mgr Ewa Główczewska",
            date = "2026-05-29 07:30:00",
            type = "REGULAR",
            hospitalId = "hosp_87",
            departmentId = "dept_87_2",
            doctorId = "doc_hosp_87_16612",
            doctorIds = listOf("doc_hosp_87_16612"),
            productTags = listOf("SCANLAN", "GENESEE"),
            content = """### Scanlan
Szkolenie instrumentariuszek z obsługi rozwieraczy Genesee MiniMax i rozwieraczy mostkowych.

**Następne kroki:** Utrzymywać stały kontakt z blokiem operacyjnym""",
            createdAt = "2026-06-01T21:38:00",
            updatedAt = "2026-06-01T21:38:00"
        )

        add(
            id = "m_16614",
            title = "Spotkanie: dr hab. n. med. Dariusz Jagielak",
            date = "2026-05-29 11:02:00",
            type = "REGULAR",
            hospitalId = "hosp_87",
            departmentId = "dept_87_1",
            doctorId = "doc_hosp_87_16614",
            doctorIds = listOf("doc_hosp_87_16614"),
            productTags = listOf("ORASCOPTIC"),
            content = """### Orascoptic
Zaprezentowano lupy i oświetlenie. Dr Jagielak oraz dr Magdalena wstępnie wybrali powiększenie 3.0 ze względu na większą głębię ostrości.

**Następne kroki:** Konieczna wizyta kontrolna z lupami 3.0""",
            createdAt = "2026-06-01T21:41:00",
            updatedAt = "2026-06-01T21:41:00"
        )

        add(
            id = "m_16615",
            title = "Spotkanie: mgr Andrzej Tomasik",
            date = "2026-06-01 11:30:00",
            type = "REGULAR",
            hospitalId = "hosp_87",
            departmentId = "dept_87_2",
            doctorId = "doc_hosp_87_16615",
            doctorIds = listOf("doc_hosp_87_16615"),
            productTags = listOf("SCANLAN", "SSU"),
            content = """### Scanlan
Przeprowadzono prezentację dla zespołu sterylizatorni dot. prawidłowego mycia i pielęgnacji narzędzi Scanlan Scanturian oraz rozwieraczy Genesee.

**Następne kroki:** Przesłać protokoły mycia oraz instrukcje konserwacji w języku polskim""",
            createdAt = "2026-06-01T21:42:00",
            updatedAt = "2026-06-01T21:42:00"
        )

        add(
            id = "m_16616",
            title = "Spotkanie: dr hab. med. Rafał Pawlaczyk",
            date = "2026-05-29 09:07:00",
            type = "REGULAR",
            hospitalId = "hosp_87",
            departmentId = "dept_87_1",
            doctorId = "doc_hosp_87_16616",
            doctorIds = listOf("doc_hosp_87_16616"),
            productTags = listOf("ORASCOPTIC", "NEOS SternFix"),
            content = """### Orascoptic
Doktor zainteresowany lupami 3.5x. Przymierzał różne modele i powiększenia. Omówiono zniżki rezydenckie.

**Następne kroki:** Brakować stały kontakt, przesłać spersonalizowaną ofertę

### Neos Sternfix
Wyjaśniono przypadek usunięcia systemu u pacjenta – powodem było zakażenie rany, a nie wada materiałowa systemu.

**Następne kroki:** Monitorować kolejne aplikacje SternFix na kardiochirurgii""",
            createdAt = "2026-06-01T21:45:00",
            updatedAt = "2026-06-01T21:45:00"
        )

        add(
            id = "m_17201",
            title = "Spotkanie: dr n. med. Jacek Grzechnik",
            date = "2026-06-18 10:00:00",
            type = "REGULAR",
            hospitalId = "hosp_52",
            departmentId = "dept_52_1",
            doctorId = "doc_hosp_52_17201",
            doctorIds = listOf("doc_hosp_52_17201"),
            productTags = listOf("SCANLAN", "ALLIUM"),
            content = """### Scanlan
Prezentacja mikronarzędzi Scanlan do urologii. Doktor chwalił precyzję wykonania imadełek i nożyczek.

**Następne kroki:** Przesłać dedykowany katalog urologiczny i wycenę zestawu podstawowego

### Allium
Omówienie stentów moczowodowych Allium przy nawracających zwężeniach moczowodu.

**Następne kroki:** Przesłać nagrania z operacji pokazowych""",
            createdAt = "2026-06-18T14:20:00",
            updatedAt = "2026-06-18T14:20:00"
        )

        add(
            id = "m_17202",
            title = "Spotkanie: dr Piotr Stosik",
            date = "2026-06-18 11:00:00",
            type = "REGULAR",
            hospitalId = "hosp_52",
            departmentId = "dept_52_1",
            doctorId = "doc_hosp_52_17202",
            doctorIds = listOf("doc_hosp_52_17202"),
            productTags = listOf("ORASCOPTIC"),
            content = """### Orascoptic
Przymiarka lup Orascoptic HDL 2.5x ze światłem Endeavour. Doktor ocenił pole widzenia bardzo wysoko.

**Następne kroki:** Przygotować wycenę indywidualną z grawerowaną ramką""",
            createdAt = "2026-06-18T15:00:00",
            updatedAt = "2026-06-18T15:00:00"
        )

        add(
            id = "m_17510",
            title = "Spotkanie: dr Grzegorz Sienkiewicz",
            date = "2026-06-25 09:30:00",
            type = "REGULAR",
            hospitalId = "hosp_53",
            departmentId = "dept_53_1",
            doctorId = "doc_hosp_53_17510",
            doctorIds = listOf("doc_hosp_53_17510"),
            productTags = listOf("BLUENEEN"),
            content = """### BlueNeem
Prezentacja zestawów rozszerzadeł OneStep Dilators oraz cewników Double J. Ordynator zadeklarował chęć wprowadzenia do stałych zakupów.

**Następne kroki:** Przesłać specyfikację do działu przetargów""",
            createdAt = "2026-06-25T13:10:00",
            updatedAt = "2026-06-25T13:10:00"
        )

        add(
            id = "m_17511",
            title = "Spotkanie: dr n. med. Wojciech Stankiewicz",
            date = "2026-06-25 10:30:00",
            type = "REGULAR",
            hospitalId = "hosp_53",
            departmentId = "dept_53_2",
            doctorId = "doc_hosp_53_17511",
            doctorIds = listOf("doc_hosp_53_17511"),
            productTags = listOf("SCANLAN"),
            content = """### Scanlan
Przegląd imadełek Scanlan z wkładką twardą i nożyczek chirurgicznych. Szpital planuje doposażenie bloku.

**Następne kroki:** Przesłać wycenę na zestaw imadełek i nożyczek""",
            createdAt = "2026-06-25T14:00:00",
            updatedAt = "2026-06-25T14:00:00"
        )

        add(
            id = "m_17801",
            title = "Spotkanie: dr Tomasz Kozłowski",
            date = "2026-07-02 11:00:00",
            type = "REGULAR",
            hospitalId = "hosp_1",
            departmentId = "dept_1_1",
            doctorId = "doc_hosp_1_17801",
            doctorIds = listOf("doc_hosp_1_17801"),
            productTags = listOf("ORASCOPTIC", "BIOSIS"),
            content = """### Orascoptic
Ordynator przetestował lupy Orascoptic 2.5x z ramką Victory. Podkreślił lekkość zestawu i czystość pola widzenia.

**Następne kroki:** Przygotować formalną ofertę dla szpitala w Giżycku

### Biosis
Omówienie siatek Biosis w chirurgii nagłej.

**Następne kroki:** Przesłać ulotki informacyjne""",
            createdAt = "2026-07-02T16:30:00",
            updatedAt = "2026-07-02T16:30:00"
        )

        add(
            id = "m_18010",
            title = "Spotkanie: dr Piotr Wysocki",
            date = "2026-07-10 09:00:00",
            type = "REGULAR",
            hospitalId = "hosp_71",
            departmentId = "dept_71_1",
            doctorId = "doc_hosp_71_18010",
            doctorIds = listOf("doc_hosp_71_18010"),
            productTags = listOf("BIOSIS"),
            content = """### Biosis
Doktor szuka optymalnych siatek biologicznych do trudnych rekonstrukcji rany operacyjnej. Zaprezentowano matryce Biosis.

**Następne kroki:** Przesłać kalkulację i protokół preparacji""",
            createdAt = "2026-07-10T12:15:00",
            updatedAt = "2026-07-10T12:15:00"
        )

        add(
            id = "m_18150",
            title = "Spotkanie: dr n. med. Janusz Rygiel",
            date = "2026-07-20 10:00:00",
            type = "REGULAR",
            hospitalId = "hosp_1",
            departmentId = "dept_1_2",
            doctorId = "doc_hosp_1_18150",
            doctorIds = listOf("doc_hosp_1_18150"),
            productTags = listOf("NEOS SternFix", "SCANLAN", "GENESEE"),
            content = """### Neos Sternfix
Omówiono zalety zamykania klatki piersiowej systemem Neos SternFix u pacjentów z grupy wysokiego ryzyka (cukrzyca, otyłość).

**Następne kroki:** Zaplanować zabieg pokazowy na bloku operacyjnym w Wejherowie

### Scanlan
Zainteresowanie rozwieraczami mostkowymi Genesee.

**Następne kroki:** Dostarczyć rozwieracz na próbne testy""",
            createdAt = "2026-07-20T15:40:00",
            updatedAt = "2026-07-20T15:40:00"
        )

        add(
            id = "m_18151",
            title = "Spotkanie: dr Witold Szymański",
            date = "2026-07-20 12:00:00",
            type = "REGULAR",
            hospitalId = "hosp_1",
            departmentId = "dept_1_3",
            doctorId = "doc_hosp_1_18151",
            doctorIds = listOf("doc_hosp_1_18151"),
            productTags = listOf("SCANLAN"),
            content = """### Scanlan
Prezentacja zacisków Bulldog Scanlan do zabiegów torakoskopowych VATS.

**Następne kroki:** Przesłać wycenę zacisków i zagiętych kleszczyków aplikacyjnych""",
            createdAt = "2026-07-20T17:10:00",
            updatedAt = "2026-07-20T17:10:00"
        )

        add(
            id = "m_18220",
            title = "Spotkanie: dr Robert Jankowski",
            date = "2026-07-28 09:30:00",
            type = "REGULAR",
            hospitalId = "hosp_1",
            departmentId = "dept_1_1",
            doctorId = "doc_hosp_1_18220",
            doctorIds = listOf("doc_hosp_1_18220"),
            productTags = listOf("SCANLAN"),
            content = """### Scanlan
Omówienie potrzeb w zakresie wymiany zużytych narzędzi chirurgicznych.

**Następne kroki:** Przesłać propozycję pakietu regeneracyjnego i nowych narzędzi Scanlan""",
            createdAt = "2026-07-28T14:15:00",
            updatedAt = "2026-07-28T14:15:00"
        )

        add(
            id = "m_18221",
            title = "Spotkanie: dr Andrzej Czerwiński",
            date = "2026-07-28 11:30:00",
            type = "REGULAR",
            hospitalId = "hosp_1",
            departmentId = "dept_1_1",
            doctorId = "doc_hosp_1_18221",
            doctorIds = listOf("doc_hosp_1_18221"),
            productTags = listOf("ORASCOPTIC"),
            content = """### Orascoptic
Przymiarka lup lekkich Orascoptic RDH 2.5x do procedur w Izbie Przyjęć i zabiegów ambulatorium.

**Następne kroki:** Przesłać ofertę indywidualną""",
            createdAt = "2026-07-28T16:00:00",
            updatedAt = "2026-07-28T16:00:00"
        )

        add(
            id = "m_18328",
            title = "Spotkanie: dr n. med. Piotr Kordowski",
            date = "2026-08-05 09:00:00",
            type = "REGULAR",
            hospitalId = "hosp_45",
            departmentId = "dept_45_1",
            doctorId = "doc_hosp_45_18328",
            doctorIds = listOf("doc_hosp_45_18328"),
            productTags = listOf("BIOSIS", "ORASCOPTIC"),
            content = """### Biosis
Doktor zainteresowany matrycami Biosis przy chirurgii onkologicznej piersi i rekonstrukcji rany.

**Następne kroki:** Wysłać ofertę i opisy przypadków (case studies)

### Orascoptic
Przymiarka lup Orascoptic 2.5x z oświetleniem Spark.

**Następne kroki:** Zorganizować kilkudniowy test w warunkach operacyjnych""",
            createdAt = "2026-08-05T10:15:00",
            updatedAt = "2026-08-05T10:15:00"
        )

        add(
            id = "m_18329",
            title = "Spotkanie: dr Krzysztof Pol",
            date = "2026-08-05 11:00:00",
            type = "REGULAR",
            hospitalId = "hosp_45",
            departmentId = "dept_45_2",
            doctorId = "doc_hosp_45_18329",
            doctorIds = listOf("doc_hosp_45_18329"),
            productTags = listOf("ALLIUM", "SCANLAN", "BLUENEEN"),
            content = """**Uwagi do spotkania:** Prezentacja oddziałowa z udziałem lekarzy: dr Oskar Murawski, dr Michał Długi, dr Beata Karwowska-Bordzio.

### Allium
Zaprezentowano stenty Allium i technikę implantacji. Zespół podjął decyzję o wytypowaniu 2-3 pacjentów do zabiegów demonstracyjnych.

**Następne kroki:** Follow up i ustalenie terminu zabiegów z udziałem proktora

### BlueNeem
Omówiono stenty Triple J. Lekarzom bardzo podobała się koncepcja dodatkowej pętli, poprosili o wycenę.

**Następne kroki:** Sprawdzić ofertę na Triple J

### Scanlan
Ordynator potwierdził zapotrzebowanie na nożyczki Scanlan do chirurgii otwartej.

**Następne kroki:** Przesłać ofertę cenową""",
            createdAt = "2026-08-05T12:20:00",
            updatedAt = "2026-08-05T12:20:00"
        )

        add(
            id = "m_18456",
            title = "Spotkanie: plg Ewa Judycka",
            date = "2026-08-06 11:30:00",
            type = "REGULAR",
            hospitalId = "hosp_28",
            departmentId = "dept_28_2",
            doctorId = "doc_hosp_28_aug_2",
            doctorIds = listOf("doc_hosp_28_aug_2"),
            productTags = listOf("ORASCOPTIC", "SSU"),
            content = """### Scanlan SU
Zainteresowanie odsysaczami Vacustat oraz taśmami Surgiloop. Otwarci na jednorazowe zaciski Bulldog.

**Następne kroki:** Wysłać ofertę na Vacustat i Surgiloop

### Orascoptic
Skierowano do dr. Bacharewicza na ortopedii, specjalizującego się w chirurgii ręki i naczyniowej.

**Następne kroki:** Umawiać spotkanie z dr. Bacharewiczem""",
            createdAt = "2026-08-07T13:45:00",
            updatedAt = "2026-08-07T13:45:00"
        )

        add(
            id = "m_18457",
            title = "Spotkanie: plg Mariola Rychorowicz",
            date = "2026-08-06 11:30:00",
            type = "REGULAR",
            hospitalId = "hosp_28",
            departmentId = "dept_28_3",
            doctorId = "doc_hosp_28_aug_3",
            doctorIds = listOf("doc_hosp_28_aug_3"),
            productTags = listOf("SSU"),
            content = """### Scanlan SU
Wybrano TipGuard jako najbardziej przydatny produkt. Duże zainteresowanie sitami sterylizacyjnymi ze stali i tworzywa.

**Następne kroki:** Wysłać wycenę na TipGuard i sita sterylizacyjne""",
            createdAt = "2026-08-07T13:46:00",
            updatedAt = "2026-08-07T13:46:00"
        )

        add(
            id = "m_18458",
            title = "Spotkanie: dr Antoni Czaczkowski",
            date = "2026-08-06 13:00:00",
            type = "REGULAR",
            hospitalId = "hosp_36",
            departmentId = "dept_36_1",
            doctorId = "doc_hosp_36_gra_1",
            doctorIds = listOf("doc_hosp_36_gra_1"),
            productTags = listOf("BIOSIS"),
            content = """### Biosis
Materiały biologiczne znane ordynatorowi. Omówiono zalety szybkiej preparacji i integracji z tkanką w polach zakażonych. Poproszono o ofertę e-mail.

**Następne kroki:** Wysłać ofertę na Biosis""",
            createdAt = "2026-08-07T13:48:00",
            updatedAt = "2026-08-07T13:48:00"
        )

        add(
            id = "m_18501",
            title = "Spotkanie: DR Adam Kałużny",
            date = "2026-08-08 08:30:00",
            type = "REGULAR",
            hospitalId = "hosp_69",
            departmentId = "dept_69_1",
            doctorId = "doc_hosp_69_16286",
            doctorIds = listOf("doc_hosp_69_16286"),
            productTags = listOf("SCANLAN", "ORASCOPTIC"),
            content = """**Uwagi do spotkania:** Wizyta kontrolna (Follow-Up) po testach nożyczek Scanlan LC oraz lup Orascoptic 3.0.

### Scanlan
Doktor potwierdził wybitną jakość cięcia nożyczek LC podczas dwóch zabiegów plastyki cewki. Zadeklarował chęć ujęcia ich w specyfikacji przetargowej.

**Następne kroki:** Przygotować opisy przedmiotu zamówienia (OPZ) dla działu aparatury

### Orascoptic
Lupy 3.0 sprawdziły się znakomicie. Doktor zgłosił zapotrzebowanie na zestaw ze światłem bezprzewodowym Spark.

**Następne kroki:** Uaktualnić ofertę o światło Spark i przesłać do akceptacji""",
            createdAt = "2026-08-08T11:00:00",
            updatedAt = "2026-08-08T11:00:00"
        )

        add(
            id = "m_18502",
            title = "Spotkanie: dr hab. med. Rafał Pawlaczyk",
            date = "2026-08-08 11:00:00",
            type = "REGULAR",
            hospitalId = "hosp_87",
            departmentId = "dept_87_1",
            doctorId = "doc_hosp_87_16616",
            doctorIds = listOf("doc_hosp_87_16616"),
            productTags = listOf("ORASCOPTIC", "NEOS SternFix"),
            content = """**Uwagi do spotkania:** Przekazanie zamówionego zestawu lup Orascoptic 3.5x oraz przegląd zapasu Neos SternFix.

### Orascoptic
Dostarczono i idealnie dopasowano lupy Orascoptic 3.5x z ramką XV1. Doktor jest niezwykle zadowolony z ostrości widzenia.

**Następne kroki:** Udostępnić kartę gwarancyjną i instrukcję czyszczenia optyki

### Neos Sternfix
Przegląd zapasów magazynowych na bloku kardiochirurgii. Zużycie stabilne, uzgodniono zamówienie uzupełniające 10 zestawów.

**Następne kroki:** Przesłać formularz zamówienia do działu logistyki UCK""",
            createdAt = "2026-08-08T14:30:00",
            updatedAt = "2026-08-08T14:30:00"
        )

        add(
            id = "m_18503",
            title = "Spotkanie: dr Tomasz Lemiesz",
            date = "2026-08-08 13:30:00",
            type = "REGULAR",
            hospitalId = "hosp_31",
            departmentId = "dept_31_2",
            doctorId = "doc_hosp_31_bs_mswia_1",
            doctorIds = listOf("doc_hosp_31_bs_mswia_1"),
            productTags = listOf("SCANLAN", "BLUENEEN"),
            content = """**Uwagi do spotkania:** Omówienie wyników przetargu na rozszerzadła OneStep oraz przygotowanie do zabiegów z użyciem robota Versius.

### BlueNeem
Przetarg rozstrzygnięty pomyślnie. Czekamy na podpisanie umowy na dostawę rozszerzadeł OneStep Dilators.

**Następne kroki:** Nadzorować proces podpisania umowy i dostawę pierwszej partii

### Scanlan
Przedstawiono walizkę pokazową z zaciskami naczyniowymi Scanlan Bulldog do operacji robotycznych.

**Następne kroki:** Zabezpieczyć zestaw testowy na pierwszy zabieg Versius""",
            createdAt = "2026-08-09T09:15:00",
            updatedAt = "2026-08-09T09:15:00"
        )

        add(
            id = "m_18504",
            title = "Spotkanie: dr Krzysztof Pol",
            date = "2026-08-09 10:00:00",
            type = "REGULAR",
            hospitalId = "hosp_45",
            departmentId = "dept_45_2",
            doctorId = "doc_hosp_45_18329",
            doctorIds = listOf("doc_hosp_45_18329"),
            productTags = listOf("ALLIUM", "BLUENEEN"),
            content = """**Uwagi do spotkania:** Finalizacja wyboru pacjentów do zabiegów ze stentami Allium oraz akceptacja oferty na stenty Triple J.

### Allium
Wytypowano 2 pacjentów ze zwężeniem moczowodu. Ustalono termin zabiegów proktorskich na 22 sierpnia.

**Następne kroki:** Zapewnić obecność proktora klinicznego i kompletny asortyment stentów Allium

### BlueNeem
Ordynator zaakceptował ofertę na stenty Triple J z pętlą moczowodową. Zamówienie próbne w toku.

**Następne kroki:** Przesłać formularz do apteki szpitalnej""",
            createdAt = "2026-08-09T11:40:00",
            updatedAt = "2026-08-09T11:40:00"
        )

        return list
    }

    fun getInitialTasks(): List<TaskEntity> {
        val list = mutableListOf<TaskEntity>()

        fun addTask(
            id: String,
            meetingId: String,
            hospitalId: String,
            departmentId: String,
            doctorId: String,
            desc: String,
            dueDate: String? = null,
            isDone: Boolean = false,
            createdAt: String = "2026-08-10T10:00:00"
        ) {
            list.add(
                TaskEntity(
                    id = id,
                    meetingId = meetingId,
                    hospitalId = hospitalId,
                    departmentId = departmentId,
                    doctorId = doctorId,
                    description = desc,
                    dueDate = dueDate,
                    isDone = isDone,
                    createdAt = createdAt
                )
            )
        }

        addTask("task_1", "m_16070", "hosp_28", "dept_28_1", "doc_hosp_28_aug_1", "Zorganizować testy lup HDL 2.5x na bloku operacyjnym", "2026-09-01", false)
        addTask("task_2", "m_16070", "hosp_28", "dept_28_1", "doc_hosp_28_aug_1", "Dostarczyć wzorce nożyczek SuperCut do testów", "2026-09-05", false)
        addTask("task_3", "m_16071", "hosp_69", "dept_69_1", "doc_hosp_69_16071", "Zaplanować warsztaty Sawbones dla zespołu kardiochirurgii", "2026-09-15", false)
        addTask("task_4", "m_16284", "hosp_69", "dept_69_1", "doc_hosp_69_16284", "Wysłać ofertę na 3 pacjentów Allium+BlueNeem", "2026-08-30", false)
        addTask("task_5", "m_16286", "hosp_69", "dept_69_1", "doc_hosp_69_16286", "Przygotować OPZ nożyczek Scanlan LC i ofertę na lupy 3.0 ze światłem Spark", "2026-08-28", false)
        addTask("task_6", "m_18329", "hosp_45", "dept_45_2", "doc_hosp_45_18329", "Zapewnić obecność proktora klinicznego na zabiegi Allium 22 sierpnia", "2026-08-22", true)
        addTask("task_7", "m_18503", "hosp_31", "dept_31_2", "doc_hosp_31_bs_mswia_1", "Zabezpieczyć zestaw testowy Scanlan Bulldog na pierwszy zabieg Versius", "2026-09-10", false)

        return list
    }
}
