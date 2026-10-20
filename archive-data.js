/**
 * ARCHIVE DATA — INTERNAL MONOLOGUE & EVERYDAY QUESTIONS
 * 
 * Arranged chronologically (newest to oldest), with project questions
 * aligned to their respective project realization years (2024 – 2026).
 * 
 * Fields:
 * - id: unique identifier string (e.g. "q-2026-01")
 * - date: display date or year string (e.g. "2026" or "19 October 2026")
 * - time: 24h time string if known, otherwise empty string ""
 * - question: the main question or thought (required)
 * - reflection: optional observation (kept clean/empty per design preference)
 * - tags: array of tag strings (max 3 tags per question from general taxonomy)
 * - relatedProject: null or { id: string, title: string, url: string }
 */

window.ARCHIVE_QUESTIONS = [
    // --- 2026: CONTEMPORARY PRACTICE & EVERYDAY INQUIRIES ---
    {
        id: "q-2026-10-19-02",
        date: "19 October 2026",
        time: "23:38",
        question: "Is voice the only difference between a female and male AI chatbot, or does it also shape the conversational flow?",
        reflection: "",
        tags: ["ai", "daily-life"],
        relatedProject: null
    },
    {
        id: "q-2026-10-19-03",
        date: "19 October 2026",
        time: "23:33",
        question: "Why are robot bodies so often designed as female, while the default voices of AI tools are male?",
        reflection: "",
        tags: ["ai", "body"],
        relatedProject: null
    },
    {
        id: "q-2026-emek-factory",
        date: "2026",
        time: "",
        question: "When we preserve the structure of a factory, do we also preserve the memory of the people who worked there?",
        reflection: "",
        tags: ["memory", "space", "body"],
        relatedProject: {
            id: "emek-museum",
            title: "EMEK MUSEUM",
            url: "./projects/emek-museum/"
        }
    },
    {
        id: "q-2026-emek",
        date: "2026",
        time: "",
        question: "How can we make this labour visible again?",
        reflection: "",
        tags: ["memory", "space", "body"],
        relatedProject: {
            id: "emek-museum",
            title: "EMEK MUSEUM",
            url: "./projects/emek-museum/"
        }
    },
    {
        id: "q-2026-fire-politic",
        date: "2026",
        time: "",
        question: "Is being affected by fire political?",
        reflection: "",
        tags: ["simulation", "space", "body"],
        relatedProject: {
            id: "fire-escape-simulation",
            title: "FIRE ESCAPE SIMULATION",
            url: "./projects/fire-escape-simulation/"
        }
    },
    {
        id: "q-2026-fire",
        date: "2026",
        time: "",
        question: "Can you escape the fire?",
        reflection: "",
        tags: ["simulation", "space", "traces"],
        relatedProject: {
            id: "fire-escape-simulation",
            title: "FIRE ESCAPE SIMULATION",
            url: "./projects/fire-escape-simulation/"
        }
    },
    {
        id: "q-2026-01",
        date: "2026",
        time: "",
        question: "When does something become a memory?",
        reflection: "",
        tags: ["memory", "time"],
        relatedProject: null
    },
    {
        id: "q-2026-02",
        date: "2026",
        time: "",
        question: "What do we leave behind when we navigate a digital space?",
        reflection: "",
        tags: ["ai", "space", "traces"],
        relatedProject: null
    },
    {
        id: "q-2026-03",
        date: "2026",
        time: "",
        question: "How do you highlight beauty without stealing its spotlight?",
        reflection: "",
        tags: ["space", "ecology"],
        relatedProject: {
            id: "bajo-la-fresca",
            title: "BAJO LA FRESCA",
            url: "./projects/bajo-la-fresca/"
        }
    },
    {
        id: "q-2026-04",
        date: "2026",
        time: "",
        question: "How does a culinary ritual shape a social atmosphere?",
        reflection: "",
        tags: ["ritual", "space", "daily-life"],
        relatedProject: {
            id: "millieu",
            title: "MILLIEU",
            url: "./projects/millieu/"
        }
    },
    {
        id: "q-2026-05",
        date: "2026",
        time: "",
        question: "Is there life because there is death?",
        reflection: "",
        tags: ["materials", "decay", "ecology"],
        relatedProject: {
            id: "the-earthen",
            title: "THE EARTHEN",
            url: "./projects/the-earthen/"
        }
    },
    {
        id: "q-2026-06",
        date: "2026",
        time: "",
        question: "Why do we always look at a window from the inside?",
        reflection: "",
        tags: ["threshold", "space", "daily-life"],
        relatedProject: null
    },

    // --- 2025: MATERIAL TRANSFORMATION & CITIZEN PRESENCE ---
    {
        id: "q-2025-01",
        date: "2025",
        time: "",
        question: "How many microplastics can we eat in a day?",
        reflection: "",
        tags: ["materials", "decay", "body"],
        relatedProject: {
            id: "bio-decay",
            title: "BIO-DECAY",
            url: "./projects/bio-decay/"
        }
    },
    {
        id: "q-2025-02",
        date: "2025",
        time: "",
        question: "Can a city exhibit itself?",
        reflection: "",
        tags: ["traces", "memory", "space"],
        relatedProject: {
            id: "chronoclines",
            title: "CHRONOCLINES",
            url: "./projects/chronoclines/"
        }
    },
    {
        id: "q-2025-03",
        date: "2025",
        time: "",
        question: "Is doing nothing doing something?",
        reflection: "",
        tags: ["traces", "daily-life", "time"],
        relatedProject: {
            id: "stray",
            title: "STRAY",
            url: "./projects/stray/"
        }
    },

    // --- 2024: 1ST YEAR DESIGN-BUILD & BIOMATERIAL ROOTS ---
    {
        id: "q-2024-01",
        date: "2024",
        time: "",
        question: "Can one space hold both play and quiet?",
        reflection: "",
        tags: ["threshold", "space"],
        relatedProject: {
            id: "ara-sira",
            title: "ARA-SIRA",
            url: "./projects/ara-sira/"
        }
    },
    {
        id: "q-2024-02",
        date: "2024",
        time: "",
        question: "When does waste become a place?",
        reflection: "",
        tags: ["materials", "space", "decay"],
        relatedProject: {
            id: "wood-weave",
            title: "WOOD WEAVE",
            url: "./projects/wood-weave/"
        }
    },
    {
        id: "q-2024-03",
        date: "2024",
        time: "",
        question: "Can we build without displacing life?",
        reflection: "",
        tags: ["space", "materials", "ecology"],
        relatedProject: {
            id: "sprouting-garden",
            title: "SPROUTING GARDEN",
            url: "./projects/sprouting-garden/"
        }
    }
];
