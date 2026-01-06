import { GetStaticProps } from 'next';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Russian Dialogue Showcase</title>
        <meta name="description" content="Interactive Russian Conversation Showcase" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🇷🇺 Русский Диалог
            </h1>
            <p className="text-purple-200 text-lg">
              Interactive Russian Conversation Showcase
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Voice Showcase</h2>
            <div className="grid gap-4">
              <a href="/showcase-simple" className="block p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white">
                <h3 className="font-bold">Voice Generation Showcase</h3>
                <p className="text-purple-300">Generate and play Russian conversations with different voices</p>
              </a>
            </div>
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
