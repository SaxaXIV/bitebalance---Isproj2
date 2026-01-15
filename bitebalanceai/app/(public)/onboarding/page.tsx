"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Step = 1 | 2 | 3 | 4;

const ALLERGIES_OPTIONS = [
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Gluten",
  "Sesame",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [age, setAge] = React.useState("");
  const [sex, setSex] = React.useState("");
  const [heightCm, setHeightCm] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("");
  const [activityLevel, setActivityLevel] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [dietType, setDietType] = React.useState("");
  const [selectedAllergies, setSelectedAllergies] = React.useState<string[]>([]);
  const [customAllergies, setCustomAllergies] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const progress = (step / 4) * 100;

  function validateStep(stepNum: Step): string | null {
    if (stepNum === 1) {
      const a = Number(age);
      const h = Number(heightCm);
      const w = Number(weightKg);
      if (!Number.isFinite(a) || a < 13 || a > 120) return "Age must be 13–120.";
      if (!sex) return "Please select your sex.";
      if (!Number.isFinite(h) || h < 80 || h > 250) return "Height must be 80–250 cm.";
      if (!Number.isFinite(w) || w < 25 || w > 300) return "Weight must be 25–300 kg.";
      if (!activityLevel) return "Please select activity level.";
    }
    if (stepNum === 2) {
      if (!goal) return "Please select a goal.";
    }
    if (stepNum === 3) {
      if (!dietType) return "Please select a diet type.";
    }
    return null;
  }

  function calculateDailyCalories(): number {
    const ageNum = Number(age);
    const heightNum = Number(heightCm);
    const weightNum = Number(weightKg);
    
    if (!ageNum || !heightNum || !weightNum || !sex || !activityLevel || !goal) {
      return 2000; // Default
    }

    // BMR calculation (Mifflin-St Jeor Equation)
    let bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum;
    if (sex === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // Activity multiplier
    const multipliers: Record<string, number> = {
      low: 1.2,
      moderate: 1.55,
      high: 1.725,
    };
    const tdee = bmr * (multipliers[activityLevel] || 1.55);

    // Goal adjustment
    const goalAdjustments: Record<string, number> = {
      lose: -500, // Deficit for weight loss
      maintain: 0,
      gain: 300, // Surplus for muscle gain
    };

    return Math.round(tdee + (goalAdjustments[goal] || 0));
  }

  async function handleSubmit() {
    const v = validateStep(step);
    if (v) return setError(v);

    if (step < 4) {
      setStep((s) => (s + 1) as Step);
      setError(null);
      return;
    }

    // Final submission
    setError(null);
    setLoading(true);

    const allergies = [
      ...selectedAllergies,
      ...customAllergies.split(",").map((a) => a.trim()).filter(Boolean),
    ].join(",");

    const dailyCalories = calculateDailyCalories();

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: Number(age),
        sex,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel,
        goal,
        dietType,
        allergies: allergies || null,
        dailyCalories,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Failed to save onboarding.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-300 via-emerald-200 to-emerald-100 px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <CardTitle>Onboarding</CardTitle>
                <span className="text-sm text-zinc-600">Step {step} of 4</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "What's your goal?"}
              {step === 3 && "What's your diet preference?"}
              {step === 4 && "Any allergies or dietary restrictions?"}
            </CardDescription>
          </CardHeader>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Age"
                    type="number"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min={13}
                    max={120}
                  />
                  <label className="block">
                    <div className="mb-1 text-sm font-medium text-zinc-900">Sex</div>
                    <select
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Height (cm)"
                    type="number"
                    inputMode="decimal"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    required
                    min={80}
                    max={250}
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    inputMode="decimal"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    required
                    min={25}
                    max={300}
                  />
                </div>

                <label className="block">
                  <div className="mb-1 text-sm font-medium text-zinc-900">Activity Level</div>
                  <select
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="low">Low (sedentary)</option>
                    <option value="moderate">Moderate (light exercise 1-3 days/week)</option>
                    <option value="high">High (moderate to intense exercise 4+ days/week)</option>
                  </select>
                </label>
              </div>
            )}

            {/* Step 2: Goal */}
            {step === 2 && (
              <div className="grid gap-3">
                {[
                  { value: "lose", label: "Lose Weight", emoji: "📉" },
                  { value: "maintain", label: "Maintain Weight", emoji: "⚖️" },
                  { value: "gain", label: "Gain Muscle", emoji: "💪" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGoal(opt.value)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                      goal === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-zinc-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Diet Type */}
            {step === 3 && (
              <div className="grid gap-3">
                {[
                  { value: "balanced", label: "Balanced", emoji: "🥗" },
                  { value: "keto", label: "Keto", emoji: "🥑" },
                  { value: "vegan", label: "Vegan", emoji: "🌱" },
                  { value: "vegetarian", label: "Vegetarian", emoji: "🥕" },
                  { value: "low-carb", label: "Low-Carb", emoji: "🍖" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDietType(opt.value)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                      dietType === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-zinc-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Allergies */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-900">Select Allergies</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ALLERGIES_OPTIONS.map((allergy) => (
                      <label
                        key={allergy}
                        className="flex items-center gap-2 rounded-md border border-zinc-200 p-2 hover:bg-zinc-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAllergies.includes(allergy)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAllergies([...selectedAllergies, allergy]);
                            } else {
                              setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
                            }
                          }}
                          className="rounded border-zinc-300"
                        />
                        <span className="text-sm">{allergy}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Input
                  label="Other allergies or restrictions (comma-separated)"
                  placeholder="e.g., Shellfish, Latex"
                  value={customAllergies}
                  onChange={(e) => setCustomAllergies(e.target.value)}
                />
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setStep((s) => (s - 1) as Step);
                    setError(null);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button type="submit" disabled={loading} className="flex-1">
                {loading
                  ? "Saving..."
                  : step === 4
                    ? "Complete Setup"
                    : "Continue"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
