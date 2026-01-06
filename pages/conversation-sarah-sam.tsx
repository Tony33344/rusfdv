import { GetStaticProps } from 'next';
import Head from 'next/head';

const conversationData = [
  { speaker: 'А', text: 'Добрый вечер, меня зовут Оля. А как тебя зовут?' },
  { speaker: 'Б', text: 'Меня зовут Марк.' },
  { speaker: 'А', text: 'Очень приятно.' },
  { speaker: 'А', text: 'Ты студент какого факультета?' },
  { speaker: 'Б', text: 'Я студент факультета общественных наук.' },
  { speaker: 'А', text: 'Что ты изучаешь?' },
  { speaker: 'Б', text: 'Я изучаю международные отношения.' },
  { speaker: 'А', text: 'Где ты живёшь?' },
  { speaker: 'Б', text: 'Я живу в Любляне, в Словении.' },
  { speaker: 'А', text: 'Какие языки ты знаешь?' },
  { speaker: 'Б', text: 'Я знаю английский и немецкий язык.' },
  { speaker: 'А', text: 'Пока!' },
  { speaker: 'Б', text: 'До свидания!' },
];

export default function ConversationSarahSamPage() {
  return (
    <>
      <Head>
        <title>Russian Dialogue - Sarah & Sam</title>
        <meta name="description" content="Russian Conversation with Sarah and Sam" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🇷🇺 Русский Диалог
            </h1>
            <p className="text-purple-200 text-lg">
              Russian Conversation - Sarah & Sam
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-purple-300">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                А — Оля (Sarah)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Б — Марк (Sam)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {conversationData.map((line, index) => (
              <div
                key={index}
                className={`flex ${
                  line.speaker === 'А' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`relative max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-xl ${
                    line.speaker === 'А'
                      ? 'bg-gradient-to-r from-pink-600 to-pink-500 rounded-tl-none'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 rounded-tr-none'
                  }`}
                >
                  <div
                    className={`absolute -top-3 ${
                      line.speaker === 'А' ? 'left-4' : 'right-4'
                    } px-3 py-1 rounded-full text-xs font-bold ${
                      line.speaker === 'А'
                        ? 'bg-pink-700 text-pink-100'
                        : 'bg-blue-700 text-blue-100'
                    }`}
                  >
                    {line.speaker === 'А' ? 'Оля' : 'Марк'}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        line.speaker === 'А'
                          ? 'bg-pink-700'
                          : 'bg-blue-700'
                      }`}
                    >
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>

                    <p className="text-white text-lg font-medium leading-relaxed">
                      {line.text}
                    </p>
                  </div>

                  <div
                    className={`absolute -bottom-2 ${
                      line.speaker === 'А' ? 'left-4' : 'right-4'
                    }`}
                  >
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500 text-white">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      Audio Available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-all">
              ← Back to Showcase
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
