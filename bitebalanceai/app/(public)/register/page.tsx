"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { PasswordStrength } from "@/components/ui/PasswordStrength";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);

  // Step 1
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Step 2
  const [address, setAddress] = React.useState("");
  const [cityCountry, setCityCountry] = React.useState("");
  const [age, setAge] = React.useState("25");
  const [gender, setGender] = React.useState("");
  const [heightCm, setHeightCm] = React.useState("170");
  const [weightKg, setWeightKg] = React.useState("65");
  const [activityLevel, setActivityLevel] = React.useState("sedentary");
  const [goal, setGoal] = React.useState("lose");

  // Step 3
  const [dietaryPreference, setDietaryPreference] = React.useState("");
  const [allergies, setAllergies] = React.useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = React.useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const allergyOptions = [
    "Milk/Dairy",
    "Soy",
    "Eggs",
    "MSG",
    "Fish",
    "Coconut",
    "Shellfish",
    "Sesame",
    "Treenuts",
    "Peanuts",
    "Wheat/Gluten",
  ];

  function nextStep() {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) return setError("Full name is required.");
      if (!username.trim()) return setError("Username is required.");
      if (!email.trim()) return setError("Email is required.");
      if (password.length < 8) return setError("Password must be at least 8 characters.");
      if (password !== confirmPassword) return setError("Passwords do not match.");
    }
    if (step === 2) {
      if (!address.trim()) return setError("Address is required.");
      if (!cityCountry.trim()) return setError("City, Country is required.");
      const a = Number(age);
      const h = Number(heightCm);
      const w = Number(weightKg);
      if (!Number.isFinite(a) || a < 13 || a > 120) return setError("Age must be 13–120.");
      if (!gender) return setError("Gender is required.");
      if (!Number.isFinite(h) || h < 80 || h > 250) return setError("Height must be 80–250 cm.");
      if (!Number.isFinite(w) || w < 25 || w > 300) return setError("Weight must be 25–300 kg.");
      if (!activityLevel) return setError("Activity level is required.");
      if (!goal) return setError("Goal is required.");
    }
    setStep((s) => (s === 1 ? 2 : 3));
  }

  function backStep() {
    setError(null);
    setStep((s) => (s === 3 ? 2 : 1));
  }

  async function finish() {
    setError(null);
    setLoading(true);

    const allergiesCombined = [...allergies, otherAllergy.trim()].filter(Boolean).join(", ");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        username,
        email,
        password,
        confirmPassword,
        address,
        cityCountry,
        age: Number(age),
        gender,
        sex: gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel,
        goal,
        dietaryPreference,
        dietType: dietaryPreference,
        allergies: allergiesCombined,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      // Prefer JSON error, but fall back to raw text so we can see Vercel/Prisma errors.
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? `Failed to register (HTTP ${res.status}).`);
      } else {
        const t = await res.text().catch(() => "");
        setError(t ? `Failed to register (HTTP ${res.status}): ${t}` : `Failed to register (HTTP ${res.status}).`);
      }
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!signInRes || signInRes.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-300 via-emerald-200 to-emerald-100 px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-4xl font-bold tracking-tight text-emerald-900">
          Bite Balance
        </h1>

        <div className="rounded-[32px] bg-lime-100/90 p-8 shadow-xl shadow-emerald-300/40">
          <div className="mb-3 text-center">
            <div className="text-lg font-bold text-emerald-900">Create Account</div>
            <div className="text-xs text-emerald-800/80">Step {step}: {step === 1 ? "Account Info" : step === 2 ? "Personal Details" : "Preferences"}</div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-emerald-900">Step 1: Account Info</div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <div className="space-y-2">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                />
                <PasswordStrength password={password} />
              </div>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-emerald-900">Step 2: Personal Details</div>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="text"
                placeholder="City, Country"
                value={cityCountry}
                onChange={(e) => setCityCountry(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Gender (Select)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="moderate">Moderate</option>
                <option value="high">Active</option>
              </select>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Gain Muscle</option>
              </select>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-emerald-900">Step 3: Preferences</div>
              <input
                type="text"
                placeholder="Dietary Preference (e.g. Keto, Vegan, None)"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
              <div className="text-xs font-semibold text-emerald-900">Allergies: Check all that apply</div>
              <div className="grid grid-cols-2 gap-2">
                {allergyOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-emerald-900 shadow-inner">
                    <input
                      type="checkbox"
                      checked={allergies.includes(opt)}
                      onChange={(e) => {
                        if (e.target.checked) setAllergies((a) => [...a, opt]);
                        else setAllergies((a) => a.filter((x) => x !== opt));
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                placeholder="Other: Please specify"
                value={otherAllergy}
                onChange={(e) => setOtherAllergy(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white px-4 text-sm text-emerald-900 shadow-inner outline-none placeholder:text-emerald-400 focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 text-center text-xs font-medium text-red-600">{error}</div>
          ) : null}

          <div className="mt-6 flex gap-2">
            {step === 1 ? (
              <Button variant="secondary" type="button" className="flex-1" onClick={() => router.push("/login")}>
                Cancel
              </Button>
            ) : (
              <Button variant="secondary" type="button" className="flex-1" onClick={backStep}>
                Back
              </Button>
            )}

            {step < 3 ? (
              <Button type="button" className="flex-1" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="button" className="flex-1" disabled={loading} onClick={finish}>
                {loading ? "Creating..." : "Finish"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

