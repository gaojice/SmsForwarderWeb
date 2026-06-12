"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/lib/hooks/use-api";
import { formatSmsCount } from "@/lib/utils";
import { toast } from "sonner";

const smsSchema = z.object({
  phone_numbers: z.string().min(1, "请输入至少一个手机号码"),
  msg_content: z
    .string()
    .min(1, "请输入短信内容")
    .max(390, "最多 390 个字符（6 条短信）"),
  sim_slot: z.enum(["1", "2"]),
});

type SmsForm = z.infer<typeof smsSchema>;

function SmsSendContent() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const mutation = useApiMutation<string>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SmsForm>({
    resolver: zodResolver(smsSchema),
    defaultValues: {
      phone_numbers: "",
      msg_content: "",
      sim_slot: "1",
    },
  });

  const msgContent = watch("msg_content");
  const simSlot = watch("sim_slot");
  const smsInfo = formatSmsCount(msgContent || "");

  const onSubmit = async (data: SmsForm) => {
    setSending(true);
    try {
      await mutation("/sms/send", {
        sim_slot: parseInt(data.sim_slot) as 1 | 2,
        phone_numbers: data.phone_numbers,
        msg_content: data.msg_content,
      });
      toast.success("短信发送成功！");
      router.push("/sms");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "发送短信失败");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="发送短信" showBack />

      <main className="flex-1 p-4">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sim_slot">SIM 卡</Label>
                <Select
                  value={simSlot}
                  onValueChange={(val) => setValue("sim_slot", val as "1" | "2")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">SIM 1</SelectItem>
                    <SelectItem value="2">SIM 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_numbers">手机号码</Label>
                <Input
                  id="phone_numbers"
                  placeholder="输入手机号码，多个号码用 ; 分隔"
                  {...register("phone_numbers")}
                />
                {errors.phone_numbers && (
                  <p className="text-sm text-destructive">{errors.phone_numbers.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  多个手机号码用分号 (;) 分隔
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="msg_content">短信内容</Label>
                  <span
                    className={`text-xs ${
                      smsInfo.total < 0 ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {smsInfo.count} SMS{smsInfo.total >= 0 ? ` (${smsInfo.total} left)` : ""}
                  </span>
                </div>
                <Textarea
                  id="msg_content"
                  placeholder="输入短信内容..."
                  rows={5}
                  {...register("msg_content")}
                  className="resize-none"
                />
                {errors.msg_content && (
                  <p className="text-sm text-destructive">{errors.msg_content.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                发送短信
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function SmsSendPage() {
  return (
    <ConfigGuard>
      <SmsSendContent />
    </ConfigGuard>
  );
}
