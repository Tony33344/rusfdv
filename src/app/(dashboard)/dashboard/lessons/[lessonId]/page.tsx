import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";
import { ArrowLeft, Volume2, BookOpen, MessageCircle, PenTool } from "lucide-react";
import { CompleteLessonButton } from "@/components/lessons/CompleteLessonButton";
import { TtsButton } from "@/components/tts/TtsButton";
import { ExercisesPanel } from "@/components/lessons/ExercisesPanel";
import { QuizPanel } from "@/components/lessons/QuizPanel";

interface LessonData {
  id: number;
  title: { ru: string; sl: string; en: string };
  textbookTheme: number;
  objectives?: { ru: string[]; sl: string[]; en: string[] };
  phonetics: {
    focus: string[];
    exercises: Array<{ type: string; items: string[] }>;
  };
  grammar: {
    topic: string;
    explanation: { ru: string; sl: string; en?: string };
    examples: Array<{ word: string; gender?: string; rule?: string }>;
    exercises: Array<{ type: string; instruction: string; items: string[]; categories?: string[] }>;
  };
  conversation: {
    topic: string;
    phrases: Array<{ ru: string; sl: string; en?: string; audio: string | null }>;
    dialogues?: Array<{
      title?: { ru: string; sl: string; en: string };
      context?: { ru: string; sl: string; en: string };
      lines: Array<{
        speaker: string;
        ru: string;
        sl: string;
        en: string;
      }>;
    }>;
  };
  vocabulary: Array<{ ru: string; sl: string; en?: string }>;
  drills?: {
    patterns: Array<{
      title: { ru: string; sl: string; en: string };
      model: { ru: string; sl: string; en: string };
      prompts: Array<{ ru: string; sl: string; en: string }>;
    }>;
  };
  quiz?: {
    questions: Array<{
      type: "multiple_choice" | "fill_blank";
      prompt: { ru: string; sl: string; en: string };
      options?: Array<{ ru: string; sl: string; en: string }>;
      answerIndex?: number;
      answerText?: { ru: string; sl: string; en: string };
      explanation?: { ru: string; sl: string; en: string };
    }>;
  };
  writing?: {
    prompt: { ru: string; sl: string; en: string };
    checklist?: { ru: string[]; sl: string[]; en: string[] };
  };
  homework?: {
    tasks: Array<{ ru: string; sl: string; en: string }>;
  };
  culture?: {
    note: { ru: string; sl: string; en: string };
  };
}

