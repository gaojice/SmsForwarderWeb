"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wifi, Loader2, Power } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiMutation } from "@/lib/hooks/use-api";
import { toast } from "sonner";

const wolSchema = z.object({
  mac: z
    .string()
    .min(1, "请输入 MAC 地址")
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "MAC 地址格式不正确（例如：24:5E:BE:0C:45:9A）"
    ),
  ip: z.string().optional(),
  port: z.string().optional(),
});

type WolForm = z.infer<typeof wolSchema>;

function WolContent() {
  const [sending, setSending] = useState(false);
  const mutation = useApiMutation<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WolForm>({
    resolver: zodResolver(wolSchema),
    defaultValues: {
      mac: "",
      ip: "",
      port: "",
    },
  });

  const onSubmit = async (data: WolForm) => {
    setSending(true);
    try {
      const payload: Record<string, unknown> = { mac: data.mac };
      if (data.ip) payload.ip = data.ip;
      if (data.port) payload.port = parseInt(data.port);

      await mutation("/wol/send", payload);
      toast.success("唤醒包已发送！");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "发送唤醒包失败");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="远程唤醒" />

      <main className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5" />
              发送唤醒包
            </CardTitle>
            <CardDescription>
              远程唤醒同一网络下的设备
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mac">MAC 地址</Label>
                <Input
                  id="mac"
                  placeholder="24:5E:BE:0C:45:9A"
                  {...register("mac")}
                />
                {errors.mac && (
                  <p className="text-sm text-destructive">{errors.mac.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  格式：XX:XX:XX:XX:XX:XX 或 XX-XX-XX-XX-XX-XX
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip">广播 IP（可选）</Label>
                <Input
                  id="ip"
                  placeholder="192.168.1.255"
                  {...register("ip")}
                />
                <p className="text-xs text-muted-foreground">
                  目标网络的广播 IP 地址
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">端口（可选）</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="9"
                  {...register("port")}
                />
                <p className="text-xs text-muted-foreground">
                  默认端口为 9，某些系统使用端口 7。
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wifi className="h-4 w-4 mr-2" />
                )}
                发送唤醒包
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function WolPage() {
  return (
    <ConfigGuard>
      <WolContent />
    </ConfigGuard>
  );
}
