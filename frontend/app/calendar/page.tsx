import { CalendarDiaryScreen } from "@/features/calendar/calendar-diary-screen";

type CalendarPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const { date } = await searchParams;

  return <CalendarDiaryScreen initialDate={date} />;
}
