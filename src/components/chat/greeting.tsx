import { useUserConfig } from "@/providers/user-config-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FileText, Palette, Code2, Lightbulb, SearchCheck } from "lucide-react";
import { UseChatHelpers } from "@ai-sdk/react";

const buttonOptions = {
  summarize: [
    "Summarize the Google 'Attention is all you need' paper",
    "Summarize the history of the Internet",
    "Summarize a video transcript",
    "Summarize this document",
    "Summarize a book",
  ],
  image: [
    "Generate an image of a landscape",
    "Generate an image of a cat",
    "Generate an image of a random character",
    "Create an image of a cityscape",
    "Generate an image of a sunset",
  ],
  code: [
    "Code a Python program to demonstrate Dijkstra's algorithm",
    "Write code for a React JS component",
    "Write code for a REST API endpoint",
    "Write code for a data analysis script",
    "Write code for a simple game",
  ],
  brainstorm: [
    "Brainstorm marketing strategies",
    "Generate creative writing ideas",
    "Brainstorm product features for a new app",
    "Generate business solutions",
    "Brainstorm research topics",
  ],
  analyze: [
    "Analyze code quality for a React JS component",
    "Review document structure",
    "Analyze data patterns for a dataset",
    "Check for security issues in a codebase",
    "Analyze performance metrics",
  ],
};

export const Greeting = ({ append }: { append: UseChatHelpers["append"] }) => {
  const { userConfig } = useUserConfig();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleButtonClick = (buttonId: string) => {
    setSelectedCategory(buttonId);
  };

  const mainButtons = [
    {
      id: "summarize",
      label: "Summarize",
      icon: FileText,
      color: "text-slate-400 group-hover:text-slate-300",
    },
    {
      id: "image",
      label: "Generate",
      icon: Palette,
      color: "text-violet-400 group-hover:text-violet-300",
    },
    {
      id: "code",
      label: "Code",
      icon: Code2,
      color: "text-blue-400 group-hover:text-blue-300",
    },
    {
      id: "brainstorm",
      label: "Brainstorm",
      icon: Lightbulb,
      color: "text-amber-400 group-hover:text-amber-300",
    },
    {
      id: "analyze",
      label: "Analyze",
      icon: SearchCheck,
      color: "text-emerald-400 group-hover:text-emerald-300",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-20rem)] items-start justify-center px-8">
      <div
        key="overview"
        className="max-w-3xl mx-auto size-full flex flex-col justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-3xl font-semibold"
        >
          {userConfig.isAnonymous
            ? "Hello there!"
            : `Hello, ${userConfig.fullName.split(" ")[0]}!`}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-2xl text-zinc-500 mb-8"
        >
          How can I help you today?
        </motion.div>

        {/* Fixed height container to prevent text shifting */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {!selectedCategory ? (
              <motion.div
                key="main-buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-wrap gap-3"
                transition={{
                  duration: 0.2,
                  ease: "linear",
                }}
              >
                {mainButtons.map((button) => {
                  const IconComponent = button.icon;
                  return (
                    <motion.button
                      key={button.id}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleButtonClick(button.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-white/20 transition-all duration-200 group"
                    >
                      <IconComponent
                        size={16}
                        className={`transition-colors ${button.color}`}
                      />
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                        {button.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="expanded-options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                // className="space-y-4"
              >
                {/* <div className="space-y-2"> */}
                {buttonOptions[
                  selectedCategory as keyof typeof buttonOptions
                ].map((option, optionIndex) => (
                  <motion.div
                    onClick={() => append({ role: "user", content: option })}
                    key={optionIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: optionIndex * 0.05 }}
                    className="border-t first:border-t-0 last:border-b py-1 border-secondary/30"
                  >
                    <button className="block w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border border-transparent hover:border-white/10">
                      {option}
                    </button>
                  </motion.div>
                ))}
                {/* </div> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
