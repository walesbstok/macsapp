package com.example.macscrm

import com.example.macscrm.data.local.CsvDataParser
import org.junit.Assert.*
import org.junit.Test

class CsvDataParserTest {

    @Test
    fun testParseCsvLines() {
        val sampleCsv = """
TYP_REKORDU;ID;NAZWA_LUB_TYTUŁ;PLACÓWKA_SZPITAL;MIASTO;WOJEWÓDZTWO;ODDZIAŁ;LEKARZ;SPECJALIZACJA_LUB_TYP;TELEFON;EMAIL;STATUS_LUB_ETAP;TERMIN_LUB_DATA;TAGI_PRODUKTY;TREŚĆ_NOTATKI;KOMENTARZ_MANAGERA;PRZEDSTAWICIEL_AUTOR
SZPITAL;hosp_1;SZPITAL KLINICZNY NR 1;SZPITAL KLINICZNY NR 1;Lublin;Lubelskie;;;;+48 81 123 45 67;kontakt@szpital.pl;key_account;2026-07-20T08:11:16.634Z;;Segment A;Notatka o szpitalu;Ważny ośrodek;
ODDZIAL;dept_1;ODDZIAŁ CHIRURGII OGÓLNEJ;SZPITAL KLINICZNY NR 1;Lublin;Lubelskie;ODDZIAŁ CHIRURGII OGÓLNEJ;;Chirurgia ogólna;+48 81 123 45 67;dept1@szpital.pl;active;2026-07-20T08:11:16.634Z;;;;
LEKARZ;doc_1;dr Jan Kowalski;SZPITAL KLINICZNY NR 1;Lublin;Lubelskie;ODDZIAŁ CHIRURGII OGÓLNEJ;dr Jan Kowalski;Ordynator;+48 81 123 45 67;jan.kowalski@szpital.pl;key_opinion_leader;2026-07-20T08:11:16.634Z;Dermabond, SternFix;Kluczowy decydent;;
SPOTKANIE;meet_1;Spotkanie wdrożeniowe;SZPITAL KLINICZNY NR 1;Lublin;Lubelskie;ODDZIAŁ CHIRURGII OGÓLNEJ;dr Jan Kowalski;;;;completed;2026-08-10T10:00:00Z;NEOS SternFix;Prezentacja produktu.;Oferta wysłana;Adam Przedstawiciel
ZADANIE;task_1;Przygotować ofertę cenową;SZPITAL KLINICZNY NR 1;Lublin;Lubelskie;ODDZIAŁ CHIRURGII OGÓLNEJ;dr Jan Kowalski;;;;pending;2026-08-20;NEOS SternFix;Przygotować ofertę;;Adam Przedstawiciel
        """.trimIndent()

        val bundle = CsvDataParser.parseCsvString(sampleCsv)

        assertEquals(1, bundle.hospitals.size)
        assertEquals("hosp_1", bundle.hospitals.first().id)
        assertEquals("SZPITAL KLINICZNY NR 1", bundle.hospitals.first().name)
        assertEquals("Lublin", bundle.hospitals.first().city)
        assertEquals("KEY_ACCOUNT", bundle.hospitals.first().pipelineStatus)

        assertEquals(1, bundle.departments.size)
        assertEquals("dept_1", bundle.departments.first().id)
        assertEquals("ODDZIAŁ CHIRURGII OGÓLNEJ", bundle.departments.first().name)

        assertEquals(1, bundle.doctors.size)
        assertEquals("doc_1", bundle.doctors.first().id)
        assertEquals("Jan", bundle.doctors.first().firstName)
        assertEquals("Kowalski", bundle.doctors.first().lastName)

        assertEquals(1, bundle.meetings.size)
        assertEquals("meet_1", bundle.meetings.first().id)
        assertEquals("Spotkanie wdrożeniowe", bundle.meetings.first().title)

        assertEquals(1, bundle.tasks.size)
        assertEquals("task_1", bundle.tasks.first().id)
        assertEquals("Przygotować ofertę cenową", bundle.tasks.first().description)
    }
}
