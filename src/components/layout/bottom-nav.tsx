"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Phone, Users, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Battery,
  Wifi,
  MapPin,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

const mainTabs = [
  { href: "/dashboard", label: "首页", icon: Home },
  { href: "/sms", label: "短信", icon: MessageSquare },
  { href: "/calls", label: "通话", icon: Phone },
  { href: "/contacts", label: "通讯录", icon: Users },
];

const moreItems = [
  { href: "/battery", label: "电量", icon: Battery },
  { href: "/wol", label: "远程唤醒", icon: Wifi },
  { href: "/location", label: "定位", icon: MapPin },
  { href: "/settings", label: "设置", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isMoreActive = moreItems.some((item) => isActive(item.href));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-16 items-center justify-around px-2">
          {mainTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                isActive(tab.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Link>
          ))}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                  isMoreActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-xs">更多</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>更多功能</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-4 gap-4 py-6">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs text-center">{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-center py-2 border-t">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="text-sm ml-6">
                    {theme === "dark" ? "浅色模式" : "深色模式"}
                  </span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
