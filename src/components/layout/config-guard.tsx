"use client";

import Link from "next/link";
import { Settings, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsContext } from "@/providers/settings-provider";

export function ConfigGuard({ children }: { children: React.ReactNode }) {
  const { isConfigured, isLoaded } = useSettingsContext();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">需要配置</h2>
        <p className="text-muted-foreground mb-6">
          请先配置 SmsForwarder 服务端地址后开始使用。
        </p>
        <Button asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4 mr-2" />
            前往设置
          </Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
