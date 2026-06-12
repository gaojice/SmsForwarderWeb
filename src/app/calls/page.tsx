"use client";

import { useState } from "react";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks/use-api";
import type { CallItem } from "@/lib/types";
import { cn, formatRelativeTime, formatDuration } from "@/lib/utils";

const callTypes = [
  { value: 0, label: "全部", icon: Phone },
  { value: 1, label: "呼入", icon: PhoneIncoming },
  { value: 2, label: "呼出", icon: PhoneOutgoing },
  { value: 3, label: "未接", icon: PhoneMissed },
] as const;

function getCallTypeIcon(type: number) {
  switch (type) {
    case 1:
      return <PhoneIncoming className="h-4 w-4 text-green-500" />;
    case 2:
      return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
    case 3:
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    default:
      return <Phone className="h-4 w-4" />;
  }
}

function CallsContent() {
  const [type, setType] = useState<0 | 1 | 2 | 3>(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 20;

  const {
    data: calls,
    isLoading,
    error,
    mutate,
  } = useApi<CallItem[]>("/call/query", {
    type,
    page_num: pageNum,
    page_size: pageSize,
    phone_number: phoneNumber || undefined,
  });

  const handleTypeChange = (newType: 0 | 1 | 2 | 3) => {
    setType(newType);
    setPageNum(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="通话记录" />

      {/* Filter Bar */}
      <div className="sticky top-14 z-30 bg-background border-b">
        <div className="flex gap-1 p-3 overflow-x-auto">
          {callTypes.map((ct) => (
            <Button
              key={ct.value}
              variant={type === ct.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeChange(ct.value)}
              className="shrink-0"
            >
              <ct.icon className="h-4 w-4 mr-1" />
              {ct.label}
            </Button>
          ))}
        </div>
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索手机号码..."
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPageNum(1);
              }}
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
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
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
        ) : !calls || calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Phone className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">未找到通话记录</p>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {calls.map((call, idx) => (
                <div key={`${call.dateLong}-${idx}`} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {getCallTypeIcon(call.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {call.name || call.number}
                      </span>
                      {call.sim_id >= 0 && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          <Smartphone className="h-3 w-3 mr-0.5" />
                          SIM{call.sim_id + 1}
                        </Badge>
                      )}
                    </div>
                    {call.name && (
                      <p className="text-xs text-muted-foreground">{call.number}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDuration(call.duration)}</span>
                      <span>·</span>
                      <span>{formatRelativeTime(call.dateLong)}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                disabled={!calls || calls.length < pageSize}
                onClick={() => setPageNum((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function CallsPage() {
  return (
    <ConfigGuard>
      <CallsContent />
    </ConfigGuard>
  );
}
