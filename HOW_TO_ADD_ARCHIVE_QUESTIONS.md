# Soru Arşivine (Internal Monologue Archive) Yeni Soru Ekleme Rehberi

Bu rehber, sitedeki **04 ARCHIVE** sayfasına günlük hayatında veya araştırmalarında aklına gelen yeni soruları, düşünceleri ve notları tek bir dosyadan saniyeler içinde nasıl ekleyebileceğini anlatır.

---

## 1. Hangi Dosyayı Düzenleyeceksin?
Dosya: **`archive-data.js`**  
*(Projenin ana klasöründe yer alır).*

---

## 2. Yeni Bir Soru Nasıl Eklenir?
`archive-data.js` dosyasını açtığında `window.ARCHIVE_QUESTIONS = [ ... ]` listesini göreceksin.

En üste (veya istediğin tarihe) aşağıdaki şablonu kopyalayıp yapıştırman ve kendi sorunu yazman yeterlidir:

```javascript
    {
        id: "q-2026-10-20-01",
        date: "20 October 2026",
        time: "15:30",
        question: "Buraya aklına gelen soruyu veya düşünceyi yaz...",
        reflection: "İsteğe bağlı: Bu soruyla ilgili aklına gelen kısa bir gözlem, detay veya henüz bitmemiş bir düşünce.",
        tags: ["daily-life", "memory", "space"],
        relatedProject: null // İlgili bir proje yoksa null bırak!
    },
```

---

## 3. Alanların Anlamları

| Alan | Zorunlu mu? | Açıklama | Örnek |
| :--- | :--- | :--- | :--- |
| `id` | Evet | Her soru için benzersiz bir kod | `"q-2026-10-20-01"` |
| `date` | Evet | Sorunun sorulduğu gün | `"20 October 2026"` |
| `time` | Evet | Saat (İstanbul yerel saati, 24 saat formatında) | `"15:30"` |
| `question` | Evet | Sorun veya kısa düşüncen | `"When does something become a memory?"` |
| `reflection` | Hayır | Varsa kısa gözlem veya düşüncen (yoksa `null` yapabilirsin) | `"Maybe an action does not need to be intentional..."` |
| `tags` | Hayır | Etiketler (filtreleme butonları için) | `["daily-life", "memory", "traces"]` |
| `relatedProject` | Hayır | Bir projeyle tesadüfen bağı varsa proje bilgisi. **Genel günlük hayat soruları için `null` bırakılır!** | `{ title: "STRAY", url: "./projects/stray/" }` veya `null` |

---

## 4. Bir Projeye Bağlamak İstersem?
Soruların çoğu **günlük hayat gözlemleridir** ve projeye gitmelerine hiç gerek yoktur (`relatedProject: null`). 

Ancak bir gün, o sorunun bir projene ilham verdiğini belirtmek istersen:
```javascript
relatedProject: { title: "STRAY", url: "./projects/stray/" }
```
yazabilirsin. Kartın altında ufak, zarif bir dipnot olarak `✦ related thought: STRAY ↗` şeklinde görünür; asla rahatsız edici büyük bir buton olarak çıkmaz.

---

## 5. Değişiklikleri Yayınlama
`archive-data.js` dosyasını kaydedip terminalden:
```bash
git add archive-data.js
git commit -m "content: add new question to archive"
git push
```
dediğinde yeni sorun anında sitende canlıya alınır!
