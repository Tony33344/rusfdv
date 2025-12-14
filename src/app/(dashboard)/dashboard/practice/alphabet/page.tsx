"use client";

import { useState } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const cyrillicAlphabet = [
  { letter: "А а", name: "а", sound: "a (as in 'father')", example: "Анна" },
  { letter: "Б б", name: "бэ", sound: "b", example: "брат" },
  { letter: "В в", name: "вэ", sound: "v", example: "вода" },
  { letter: "Г г", name: "гэ", sound: "g", example: "город" },
  { letter: "Д д", name: "дэ", sound: "d", example: "дом" },
  { letter: "Е е", name: "е", sound: "ye (as in 'yes')", example: "ел" },
  { letter: "Ё ё", name: "ё", sound: "yo (as in 'yolk')", example: "ёлка" },
  { letter: "Ж ж", name: "жэ", sound: "zh (as in 'pleasure')", example: "жена" },
  { letter: "З з", name: "зэ", sound: "z", example: "звук" },
  { letter: "И и", name: "и", sound: "ee (as in 'meet')", example: "имя" },
  { letter: "Й й", name: "и краткое", sound: "y (as in 'boy')", example: "йогурт" },
  { letter: "К к", name: "ка", sound: "k", example: "книга" },
  { letter: "Л л", name: "эл", sound: "l", example: "лампа" },
  { letter: "М м", name: "эм", sound: "m", example: "мама" },
  { letter: "Н н", name: "эн", sound: "n", example: "нос" },
  { letter: "О о", name: "о", sound: "o (as in 'more')", example: "окно" },
  { letter: "П п", name: "пэ", sound: "p", example: "папа" },
  { letter: "Р р", name: "эр", sound: "r (rolled)", example: "рука" },
  { letter: "С с", name: "эс", sound: "s", example: "сок" },
  { letter: "Т т", name: "тэ", sound: "t", example: "там" },
  { letter: "У у", name: "у", sound: "oo (as in 'moon')", example: "утро" },
  { letter: "Ф ф", name: "эф", sound: "f", example: "факт" },
  { letter: "Х х", name: "ха", sound: "kh (as in 'Bach')", example: "хлеб" },
  { letter: "Ц ц", name: "цэ", sound: "ts", example: "цена" },
  { letter: "Ч ч", name: "че", sound: "ch", example: "час" },
  { letter: "Ш ш", name: "ша", sound: "sh", example: "школа" },
  { letter: "Щ щ", name: "ща", sound: "shch", example: "щи" },
  { letter: "Ъ ъ", name: "твёрдый знак", sound: "(hard sign)", example: "объект" },
  { letter: "Ы ы", name: "ы", sound: "i (as in 'bit')", example: "сын" },
  { letter: "Ь ь", name: "мягкий знак", sound: "(soft sign)", example: "мать" },
  { letter: "Э э", name: "э", sound: "e (as in 'met')", example: "это" },
  { letter: "Ю ю", name: "ю", sound: "yu (as in 'you')", example: "юг" },
  { letter: "Я я", name: "я", sound: "ya (as in 'yard')", example: "яблоко" },
];

export default function AlphabetPracticePage() {
  const [selectedLetter, setSelectedLetter] = useState<typeof cyrillicAlphabet[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/practice"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Русский алфавит 🔤
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            33 буквы кириллицы — нажмите на букву для подробностей
          </p>
        </div>
      </div>

      {/* Selected Letter Detail */}
      {selectedLetter && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {selectedLetter.letter}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Название: <strong>{selectedLetter.name}</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Звук: {selectedLetter.sound}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Пример: <strong>{selectedLetter.example}</strong>
              </p>
            </div>
            <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition">
              <Volume2 className="text-white" size={32} />
            </button>
          </div>
        </div>
      )}

      {/* Alphabet Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Кириллический алфавит
        </h2>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-2">
          {cyrillicAlphabet.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedLetter(item)}
              className={cn(
                "aspect-square flex items-center justify-center text-xl font-bold rounded-lg transition",
                selectedLetter?.letter === item.letter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900"
              )}
            >
              {item.letter.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Vowels vs Consonants */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            Гласные (10)
          </h3>
          <p className="text-green-700 dark:text-green-300 text-lg">
            А Е Ё И О У Ы Э Ю Я
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Согласные (21)
          </h3>
          <p className="text-purple-700 dark:text-purple-300 text-lg">
            Б В Г Д Ж З Й К Л М Н П Р С Т Ф Х Ц Ч Ш Щ
          </p>
        </div>
      </div>

      {/* Special Characters */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
        <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
          Специальные знаки (2)
        </h3>
        <div className="flex gap-4">
          <div>
            <span className="text-2xl font-bold text-orange-600">Ъ</span>
            <span className="text-orange-700 dark:text-orange-300 ml-2">
              — твёрдый знак (разделительный)
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-orange-600">Ь</span>
            <span className="text-orange-700 dark:text-orange-300 ml-2">
              — мягкий знак (смягчает согласную)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
