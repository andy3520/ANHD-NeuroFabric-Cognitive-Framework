"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem("neurofabric-disclaimer");
    if (!hasSeenDisclaimer) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("neurofabric-disclaimer", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Work in Progress</DialogTitle>
          </div>
          <DialogDescription className="pt-4 space-y-3">
            <p>
              This is a demonstration interface for the ANHD-NeuroFabric
              Cognitive Framework.
            </p>
            <p className="font-semibold text-foreground">
              ⚠️ Currently using mock data and simulated responses
            </p>
            <p>
              The actual multi-agent orchestration system is under development.
              This demo showcases the proposed architecture and user interface.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={handleAccept}>I Understand</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
