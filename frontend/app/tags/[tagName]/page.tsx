import { redirect } from "next/navigation";

type TagPageProps = {
  params: Promise<{ tagName: string }>;
};

export default async function TagPage({ params }: TagPageProps) {
  const { tagName } = await params;
  redirect(`/?q=${encodeURIComponent(decodeURIComponent(tagName))}`);
}
