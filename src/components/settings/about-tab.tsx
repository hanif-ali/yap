"use client";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function AboutTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">About Yap</h2>
      </div>

      <div className="space-y-6">
        <Card className="bg-transparent border-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">MIT License</Badge>
              <Badge variant="outline">Open Source</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Yap was built as an open-source clone of{" "}
              <a
                href="https://t3.chat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                t3.chat
              </a>
              , created by{" "}
              <a
                href="https://t3.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Theo Browne
              </a>
            </p>
            <p className="text-muted-foreground">
              I built the project in a week and as a result, there might
              still be some bugs and vulnerabilities. If you find any,
              please report them.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/hanif-ali/yap"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/hanif-ali/yap/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report Issues
                </a>
              </Button>
            </div>
            <div className="font-semibold leading-none mt-10">
              My Own Links
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/hanif-ali"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Profile
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://hanif-ali.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Personal Website
                </a>
              </Button>
            </div>

            <div className="font-semibold leading-none mt-10">
              Tech Stack
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="font-medium mb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend & Database</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Convex</Badge>
                  <Badge variant="secondary">Clerk Auth</Badge>
                  <Badge variant="secondary">Vercel AI SDK</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 