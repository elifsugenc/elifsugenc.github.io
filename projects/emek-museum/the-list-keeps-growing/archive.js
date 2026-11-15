(() => {
    'use strict';

    // Entries are ordered by incident date, oldest first. Source for Kozlu:
    // https://www.zhaber.com.tr/3-mart-1992-kozlu-faciasinda-sehit-olan-263-maden-isçisinin-isimleri
    // Other groups use the names and sources supplied for the archive.
    const ARCHIVE_GROUPS = [
        {
            date: '1992-03-03',
            eventName: 'Kozlu mine disaster',
            incidentTime: '19:50',
            namesSource: 'https://www.zhaber.com.tr/3-mart-1992-kozlu-faciasinda-sehit-olan-263-maden-isçisinin-isimleri',
            timeSource: 'https://www.zhaber.com.tr/3-mart-1992-kozlu-faciasinda-sehit-olan-263-maden-isçisinin-isimleri',
            ageContext: 'Verified individual records from official casualty registry (3 March 1992)',
            records: [
        { name: 'Celal KAPLANGİL', regId: '2449401', birthYear: 1949, age: 43, hometown: 'Erzincan' },
        { name: 'Muzaffer TURKÖLÇ', regId: '2473990', birthYear: 1958, age: 34, hometown: 'Zonguldak' },
        { name: 'Orhan AVŞAR', regId: '10246945', birthYear: 1957, age: 35, hometown: 'Ereğli' },
        { name: 'Erol ÖZTÜRK', regId: '14320609', birthYear: 1960, age: 32, hometown: 'Maçka' },
        { name: 'Ahmet NAZMAN', regId: '2466578', birthYear: 1956, age: 36, hometown: 'Kozlu' },
        { name: 'Recep BAŞOĞLU', regId: '12608999', birthYear: 1953, age: 39, hometown: 'Çaycuma' },
        { name: 'Kazım AYDIN', regId: '2473300', birthYear: 1954, age: 38, hometown: 'Yenice' },
        { name: 'Recep TETİK', regId: '2478583', birthYear: 1961, age: 31, hometown: 'Çaycuma' },
        { name: 'Muharrem SEZER', regId: '2471017', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Muhammet MADAK', regId: '10254756', birthYear: 1954, age: 38, hometown: 'Yenice' },
        { name: 'Enver TOPAL', regId: '2456291', birthYear: 1952, age: 40, hometown: 'Devrek' },
        { name: 'Zekeriya MANTARCI', regId: '13908915', birthYear: 1962, age: 30, hometown: 'Devrek' },
        { name: 'Necati KANCA', regId: '2454176', birthYear: 1951, age: 41, hometown: 'Yenice' },
        { name: 'Şevki ÇENESİZ', regId: '2454717', birthYear: 1951, age: 41, hometown: 'Yenice' },
        { name: 'Recep HATIL', regId: '10242062', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'Ahmet ÇİLLİ', regId: '9395643', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Hasn TAŞÇI', regId: '2471177', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Nevzat KIZILBOĞA', regId: '2481839', birthYear: 1959, age: 33, hometown: 'Ereğli' },
        { name: 'Şaban DEMİRBAY', regId: '2476600', birthYear: 1958, age: 34, hometown: 'Ereğli' },
        { name: 'Şeref DEMİRBAY', regId: '2477821', birthYear: 1955, age: 37, hometown: 'Ereğli' },
        { name: 'Ahmet BAYRAM', regId: '8204365', birthYear: 1954, age: 38, hometown: 'Devrek' },
        { name: 'Nafız ELİİYİ', regId: '2452361', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Bayram ÇİLLİ', regId: '2452942', birthYear: 1951, age: 41, hometown: 'Devrek' },
        { name: 'Şeref KARAHAN', regId: '2456060', birthYear: 1952, age: 40, hometown: 'Ereğli' },
        { name: 'Ziya ODABAŞ', regId: '2476225', birthYear: 1954, age: 38, hometown: 'Yenice' },
        { name: 'İzzet ARAT', regId: '5634876', birthYear: 1951, age: 41, hometown: 'Yenice' },
        { name: 'M.Emin SUBAŞI', regId: '14319209', birthYear: 1964, age: 28, hometown: 'Devrek' },
        { name: 'Yakup KOZLU', regId: '13857782', birthYear: 1962, age: 30, hometown: 'Devrek' },
        { name: 'Zihni KORKMAZ', regId: '2475672', birthYear: 1957, age: 35, hometown: 'Yenice' },
        { name: 'Talat GÜMÜŞTAŞ', regId: '2429676', birthYear: 1943, age: 49, hometown: 'Devrek' },
        { name: 'Recep TERZİOĞLU', regId: '10263025', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Şaban SİVRİ', regId: '2476184', birthYear: 1957, age: 35, hometown: 'Devrek' },
        { name: 'İsmail ACAR', regId: '2477356', birthYear: 1959, age: 33, hometown: 'Çaycuma' },
        { name: 'Emin KUNDAKÇI', regId: '2473224', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Hüseyin KARATAŞ', regId: '10247295', birthYear: 1954, age: 38, hometown: 'Devrek' },
        { name: 'Satılmış KARAÇAM', regId: '2481843', birthYear: 1965, age: 27, hometown: 'Devrek' },
        { name: 'Ahmet AYHAN', regId: '2442860', birthYear: 1947, age: 45, hometown: 'Kozlu' },
        { name: 'Reşat YAMAN', regId: '2476244', birthYear: 1957, age: 35, hometown: 'Ereğli' },
        { name: 'Ramazan ÇAKAR', regId: '2473138', birthYear: 1955, age: 37, hometown: 'Ereğli' },
        { name: 'İsmail ZORBA', regId: '2476238', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'Ersin ARSLAN', regId: '5614099', birthYear: 1953, age: 39, hometown: 'Devrek' },
        { name: 'Recep TAŞCI', regId: '2472743', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Sabri TERZİ', regId: '10263026', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Şükrü ÖZTÜRK', regId: '2476651', birthYear: 1956, age: 36, hometown: 'Ereğli' },
        { name: 'Ali AKÇABELEN', regId: '2463744', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Durmuş KOCADAYI', regId: '2457088', birthYear: 1951, age: 41, hometown: 'Devrek' },
        { name: 'Bekir ÇELİK', regId: '2457584', birthYear: 1951, age: 41, hometown: 'Devrek' },
        { name: 'Sabahattin AYTAN', regId: '16693982', birthYear: 1965, age: 27, hometown: 'Kozlu' },
        { name: 'Recep KİREN', regId: '5599141', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Hidayet DERİN', regId: '5177221', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Muharem KÖSE', regId: '9576626', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'Hakkı SAĞIR', regId: '5179985', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'İbrahim ELİİYİ', regId: '2462207', birthYear: 1954, age: 38, hometown: 'Devrek' },
        { name: 'Hüseyin SARIOĞLU', regId: '2463830', birthYear: 1948, age: 44, hometown: 'Devrek' },
        { name: 'Muzaffer KABAOĞLU', regId: '2439578', birthYear: 1945, age: 47, hometown: 'Devrek' },
        { name: 'Sefer ÇATAKLI', regId: '2465734', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Yaşar KARA', regId: '9344390', birthYear: 1955, age: 37, hometown: 'Maçka' },
        { name: 'Hüseyin OKUMUŞ', regId: '2470774', birthYear: 1954, age: 38, hometown: 'Kozlu' },
        { name: 'Sefer KARADAYI', regId: '2481844', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Muharrem BAŞLI', regId: '2476078', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'Sezai KARABÜGÜL', regId: '2453041', birthYear: 1950, age: 42, hometown: 'Ereğli' },
        { name: 'M.Ali TERZİ', regId: '30086719', birthYear: 1960, age: 32, hometown: 'Devrek' },
        { name: 'Muharrem AYDIN', regId: '2471220', birthYear: 1953, age: 39, hometown: 'Devrek' },
        { name: 'Niyazi TAŞCI', regId: '2472748', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Dursun DERİN', regId: '2471162', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Recep ÖZOĞLU', regId: '2464741', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'A.Osman YOLCU', regId: '2451737', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Şaban KÖSEOĞLU', regId: '2481243', birthYear: 1962, age: 30, hometown: 'Devrek' },
        { name: 'Talat SARAÇ', regId: '10837872', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Kemal AKÇAPINAR', regId: '2476668', birthYear: 1954, age: 38, hometown: 'Devrek' },
        { name: 'Rıza KAYAALTI', regId: '2466018', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'A.İhsan GÖKYAR', regId: '2478721', birthYear: 1960, age: 32, hometown: 'Devrek' },
        { name: 'Aziz YILMAZ', regId: '5619074', birthYear: 1953, age: 39, hometown: 'Devrek' },
        { name: 'İsmail KARAASLAN', regId: '2465385', birthYear: 1955, age: 37, hometown: 'Kozlu' },
        { name: 'Muhammet KARAYANIK', regId: '10248220', birthYear: 1960, age: 32, hometown: 'Devrek' },
        { name: 'A.Yılmaz ENSECİ', regId: '2482565', birthYear: 1961, age: 31, hometown: 'Devrek' },
        { name: 'Tahsin KARAYANIK', regId: '2458154', birthYear: 1951, age: 41, hometown: 'Devrek' },
        { name: 'Hasan CANBAŞ', regId: '10247250', birthYear: 1957, age: 35, hometown: 'Devrek' },
        { name: 'Duran SUER', regId: '2481830', birthYear: 1960, age: 32, hometown: 'Devrek' },
        { name: 'Nevzat KARAYANIK', regId: '10247304', birthYear: 1951, age: 41, hometown: 'Devrek' },
        { name: 'Tahir ADATEPE', regId: '10276912', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Kudret YAMAN', regId: '12075274', birthYear: 1959, age: 33, hometown: 'Zonguldak' },
        { name: 'Hasan ÖZBAY', regId: '2478071', birthYear: 1960, age: 32, hometown: 'Devrek' },
        { name: 'Recep BAYRAM', regId: '14922884', birthYear: 1963, age: 29, hometown: 'Devrek' },
        { name: 'Hasan ÖZDAL', regId: '9468896', birthYear: 1952, age: 40, hometown: 'Devrek' },
        { name: 'İsmail ÇALTEPE', regId: '2472751', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Şakir KARAÇAM', regId: '2454596', birthYear: 1952, age: 40, hometown: 'Devrek' },
        { name: 'Mehmet GÖKYAR', regId: '10248213', birthYear: 1961, age: 31, hometown: 'Devrek' },
        { name: 'Muhammet KARAÇAM', regId: '10247289', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'Yaşar KARAÇAM', regId: '2451822', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Firuzan AKTEPE', regId: '10245611', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'Abdullah GÖKBAŞ', regId: '2447506', birthYear: 1949, age: 43, hometown: 'Devrek' },
        { name: 'Hakkı GÖKKAYA', regId: '10266237', birthYear: 1960, age: 32, hometown: 'Devrek' },
        { name: 'Mustafa BIYIKLI', regId: '10258851', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'İshak KARAYANIK', regId: '10258317', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'Satılmış ALÇANLI', regId: '10244963', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Kadir KALAYCI', regId: '10247285', birthYear: 1952, age: 40, hometown: 'Devrek' },
        { name: 'Satılmış KARAHAN', regId: '2471210', birthYear: 1955, age: 37, hometown: 'Ereğli' },
        { name: 'Arif KOCAMAN', regId: '2477771', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Sait YILDIZ', regId: '2458061', birthYear: 1948, age: 44, hometown: 'Bartın' },
        { name: 'Recep KULAÇ', regId: '10265613', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'A.Rıza ARSLAN', regId: '2460891', birthYear: 1952, age: 40, hometown: 'Ereğli' },
        { name: 'Kadir ÇAM', regId: '2454105', birthYear: 1951, age: 41, hometown: 'Ereğli' },
        { name: 'Cemal YILMAZ', regId: '2455588', birthYear: 1948, age: 44, hometown: 'Ereğli' },
        { name: 'Recep TELLİOĞLU', regId: '10968352', birthYear: 1963, age: 29, hometown: 'Devrek' },
        { name: 'Sefer KÖSE', regId: '2452355', birthYear: 1951, age: 41, hometown: 'Devrek' },
        { name: 'Ahmet BAYRAM', regId: '14318232', birthYear: 1964, age: 28, hometown: 'Devrek' },
        { name: 'Hüseyin TAŞÇI', regId: '2473241', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'Yusuf DERİN', regId: '14184955', birthYear: 1963, age: 29, hometown: 'Devrek' },
        { name: 'Halit TOPAL', regId: '2482510', birthYear: 1965, age: 27, hometown: 'Devrek' },
        { name: 'Mehmet YANIK', regId: '10207266', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'Mehmet KÖSE', regId: '2473488', birthYear: 1953, age: 39, hometown: 'Devrek' },
        { name: 'Muhammet ELİİYİ', regId: '2481257', birthYear: 1963, age: 29, hometown: 'Devrek' },
        { name: 'Şaban AKKURT', regId: '7421067', birthYear: 1957, age: 35, hometown: 'Devrek' },
        { name: 'Remzi DERİN', regId: '2460863', birthYear: 1953, age: 39, hometown: 'Devrek' },
        { name: 'Hüseyin TOPAL', regId: '2459108', birthYear: 1953, age: 39, hometown: 'Devrek' },
        { name: 'Ramazan MUMCU', regId: '10259900', birthYear: 1958, age: 34, hometown: 'Kozlu' },
        { name: 'İsmail TAŞKIN', regId: '2453053', birthYear: 1946, age: 46, hometown: 'Kozlu' },
        { name: 'Burhan ÇIRAK', regId: '2479657', birthYear: 1961, age: 31, hometown: 'Devrek' },
        { name: 'İbrahim DEMİRHAN', regId: '2465743', birthYear: 1950, age: 42, hometown: 'Ereğli' },
        { name: 'Ekrem KAYIK', regId: '12507364', birthYear: 1960, age: 32, hometown: 'Kastamonu' },
        { name: 'Metin DEMİROĞLU', regId: '13863088', birthYear: 1960, age: 32, hometown: 'Ordu' },
        { name: 'Cemali TETİK', regId: '2456295', birthYear: 1947, age: 45, hometown: 'Yenice' },
        { name: 'Kemal KAYAOĞLU', regId: '2479650', birthYear: 1959, age: 33, hometown: 'Yenice' },
        { name: 'Sami AYNAGÖZ', regId: '10254662', birthYear: 1955, age: 37, hometown: 'Karabük' },
        { name: 'Satılmış USLUBAŞ', regId: '2450054', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'A.Rıza KILAV', regId: '2457574', birthYear: 1952, age: 40, hometown: 'Devrek' },
        { name: 'Mehmet BÜKRÜCÜ', regId: '2474397', birthYear: 1952, age: 40, hometown: 'Devrek' },
        { name: 'Satılmış ERMİŞ', regId: '2477811', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Orhan TOPAL', regId: '2474453', birthYear: 1964, age: 28, hometown: 'Devrek' },
        { name: 'Berat ŞEN', regId: '13914313', birthYear: 1960, age: 32, hometown: 'Zonguldak' },
        { name: 'Hüseyin KELEZ', regId: '2481444', birthYear: 1960, age: 32, hometown: 'Devrek' },
        { name: 'Mustafa BAYRAK', regId: '5615465', birthYear: 1946, age: 46, hometown: 'Kurucaşile' },
        { name: 'Ahmet GÖZEN', regId: '2479140', birthYear: 1957, age: 35, hometown: 'Trabzon' },
        { name: 'Hüseyin SÖNMEZ', regId: '2640267', birthYear: 1956, age: 36, hometown: 'Erzincan' },
        { name: 'Niyazi FİLİZ', regId: '2455427', birthYear: 1947, age: 45, hometown: 'Ordu' },
        { name: 'Cahit GÜNGÖR', regId: '9085217', birthYear: 1955, age: 37, hometown: 'Kars' },
        { name: 'Hüseyin TURAN', regId: '2460916', birthYear: 1949, age: 43, hometown: 'Ereğli' },
        { name: 'Recep KİRİŞ', regId: '2451825', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Satılmış AYDOĞAN', regId: '2459841', birthYear: 1948, age: 44, hometown: 'Ereğli' },
        { name: 'Durali GÜLBAĞ', regId: '2477412', birthYear: 1959, age: 33, hometown: 'Çankırı' },
        { name: 'Orhan SAKA', regId: '2478551', birthYear: 1962, age: 30, hometown: 'Devrek' },
        { name: 'Fahrettin KARGA', regId: '16501957', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Ferahmuz KILIÇOĞLU', regId: '2458449', birthYear: 1947, age: 45, hometown: 'Posof' },
        { name: 'Mehmet Ali KALAYCI', regId: '14320512', birthYear: 1960, age: 32, hometown: 'Trabzon' },
        { name: 'Mustafa KESER', regId: '10279843', birthYear: 1959, age: 33, hometown: 'Zonguldak' },
        { name: 'İhsan KARAPINAR', regId: '5629318', birthYear: 1956, age: 36, hometown: 'Zonguldak' },
        { name: 'Mevlüt YAZGAN', regId: '2472761', birthYear: 1954, age: 38, hometown: 'Kozlu' },
        { name: 'Ramazan KALAFAT', regId: '5616616', birthYear: 1953, age: 39, hometown: 'Kozlu' },
        { name: 'Mehmet TERZİ', regId: '2431022', birthYear: 1943, age: 49, hometown: 'Devrek' },
        { name: 'Recep ALDIRMAZ', regId: '2455484', birthYear: 1952, age: 40, hometown: 'Ereğli' },
        { name: 'Galip ÖZEN', regId: '2473219', birthYear: 1955, age: 37, hometown: 'Ereğli' },
        { name: 'Mehmet ÜNLÜ', regId: '2470803', birthYear: 1954, age: 38, hometown: 'Ereğli' },
        { name: 'Mustafa GEMİCİOĞLU', regId: '10261830', birthYear: 1954, age: 38, hometown: 'Zonguldak' },
        { name: 'Ahmet ÇOLAK', regId: '2450910', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Turgut ESEN', regId: '2477340', birthYear: 1958, age: 34, hometown: 'Posof' },
        { name: 'Mehmet AYDIN', regId: '2453012', birthYear: 1945, age: 47, hometown: 'Kozlu' },
        { name: 'Muharrem OĞUZ', regId: '2473235', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'Cemal SEZER', regId: '2452868', birthYear: 1951, age: 41, hometown: 'Kozlu' },
        { name: 'Mehmet KIZILKAYPAK', regId: '2472753', birthYear: 1950, age: 42, hometown: 'Bartın' },
        { name: 'Coşkun ÇETİN', regId: '2476160', birthYear: 1957, age: 35, hometown: 'Kozlu' },
        { name: 'Dursun BOZACIOĞLU', regId: '16685747', birthYear: 1964, age: 28, hometown: 'Kozlu' },
        { name: 'Mustafa ÇİV', regId: '2475725', birthYear: 1955, age: 37, hometown: 'Kozlu' },
        { name: 'Recep BOZACIOĞLU', regId: '2478083', birthYear: 1958, age: 34, hometown: 'Kozlu' },
        { name: 'Mevlüt ÇAKMAKÇI', regId: '2482536', birthYear: 1963, age: 29, hometown: 'Kozlu' },
        { name: 'Bekir ÇAKMAKÇI', regId: '2475786', birthYear: 1959, age: 33, hometown: 'Kozlu' },
        { name: 'Sadettin İNAN', regId: '2449377', birthYear: 1949, age: 43, hometown: 'Kozlu' },
        { name: 'Şerafettin ERDOĞAN', regId: '2452049', birthYear: 1951, age: 41, hometown: 'Ereğli' },
        { name: 'Sefer ORHAN', regId: '2447645', birthYear: 1949, age: 43, hometown: 'Ereğli' },
        { name: 'Muharrem KARAGÖZ', regId: '2451535', birthYear: 1950, age: 42, hometown: 'Ereğli' },
        { name: 'Kasım TAYTEKİN', regId: '2453291', birthYear: 1951, age: 41, hometown: 'Ereğli' },
        { name: 'Hüseyin TAYTEKİN', regId: '2454449', birthYear: 1951, age: 41, hometown: 'Ereğli' },
        { name: 'Hayrettin KARAHAN', regId: '2473186', birthYear: 1949, age: 43, hometown: 'Ereğli' },
        { name: 'A.Ali KARAKUŞ', regId: '2473204', birthYear: 1955, age: 37, hometown: 'Ereğli' },
        { name: 'Mevlüt YILDIZHAN', regId: '2476188', birthYear: 1959, age: 33, hometown: 'Ereğli' },
        { name: 'Recep YANAZ', regId: '2477904', birthYear: 1961, age: 31, hometown: 'Ereğli' },
        { name: 'Kadir YILDIZHAN', regId: '2479130', birthYear: 1959, age: 33, hometown: 'Ereğli' },
        { name: 'Necati ERDOĞAN', regId: '9568754', birthYear: 1956, age: 36, hometown: 'Ereğli' },
        { name: 'Bayram AYDIN', regId: '13911864', birthYear: 1964, age: 28, hometown: 'Ereğli' },
        { name: 'Mevlüt ERDOĞAN', regId: '15808384', birthYear: 1963, age: 29, hometown: 'Ereğli' },
        { name: 'Mustafa ERDOĞAN', regId: '16808385', birthYear: 1961, age: 31, hometown: 'Ereğli' },
        { name: 'İdris AYDOĞMUŞ', regId: '2456371', birthYear: 1952, age: 40, hometown: 'Kozlu' },
        { name: 'Şaban YAVUZ', regId: '2458111', birthYear: 1952, age: 40, hometown: 'Kozlu' },
        { name: 'Hamza YILMAZ', regId: '2457851', birthYear: 1953, age: 39, hometown: 'Ereğli' },
        { name: 'Kadir KARAKUŞ', regId: '2457268', birthYear: 1952, age: 40, hometown: 'Ereğli' },
        { name: 'Mehmet ÖZTÜRK', regId: '2481241', birthYear: 1964, age: 28, hometown: 'Ereğli' },
        { name: 'Nizamettin TURGUT', regId: '2471544', birthYear: 1951, age: 41, hometown: 'Yenice' },
        { name: 'Hüseyin ÇELEBİ', regId: '24757789', birthYear: 1956, age: 36, hometown: 'Kozlu' },
        { name: 'Mustafa ŞAHİN', regId: '5626757', birthYear: 1954, age: 38, hometown: 'Kozlu' },
        { name: 'Sabahattin GÖKTAŞ', regId: '2476543', birthYear: 1959, age: 33, hometown: 'Yenice' },
        { name: 'Cevat KAZAN', regId: '5638207', birthYear: 1955, age: 37, hometown: 'Yenice' },
        { name: 'Osman ÇATALÇAM', regId: '8196875', birthYear: 1958, age: 34, hometown: 'Yenice' },
        { name: 'Ali DURAK', regId: '10253225', birthYear: 1957, age: 35, hometown: 'Yenice' },
        { name: 'Kadir YAĞBASAN', regId: '13908107', birthYear: 1966, age: 26, hometown: 'Yenice' },
        { name: 'Salih DURAK', regId: '14320119', birthYear: 1965, age: 27, hometown: 'Yenice' },
        { name: 'Ahmet BAKIRCIK', regId: '14320795', birthYear: 1966, age: 26, hometown: 'Yenice' },
        { name: 'Bilal ÖZKAYA', regId: '2476648', birthYear: 1958, age: 34, hometown: 'Kozlu' },
        { name: 'Şevket KÖROĞLU', regId: '2477774', birthYear: 1959, age: 33, hometown: 'Devrek' },
        { name: 'Durdu ALTAY', regId: '5613456', birthYear: 1955, age: 37, hometown: 'Kozlu' },
        { name: 'Vedat İNAL', regId: '16685699', birthYear: 1964, age: 28, hometown: 'Ereğli' },
        { name: 'Memiş ÖZDEMİR', regId: '2476218', birthYear: 1956, age: 36, hometown: 'Ereğli' },
        { name: 'Ahmet KORKMAZ', regId: '2476228', birthYear: 1959, age: 33, hometown: 'Ereğli' },
        { name: 'İlyas İNAL', regId: '2476287', birthYear: 1957, age: 35, hometown: 'Ereğli' },
        { name: 'Halil İNAL', regId: '2476288', birthYear: 1958, age: 34, hometown: 'Ereğli' },
        { name: 'Fehmi KAYACAN', regId: '2481245', birthYear: 1957, age: 35, hometown: 'Ereğli' },
        { name: 'Yılmaz KARAHAN', regId: '10284875', birthYear: 1954, age: 38, hometown: 'Ereğli' },
        { name: 'Yakup KILIÇARSLAN', regId: '13956477', birthYear: 1958, age: 34, hometown: 'Ereğli' },
        { name: 'Kenan ÖZSOY', regId: '2471151', birthYear: 1948, age: 44, hometown: 'Ereğli' },
        { name: 'Muhterem DOĞANCI', regId: '2429141', birthYear: 1943, age: 49, hometown: 'Devrek' },
        { name: 'Osman KARAKÖK', regId: '2451554', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Satılmış TÜRKMEN', regId: '2473994', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'K.Cemali ÖREN', regId: '2454053', birthYear: 1951, age: 41, hometown: 'Yenice' },
        { name: 'Hüsnü AYAN', regId: '2448421', birthYear: 1949, age: 43, hometown: 'Yenice' },
        { name: 'Satılmış ÇANAKÇI', regId: '2458440', birthYear: 1953, age: 39, hometown: 'Yenice' },
        { name: 'Satılmış ÇANAKÇI', regId: '2476548', birthYear: 1957, age: 35, hometown: 'Yenice' },
        { name: 'Necip ÇANAKÇI', regId: '2476549', birthYear: 1956, age: 36, hometown: 'Yenice' },
        { name: 'Mustafa ÇANAKÇI', regId: '2476550', birthYear: 1957, age: 35, hometown: 'Yenice' },
        { name: 'İsa AYAN', regId: '2477925', birthYear: 1960, age: 32, hometown: 'Yenice' },
        { name: 'Yaşar KUZÖREN', regId: '2478998', birthYear: 1955, age: 37, hometown: 'Yenice' },
        { name: 'Şahin ÇAYLI', regId: '2479952', birthYear: 1966, age: 26, hometown: 'Yenice' },
        { name: 'Mustafa ÇAYLI', regId: '2479953', birthYear: 1960, age: 32, hometown: 'Yenice' },
        { name: 'Nizamettin KAHVECİ', regId: '2479956', birthYear: 1967, age: 25, hometown: 'Yenice' },
        { name: 'Şenol KAHVECİ', regId: '2479957', birthYear: 1963, age: 29, hometown: 'Yenice' },
        { name: 'Ahmet ÇAYLI', regId: '10266197', birthYear: 1956, age: 36, hometown: 'Yenice' },
        { name: 'Hilmi AYAN', regId: '10289419', birthYear: 1953, age: 39, hometown: 'Yenice' },
        { name: 'Metin KAHVECİ', regId: '14320738', birthYear: 1961, age: 31, hometown: 'Yenice' },
        { name: 'Metin ÇANAKÇI', regId: '14327001', birthYear: 1966, age: 26, hometown: 'Yenice' },
        { name: 'Erdal KAHVECİ', regId: '16684969', birthYear: 1967, age: 25, hometown: 'Yenice' },
        { name: 'Hilmi AYAN', regId: '16696812', birthYear: 1962, age: 30, hometown: 'Yenice' },
        { name: 'Mehmet İNCEBACAK', regId: '30101257', birthYear: 1964, age: 28, hometown: 'Yenice' },
        { name: 'Tacettin ÖZTÜRK', regId: '2459213', birthYear: 1949, age: 43, hometown: 'Bartın' },
        { name: 'Ramazan YILMAZ', regId: '2454390', birthYear: 1950, age: 42, hometown: 'Kozlu' },
        { name: 'Celal GÜMÜŞBAŞ', regId: '2478077', birthYear: 1961, age: 31, hometown: 'Kozlu' },
        { name: 'Mustafa YAVUZ', regId: '2475701', birthYear: 1957, age: 35, hometown: 'Kozlu' },
        { name: 'Osman DEMİRCİ', regId: '5911238', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Kasım AYDEMİR', regId: '2449128', birthYear: 1949, age: 43, hometown: 'Ereğli' },
        { name: 'Rıfat GEMİCİ', regId: '2468965', birthYear: 1952, age: 40, hometown: 'Devrek' },
        { name: 'A.Nevzat GÜNEYLİ', regId: '2473102', birthYear: 1955, age: 37, hometown: 'Devrek' },
        { name: 'Hurşit PEKMEZCİ', regId: '2473218', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'Durmuş ALAGÖZ', regId: '2476144', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'Kemal TÜRKMEN', regId: '2476247', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'M.Zeki GEMİCİ', regId: '2476294', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'Recep PEKMEZCİ', regId: '2477830', birthYear: 1954, age: 38, hometown: 'Devrek' },
        { name: 'Yüksel KARAÖZ', regId: '2481442', birthYear: 1965, age: 27, hometown: 'Devrek' },
        { name: 'Yusuf ALAGÖZ', regId: '9399766', birthYear: 1956, age: 36, hometown: 'Devrek' },
        { name: 'İsmail AYDIN', regId: '2452842', birthYear: 1950, age: 42, hometown: 'Kozlu' },
        { name: 'Hüseyin ÇAKMAK', regId: '2460675', birthYear: 1953, age: 39, hometown: 'Kozlu' },
        { name: 'Bekir ALDIRMAZ', regId: '2454792', birthYear: 1952, age: 40, hometown: 'Ereğli' },
        { name: 'Mehmet TEMEL', regId: '2473188', birthYear: 1953, age: 39, hometown: 'Ereğli' },
        { name: 'Mehmet TEKİN', regId: '2476248', birthYear: 1958, age: 34, hometown: 'Ereğli' },
        { name: 'Cemal ÖREN', regId: '2456910', birthYear: 1952, age: 40, hometown: 'Yenice' },
        { name: 'Niyazi YAR', regId: '2457845', birthYear: 1953, age: 39, hometown: 'Yenice' },
        { name: 'Cemali DEMİRCİ', regId: '2473288', birthYear: 1954, age: 38, hometown: 'Yenice' },
        { name: 'İrfan ÖREN', regId: '2475688', birthYear: 1956, age: 36, hometown: 'Yenice' },
        { name: 'Kemal KÖSEOĞLU', regId: '2481244', birthYear: 1964, age: 28, hometown: 'Yenice' },
        { name: 'İmdat KASKATI', regId: '10289422', birthYear: 1959, age: 33, hometown: 'Yenice' },
        { name: 'Ziyafet ÖZTAŞ', regId: '2457805', birthYear: 1948, age: 44, hometown: 'Giresun' },
        { name: 'Aziz ÖREN', regId: '2477086', birthYear: 1958, age: 34, hometown: 'Devrek' },
        { name: 'İsmail KIZILTOPRAK', regId: '2479679', birthYear: 1960, age: 32, hometown: 'Bartın' },
        { name: 'Refik KİREMİTÇİ', regId: '2451521', birthYear: 1950, age: 42, hometown: 'Devrek' },
        { name: 'Mehmet BOZKURT', regId: '2473076', birthYear: 1955, age: 37, hometown: 'Ereğli' },
        { name: 'Kadir AYDIN', regId: '2476007', birthYear: 1956, age: 36, hometown: 'Ereğli' },
        { name: 'Latif KANGAL', regId: '2478688', birthYear: 1956, age: 36, hometown: 'Devrek' }
            ],
            names: [
                'Celal KAPLANGİL',
                'Muzaffer TURKÖLÇ',
                'Orhan AVŞAR',
                'Erol ÖZTÜRK',
                'Ahmet NAZMAN',
                'Recep BAŞOĞLU',
                'Kazım AYDIN',
                'Recep TETİK',
                'Muharrem SEZER',
                'Muhammet MADAK',
                'Enver TOPAL',
                'Zekeriya MANTARCI',
                'Necati KANCA',
                'Şevki ÇENESİZ',
                'Recep HATIL',
                'Ahmet ÇİLLİ',
                'Hasn TAŞÇI',
                'Nevzat KIZILBOĞA',
                'Şaban DEMİRBAY',
                'Şeref DEMİRBAY',
                'Ahmet BAYRAM',
                'Nafız ELİİYİ',
                'Bayram ÇİLLİ',
                'Şeref KARAHAN',
                'Ziya ODABAŞ',
                'İzzet ARAT',
                'M.Emin SUBAŞI',
                'Yakup KOZLU',
                'Zihni KORKMAZ',
                'Talat GÜMÜŞTAŞ',
                'Recep TERZİOĞLU',
                'Şaban SİVRİ',
                'İsmail ACAR',
                'Emin KUNDAKÇI',
                'Hüseyin KARATAŞ',
                'Satılmış KARAÇAM',
                'Ahmet AYHAN',
                'Reşat YAMAN',
                'Ramazan ÇAKAR',
                'İsmail ZORBA',
                'Ersin ARSLAN',
                'Recep TAŞCI',
                'Sabri TERZİ',
                'Şükrü ÖZTÜRK',
                'Ali AKÇABELEN',
                'Durmuş KOCADAYI',
                'Bekir ÇELİK',
                'Sabahattin AYTAN',
                'Recep KİREN',
                'Hidayet DERİN',
                'Muharem KÖSE',
                'Hakkı SAĞIR',
                'İbrahim ELİİYİ',
                'Hüseyin SARIOĞLU',
                'Muzaffer KABAOĞLU',
                'Sefer ÇATAKLI',
                'Yaşar KARA',
                'Hüseyin OKUMUŞ',
                'Sefer KARADAYI',
                'Muharrem BAŞLI',
                'Sezai KARABÜGÜL',
                'M.Ali TERZİ',
                'Muharrem AYDIN',
                'Niyazi TAŞCI',
                'Dursun DERİN',
                'Recep ÖZOĞLU',
                'A.Osman YOLCU',
                'Şaban KÖSEOĞLU',
                'Talat SARAÇ',
                'Kemal AKÇAPINAR',
                'Rıza KAYAALTI',
                'A.İhsan GÖKYAR',
                'Aziz YILMAZ',
                'İsmail KARAASLAN',
                'Muhammet KARAYANIK',
                'A.Yılmaz ENSECİ',
                'Tahsin KARAYANIK',
                'Hasan CANBAŞ',
                'Duran SUER',
                'Nevzat KARAYANIK',
                'Tahir ADATEPE',
                'Kudret YAMAN',
                'Hasan ÖZBAY',
                'Recep BAYRAM',
                'Hasan ÖZDAL',
                'İsmail ÇALTEPE',
                'Şakir KARAÇAM',
                'Mehmet GÖKYAR',
                'Muhammet KARAÇAM',
                'Yaşar KARAÇAM',
                'Firuzan AKTEPE',
                'Abdullah GÖKBAŞ',
                'Hakkı GÖKKAYA',
                'Mustafa BIYIKLI',
                'İshak KARAYANIK',
                'Satılmış ALÇANLI',
                'Kadir KALAYCI',
                'Satılmış KARAHAN',
                'Arif KOCAMAN',
                'Sait YILDIZ',
                'Recep KULAÇ',
                'A.Rıza ARSLAN',
                'Kadir ÇAM',
                'Cemal YILMAZ',
                'Recep TELLİOĞLU',
                'Sefer KÖSE',
                'Ahmet BAYRAM',
                'Hüseyin TAŞÇI',
                'Yusuf DERİN',
                'Halit TOPAL',
                'Mehmet YANIK',
                'Mehmet KÖSE',
                'Muhammet ELİİYİ',
                'Şaban AKKURT',
                'Remzi DERİN',
                'Hüseyin TOPAL',
                'Ramazan MUMCU',
                'İsmail TAŞKIN',
                'Burhan ÇIRAK',
                'İbrahim DEMİRHAN',
                'Ekrem KAYIK',
                'Metin DEMİROĞLU',
                'Cemali TETİK',
                'Kemal KAYAOĞLU',
                'Sami AYNAGÖZ',
                'Satılmış USLUBAŞ',
                'A.Rıza KILAV',
                'Mehmet BÜKRÜCÜ',
                'Satılmış ERMİŞ',
                'Orhan TOPAL',
                'Berat ŞEN',
                'Hüseyin KELEZ',
                'Mustafa BAYRAK',
                'Ahmet GÖZEN',
                'Hüseyin SÖNMEZ',
                'Niyazi FİLİZ',
                'Cahit GÜNGÖR',
                'Hüseyin TURAN',
                'Recep KİRİŞ',
                'Satılmış AYDOĞAN',
                'Durali GÜLBAĞ',
                'Orhan SAKA',
                'Fahrettin KARGA',
                'Ferahmuz KILIÇOĞLU',
                'Mehmet Ali KALAYCI',
                'Mustafa KESER',
                'İhsan KARAPINAR',
                'Mevlüt YAZGAN',
                'Ramazan KALAFAT',
                'Mehmet TERZİ',
                'Recep ALDIRMAZ',
                'Galip ÖZEN',
                'Mehmet ÜNLÜ',
                'Mustafa GEMİCİOĞLU',
                'Ahmet ÇOLAK',
                'Turgut ESEN',
                'Mehmet AYDIN',
                'Muharrem OĞUZ',
                'Cemal SEZER',
                'Mehmet KIZILKAYPAK',
                'Coşkun ÇETİN',
                'Dursun BOZACIOĞLU',
                'Mustafa ÇİV',
                'Recep BOZACIOĞLU',
                'Mevlüt ÇAKMAKÇI',
                'Bekir ÇAKMAKÇI',
                'Sadettin İNAN',
                'Şerafettin ERDOĞAN',
                'Sefer ORHAN',
                'Muharrem KARAGÖZ',
                'Kasım TAYTEKİN',
                'Hüseyin TAYTEKİN',
                'Hayrettin KARAHAN',
                'A.Ali KARAKUŞ',
                'Mevlüt YILDIZHAN',
                'Recep YANAZ',
                'Kadir YILDIZHAN',
                'Necati ERDOĞAN',
                'Bayram AYDIN',
                'Mevlüt ERDOĞAN',
                'Mustafa ERDOĞAN',
                'İdris AYDOĞMUŞ',
                'Şaban YAVUZ',
                'Hamza YILMAZ',
                'Kadir KARAKUŞ',
                'Mehmet ÖZTÜRK',
                'Nizamettin TURGUT',
                'Hüseyin ÇELEBİ',
                'Mustafa ŞAHİN',
                'Sabahattin GÖKTAŞ',
                'Cevat KAZAN',
                'Osman ÇATALÇAM',
                'Ali DURAK',
                'Kadir YAĞBASAN',
                'Salih DURAK',
                'Ahmet BAKIRCIK',
                'Bilal ÖZKAYA',
                'Şevket KÖROĞLU',
                'Durdu ALTAY',
                'Vedat İNAL',
                'Memiş ÖZDEMİR',
                'Ahmet KORKMAZ',
                'İlyas İNAL',
                'Halil İNAL',
                'Fehmi KAYACAN',
                'Yılmaz KARAHAN',
                'Yakup KILIÇARSLAN',
                'Kenan ÖZSOY',
                'Muhterem DOĞANCI',
                'Osman KARAKÖK',
                'Satılmış TÜRKMEN',
                'K.Cemali ÖREN',
                'Hüsnü AYAN',
                'Satılmış ÇANAKÇI',
                'Satılmış ÇANAKÇI',
                'Necip ÇANAKÇI',
                'Mustafa ÇANAKÇI',
                'İsa AYAN',
                'Yaşar KUZÖREN',
                'Şahin ÇAYLI',
                'Mustafa ÇAYLI',
                'Nizamettin KAHVECİ',
                'Şenol KAHVECİ',
                'Ahmet ÇAYLI',
                'Hilmi AYAN',
                'Metin KAHVECİ',
                'Metin ÇANAKÇI',
                'Erdal KAHVECİ',
                'Hilmi AYAN',
                'Mehmet İNCEBACAK',
                'Tacettin ÖZTÜRK',
                'Ramazan YILMAZ',
                'Celal GÜMÜŞBAŞ',
                'Mustafa YAVUZ',
                'Osman DEMİRCİ',
                'Kasım AYDEMİR',
                'Rıfat GEMİCİ',
                'A.Nevzat GÜNEYLİ',
                'Hurşit PEKMEZCİ',
                'Durmuş ALAGÖZ',
                'Kemal TÜRKMEN',
                'M.Zeki GEMİCİ',
                'Recep PEKMEZCİ',
                'Yüksel KARAÖZ',
                'Yusuf ALAGÖZ',
                'İsmail AYDIN',
                'Hüseyin ÇAKMAK',
                'Bekir ALDIRMAZ',
                'Mehmet TEMEL',
                'Mehmet TEKİN',
                'Cemal ÖREN',
                'Niyazi YAR',
                'Cemali DEMİRCİ',
                'İrfan ÖREN',
                'Kemal KÖSEOĞLU',
                'İmdat KASKATI',
                'Ziyafet ÖZTAŞ',
                'Aziz ÖREN',
                'İsmail KIZILTOPRAK',
                'Refik KİREMİTÇİ',
                'Mehmet BOZKURT',
                'Kadir AYDIN',
                'Latif KANGAL'
            ],
        },
        {
            date: '2014-05-13',
            eventName: 'Soma mine disaster',
            incidentTime: '15:10',
            namesSource: 'https://bianet.org/haber/21-durusmada-301-somali-madenciyi-isimleriyle-aniyoruz-195528',
            timeSource: 'https://www.barobirlik.org.tr/dosyalar/duyurular/20141112_somamadenfaciasipdf.pdf',
            ages: {
                'İbrahim Sungur': 34,
                'Mehmet Azman': 27,
                'Uğur Çolak': 26,
                'Ali Şahin': 23,
                'İbrahim Duman': 26,
                'Saadettin Yılmaz': 41,
                'Zühtü Yıldırım': 28,
            },
            ageSources: {
                'İbrahim Sungur': 'https://www.aa.com.tr/tr/turkiye/turkiye-maden-faciasinda-hayatini-kaybeden-evlatlarini-ugurluyor/159370',
                'Mehmet Azman': 'https://www.aa.com.tr/tr/turkiye/o-gun-maden-degil-bizim-icimiz-goctu/1475763',
                'Uğur Çolak': 'https://www.aa.com.tr/tr/turkiye/o-gun-maden-degil-bizim-icimiz-goctu/1475763',
                'Ali Şahin': 'https://www.aa.com.tr/tr/yasam/somada-acilar-ilk-gunku-gibi/816057',
                'İbrahim Duman': 'https://h.aa.com.tr/tr/turkiye/soma-sehitleri-aniliyor/571523',
                'Saadettin Yılmaz': 'https://www.aa.com.tr/tr/yasam/somali-kadinlarin-acisi-ilk-gunku-gibi/814390',
                'Zühtü Yıldırım': 'https://www.aa.com.tr/tr/yasam/somada-acilar-ilk-gunku-gibi/816057',
            },
            names: `
Abdullah İnal
Abdullah Özdemir
Abdullah Sivri
Abdülmüttalip Akay
Adem Abokan
Adem Çetiner
Adem Varol
Ahmet Akbulut
Ahmet Akdemir
Ahmet Ali Aslan
Ahmet Avcu
Ahmet Bal
Ahmet Çelik
Ahmet Ergün
Ahmet Erol
Ahmet Gülcü
Ahmet Güven
Ahmet Kaya
Ahmet Soluk
Ahmet Şen
Ahmet Varal
Akif Doruk
Ali Biçak
Ali Çiftçi
Ali Gül
Ali Kavas
Ali Kilit
Ali Şahin
Ali Şentürk
Ali Yanar
Ali Yüksel
Arif Demir
Aşkın Koyun
Aydın Özgün
Ayhan Avcı
Bayram Ali Dağlı
Bayram Bayındır
Bayram Erol
Bayram İndirik
Bayram Parça
Beytullah Çakır
Bilal Ay
Bilal Bilgi
Bilal Malkoç
Burak Karayel
Celal Sevinç
Cemal Kaya
Cemal Yıldız
Cemil Taşdemir
Cengiz Çantal
Cengiz Kargı
Cengiz Şimşek
Davut Ağız
Davut Çeçen
Davut Duran
Davut Köse
Doğan Yıldırım
Dursun Demircan
Emin Esen
Emin Kurt
Emin Mazı
Emrah Çakır
Emrullah Armut
Engin Yıldırım
Ercan Cezeli
Erdal Demirel
Erdoğan Köse
Erdoğan Merdim
Erdoğan Sevben
Ergun Koyakkaya
Ergün Akkuş
Ergün Sidal
Erkan Altuntaş
Erkan Doğdu
Erol Işık
Erol Uysal
Ersin Çetin
Ersin Keçeli
Evren Sarı
Faruk Karahan
Fatih Köse
Fedai Bozdağ
Ferhat Avkaş
Ferhat Canbaz
Ferhat İren
Ferhat Tokgöz
Feridun Çelik
Gafur Şen
Gazi Osman Sümer
Gökhan Yılmaz
Göknur Kocagedik
Güngör Kayrak
Hakan Taşdemir
Hakan Uçkun
Hakkı Doğan Sal
Halil Ergöz
Halil İbrahim Doğan
Halil İbrahim Hamurcu
Halil Koca
Halil Şevik
Harun Keskin
Hasan Akkaş
Hayri Türker
Hayrullah Baygül
Himmet Anaçlı
Hüseyin Avkaş
Hüseyin Dalbudak
Hüseyin Demir
Hüseyin Kılıç
Hüseyin Kılıç
Hüseyin Top
İbrahim Biçer
İbrahim Çelik
İbrahim Çelik
İbrahim Duman
İbrahim Gezer
İbrahim Gökçe
İbrahim Kutbey
İbrahim Salgın
İbrahim Sungur
İdris Arslan
İdris Duran
İlkay Yıldırım
İlyas Özkan
İlyas Yıldırım
İsa Aldemir
İsa Çalış
İsa Sadan
İsa Sevben
İsmail Aslan
İsmail Aslan
İsmail Canbal
İsmail Çata
İsmail Çoşkun
İsmail Değirmen
İsmail Gezer
İsmail Gürpınar
İsmail Kalkan
İsmail Kutlu
İsmail Öztürk
İsmail Şengür
İsmail Tulum
İsmail Yıldırım
İsmet Yılmaz
Kader Yıldırım
Kadir Özel
Kamber Çağlar
Kamil Çal
Kasım Softa
Kazım Karaçoban
Kemal Çoban
Kenan Akdeniz
Kenan Aksoy
Kenan Avcı
Koray Karadağ
Mahmut Akbulut
Mehmet Akif Günaydın
Mehmet Ali Özcan
Mehmet Ateş
Mehmet Azman
Mehmet Çelik
Mehmet Efe
Mehmet Emin Çardak
Mehmet Eser
Mehmet Gülşen
Mehmet Şentürk
Mehmet Yavaş
Mehmet Yetim
Mesut Memiş
Mesut Özkoç
Metin Burmalı
Metin Uslu
Mithat Özdirik
Muhammed Arslancan
Muhammed Çağan
Muhammed Girgin
Muharrem Çiçek
Muharrem Şen
Muhsin Taş
Murat Avcı
Murat Gezgin
Murat Gümüş
Murat Kandemir
Musa Kara
Musa Karaçoban
Mustafa Çalı
Mustafa Dağlı
Mustafa Fenerli
Mustafa Kaya
Mustafa Kocabaş
Mustafa Korkmaz
Mustafa Sedat Toprak
Mustafa Türkhan
Muzaffer Eren
Mücahit Yardımcı
Nihat Kayrak
Niyazi Bayram
Niyazi İzmir
Niyazi Kurban
Numan Kandemir
Nurhan Yankın
Nurettin Kara
Nurettin Yıldız
Nurullah Köse
Okan Merdim
Orhan Öksüz
Osman Fındık
Osman Özgün
Osman Şam
Ömer Afacan
Ömer Elibol
Ömer Özcan
Özay Eren
Özcan Bozdağ
Özcan Öncü
Özcan Sarı
Özgül Çiftçi
Özgür Çevirgen
Özgür Şen
Ramazan Aldemir
Ramazan Çakır
Ramazan Çatar
Ramazan Doğan
Ramazan Kökçü
Ramazan Mercan
Ramazan Savaşan
Ramazan Sökmen
Ramazan Şahin
Ramazan Uçkun
Ramazan Ünal
Ramazan Yavaş
Recep Aldemir
Recep Gümcür
Recep Terzi
Recep Türk
Remzi Artar
Rıdvan Kazancı
Rıdvan Koçhan
Ruhi Dağlı
Sadettin Yılmaz
Sadık Akdağ
Sadık Çakır
Sadi Almaz
Sadrettin Güngör
Saffet Şahin
Saim Özcan
Sait Karaca
Sami Yıldırım
Sebahattin Aydın
Sefer Hazar
Sefer Yayla
Selahattin Kayrak
Selami Tizel
Semai Aktaş
Serkan Buran
Serkan Güneş
Seyit Ali Çetin
Sezai Kılıç
Sinan Yılmaz
Suat Esen
Süleyman Akcan
Süleyman Aldemir
Süleyman Çata
Süleyman Kandemir
Süleyman Tunahan Ulusoy
Şaban İlçi
Şahin Aydın
Şavki Değirmen
Şenay Baygül
Şerafettin Girgin
Şerif Genç
Şerif Gezgin
Şevket Saban
Şinasi Tokmak
Tebib Kaska
Talip Özten
Tayyip Şenlik
Tezcan Şentürk
Tolga Özcan
Tuncay Sidal
Tuncay Şahin
Tuncer Ülhan
Turgay Yağcı
Turgut Yılmaz
Uğur Canbey
Uğur Çolak
Veysel Arkan
Yahya Aybak
Yıldırım Güney
Yılmaz Çiftçi
Yılmaz Erol
Yunus Yılancı
Yüksel Akcan
Yüksel Cangül
Yüksel Yaşar
Zabit Ataş
Zekeriya Kuzu
Zeki Coşkun
Zeki Gezer
Zeynel Uzar
Zühtü Yıldırım`.trim().split('\n'),
        },
        {
            date: '2014-10-28',
            eventName: 'Ermenek mine flooding',
            incidentTime: '12:15',
            namesSource: 'https://bianet.org/haber/ermenek-davasinda-saniklara-ceza-degil-odul-verildi-176950',
            timeSource: 'https://www.karaman.gov.tr/ermenek-te-maden-kazasi',
            ages: { 'Ömer Cansu': 22 },
            ageSources: { 'Ömer Cansu': 'https://www.haberturk.com/gundem/haber/1015364-o-madencinin-kimligi-belirlendi' },
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
            eventName: 'Amasra mine explosion',
            incidentTime: '18:15',
            namesSource: 'https://bartinstar.com/bartinda-selalar-pes-pese-iste-maden-sehitlerimizin-isimleri/',
            timeSource: 'https://www.aa.com.tr/tr/gundem/bartinda-maden-ocaginda-patlama/2712051',
            deathDates: {
                'Taner Şen': '2022-11-04',
                'Ayhan Akgül': '2023-04-05',
            },
            personSources: {
                'Taner Şen': 'https://genelmadenis.org.tr/sehidimiz-taner-seni-ugurladik/',
                'Ayhan Akgül': 'https://www5.tbmm.gov.tr/tutanaklar/TUTANAK/TBMM/d27/c129/tbmm27129086.pdf',
            },
            ages: {
                'Taner Şen': 30,
                'Ayhan Akgül': 38,
                'Murat Ergin': 37,
                'Deniz Baykal': 38,
                'Soner Ak': 32,
                'Serhat Kahraman': 34,
                'Öner Yıldız': 38,
                'Şuayip Okul': 28,
                'Rahman Özçelik': 22,
                'Gürdal Serenli': 24,
                'Aziz Köse': 28,
            },
            ageSources: {
                'Taner Şen': 'https://genelmadenis.org.tr/sehidimiz-taner-seni-ugurladik/',
                'Ayhan Akgül': 'https://www5.tbmm.gov.tr/tutanaklar/TUTANAK/TBMM/d27/c129/tbmm27129086.pdf',
                'Murat Ergin': 'https://www.trthaber.com/foto-galeri/bir-madencinin-sehitlik-mertebesinde-biten-hikayesi-matematigin-tuttugu-murat/51137.html',
                'Deniz Baykal': 'https://www.karar.com/guncel-haberler/maden-faciasinda-hayatini-kaybedenler-ugurlaniyor-ayni-koyde-iki-cenaze-1696697',
                'Soner Ak': 'https://www.haberturk.com/tarifsiz-aci-her-bir-madencinin-hikayesi-yuregimizi-dagladi-3530701',
                'Serhat Kahraman': 'https://www.haberturk.com/tarifsiz-aci-her-bir-madencinin-hikayesi-yuregimizi-dagladi-3530701',
                'Öner Yıldız': 'https://www.haberturk.com/30-yil-once-grizu-patlamasindan-kurtulan-emekli-madenci-oglunun-acisini-yasadi-3530344',
                'Şuayip Okul': 'https://artigercek.com/emek/faciada-olen-madencinin-akrabasi-1-hafta-once-bakim-zamani-geldigini-soylemisti-226945h',
                'Rahman Özçelik': 'https://www.trthaber.com/foto-galeri/maden-iscilerine-veda/51070.html',
                'Gürdal Serenli': 'https://www.trthaber.com/foto-galeri/maden-iscilerine-veda/51070.html',
                'Aziz Köse': 'https://openaccess.firat.edu.tr/xmlui/bitstream/handle/11508/21025/TAM%20MET%C4%B0N-AMASRADA%20MEYDANA%20GELEN%20MADEN%20OCA%C4%9EI%20PATLAMASININ%20T%C3%9CRK%20YAZILI%20BASININDA%20YANSIMALARI.pdf?isAllowed=y&sequence=1',
            },
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
            eventName: 'Gelik mine explosion',
            incidentTime: '10:00',
            namesSource: 'https://www.aa.com.tr/tr/gundem/zonguldakta-maden-ocagindaki-grizu-patlamasinda-olen-3-isci-defnedildi/4099439',
            timeSource: 'https://www.aa.com.tr/tr/gundem/zonguldakta-maden-ocagindaki-grizu-patlamasinda-3-kisi-oldu-5-kisi-yaralandi/4098203',
            ages: {
                'Cengizhan Bükrübaş': 25,
                'Murat Kaya': 38,
                'Recep Çolakoğlu': 45,
            },
            ageSources: {
                'Cengizhan Bükrübaş': 'https://www.haberturk.com/gundem/maden-sehitlerine-veda-10-yasindaki-elif-defalarca-tabutu-optu-zonguldak-haberleri-3922251',
                'Murat Kaya': 'https://www.haberturk.com/gundem/maden-sehitlerine-veda-10-yasindaki-elif-defalarca-tabutu-optu-zonguldak-haberleri-3922251',
                'Recep Çolakoğlu': 'https://www.haberturk.com/gundem/maden-sehitlerine-veda-10-yasindaki-elif-defalarca-tabutu-optu-zonguldak-haberleri-3922251',
            },
            names: `
Cengizhan Bükrübaş
Murat Kaya
Recep Çolakoğlu`.trim().split('\n'),
        },
    ];
    const ARCHIVE_RECORDS = ARCHIVE_GROUPS.flatMap((group) => {
        if (group.records) {
            return group.records.map((item) => ({
                name: item.name,
                eventName: group.eventName,
                eventDate: group.date,
                deathDate: item.deathDate || group.date,
                incidentTime: group.incidentTime,
                age: item.age ?? null,
                birthYear: item.birthYear ?? null,
                hometown: item.hometown ?? null,
                regId: item.regId ?? null,
                ageSource: item.ageSource || group.ageSources?.[item.name] || null,
                ageContext: group.ageContext || null,
                ageContextSource: group.ageContextSource || null,
                namesSource: item.namesSource || group.namesSource,
                timeSource: group.timeSource,
            }));
        }
        return group.names.map((name) => ({
            name,
            eventName: group.eventName,
            eventDate: group.date,
            deathDate: group.deathDates?.[name] || group.date,
            incidentTime: group.incidentTime,
            age: group.ages?.[name] ?? null,
            birthYear: group.birthYears?.[name] ?? null,
            hometown: group.hometowns?.[name] ?? null,
            regId: group.regIds?.[name] ?? null,
            ageSource: group.ageSources?.[name] || group.personSources?.[name] || null,
            ageContext: group.ageContext || null,
            ageContextSource: group.ageContextSource || null,
            namesSource: group.personSources?.[name] || group.namesSource,
            timeSource: group.timeSource,
        }));
    });
    const ARCHIVE_NAMES = ARCHIVE_RECORDS.map((record) => record.name);

    const list = document.getElementById('name-list');
    if (!list) return;

    function displayName(name) {
        return name.toLocaleLowerCase('tr-TR').replace(/(^|[\s.-])(\p{L})/gu, (_, separator, letter) => (
            separator + letter.toLocaleUpperCase('tr-TR')
        ));
    }

    list.innerHTML = ARCHIVE_RECORDS.map((record, index) => {
        const name = displayName(record.name);
        return `<li data-list-index="${index}"><span class="stream-name">${name}</span></li>`;
    }).join('');
    const mosaic = document.getElementById('name-mosaic');
    if (mosaic) {
        mosaic.innerHTML = ARCHIVE_RECORDS.map((record, index) => {
            const name = displayName(record.name);
            const label = record.age != null
                ? `${name}, age ${record.age}; memorial record`
                : `${name}; memorial record`;
            return `<li tabindex="${index === 0 ? '0' : '-1'}" data-record-index="${index}" style="--name-index:${index}" aria-label="${label}">${name}</li>`;
        }).join(' ');
    }

    const readingDetail = document.getElementById('reading-detail');
    const wallDetail = document.getElementById('wall-detail');
    const wallDetailClose = wallDetail?.querySelector('.wall-detail-close');
    let wallDetailPinned = false;

    function showRecord(index, panel) {
        const record = ARCHIVE_RECORDS[index];
        if (!record || !panel) return;

        const deathDate = new Date(`${record.deathDate}T12:00:00`);
        
        const nameHeader = panel.querySelector('[data-detail-field="name"]');
        if (nameHeader) {
            nameHeader.textContent = displayName(record.name);
        }

        panel.querySelector('[data-detail-field="event"]').textContent = record.eventName;
        panel.querySelector('[data-detail-field="date"]').textContent = new Intl.DateTimeFormat('en', {
            day: 'numeric', month: 'long', year: 'numeric',
        }).format(deathDate);
        
        const ageField = panel.querySelector('[data-detail-field="age"]');
        if (ageField) {
            ageField.textContent = record.age != null
                ? `${record.age} years${record.birthYear ? ` (born ${record.birthYear})` : ''}`
                : record.ageContext || 'Not verified in this archive';
        }

        const hometownRow = panel.querySelector('[data-detail-row="hometown"]');
        if (hometownRow) hometownRow.hidden = true;
        const regnoRow = panel.querySelector('[data-detail-row="regno"]');
        if (regnoRow) regnoRow.hidden = true;

        panel.querySelector('[data-detail-field="time"]').textContent = `Individual time not recorded · incident approx. ${record.incidentTime}`;
        panel.querySelector('[data-detail-source="names"]').href = record.namesSource;
        const ageSource = panel.querySelector('[data-detail-source="age"]');
        const ageSourceHref = record.ageSource || record.ageContextSource;
        ageSource.hidden = !ageSourceHref;
        if (ageSourceHref) ageSource.href = ageSourceHref;
        panel.querySelector('[data-detail-source="time"]').href = record.timeSource;
        panel.setAttribute('aria-hidden', 'false');
        panel.closest('.archive-reading, .archive-mosaic-stage')?.classList.add('has-selection');
    }

    function positionWallDetail(item) {
        if (!item || !wallDetail || !mosaicStage) return;
        const itemBounds = item.getBoundingClientRect();
        const stageBounds = mosaicStage.getBoundingClientRect();
        const panelWidth = wallDetail.offsetWidth;
        const panelHeight = wallDetail.offsetHeight;
        const itemCenterX = itemBounds.left + itemBounds.width / 2 - stageBounds.left;
        const minX = panelWidth / 2 + 12;
        const maxX = stageBounds.width - panelWidth / 2 - 12;
        const centerX = Math.max(minX, Math.min(maxX, itemCenterX));
        wallDetail.style.setProperty('--wall-detail-left', `${centerX}px`);

        const gap = 12;
        const itemTop = itemBounds.top - stageBounds.top;
        const itemBottom = itemBounds.bottom - stageBounds.top;
        const aboveSpace = itemTop - 12;
        const belowSpace = stageBounds.height - itemBottom - 12;
        const placeAbove = aboveSpace >= panelHeight + gap || aboveSpace >= belowSpace;
        const top = placeAbove
            ? Math.max(12, itemTop - panelHeight - gap)
            : Math.min(stageBounds.height - panelHeight - 12, itemBottom + gap);
        wallDetail.style.setProperty('--wall-detail-top', `${top}px`);
    }

    function recordFromEvent(event) {
        const item = event.target.closest('[data-record-index]');
        if (item) {
            showRecord(Number(item.dataset.recordIndex), wallDetail);
            positionWallDetail(item);
        }
    }

    mosaic?.addEventListener('pointerover', recordFromEvent);
    mosaic?.addEventListener('pointerout', (event) => {
        const leavingName = event.target.closest('[data-record-index]');
        const enteringName = event.relatedTarget?.closest?.('[data-record-index]');
        const enteringPanel = event.relatedTarget?.closest?.('#wall-detail');
        if (leavingName && !enteringName && !enteringPanel && !wallDetailPinned) {
            mosaicStage?.classList.remove('has-selection');
            wallDetail?.setAttribute('aria-hidden', 'true');
        }
    });
    mosaic?.addEventListener('focusin', recordFromEvent);
    mosaic?.addEventListener('focusout', (event) => {
        if (!event.relatedTarget?.closest?.('[data-record-index]') && !wallDetailPinned) {
            mosaicStage?.classList.remove('has-selection');
            wallDetail?.setAttribute('aria-hidden', 'true');
        }
    });
    mosaic?.addEventListener('click', (event) => {
        const item = event.target.closest('[data-record-index]');
        if (!item) return;
        showRecord(Number(item.dataset.recordIndex), wallDetail);
        positionWallDetail(item);
        wallDetailPinned = true;
        mosaicStage?.classList.add('wall-detail-pinned');
    });
    wallDetailClose?.addEventListener('click', () => {
        wallDetailPinned = false;
        mosaicStage?.classList.remove('has-selection', 'wall-detail-pinned');
        wallDetail?.setAttribute('aria-hidden', 'true');
    });
    wallDetail?.addEventListener('pointerleave', () => {
        if (wallDetailPinned) return;
        mosaicStage?.classList.remove('has-selection');
        wallDetail.setAttribute('aria-hidden', 'true');
    });
    wallDetail?.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !wallDetailPinned) return;
        wallDetailPinned = false;
        mosaicStage?.classList.remove('has-selection', 'wall-detail-pinned');
        wallDetail.setAttribute('aria-hidden', 'true');
    });
    mosaic?.addEventListener('keydown', (event) => {
        const current = event.target.closest('[data-record-index]');
        if (!current) return;
        const currentIndex = Number(current.dataset.recordIndex);
        let nextIndex = currentIndex;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = Math.min(ARCHIVE_RECORDS.length - 1, currentIndex + 1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = Math.max(0, currentIndex - 1);
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = ARCHIVE_RECORDS.length - 1;
        else return;

        event.preventDefault();
        current.tabIndex = -1;
        const next = mosaic.querySelector(`[data-record-index="${nextIndex}"]`);
        next.tabIndex = 0;
        next.focus();
    });
    const archiveEnd = document.getElementById('archive-end');
    if (archiveEnd) {
        archiveEnd.textContent = `${ARCHIVE_NAMES.length} names recorded. Countless more remain unrecorded.`;
    }

    const mosaicSection = document.getElementById('archive-mosaic');
    const mosaicStage = document.getElementById('archive-mosaic-stage');
    let wallFrame = 0;

    function fitMosaicToViewport() {
        if (!mosaic || !mosaicStage) return;
        const stageStyle = getComputedStyle(mosaicStage);
        const availableHeight = mosaicStage.clientHeight
            - parseFloat(stageStyle.paddingTop)
            - parseFloat(stageStyle.paddingBottom);
        const baseSize = Math.min(20, Math.max(5, mosaic.clientWidth * 0.015));
        const minimumSize = window.innerWidth <= 600 ? 3.2 : 5;
        let low = minimumSize;
        let high = baseSize;

        for (let attempt = 0; attempt < 14; attempt += 1) {
            const size = (low + high) / 2;
            mosaic.style.fontSize = `${size}px`;
            if (mosaic.scrollHeight <= availableHeight) low = size;
            else high = size;
        }

        mosaic.style.fontSize = `${low}px`;
    }

    fitMosaicToViewport();

    function updateMosaicTransition() {
        wallFrame = 0;
        if (!mosaicSection || !mosaicStage) return;
        const travel = mosaicSection.offsetHeight - window.innerHeight;
        const progress = travel > 0
            ? Math.max(0, Math.min(1, -mosaicSection.getBoundingClientRect().top / travel))
            : 1;
        const reveal = Math.max(0, Math.min(1, progress / 0.7));

        if (progress > 0.02) mosaicStage.classList.add('has-streamed');

        mosaicStage.style.setProperty('--wall-opacity', reveal.toFixed(3));
        mosaicStage.style.setProperty('--wall-scale', (0.9 + reveal * 0.1).toFixed(3));
        mosaicStage.style.setProperty('--wall-shift', `${(1 - reveal) * 48}px`);
        mosaicStage.style.setProperty('--wall-blur', `${(1 - reveal) * 7}px`);
        const isInteractive = reveal > 0.92;
        mosaicStage.classList.toggle('is-interactive', isInteractive);
        mosaic?.setAttribute('aria-hidden', isInteractive ? 'false' : 'true');
        if (!isInteractive) {
            mosaicStage.classList.remove('has-selection');
            mosaicStage.classList.remove('wall-detail-pinned');
            wallDetailPinned = false;
            wallDetail?.setAttribute('aria-hidden', 'true');
        }
    }

    function scheduleMosaicTransition() {
        if (!wallFrame) wallFrame = requestAnimationFrame(updateMosaicTransition);
    }

    window.addEventListener('scroll', scheduleMosaicTransition, { passive: true });
    window.addEventListener('resize', () => {
        fitMosaicToViewport();
        scheduleMosaicTransition();
    }, { passive: true });
    scheduleMosaicTransition();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const readingSection = document.getElementById('archive-reading');
    const resumeAfter = 5000;
    const nameStepDelay = 6000;
    const nameScrollDuration = 950;
    let activeIndex = -1;
    let pausedUntil = reducedMotion.matches ? Infinity : performance.now() + 1800;
    let autoTimer = 0;
    let navigationLocked = false;
    let programmaticScroll = false;
    let finishTimer = 0;

    function moveToName(index, userInitiated = false) {
        activeIndex = Math.max(0, Math.min(ARCHIVE_RECORDS.length - 1, index));
        showRecord(activeIndex, readingDetail);
        programmaticScroll = true;
        navigationLocked = true;
        list.children[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(() => {
            programmaticScroll = false;
            navigationLocked = false;
        }, nameScrollDuration);
        if (userInitiated) {
            pausedUntil = performance.now() + resumeAfter;
            scheduleAuto(resumeAfter);
        }
    }

    function inReadingSection() {
        const bounds = readingSection.getBoundingClientRect();
        return bounds.top < window.innerHeight / 2 && bounds.bottom > window.innerHeight / 2;
    }

    function stepName(direction, userInitiated = true) {
        const next = activeIndex + direction;
        if (next < 0 || next >= ARCHIVE_RECORDS.length) return false;
        moveToName(next, userInitiated);
        return true;
    }

    readingSection?.addEventListener('wheel', (event) => {
        if (!inReadingSection() || event.target.closest('a')) return;
        const direction = Math.sign(event.deltaY);
        if (!direction || (direction < 0 && activeIndex === 0)
            || (direction > 0 && activeIndex === ARCHIVE_RECORDS.length - 1)) return;
        event.preventDefault();
        if (navigationLocked) return;
        stepName(direction);
    }, { passive: false });

    let touchStartY = null;
    readingSection?.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0]?.clientY ?? null;
    }, { passive: true });
    readingSection?.addEventListener('touchend', (event) => {
        if (touchStartY === null || event.target.closest('a')) return;
        const delta = touchStartY - (event.changedTouches[0]?.clientY ?? touchStartY);
        touchStartY = null;
        if (Math.abs(delta) < 28) return;
        if (navigationLocked) {
            event.preventDefault();
            return;
        }
        const direction = Math.sign(delta);
        if (stepName(direction)) {
            event.preventDefault();
        } else {
            window.scrollBy({ top: direction * window.innerHeight, behavior: 'smooth' });
        }
    }, { passive: false });

    readingSection?.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(event.key)) return;
        const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? 1 : -1;
        if (navigationLocked) {
            event.preventDefault();
            return;
        }
        if (stepName(direction)) event.preventDefault();
    });

    window.addEventListener('scroll', () => {
        if (programmaticScroll || !inReadingSection()) return;
        // Keep the focused name in sync when visitors drag the browser scrollbar.
        const listTop = list.getBoundingClientRect().top + window.scrollY;
        const viewportCenter = window.scrollY + window.innerHeight / 2;
        if (viewportCenter < listTop) {
            activeIndex = -1;
            readingSection.classList.remove('has-selection');
            readingDetail?.setAttribute('aria-hidden', 'true');
            return;
        }
        const nearest = Math.max(0, Math.min(ARCHIVE_RECORDS.length - 1,
            Math.round((viewportCenter - listTop) / window.innerHeight)));
        if (nearest !== activeIndex) {
            activeIndex = nearest;
            showRecord(activeIndex, readingDetail);
        }
    }, { passive: true });

    function scheduleAuto(delay) {
        window.clearTimeout(autoTimer);
        if (reducedMotion.matches) return;
        autoTimer = window.setTimeout(() => {
            if (performance.now() < pausedUntil) return scheduleAuto(pausedUntil - performance.now());
            if (activeIndex < ARCHIVE_RECORDS.length - 1) {
                moveToName(activeIndex + 1);
                scheduleAuto(nameStepDelay);
            } else {
                archiveEnd?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                finishTimer = window.setTimeout(() => {
                    const endPosition = document.documentElement.scrollHeight - window.innerHeight;
                    window.scrollTo({ top: endPosition, behavior: 'smooth' });
                }, 1800);
            }
        }, delay);
    }

    readingSection?.setAttribute('tabindex', '0');
    if (!reducedMotion.matches) scheduleAuto(1800);
    reducedMotion.addEventListener('change', (event) => {
        if (event.matches) {
            window.clearTimeout(autoTimer);
            window.clearTimeout(finishTimer);
            pausedUntil = Infinity;
        } else {
            pausedUntil = performance.now() + 1800;
            scheduleAuto(1800);
        }
    });
})();
