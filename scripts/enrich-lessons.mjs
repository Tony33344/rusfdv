import fs from "node:fs/promises";
import path from "node:path";

const lessonsDir = path.join(process.cwd(), "content", "lessons");

function pad2(n) {
  return String(n).padStart(2, "0");
}

function ensureTri(obj, fallback) {
  return {
    ru: obj?.ru ?? fallback.ru,
    sl: obj?.sl ?? fallback.sl,
    en: obj?.en ?? fallback.en,
  };
}

function ensureObjectives(lesson) {
  if (lesson.objectives?.ru?.length) return;

  const titleRu = lesson.title?.ru ?? `Урок ${lesson.id}`;
  const convTopic = lesson.conversation?.topic ?? "Тема";
  const grammarTopic = lesson.grammar?.topic ?? "Грамматика";

  lesson.objectives = {
    ru: [
      `Понимать и использовать лексику по теме «${convTopic}»`,
      `Практиковать грамматику: ${grammarTopic}`,
      `Построить 6–8 простых фраз и мини-диалог по теме «${titleRu}»`,
    ],
    sl: [
      `Uporabljati besedišče na temo »${convTopic}«`,
      `Vaditi slovnico: ${grammarTopic}`,
      `Sestaviti 6–8 preprostih stavkov in mini dialog na temo »${titleRu}«`,
    ],
    en: [
      `Use key vocabulary for the topic “${convTopic}”`,
      `Practice grammar: ${grammarTopic}`,
      `Build 6–8 simple sentences and a mini-dialogue for “${titleRu}”`,
    ],
  };
}

function ensureGrammarEn(lesson) {
  if (!lesson.grammar?.explanation) return;
  if (lesson.grammar.explanation.en) return;
  // Safe baseline (not perfect translation, but ensures EN exists)
  lesson.grammar.explanation.en = `Grammar focus: ${lesson.grammar.topic}. See Russian explanation above.`;
}

function ensurePhraseEn(lesson) {
  const phrases = lesson.conversation?.phrases;
  if (!Array.isArray(phrases)) return;
  for (const p of phrases) {
    if (p.en) continue;
    // Minimal EN placeholder derived from RU (better than missing field)
    p.en = "(EN) " + (p.ru ?? "");
  }
}

function ensureVocabEn(lesson) {
  const vocab = lesson.vocabulary;
  if (!Array.isArray(vocab)) return;
  for (const w of vocab) {
    if (w.en) continue;
    w.en = "(EN) " + (w.ru ?? "");
  }
}

function ensureDialogues(lesson) {
  lesson.conversation = lesson.conversation ?? { topic: "", phrases: [] };
  if (Array.isArray(lesson.conversation.dialogues) && lesson.conversation.dialogues.length) return;

  const phrases = Array.isArray(lesson.conversation.phrases) ? lesson.conversation.phrases : [];
  const lines = phrases.slice(0, 6).map((p, idx) => ({
    speaker: idx % 2 === 0 ? "A" : "B",
    ru: p.ru ?? "",
    sl: p.sl ?? "",
    en: p.en ?? "",
  }));

  if (!lines.length) {
    lines.push(
      { speaker: "A", ru: `Здравствуйте!`, sl: `Pozdravljeni!`, en: `Hello!` },
      { speaker: "B", ru: `Здравствуйте!`, sl: `Pozdravljeni!`, en: `Hello!` },
    );
  }

  lesson.conversation.dialogues = [
    {
      title: ensureTri(null, {
        ru: `Диалог: ${lesson.conversation.topic || lesson.title?.ru || "Тема"}`,
        sl: `Dialog: ${lesson.conversation.topic || lesson.title?.sl || "Tema"}`,
        en: `Dialogue: ${lesson.conversation.topic || lesson.title?.en || "Topic"}`,
      }),
      context: ensureTri(null, {
        ru: "Мини-диалог для тренировки речи.",
        sl: "Mini dialog za govor.",
        en: "A mini-dialogue for speaking practice.",
      }),
      lines,
    },
  ];
}

