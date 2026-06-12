"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  UserPlus,
  Phone,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks/use-api";
import type { ContactItem } from "@/lib/types";

function ContactsContent() {
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const {
    data: contacts,
    isLoading,
    error,
    mutate,
  } = useApi<ContactItem[]>("/contact/query", {
    name: searchName || undefined,
    phone_number: searchPhone || undefined,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="通讯录">
        <Button asChild size="icon" variant="ghost" className="h-9 w-9">
          <Link href="/contacts/add">
            <UserPlus className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      {/* Search Bar */}
      <div className="sticky top-14 z-30 bg-background border-b p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索姓名..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索手机号码..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="pl-9"
          />
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
        ) : !contacts || contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">未找到联系人</p>
          </div>
        ) : (
          <div className="divide-y">
            {contacts.map((contact, idx) => (
              <div
                key={`${contact.phone_number}-${idx}`}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-medium">
                    {(contact.name || contact.phone_number).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{contact.name || "未知"}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone_number}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <Link
        href="/contacts/add"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
      >
        <UserPlus className="h-5 w-5" />
      </Link>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <ConfigGuard>
      <ContactsContent />
    </ConfigGuard>
  );
}
