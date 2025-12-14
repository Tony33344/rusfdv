import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Home, Mic, ClipboardList, User, LogOut, GraduationCap } from "lucide-react";
import { cookies } from "next/headers";
import { getLocaleFromCookie, t } from "@/lib/i18n";
import { DashboardClientWrapper } from "./DashboardClientWrapper";
import { VoiceSelector } from "@/components/voice/VoiceSelector";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore.get("locale")?.value);

  const session = {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split("@")[0],
      role: user.user_metadata?.role || "STUDENT",
    },
  };

  return (
    <DashboardClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  РусскийПуть
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <Home size={18} />
                  <span>{t("nav.home", locale)}</span>
                </Link>
                <Link
                  href="/dashboard/lessons"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <BookOpen size={18} />
                  <span>{t("nav.lessons", locale)}</span>
                </Link>
                <Link
                  href="/dashboard/practice"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <Mic size={18} />
                  <span>{t("nav.practice", locale)}</span>
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <ClipboardList size={18} />
                  <span>{t("nav.progress", locale)}</span>
                </Link>
                <Link
                  href="/dashboard/grades"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <GraduationCap size={18} />
                  <span>{t("nav.grades", locale)}</span>
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1">
                  <button className="px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700" title="Русский">🇷🇺</button>
                  <button className="px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700" title="English">🇬🇧</button>
                  <button className="px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700" title="Slovenščina">🇸🇮</button>
                </div>
                <div className="hidden sm:block">
                  <VoiceSelector />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <User size={18} />
                  <span className="hidden sm:inline">{session.user.name || session.user.email}</span>
                </div>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="p-2 text-gray-500 hover:text-red-600 transition"
                    title={t("nav.logout", locale)}
                  >
                    <LogOut size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="flex justify-around py-2">
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300"
            >
              <Home size={20} />
              <span className="text-xs">{t("nav.home", locale)}</span>
            </Link>
            <Link
              href="/dashboard/lessons"
              className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300"
            >
              <BookOpen size={20} />
              <span className="text-xs">{t("nav.lessons", locale)}</span>
            </Link>
            <Link
              href="/dashboard/practice"
              className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300"
            >
              <Mic size={20} />
              <span className="text-xs">{t("nav.practice", locale)}</span>
            </Link>
            <Link
              href="/dashboard/grades"
              className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-300"
            >
              <GraduationCap size={20} />
              <span className="text-xs">{t("nav.grades", locale)}</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </DashboardClientWrapper>
  );
}
