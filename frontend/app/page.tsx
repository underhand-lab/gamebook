import { HomeScreen } from "@/features/home/home-screen";

type HomePageProps = {
  searchParams?: Promise<{ userId?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  return <HomeScreen userId={params?.userId} />;
}
