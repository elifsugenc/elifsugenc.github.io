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
    const ARCHIVE_RECORDS = ARCHIVE_GROUPS.flatMap((group) => group.names.map((name) => ({
        name,
        eventName: group.eventName,
        eventDate: group.date,
        deathDate: group.deathDates?.[name] || group.date,
        incidentTime: group.incidentTime,
        age: group.ages?.[name] ?? null,
        ageSource: group.ageSources?.[name] || group.personSources?.[name] || null,
        namesSource: group.personSources?.[name] || group.namesSource,
        timeSource: group.timeSource,
    })));
    const ARCHIVE_NAMES = ARCHIVE_RECORDS.map((record) => record.name);

    const list = document.getElementById('name-list');
    if (!list) return;

    function displayName(name) {
        return name.toLocaleLowerCase('tr-TR').replace(/(^|[\s.-])(\p{L})/gu, (_, separator, letter) => (
            separator + letter.toLocaleUpperCase('tr-TR')
        ));
    }

    list.innerHTML = ARCHIVE_NAMES.map((name, index) => `<li data-list-index="${index}">${displayName(name)}</li>`).join('');
    const mosaic = document.getElementById('name-mosaic');
    if (mosaic) {
        mosaic.innerHTML = ARCHIVE_RECORDS.map((record, index) => {
            const name = displayName(record.name);
            return `<li tabindex="${index === 0 ? '0' : '-1'}" data-record-index="${index}" aria-label="${name}; memorial record">${name}</li>`;
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
        panel.querySelector('[data-detail-field="event"]').textContent = record.eventName;
        panel.querySelector('[data-detail-field="date"]').textContent = new Intl.DateTimeFormat('en', {
            day: 'numeric', month: 'long', year: 'numeric',
        }).format(deathDate);
        panel.querySelector('[data-detail-field="age"]').textContent = record.age ? `${record.age} years` : 'Not verified in this archive';
        panel.querySelector('[data-detail-field="time"]').textContent = `Individual time not recorded · incident approx. ${record.incidentTime}`;
        panel.querySelector('[data-detail-source="names"]').href = record.namesSource;
        const ageSource = panel.querySelector('[data-detail-source="age"]');
        ageSource.hidden = !record.ageSource;
        if (record.ageSource) ageSource.href = record.ageSource;
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
    let activeIndex = 0;
    let pausedUntil = reducedMotion.matches ? Infinity : performance.now() + 1800;
    let autoTimer = 0;
    let wheelLocked = false;
    let programmaticScroll = false;
    let finishTimer = 0;

    function moveToName(index, userInitiated = false) {
        activeIndex = Math.max(0, Math.min(ARCHIVE_RECORDS.length - 1, index));
        showRecord(activeIndex, readingDetail);
        programmaticScroll = true;
        list.children[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(() => { programmaticScroll = false; }, 900);
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
        if (wheelLocked) return;
        wheelLocked = true;
        stepName(direction);
        window.setTimeout(() => { wheelLocked = false; }, 520);
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
        if (stepName(direction)) event.preventDefault();
    });

    window.addEventListener('scroll', () => {
        if (programmaticScroll || !inReadingSection()) return;
        // Keep the focused name in sync when visitors drag the browser scrollbar.
        const listTop = list.getBoundingClientRect().top + window.scrollY;
        const nearest = Math.max(0, Math.min(ARCHIVE_RECORDS.length - 1,
            Math.round((window.scrollY + window.innerHeight / 2 - listTop) / window.innerHeight)));
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
