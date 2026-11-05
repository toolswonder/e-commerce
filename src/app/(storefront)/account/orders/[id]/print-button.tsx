"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintInvoiceButton() {
  return (
    <Button
      onClick={() => window.print()}
      variant="outline"
      className="text-xs gap-1.5 rounded-lg border-zinc-300 print:hidden"
    >
      <Printer className="w-4 h-4" /> Print / Save Invoice PDF
    </Button>
  );
}
