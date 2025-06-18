"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { useUserConfig } from "@/providers/user-config-provider";

export function HistoryTab() {
  const { userConfig, updateUserConfig } = useUserConfig();
  const threads = useQuery(api.threads.getForCurrentUser);
  const deleteThreadsOlderThan = useMutation(
    api.threads.deleteThreadsOlderThan
  );
  const deleteAllThreads = useMutation(api.threads.deleteAllThreadsForUser);

  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateDeletionSchedule = async (
    schedule: "daily" | "monthly" | "yearly" | "never"
  ) => {
      await updateUserConfig({
        deletionSchedule: schedule,
      });
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleting(true);
      const deletedCount = await deleteAllThreads({});
      toast.success(
        `Deleted ${deletedCount} threads and all associated messages.`
      );
      setIsDeleteAllOpen(false);
    } catch (error) {
      toast.error("Failed to delete all threads");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!threads) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">History & Sync</h2>
          <p className="text-muted-foreground mb-6">
            Manage your chat history and schedule deletion.
          </p>
          <Card className="bg-transparent border-none">
            <CardContent>
              <Loader2 className="animate-spin" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-2">History & Sync</h2>
        <p className="text-muted-foreground mb-6">
          Manage your chat history and schedule deletion.
        </p>
      </div>

      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle>Thread Statistics</CardTitle>
          <CardDescription>Overview of your chat history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border ">
            <div>
              <p className="text-sm font-medium">Total Threads</p>
              <p className="text-2xl font-bold">{threads.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle>Schedule Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border ">
            <div>
              <p className="text-sm font-medium">
                Delete chats older than:{" "}
                <span className="text-muted-foreground">
                  {userConfig.deletionSchedule === "daily"
                    ? "a day"
                    : userConfig.deletionSchedule === "monthly"
                      ? "a month"
                      : userConfig.deletionSchedule === "yearly"
                        ? "a year"
                        : "Never"}
                </span>
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Select Period"
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => updateDeletionSchedule("never")}
                >
                  Never
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateDeletionSchedule("daily")}
                >
                  A day
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateDeletionSchedule("monthly")}
                >
                  A month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateDeletionSchedule("yearly")}
                >
                  A year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-muted-foreground">
            ⏰ Scheduled deletions happen at 00:00:00 UTC
          </p>
        </CardContent>
      </Card>

      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle>Destroy Chat History</CardTitle>
          <CardDescription>
            Permanently delete all your chat history and messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDeleteAllOpen} onOpenChange={setIsDeleteAllOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting || threads.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Chats
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Delete All Chats
                </DialogTitle>
                <DialogDescription>
                  This action will permanently delete all {threads.length}{" "}
                  threads and their associated messages. This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteAllOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete All"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
