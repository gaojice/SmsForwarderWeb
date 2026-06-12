"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Send,
  Inbox,
  SendHorizontal,
  Smartphone,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks/use-api";
import type { SmsItem } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

function SmsContent() {
  const [type, setType] = useState<1 | 2>(1);
  const [keyword, setKeyword] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 20;

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const {
    data: messages,
    isLoading,
    error,
    mutate,
  } = useApi<SmsItem[]>("/sms/query", {
    type,
    page_num: pageNum,
    page_size: pageSize,
    keyword: keyword || undefined,
  });

  const handleTypeChange = (newType: 1 | 2) => {
    setType(newType);
    setPageNum(1);
    setExpandedIdx(null);
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPageNum(1);
    setExpandedIdx(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="短信">
        <Button asChild size="icon" variant="ghost" className="h-9 w-9">
          <Link href="/sms/send">
            <Send className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="sticky top-14 z-30 bg-background border-b">
        <div className="flex gap-2 p-3">
          <Button
            variant={type === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange(1)}
            className="flex-1"
          >
            <Inbox className="h-4 w-4 mr-1" />
            收件箱
          </Button>
          <Button
            variant={type === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange(2)}
            className="flex-1"
          >
            <SendHorizontal className="h-4 w-4 mr-1" />
            已发送
          </Button>
        </div>
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索短信..."
              value={keyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive">{error.message}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => mutate()}>
              重试
            </Button>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">未找到短信</p>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {messages.map((msg, idx) => {
                const isExpanded = expandedIdx === idx;
                return (
                  <div
                    key={`${msg.date}-${idx}`}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {msg.name !== "未知号码" ? msg.name : msg.number}
                          </span>
                          {msg.sim_id >= 0 && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              <Smartphone className="h-3 w-3 mr-0.5" />
                              SIM{msg.sim_id + 1}
                            </Badge>
                          )}
                        </div>
                        {msg.name !== "未知号码" && (
                          <p className="text-xs text-muted-foreground mb-1">{msg.number}</p>
                        )}
                        <p className={`text-sm text-muted-foreground whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-2"}`}>{msg.content}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(msg.date)}
                        </span>
                        {msg.content.length > 80 && (
                          isExpanded
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 p-4">
              <Button
                variant="outline"
                size="sm"
                disabled={pageNum <= 1}
                onClick={() => setPageNum((p) => p - 1)}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground">第 {pageNum} 页</span>
              <Button
                variant="outline"
                size="sm"
                disabled={!messages || messages.length < pageSize}
                onClick={() => setPageNum((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          </>
        )}
      </main>

      {/* FAB */}
      <Link
        href="/sms/send"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Send className="h-5 w-5" />
      </Link>
    </div>
  );
}

export default function SmsPage() {
  return (
    <ConfigGuard>
      <SmsContent />
    </ConfigGuard>
  );
}