function ensureDrills(lesson) {
  if (lesson.drills?.patterns?.length) return;
  const vocab = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [];
  const sample = vocab.slice(0, 4);

  lesson.drills = {
    patterns: [
      {
        title: {
          ru: "Шаблон: Я люблю ...",
          sl: "Vzorec: Rad/a imam ...",
          en: "Pattern: I like ...",
        },
        model: {
          ru: "Я люблю ...",
          sl: "Rad/a imam ...",
          en: "I like ...",
        },
        prompts: sample.length
          ? sample.map((w) => ({ ru: w.ru, sl: w.sl, en: w.en }))
          : [
              { ru: "кофе", sl: "kava", en: "coffee" },
              { ru: "чай", sl: "čaj", en: "tea" },
            ],
      },
      {
        title: {
          ru: "Шаблон: Я хочу ...",
          sl: "Vzorec: Hočem ...",
          en: "Pattern: I want ...",
        },
        model: {
          ru: "Я хочу ...",
          sl: "Hočem ...",
          en: "I want ...",
        },
        prompts: sample.length
          ? sample.map((w) => ({ ru: w.ru, sl: w.sl, en: w.en }))
          : [
              { ru: "отдохнуть", sl: "počivati", en: "to rest" },
              { ru: "поехать", sl: "iti", en: "to go" },
            ],
      },
    ],
  };
}

function ensureQuiz(lesson) {
  if (lesson.quiz?.questions?.length) return;

  lesson.quiz = {
    questions: [
      {
        type: "fill_blank",
        prompt: {
          ru: "Заполните: Я ___ русский язык.",
          sl: "Dopolni: Jaz ___ ruski jezik.",
          en: "Fill in: Я ___ Russian.",
        },
        answerText: { ru: "учу", sl: "se učim", en: "study/learn" },
        explanation: {
          ru: "Базовая фраза: «Я учу русский язык».",
          sl: "Osnovna fraza: «Я учу русский язык».",
          en: "Basic phrase: «Я учу русский язык».",
        },
      },
    ],
  };
}

function ensureWritingHomeworkCulture(lesson) {
  if (!lesson.writing) {
    lesson.writing = {
      prompt: {
        ru: `Напишите 6–8 предложений по теме «${lesson.title?.ru ?? "Урок"}».`,
        sl: `Napišite 6–8 stavkov na temo »${lesson.title?.sl ?? "Lekcija"}«.`,
        en: `Write 6–8 sentences about “${lesson.title?.en ?? "Lesson"}”.`,
      },
      checklist: {
        ru: ["Используйте 8 слов из словаря", "Добавьте 2 вопроса"],
        sl: ["Uporabite 8 besed iz slovarja", "Dodajte 2 vprašanji"],
        en: ["Use 8 vocabulary words", "Include 2 questions"],
      },
    };
  }

  if (!lesson.homework?.tasks?.length) {
    lesson.homework = {
      tasks: [
        {
          ru: "Сделайте 10 предложений с лексикой урока.",
          sl: "Naredite 10 stavkov z besediščem lekcije.",
          en: "Make 10 sentences using the lesson vocabulary.",
        },
        {
          ru: "Запишите голосом 5 предложений (Voice Teacher) и повторите за TTS.",
          sl: "Posnemite 5 stavkov (Voice Teacher) in ponovite za TTS.",
          en: "Record 5 sentences (Voice Teacher) and repeat after TTS.",
        },
      ],
    };
  }

  if (!lesson.culture?.note) {
    lesson.culture = {
      note: {
        ru: "Культурная заметка: обращайте внимание на форму «вы» в вежливой речи.",
        sl: "Kulturna opomba: bodite pozorni na vljudno obliko «вы».",
        en: "Culture note: pay attention to polite «вы» forms in public situations.",
      },
    };
  }
}

function normalizeConversation(lesson) {
  lesson.conversation = lesson.conversation ?? { topic: "", phrases: [] };
  if (!Array.isArray(lesson.conversation.phrases)) lesson.conversation.phrases = [];
}

async function main() {
  const updated = [];

  for (let id = 7; id <= 30; id++) {
    const fp = path.join(lessonsDir, `lesson-${pad2(id)}.json`);
    const raw = await fs.readFile(fp, "utf8");
    const lesson = JSON.parse(raw);

    // Do not overwrite already-rich lessons
    ensureObjectives(lesson);
    ensureGrammarEn(lesson);
    normalizeConversation(lesson);
    ensurePhraseEn(lesson);
    ensureVocabEn(lesson);
    ensureDialogues(lesson);
    ensureDrills(lesson);
    ensureQuiz(lesson);
    ensureWritingHomeworkCulture(lesson);

    await fs.writeFile(fp, JSON.stringify(lesson, null, 2) + "\n", "utf8");
    updated.push(fp);
  }

  console.log(`Updated ${updated.length} lessons (7–30).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
