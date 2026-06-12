"use client";

import {
  Battery as BatteryIcon,
  BatteryCharging,
  Thermometer,
  Zap,
  Activity,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useApi } from "@/lib/hooks/use-api";
import type { BatteryResponse } from "@/lib/types";

function parseBatteryLevel(level: string): number {
  const match = level.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function BatteryContent() {
  const {
    data: battery,
    isLoading,
    error,
    mutate,
  } = useApi<BatteryResponse>("/battery/query", {}, {
    refreshInterval: 15000,
  });

  const level = battery ? parseBatteryLevel(battery.level) : 0;

  const getBatteryColor = (level: number) => {
    if (level >= 60) return "text-green-500";
    if (level >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="电池电量">
        <Button variant="ghost" size="icon" onClick={() => mutate()} className="h-9 w-9">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </PageHeader>

      <main className="flex-1 p-4 space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-center">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive">{error.message}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => mutate()}>
              重试
            </Button>
          </div>
        ) : battery ? (
          <>
            {/* Main Battery Display */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <BatteryIcon className={`h-24 w-24 ${getBatteryColor(level)}`} />
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                      {battery.level}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge
                      variant={
                        battery.status === "充电中" || battery.status === "Charging"
                          ? "default"
                          : "secondary"
                      }
                      className="flex items-center gap-1"
                    >
                      {battery.status === "充电中" || battery.status === "Charging" ? (
                        <BatteryCharging className="h-3 w-3" />
                      ) : null}
                      {battery.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={level} className="h-3 mt-6" />
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {battery.voltage && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      电压
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{battery.voltage}</p>
                  </CardContent>
                </Card>
              )}

              {battery.temperature && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      温度
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      {parseInt(battery.temperature) / 10}°C
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    健康度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{battery.health}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    充电方式
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{battery.plugged || "未充电"}</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default function BatteryPage() {
  return (
    <ConfigGuard>
      <BatteryContent />
    </ConfigGuard>
  );
}
