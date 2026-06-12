"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useApiMutation } from "@/lib/hooks/use-api";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().optional(),
  phone_number: z.string().min(1, "请输入至少一个手机号码"),
});

type ContactForm = z.infer<typeof contactSchema>;

function ContactAddContent() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const mutation = useApiMutation<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone_number: "",
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setSaving(true);
    try {
      await mutation("/contact/add", {
        name: data.name || undefined,
        phone_number: data.phone_number,
      });
      toast.success("联系人添加成功！");
      router.push("/contacts");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "添加联系人失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="添加联系人" showBack />

      <main className="flex-1 p-4">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名（可选）</Label>
                <Input
                  id="name"
                  placeholder="联系人姓名"
                  {...register("name")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">手机号码</Label>
                <Input
                  id="phone_number"
                  placeholder="输入手机号码，多个号码用 ; 分隔"
                  {...register("phone_number")}
                />
                {errors.phone_number && (
                  <p className="text-sm text-destructive">{errors.phone_number.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  多个手机号码用分号 (;) 分隔
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                添加联系人
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function ContactAddPage() {
  return (
    <ConfigGuard>
      <ContactAddContent />
    </ConfigGuard>
  );
}
