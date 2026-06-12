"use client";

import {
  MapPin,
  Navigation,
  Clock,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigGuard } from "@/components/layout/config-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/lib/hooks/use-api";
import type { LocationResponse } from "@/lib/types";

function LocationContent() {
  const {
    data: location,
    isLoading,
    error,
    mutate,
  } = useApi<LocationResponse>("/location/query", {});

  const getMapUrl = (lat: number, lng: number) => {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="定位">
        <Button variant="ghost" size="icon" onClick={() => mutate()} className="h-9 w-9">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </PageHeader>

      <main className="flex-1 p-4 space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
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
        ) : location ? (
          <>
            {/* Map Preview Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={getMapUrl(location.latitude, location.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      在地图中打开
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            {location.address && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    地址
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{location.address}</p>
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    纬度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono">{location.latitude.toFixed(6)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    经度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono">{location.longitude.toFixed(6)}</p>
                </CardContent>
              </Card>

              {location.provider && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      供应商
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{location.provider}</Badge>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    定位时间
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{location.time}</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default function LocationPage() {
  return (
    <ConfigGuard>
      <LocationContent />
    </ConfigGuard>
  );
}
