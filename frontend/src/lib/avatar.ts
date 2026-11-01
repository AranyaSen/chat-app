const AVATAR_TONES = [
  "bg-[#e9e2ff] text-[#5945a4] ring-[#f4f0ff]",
  "bg-[#dcecff] text-[#2b5b83] ring-[#edf6ff]",
  "bg-[#e3f4ed] text-[#2f6b57] ring-[#effaf5]",
  "bg-[#fdeee3] text-[#88582f] ring-[#fff7f0]",
  "bg-[#f1e7f5] text-[#704b82] ring-[#faf3fc]",
  "bg-[#e8eef6] text-[#425b78] ring-[#f4f8fc]",
] as const;

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getAvatarTone(seed: string): (typeof AVATAR_TONES)[number] {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return AVATAR_TONES[hash % AVATAR_TONES.length];
}
