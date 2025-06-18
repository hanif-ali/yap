"use client";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function CustomizationTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Customize Yap</h2>
        <p className="text-muted-foreground mb-6">
          Personalize your chat experience.
        </p>
      </div>

      <Card className="bg-transparent border-none">
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-y-8 gap-x-6">
            <div className="space-y-2">
              <label
                htmlFor="occupation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                What do you do?
              </label>
              <Input
                id="occupation"
                placeholder="Engineer, student, etc."
                className="focus:outline-none focus:ring-0"
              />
              <p className="text-sm text-muted-foreground">0/100</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="additional"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Anything the model should keep in mind when responding?
              </label>
              <Input
                id="additional"
                placeholder="Interests, values, or preferences to keep in mind"
                className="max-w-md focus:outline-none focus:ring-0"
              />
              <p className="text-sm text-muted-foreground">0/3000</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                What traits should Yap have?{" "}
                <span className="text-sm text-muted-foreground">
                  (up to 50, max 100 chars each)
                </span>
              </label>
              <Input
                placeholder="Type a trait and press Enter or Tab..."
                className="max-w-md focus:outline-none focus:ring-0"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">friendly +</Badge>
                <Badge variant="secondary">witty +</Badge>
                <Badge variant="secondary">concise +</Badge>
                <Badge variant="secondary">curious +</Badge>
                <Badge variant="secondary">empathetic +</Badge>
                <Badge variant="secondary">creative +</Badge>
                <Badge variant="secondary">patient +</Badge>
              </div>
              <p className="text-sm text-muted-foreground">0/50</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 