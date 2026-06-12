"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, showBack = false, children, className }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80", className)}>
      <div className="flex h-14 items-center px-4 gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold flex-1 truncate">{title}</h1>
        {children}
      </div>
    </header>
  );
}
