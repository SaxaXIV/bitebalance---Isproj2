export function emitMealLogged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("mealLogged"));
}

export function onMealLogged(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  const listener = () => handler();
  window.addEventListener("mealLogged", listener);
  return () => window.removeEventListener("mealLogged", listener);
}

