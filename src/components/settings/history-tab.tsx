"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function HistoryTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">History & Sync</h2>
        <p className="text-muted-foreground mb-6">
          Manage your chat history and synchronization settings.
        </p>
      </div>

      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
          <CardDescription>
            Control how your conversations are stored and synced
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chat history settings will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 