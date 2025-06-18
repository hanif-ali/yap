"use client";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUserConfig } from "@/providers/user-config-provider";
import { useFormik } from "formik";
import { useState } from "react";
import { X } from "lucide-react";

const suggestedTraits = [
  "friendly",
  "witty",
  "concise",
  "curious",
  "empathetic",
  "creative",
  "patient",
];

export function CustomizationTab() {
  const { userConfig, updateUserConfig } = useUserConfig();
  const [traitInput, setTraitInput] = useState("");

  const formik = useFormik({
    initialValues: {
      profession: userConfig.profession || "",
      userContext: userConfig.userContext || "",
      traits: userConfig.traits || [],
    },
    onSubmit: async (values) => {
      await updateUserConfig({
        profession: values.profession,
        userContext: values.userContext,
        traits: values.traits,
      });

      formik.resetForm({ values });
    },
  });

  const addTrait = (trait: string) => {
    if (
      trait.trim() &&
      !formik.values.traits.includes(trait.trim()) &&
      formik.values.traits.length < 50
    ) {
      formik.setFieldValue("traits", [...formik.values.traits, trait.trim()]);
    }
  };

  const removeTrait = (traitToRemove: string) => {
    formik.setFieldValue(
      "traits",
      formik.values.traits.filter((trait) => trait !== traitToRemove)
    );
  };

  const handleTraitInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      addTrait(traitInput);
      setTraitInput("");
    }
  };

  const handleSuggestedTraitClick = (trait: string) => {
    addTrait(trait);
  };

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
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
              <div className="space-y-2">
                <label
                  htmlFor="profession"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  What do you do?
                </label>
                <Input
                  id="profession"
                  name="profession"
                  value={formik.values.profession}
                  onChange={formik.handleChange}
                  placeholder="Engineer, student, etc."
                  className="focus:outline-none focus:ring-0 mt-2"
                />
                <p className="text-sm text-muted-foreground">
                  {formik.values.profession.length}/100
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="userContext"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Anything the model should keep in mind when responding?
                </label>
                <Input
                  id="userContext"
                  name="userContext"
                  value={formik.values.userContext}
                  onChange={formik.handleChange}
                  placeholder="Interests, values, or preferences to keep in mind"
                  className="max-w-md focus:outline-none focus:ring-0 mt-2"
                />
                <p className="text-sm text-muted-foreground">
                  {formik.values.userContext.length}/3000
                </p>
              </div>
            </div>

            {/* Full width traits section */}
            <div className="space-y-2 mt-8">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                What traits should Yap have?{" "}
                <span className="text-sm text-muted-foreground">
                  (up to 50, max 100 chars each)
                </span>
              </label>
              <Input
                value={traitInput}
                onChange={(e) => setTraitInput(e.target.value)}
                onKeyDown={handleTraitInputKeyDown}
                placeholder="Type a trait and press Enter or Tab..."
                className="focus:outline-none focus:ring-0 mt-2"
              />

              {/* Current traits */}
              {formik.values.traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formik.values.traits.map((trait, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => removeTrait(trait)}
                    >
                      {trait}
                      <X size={14} />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested traits */}
              {suggestedTraits.filter(trait => !formik.values.traits.includes(trait)).length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Suggested traits (click to add):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTraits
                      .filter(trait => !formik.values.traits.includes(trait))
                      .map((trait) => (
                        <Badge
                          key={trait}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => handleSuggestedTraitClick(trait)}
                        >
                          {trait} +
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4">
              <Button type="submit" disabled={!formik.dirty || !formik.isValid}>
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
