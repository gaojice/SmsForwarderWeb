"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings, Wifi, WifiOff, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSettingsContext } from "@/providers/settings-provider";
import { api } from "@/lib/api";
import { toast } from "sonner";

const settingsSchema = z.object({
  serverUrl: z.string().url("请输入有效的 URL 地址"),
  secret: z.string().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { settings, updateSettings, isConfigured } = useSettingsContext();
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      serverUrl: settings.serverUrl,
      secret: settings.secret,
    },
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettings({
      serverUrl: data.serverUrl.replace(/\/$/, ""),
      secret: data.secret || "",
    });
    toast.success("设置已保存");
    setConnected(null);
  };

  const testConnection = async () => {
    setTesting(true);
    setConnected(null);
    try {
      const currentSettings = {
        serverUrl: settings.serverUrl,
        secret: settings.secret,
      };
      await api.configQuery(currentSettings);
      setConnected(true);
      toast.success("连接成功！");
    } catch (error) {
      setConnected(false);
      toast.error(error instanceof Error ? error.message : "连接失败");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="设置">
        <Settings className="h-5 w-5 text-muted-foreground" />
      </PageHeader>

      <main className="flex-1 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>服务器配置</CardTitle>
            <CardDescription>
              配置 SmsForwarder 设备的连接信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serverUrl">服务器地址</Label>
                <Input
                  id="serverUrl"
                  placeholder="http://192.168.1.100:5000"
                  {...register("serverUrl")}
                />
                {errors.serverUrl && (
                  <p className="text-sm text-destructive">{errors.serverUrl.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  SmsForwarder 设备的 IP 地址和端口（例如：http://192.168.1.100:5000）
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret">签名密钥（可选）</Label>
                <Input
                  id="secret"
                  type="password"
                  placeholder="如未配置请留空"
                  {...register("secret")}
                />
                <p className="text-xs text-muted-foreground">
                  仅在设备启用了签名验证时需要填写
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!isDirty}>
                  保存设置
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={testConnection}
                  disabled={!isConfigured || testing}
                >
                  {testing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : connected === true ? (
                    <Wifi className="h-4 w-4 mr-2 text-green-500" />
                  ) : connected === false ? (
                    <WifiOff className="h-4 w-4 mr-2 text-destructive" />
                  ) : null}
                  测试连接
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>关于</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">应用版本</span>
              <span>1.0.0</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">接口版本</span>
              <span>v3.0.0+</span>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground pt-2">
              本应用是 SmsForwarder Android 应用的远程控制客户端。
              请确保两台设备在同一网络下，或使用端口转发远程访问设备。
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
