"use client";

import {
  Battery,
  MessageSquare,
  Phone,
  Users,
  Wifi,
  MapPin,
  Smartphone,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks/use-api";
import type { ConfigQueryResponse, BatteryResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

function DashboardContent() {
  const {
    data: config,
    isLoading: configLoading,
    error: configError,
    mutate: refreshConfig,
  } = useApi<ConfigQueryResponse>("/config/query", {});

  const {
    data: battery,
    isLoading: batteryLoading,
    error: batteryError,
    mutate: refreshBattery,
  } = useApi<BatteryResponse>("/battery/query", {}, {
    refreshInterval: 30000,
  });

  const refresh = () => {
    refreshConfig();
    refreshBattery();
  };

  const features = [
    { key: "enable_api_sms_send", label: "发送短信", icon: MessageSquare },
    { key: "enable_api_sms_query", label: "查询短信", icon: MessageSquare },
    { key: "enable_api_call_query", label: "通话记录", icon: Phone },
    { key: "enable_api_contact_query", label: "通讯录", icon: Users },
    { key: "enable_api_battery_query", label: "电池电量", icon: Battery },
    { key: "enable_api_wol", label: "远程唤醒", icon: Wifi },
  ];

  const parseBatteryLevel = (level: string): number => {
    const match = level.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="首页">
        <Button variant="ghost" size="icon" onClick={refresh} className="h-9 w-9">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </PageHeader>

      <main className="flex-1 p-4 space-y-4">
        {/* Device Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-5 w-5" />
              设备信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {configLoading ? (
              <>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-2/3" />
              </>
            ) : configError ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{configError.message}</span>
              </div>
            ) : config ? (
              <>
                {config.extra_device_mark && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">设备名称</span>
                    <span className="text-sm font-medium">{config.extra_device_mark}</span>
                  </div>
                )}
                {config.sim_info_list &&
                  Object.entries(config.sim_info_list).map(([key, sim]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        SIM {parseInt(key) + 1}
                      </span>
                      <span className="text-sm font-medium truncate ml-2">
                        {config[`extra_sim${parseInt(key) + 1}` as keyof typeof config] as string || sim.number || sim.carrier_name}
                      </span>
                    </div>
                  ))}
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Battery Card */}
        {config?.enable_api_battery_query && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Battery className="h-5 w-5" />
                电池电量
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {batteryLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : batteryError ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{batteryError.message}</span>
                </div>
              ) : battery ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{battery.level}</span>
                    <Badge variant={battery.status === "充电中" || battery.status === "Charging" ? "default" : "secondary"}>
                      {battery.status}
                    </Badge>
                  </div>
                  <Progress value={parseBatteryLevel(battery.level)} className="h-2" />
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {battery.voltage && (
                      <div>Voltage: {battery.voltage}</div>
                    )}
                    {battery.temperature && (
                      <div>温度: {parseInt(battery.temperature) / 10}°C</div>
                    )}
                    {battery.health && (
                      <div>健康度: {battery.health}</div>
                    )}
                    {battery.plugged && (
                      <div>充电方式: {battery.plugged}</div>
                    )}
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Features Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">已启用功能</CardTitle>
          </CardHeader>
          <CardContent>
            {configLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {features.map((feature) => {
                  const enabled = config?.[feature.key as keyof ConfigQueryResponse] as boolean;
                  return (
                    <div
                      key={feature.key}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-lg border",
                        enabled ? "bg-muted/50" : "opacity-50"
                      )}
                    >
                      <feature.icon className="h-5 w-5" />
                      <span className="text-xs text-center">{feature.label}</span>
                      {enabled ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ConfigGuard>
      <DashboardContent />
    </ConfigGuard>
  );
}
