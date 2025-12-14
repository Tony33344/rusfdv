export type Locale = "ru" | "en" | "sl";

export const translations = {
  // Navigation
  nav: {
    home: { ru: "Главная", en: "Home", sl: "Domov" },
    lessons: { ru: "Уроки", en: "Lessons", sl: "Lekcije" },
    practice: { ru: "Практика", en: "Practice", sl: "Vaja" },
    progress: { ru: "Прогресс", en: "Progress", sl: "Napredek" },
    grades: { ru: "Оценки", en: "Grades", sl: "Ocene" },
    logout: { ru: "Выйти", en: "Logout", sl: "Odjava" },
  },

  // Auth
  auth: {
    login: { ru: "Войти", en: "Login", sl: "Prijava" },
    register: { ru: "Регистрация", en: "Register", sl: "Registracija" },
    email: { ru: "Email", en: "Email", sl: "E-pošta" },
    password: { ru: "Пароль", en: "Password", sl: "Geslo" },
    name: { ru: "Имя", en: "Name", sl: "Ime" },
    loginTitle: { ru: "Войдите в свой аккаунт", en: "Sign in to your account", sl: "Prijavite se v svoj račun" },
    registerTitle: { ru: "Создайте аккаунт", en: "Create an account", sl: "Ustvarite račun" },
    noAccount: { ru: "Нет аккаунта?", en: "Don't have an account?", sl: "Nimate računa?" },
    hasAccount: { ru: "Уже есть аккаунт?", en: "Already have an account?", sl: "Že imate račun?" },
    loggingIn: { ru: "Вход...", en: "Signing in...", sl: "Prijavljanje..." },
    registering: { ru: "Регистрация...", en: "Registering...", sl: "Registracija..." },
  },

  // Dashboard
  dashboard: {
    welcome: { ru: "Привет", en: "Hello", sl: "Živjo" },
    welcomeMessage: { ru: "Добро пожаловать в курс русского языка. Продолжайте учиться!", en: "Welcome to the Russian language course. Keep learning!", sl: "Dobrodošli na tečaju ruščine. Nadaljujte z učenjem!" },
    lessonsCompleted: { ru: "Уроков пройдено", en: "Lessons completed", sl: "Opravljene lekcije" },
    attendance: { ru: "Посещаемость", en: "Attendance", sl: "Prisotnost" },
    points: { ru: "Баллов", en: "Points", sl: "Točke" },
    studyTime: { ru: "Время обучения", en: "Study time", sl: "Čas učenja" },
    nextLesson: { ru: "Следующий урок", en: "Next lesson", sl: "Naslednja lekcija" },
    start: { ru: "Начать", en: "Start", sl: "Začni" },
  },

  // Lessons
  lessons: {
    title: { ru: "Уроки", en: "Lessons", sl: "Lekcije" },
    subtitle: { ru: "30 уроков — от алфавита до свободного общения", en: "30 lessons — from alphabet to fluent conversation", sl: "30 lekcij — od abecede do tekočega pogovora" },
    description: { ru: "30 уроков с фонетикой, грамматикой и разговорными темами.", en: "30 lessons with phonetics, grammar, and conversation topics.", sl: "30 lekcij s fonetiko, slovnico in pogovornimi temami." },
    phonetics: { ru: "Фонетика", en: "Phonetics", sl: "Fonetika" },
    grammar: { ru: "Грамматика", en: "Grammar", sl: "Slovnica" },
    vocabulary: { ru: "Словарь", en: "Vocabulary", sl: "Besedišče" },
    exercises: { ru: "Упражнения", en: "Exercises", sl: "Vaje" },
    dialogue: { ru: "Диалог", en: "Dialogue", sl: "Dialog" },
    completed: { ru: "Пройден", en: "Completed", sl: "Opravljeno" },
    locked: { ru: "Заблокирован", en: "Locked", sl: "Zaklenjeno" },
  },

  // Practice
  practice: {
    title: { ru: "Практика", en: "Practice", sl: "Vaja" },
    voiceTeacher: { ru: "AI Голосовой учитель", en: "AI Voice Teacher", sl: "AI Glasovni učitelj" },
    voiceTeacherDesc: { ru: "Тренируйте произношение с AI-репетитором и практикуйте разговорную речь.", en: "Practice pronunciation with AI tutor and improve your speaking skills.", sl: "Vadite izgovorjavo z AI tutorjem in izboljšajte svoje govorne sposobnosti." },
    speakNow: { ru: "Говорите", en: "Speak now", sl: "Govorite zdaj" },
    listening: { ru: "Слушаю...", en: "Listening...", sl: "Poslušam..." },
    playAudio: { ru: "Воспроизвести", en: "Play audio", sl: "Predvajaj zvok" },
    yourPronunciation: { ru: "Ваше произношение", en: "Your pronunciation", sl: "Vaša izgovorjava" },
    feedback: { ru: "Обратная связь", en: "Feedback", sl: "Povratne informacije" },
    tryAgain: { ru: "Попробовать снова", en: "Try again", sl: "Poskusite znova" },
    excellent: { ru: "Отлично!", en: "Excellent!", sl: "Odlično!" },
    good: { ru: "Хорошо!", en: "Good!", sl: "Dobro!" },
    needsWork: { ru: "Нужно поработать", en: "Needs work", sl: "Potrebuje delo" },
  },

  // Grades
  grades: {
    title: { ru: "Оценки и прогресс", en: "Grades and Progress", sl: "Ocene in napredek" },
    finalGrade: { ru: "Итоговая оценка", en: "Final Grade", sl: "Končna ocena" },
    gradeBreakdown: { ru: "Разбивка оценки", en: "Grade Breakdown", sl: "Razčlenitev ocene" },
    writtenExams: { ru: "Письменные экзамены", en: "Written Exams", sl: "Pisni izpiti" },
    oralExams: { ru: "Устные экзамены", en: "Oral Exams", sl: "Ustni izpiti" },
    homework: { ru: "Домашние задания", en: "Homework", sl: "Domače naloge" },
    presentations: { ru: "Презентации", en: "Presentations", sl: "Predstavitve" },
    attendanceReq: { ru: "Требование посещаемости: 75%", en: "Attendance requirement: 75%", sl: "Zahteva prisotnosti: 75%" },
  },

  // Common
  common: {
    loading: { ru: "Загрузка...", en: "Loading...", sl: "Nalaganje..." },
    error: { ru: "Ошибка", en: "Error", sl: "Napaka" },
    save: { ru: "Сохранить", en: "Save", sl: "Shrani" },
    cancel: { ru: "Отмена", en: "Cancel", sl: "Prekliči" },
    next: { ru: "Далее", en: "Next", sl: "Naprej" },
    previous: { ru: "Назад", en: "Previous", sl: "Nazaj" },
    submit: { ru: "Отправить", en: "Submit", sl: "Pošlji" },
    correct: { ru: "Правильно!", en: "Correct!", sl: "Pravilno!" },
    incorrect: { ru: "Неправильно", en: "Incorrect", sl: "Nepravilno" },
  },

  // Landing page
  landing: {
    heroTitle: { ru: "Изучайте русский язык", en: "Learn Russian", sl: "Učite se ruščine" },
    heroSubtitle: { ru: "с AI-репетитором", en: "with AI tutor", sl: "z AI tutorjem" },
    heroDescription: { ru: "30 интерактивных уроков с голосовым AI-репетитором, упражнениями и отслеживанием прогресса.", en: "30 interactive lessons with voice AI tutor, exercises, and progress tracking.", sl: "30 interaktivnih lekcij z glasovnim AI tutorjem, vajami in sledenjem napredka." },
    startLearning: { ru: "Начать обучение", en: "Start learning", sl: "Začnite z učenjem" },
    haveAccount: { ru: "У меня есть аккаунт", en: "I have an account", sl: "Imam račun" },
    forFDV: { ru: "Курс русского языка для FDV", en: "Russian language course for FDV", sl: "Tečaj ruščine za FDV" },
    features: { ru: "Всё для успешного изучения", en: "Everything for successful learning", sl: "Vse za uspešno učenje" },
    featuresSubtitle: { ru: "Платформа создана специально для курса «World Language – Russian» в FDV", en: "Platform designed specifically for the 'World Language – Russian' course at FDV", sl: "Platforma, zasnovana posebej za tečaj 'Svetovni jezik – ruščina' na FDV" },
    aiTutor: { ru: "AI-репетитор", en: "AI Tutor", sl: "AI Tutor" },
    aiTutorDesc: { ru: "Голосовой помощник для практики произношения с мгновенной обратной связью", en: "Voice assistant for pronunciation practice with instant feedback", sl: "Glasovni pomočnik za vajo izgovorjave s takojšnjimi povratnimi informacijami" },
    tracking: { ru: "Отслеживание", en: "Tracking", sl: "Sledenje" },
    trackingDesc: { ru: "Прогресс, посещаемость и оценки — всё в одном месте", en: "Progress, attendance, and grades — all in one place", sl: "Napredek, prisotnost in ocene — vse na enem mestu" },
    forFDVDesc: { ru: "Соответствует требованиям курса: 75% посещаемость, ДЗ, экзамены", en: "Meets course requirements: 75% attendance, homework, exams", sl: "Izpolnjuje zahteve tečaja: 75% prisotnost, domače naloge, izpiti" },
    courseStructure: { ru: "Структура курса", en: "Course Structure", sl: "Struktura tečaja" },
    courseStructureDesc: { ru: "Каждый урок включает фонетику, грамматику, разговорную тему и упражнения", en: "Each lesson includes phonetics, grammar, conversation topic, and exercises", sl: "Vsaka lekcija vključuje fonetiko, slovnico, pogovorno temo in vaje" },
    readyToStart: { ru: "Готовы начать изучение русского языка?", en: "Ready to start learning Russian?", sl: "Ste pripravljeni začeti učenje ruščine?" },
    registerFree: { ru: "Зарегистрируйтесь бесплатно и получите доступ ко всем урокам", en: "Register for free and get access to all lessons", sl: "Registrirajte se brezplačno in pridobite dostop do vseh lekcij" },
    createAccount: { ru: "Создать аккаунт", en: "Create account", sl: "Ustvari račun" },
  },

  // Lesson content labels
  lessonLabels: {
    lesson: { ru: "Урок", en: "Lesson", sl: "Lekcija" },
    alphabet: { ru: "Алфавит", en: "Alphabet", sl: "Abeceda" },
    pronunciation: { ru: "Произношение", en: "Pronunciation", sl: "Izgovorjava" },
    greetings: { ru: "Приветствие", en: "Greetings", sl: "Pozdravi" },
    introduction: { ru: "Знакомство", en: "Introduction", sl: "Predstavitev" },
    family: { ru: "Семья", en: "Family", sl: "Družina" },
    professions: { ru: "Профессии", en: "Professions", sl: "Poklici" },
    dailyRoutine: { ru: "Мой день", en: "My day", sl: "Moj dan" },
    food: { ru: "Еда и напитки", en: "Food and drinks", sl: "Hrana in pijača" },
    shopping: { ru: "Покупки", en: "Shopping", sl: "Nakupovanje" },
    city: { ru: "Город", en: "City", sl: "Mesto" },
    transport: { ru: "Транспорт", en: "Transport", sl: "Prevoz" },
    weather: { ru: "Погода", en: "Weather", sl: "Vreme" },
    hobbies: { ru: "Хобби", en: "Hobbies", sl: "Hobiji" },
    health: { ru: "Здоровье", en: "Health", sl: "Zdravje" },
    travel: { ru: "Путешествия", en: "Travel", sl: "Potovanja" },
  },
} as const;

export function t(key: string, locale: Locale = "ru"): string {
  const keys = key.split(".");
  let value: unknown = translations;
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  if (value && typeof value === "object" && locale in value) {
    return (value as Record<string, string>)[locale];
  }
  
  return key;
}

export function getLocaleFromCookie(cookieValue: string | undefined): Locale {
  if (cookieValue === "en" || cookieValue === "sl" || cookieValue === "ru") {
    return cookieValue;
  }
  return "ru";
}
