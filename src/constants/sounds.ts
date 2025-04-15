import type { Sound } from "@/types";

export const soundsLibary: Sound[] = [
  {
    id: "Rain",
    name: "Rain",
    source: require("@/assets/sounds/rain.mp3"),
    category: "nature",
  },
  {
    id: "florest",
    name: "Florest",
    source: require("@/assets/sounds/rain-florest.mp3"),
    category: "nature",
  },
]