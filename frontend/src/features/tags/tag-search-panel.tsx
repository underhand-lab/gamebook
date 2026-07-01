"use client";

import Link from "next/link";
import { Search, Tag, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { matchlogApi, type TagSearchResult, type TagType } from "@/lib/api";

export function TagSearchPanel() {
  const [q, setQ] = useState("");
  const [tagType, setTagType] = useState<TagType | "">("");
  const [items, setItems] = useState<TagSearchResult[]>([]);

  async function search() {
    const result = await matchlogApi.searchTags({
      q,
      tagType: tagType || undefined,
      size: 8,
    });
    setItems(result.items);
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search();
  }

  return (
    <Card>
      <CardHeader className="relative pr-12">
        <CardTitle>태그 검색</CardTitle>
        <CardDescription>태그를 선택하면 연결된 경기 결과로 이동합니다.</CardDescription>
        <Button
          aria-label="닫기"
          className="absolute right-4 top-4"
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => window.history.back()}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <form className="grid gap-4 md:grid-cols-[1fr_12rem_auto]" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="tagQuery">태그명</Label>
            <Input
              id="tagQuery"
              placeholder="올해최고, 라이벌전"
              value={q}
              onChange={(event) => setQ(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagType">유형</Label>
            <Select
              id="tagType"
              value={tagType}
              onChange={(event) => setTagType(event.target.value as TagType | "")}
            >
              <option value="">전체</option>
              <option value="OFFICIAL">OFFICIAL</option>
              <option value="USER">USER</option>
            </Select>
          </div>
          <Button className="self-end" type="submit">
            <Search className="h-4 w-4" />
            검색
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Button key={item.tag.id} asChild variant="outline" size="sm">
              <Link href={`/tags/${encodeURIComponent(item.tag.name)}`}>
                <Tag className="h-4 w-4" />
                {item.tag.name}
                <Badge variant="secondary">{item.matchCount}경기</Badge>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
