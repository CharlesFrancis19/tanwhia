// src/components/CharacterSprite.jsx
export default function CharacterSprite({ mood = "neutral", speaking = false }) {
  const SPRITES = {
    speaking: "/char-speaking.png",
    happy: "/char-happy.png",
    neutral: "/char-neutral.png",
    sad: "/char-sad.png",
  };
  const src = speaking ? SPRITES.speaking : (SPRITES[mood] ?? SPRITES.neutral);

  return (
    
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <img
        src={src}
        alt="Character"
        className="
          h-[100vh] w-auto           
          object-contain
          max-w-none                 /* avoid squeezing due to parent width */
          "
        draggable={false}
      />
    </div>
  );
}
