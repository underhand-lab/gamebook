import { ProfileScreen } from "@/features/profile/profile-screen";

type HomePageProps = {
  searchParams?: Promise<{ userId?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  return <ProfileScreen userId={params?.userId ?? "user-me"} />;
}