async function getLesson(id: string): Promise<LessonData | null> {
  const lessonPath = path.join(process.cwd(), "content", "lessons", `lesson-${id.padStart(2, "0")}.json`);
  
  try {
    const content = await fs.readFile(lessonPath, "utf8");
    return JSON.parse(content) as LessonData;
  } catch {
    return null;
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = await getLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/lessons"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Урок {lesson.id}: {lesson.title.ru}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {lesson.title.sl} • {lesson.title.en}
          </p>
        </div>
      </div>

      {lesson.objectives?.ru?.length ? (
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Цели урока / Lesson objectives
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">RU</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {lesson.objectives.ru.map((o, i) => (
                  <li key={`ru-${i}`}>{o}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">SL</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {lesson.objectives.sl.map((o, i) => (
                  <li key={`sl-${i}`}>{o}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">EN</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                {lesson.objectives.en.map((o, i) => (
                  <li key={`en-${i}`}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <TabButton icon={<Volume2 size={18} />} label="Фонетика" active />
        <TabButton icon={<BookOpen size={18} />} label="Грамматика" />
        <TabButton icon={<MessageCircle size={18} />} label="Разговор" />
        <TabButton icon={<PenTool size={18} />} label="Упражнения" />
      </div>

      {/* Phonetics Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Volume2 className="text-blue-600" size={24} />
          Фонетика
        </h2>
        
        {lesson.phonetics.focus.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Изучаемые звуки:
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson.phonetics.focus.map((sound, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-lg font-medium"
                >
                  {sound}
                </span>
              ))}
            </div>
          </div>
        )}

        {lesson.phonetics.exercises.map((exercise, i) => (
          <div key={i} className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {exercise.type === "listen-repeat" ? "Слушайте и повторяйте:" : exercise.type}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {exercise.items.map((item, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {item}
                  </span>
                  <TtsButton text={item} size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {lesson.drills?.patterns?.length ? (
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PenTool className="text-indigo-600" size={24} />
            Дриллы / Pattern drills
          </h2>

          <div className="space-y-4">
            {lesson.drills.patterns.map((p, i) => (
              <div key={i} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                  {p.title.ru} • {p.title.sl} • {p.title.en}
                </p>
                <div className="mt-2 p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-gray-900 dark:text-white">{p.model.ru}</p>
                    <TtsButton text={p.model.ru} size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{p.model.sl}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{p.model.en}</p>
                </div>

                <div className="mt-3 grid md:grid-cols-2 gap-2">
                  {p.prompts.map((pr, j) => (
                    <div key={j} className="p-3 bg-white/70 dark:bg-gray-800/60 rounded-lg">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-gray-900 dark:text-white">{pr.ru}</p>
                        <TtsButton text={pr.ru} size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{pr.sl}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{pr.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.quiz?.questions?.length ? (
        <QuizPanel lessonId={lesson.id} questions={lesson.quiz.questions} />
      ) : null}

      {lesson.writing?.prompt ? (
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Письмо / Writing
          </h2>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <p className="text-gray-900 dark:text-white">{lesson.writing.prompt.ru}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.writing.prompt.sl}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.writing.prompt.en}</p>
          </div>

          {lesson.writing.checklist?.ru?.length ? (
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">RU</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {lesson.writing.checklist.ru.map((c, i) => (
                    <li key={`w-ru-${i}`}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">SL</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {lesson.writing.checklist.sl.map((c, i) => (
                    <li key={`w-sl-${i}`}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">EN</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {lesson.writing.checklist.en.map((c, i) => (
                    <li key={`w-en-${i}`}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {lesson.homework?.tasks?.length ? (
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Домашнее задание / Homework
          </h2>
          <div className="space-y-2">
            {lesson.homework.tasks.map((t, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-gray-900 dark:text-white">{t.ru}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.sl}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.en}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.culture?.note ? (
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Культура / Culture note
          </h2>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="text-gray-900 dark:text-white">{lesson.culture.note.ru}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.culture.note.sl}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.culture.note.en}</p>
          </div>
        </section>
      ) : null}

      {/* Grammar Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="text-green-600" size={24} />
          Грамматика: {lesson.grammar.topic}
        </h2>

        {lesson.grammar.explanation.ru && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {lesson.grammar.explanation.ru}
            </p>
            {lesson.grammar.explanation.sl && (
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm italic">
                {lesson.grammar.explanation.sl}
              </p>
            )}
          </div>
        )}

        {lesson.grammar.examples.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Примеры:
            </h3>
            <div className="grid gap-2">
              {lesson.grammar.examples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {ex.word}
                    </span>
                    <TtsButton text={ex.word} size={18} className="text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {ex.gender && `(${ex.gender})`} {ex.rule}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      <ExercisesPanel lessonId={lesson.id} exercises={lesson.grammar.exercises} />

      {/* Conversation Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageCircle className="text-purple-600" size={24} />
          Разговорная тема: {lesson.conversation.topic}
        </h2>

        {lesson.conversation.dialogues && lesson.conversation.dialogues.length > 0 && (
          <div className="space-y-4 mb-6">
            {lesson.conversation.dialogues.map((d, i) => (
              <div key={i} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                {d.title ? (
                  <p className="font-semibold text-purple-900 dark:text-purple-100">
                    {d.title.ru} • {d.title.sl} • {d.title.en}
                  </p>
                ) : null}
                {d.context ? (
                  <p className="text-sm text-purple-800/80 dark:text-purple-200/80 mt-1">
                    {d.context.ru} • {d.context.sl} • {d.context.en}
                  </p>
                ) : null}

                <div className="mt-3 space-y-2">
                  {d.lines.map((line, j) => (
                    <div key={j} className="bg-white/70 dark:bg-gray-800/60 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {line.speaker}
                          </p>
                          <p className="text-gray-900 dark:text-white">{line.ru}</p>
                        </div>
                        <TtsButton text={line.ru} size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{line.sl}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{line.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {lesson.conversation.phrases.length > 0 && (
          <div className="space-y-3">
            {lesson.conversation.phrases.map((phrase, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TtsButton
                    text={phrase.ru}
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {phrase.ru}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {phrase.sl} {phrase.en && `• ${phrase.en}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vocabulary Section */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="text-orange-600" size={24} />
            Словарь / Vocabulary
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {lesson.vocabulary.map((word, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{word.ru}</span>
                  <TtsButton text={word.ru} size={18} className="text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {word.sl} {word.en && `• ${word.en}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Next Lesson Button */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/dashboard/lessons"
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          ← Все уроки
        </Link>
        <CompleteLessonButton lessonId={lesson.id} />
      </div>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition
        ${active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
