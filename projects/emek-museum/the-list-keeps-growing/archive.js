(() => {
    'use strict';

    // Entries are ordered by incident date, oldest first. Source for Kozlu:
    // https://www.zhaber.com.tr/3-mart-1992-kozlu-faciasinda-sehit-olan-263-maden-isçisinin-isimleri
    // Other groups use the names and sources supplied for the archive.
    const ARCHIVE_GROUPS = [
        {
            date: '1992-03-03',
            names: `
Celal KAPLANGİL
Muzaffer TURKÖLÇ
Orhan AVŞAR
Erol ÖZTÜRK
Ahmet NAZMAN
Recep BAŞOĞLU
Kazım AYDIN
Recep TETİK
Muharrem SEZER
Muhammet MADAK
Enver TOPAL
Zekeriya MANTARCI
Necati KANCA
Şevki ÇENESİZ
Recep HATIL
Ahmet ÇİLLİ
Hasn TAŞÇI
Nevzat KIZILBOĞA
Şaban DEMİRBAY
Şeref DEMİRBAY
Ahmet BAYRAM
Nafız ELİİYİ
Bayram ÇİLLİ
Şeref KARAHAN
Ziya ODABAŞ
İzzet ARAT
M. Emin SUBAŞI
Yakup KOZLU
Zihni KORKMAZ
Talat GÜMÜŞTAŞ
Recep TERZİOĞLU
Şaban SİVRİ
İsmail ACAR
Emin KUNDAKÇI
Hüseyin KARATAŞ
Satılmış KARAÇAM
Ahmet AYHAN
Reşat YAMAN
Ramazan ÇAKAR
İsmail ZORBA
Ersin ARSLAN
Recep TAŞCI
Sabri TERZİ
Şükrü ÖZTÜRK
Ali AKÇABELEN
Durmuş KOCADAYI
Bekir ÇELİK
Sabahattin AYTAN
Recep KİREN
Hidayet DERİN
Muharem KÖSE
Hakkı SAĞIR
İbrahim ELİİYİ
Hüseyin SARIOĞLU
Muzaffer KABAOĞLU
Sefer ÇATAKLI
Yaşar KARA
Hüseyin OKUMUŞ
Sefer KARADAYI
Muharrem BAŞLI
Sezai KARABÜGÜL
M. Ali TERZİ
Muharrem AYDIN
Niyazi TAŞCI
Dursun DERİN
Recep ÖZOĞLU
A. Osman YOLCU
Şaban KÖSEOĞLU
Talat SARAÇ
Kemal AKÇAPINAR
Rıza KAYAALTI
A. İhsan GÖKYAR
Aziz YILMAZ
İsmail KARAASLAN
Muhammet KARAYANIK
A. Yılmaz ENSECİ
Tahsin KARAYANIK
Hasan CANBAŞ
Duran SUER
Nevzat KARAYANIK
Tahir ADATEPE
Kudret YAMAN
Hasan ÖZBAY
Recep BAYRAM
Hasan ÖZDAL
İsmail ÇALTEPE
Şakir KARAÇAM
Mehmet GÖKYAR
Muhammet KARAÇAM
Yaşar KARAÇAM
Firuzan AKTEPE
Abdullah GÖKBAŞ
Hakkı GÖKKAYA
Mustafa BIYIKLI
İshak KARAYANIK
Satılmış ALÇANLI
Kadir KALAYCI
Satılmış KARAHAN
Arif KOCAMAN
Sait YILDIZ
Recep KULAÇ
A. Rıza ARSLAN
Kadir ÇAM
Cemal YILMAZ
Recep TELLİOĞLU
Sefer KÖSE
Ahmet BAYRAM
Hüseyin TAŞÇI
Yusuf DERİN
Halit TOPAL
Mehmet YANIK
Mehmet KÖSE
Muhammet ELİİYİ
Şaban AKKURT
Remzi DERİN
Hüseyin TOPAL
Ramazan MUMCU
İsmail TAŞKIN
Burhan ÇIRAK
İbrahim DEMİRHAN
Ekrem KAYIK
Metin DEMİROĞLU
Cemali TETİK
Kemal KAYAOĞLU
Sami AYNAGÖZ
Satılmış USLUBAŞ
A. Rıza KILAV
Mehmet BÜKRÜCÜ
Satılmış ERMİŞ
Orhan TOPAL
Berat ŞEN
Hüseyin KELEZ
Mustafa BAYRAK
Ahmet GÖZEN
Hüseyin SÖNMEZ
Niyazi FİLİZ
Cahit GÜNGÖR
Hüseyin TURAN
Recep KİRİŞ
Satılmış AYDOĞAN
Durali GÜLBAĞ
Orhan SAKA
Fahrettin KARGA
Ferahmuz KILIÇOĞLU
Mehmet Ali KALAYCI
Mustafa KESER
İhsan KARAPINAR
Mevlüt YAZGAN
Ramazan KALAFAT
Mehmet TERZİ
Recep ALDIRMAZ
Galip ÖZEN
Mehmet ÜNLÜ
Mustafa GEMİCİOĞLU
Ahmet ÇOLAK
Turgut ESEN
Mehmet AYDIN
Muharrem OĞUZ
Cemal SEZER
Mehmet KIZILKAYPAK
Coşkun ÇETİN
Dursun BOZACIOĞLU
Mustafa ÇİV
Recep BOZACIOĞLU
Mevlüt ÇAKMAKÇI
Bekir ÇAKMAKÇI
Sadettin İNAN
Şerafettin ERDOĞAN
Sefer ORHAN
Muharrem KARAGÖZ
Kasım TAYTEKİN
Hüseyin TAYTEKİN
Hayrettin KARAHAN
A. Ali KARAKUŞ
Mevlüt YILDIZHAN
Recep YANAZ
Kadir YILDIZHAN
Necati ERDOĞAN
Bayram AYDIN
Mevlüt ERDOĞAN
Mustafa ERDOĞAN
İdris AYDOĞMUŞ
Şaban YAVUZ
Hamza YILMAZ
Kadir KARAKUŞ
Mehmet ÖZTÜRK
Nizamettin TURGUT
Hüseyin ÇELEBİ
Mustafa ŞAHİN
Sabahattin GÖKTAŞ
Cevat KAZAN
Osman ÇATALÇAM
Ali DURAK
Kadir YAĞBASAN
Salih DURAK
Ahmet BAKIRCIK
Bilal ÖZKAYA
Şevket KÖROĞLU
Durdu ALTAY
Vedat İNAL
Memiş ÖZDEMİR
Ahmet KORKMAZ
İlyas İNAL
Halil İNAL
Fehmi KAYACAN
Yılmaz KARAHAN
Yakup KILIÇARSLAN
Kenan ÖZSOY
Muhterem DOĞANCI
Osman KARAKÖK
Satılmış TÜRKMEN
K. Cemali ÖREN
Hüsnü AYAN
Satılmış ÇANAKÇI
Satılmış ÇANAKÇI
Necip ÇANAKÇI
Mustafa ÇANAKÇI
İsa AYAN
Yaşar KUZÖREN
Şahin ÇAYLI
Mustafa ÇAYLI
Nizamettin KAHVECİ
Şenol KAHVECİ
Ahmet ÇAYLI
Hilmi AYAN
Metin KAHVECİ
Metin ÇANAKÇI
Erdal KAHVECİ
Hilmi AYAN
Mehmet İNCEBACAK
Tacettin ÖZTÜRK
Ramazan YILMAZ
Celal GÜMÜŞBAŞ
Mustafa YAVUZ
Osman DEMİRCİ
Kasım AYDEMİR
Rıfat GEMİCİ
A. Nevzat GÜNEYLİ
Hurşit PEKMEZCİ
Durmuş ALAGÖZ
Kemal TÜRKMEN
M. Zeki GEMİCİ
Recep PEKMEZCİ
Yüksel KARAÖZ
Yusuf ALAGÖZ
İsmail AYDIN
Hüseyin ÇAKMAK
Bekir ALDIRMAZ
Mehmet TEMEL
Mehmet TEKİN
Cemal ÖREN
Niyazi YAR
Cemali DEMİRCİ
İrfan ÖREN
Kemal KÖSEOĞLU
İmdat KASKATI
Ziyafet ÖZTAŞ
Aziz ÖREN
İsmail KIZILTOPRAK
Refik KİREMİTÇİ
Mehmet BOZKURT
Kadir AYDIN
Latif KANGAL`.trim().split('\n'),
        },
        {
            date: '2014-05-13',
            names: `
İbrahim Sungur
Ali Kavas
İsmail Öztürk
Mehmet Ateş
Zeki Gezer
Ramazan Ünal
Sefer Hazar
Uğur Canbey
Kasım Softa
Mehmet Emin Çardak
Muhammed Çağan
Yüksel Yaşar
Emin Mazı
Ali Şahin`.trim().split('\n'),
        },
        {
            date: '2014-10-28',
            names: `
Tezcan Gökçe
Hasan Tuncer
Ali Haznedar
Mehmet Özcan
Kamil Yaman
Mehmet Baha
Ömer Cansu
İsmail Gürses
Uğur İlhan
Hüseyin Çolak
Osman Çoksöyler
Mehmet Tokat
Hüsnü Çolak
Hüseyin Gültekin
Recep Çillioğlu
İsa Gözbaşı
Kerim Haznedar
Bahir Üzer`.trim().split('\n'),
        },
        {
            date: '2022-10-14',
            names: `
Murat Ergin
Enes Aydın
Orhan Altun
Mehmet Kara
Emrah Kaya
Deniz Baykal
Şuayip Okul
Ali Doğru
Aziz Köse
Berkay Pınaroğlu
Emrah Kaval
Ercan Akdeniz
Fikret Kansız
Gökhan Mercan
Ramazan Özer
Selçuk Ayvaz
Serkan Nakaş
Yener Saygın
Rasim Bulut
Serhat Kahraman
Suat Demirkıran
Yasin Çelik
Mehmet Bulut
Gürdal Serenli
Rıdvan Acet
Sabri Akdere
Ferhat Poyraz
Remzi Özçelik
Burçin Saban
Mustafa Can Yıldırım
İbrahim Köse
Yusuf Özerkan
Öner Yıldız
Şaban Yıldırım
Ercan Saraç
Mustafa Çelik
Soner Ak
Rahman Özçelik
Okan Akgül
Berkay Kesim
Murat Öztan
Taner Şen
Ayhan Akgül`.trim().split('\n'),
        },
        {
            date: '2026-10-23',
            names: `
Cengizhan Bükrübaş
Murat Kaya
Recep Çolakoğlu`.trim().split('\n'),
        },
    ];
    const ARCHIVE_NAMES = ARCHIVE_GROUPS.flatMap((group) => group.names);

    const list = document.getElementById('name-list');
    if (!list) return;

    list.innerHTML = ARCHIVE_NAMES.map((name) => `<li>${name}</li>`).join('');
    const archiveEnd = document.getElementById('archive-end');
    if (archiveEnd) {
        archiveEnd.textContent = `${ARCHIVE_NAMES.length} names recorded. Countless more remain unrecorded.`;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const speed = 0.8; // pixels per second: deliberately almost imperceptible
    const startDelay = 1800;
    const resumeAfter = 4000;
    let pausedUntil = reducedMotion.matches ? Infinity : performance.now() + startDelay;
    let lastFrame = 0;
    let reachedEnd = false;

    function pauseTemporarily() {
        if (reducedMotion.matches || reachedEnd) return;
        pausedUntil = performance.now() + resumeAfter;
    }

    window.addEventListener('wheel', pauseTemporarily, { passive: true });
    window.addEventListener('touchmove', pauseTemporarily, { passive: true });
    window.addEventListener('pointerdown', (event) => {
        // Pause when the visitor grabs the browser's vertical scrollbar.
        if (event.clientX >= document.documentElement.clientWidth) pauseTemporarily();
    }, { passive: true });
    window.addEventListener('keydown', (event) => {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
            pauseTemporarily();
        }
    });
    reducedMotion.addEventListener('change', (event) => {
        if (event.matches) pausedUntil = Infinity;
        else if (!reachedEnd) pausedUntil = performance.now() + startDelay;
    });

    function drift(timestamp) {
        if (!lastFrame) lastFrame = timestamp;
        const elapsed = Math.min((timestamp - lastFrame) / 1000, 0.05);
        lastFrame = timestamp;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return requestAnimationFrame(drift);

        if (window.scrollY >= maxScroll - 0.5) {
            reachedEnd = true;
            return;
        }

        if (timestamp >= pausedUntil) {
            window.scrollBy(0, Math.min(speed * elapsed, maxScroll - window.scrollY));
        }
        requestAnimationFrame(drift);
    }

    requestAnimationFrame(drift);
})();
