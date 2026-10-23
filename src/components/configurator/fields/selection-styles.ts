// Shared look of every selectable option (cards, tiles, pills): a brighter border and a soft fill when selected.
// No glow: selection reads through the border and the filled icon, like the rest of the site.
export const SELECTED_CLASSES = "border-white/70 bg-white/[0.07]";
export const UNSELECTED_CLASSES =
  "border-white/12 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]";
export const OPTION_TRANSITION =
  "cursor-pointer transition-colors duration-200 ease-out";

export const optionClasses = (selected: boolean) =>
  `${OPTION_TRANSITION} ${selected ? SELECTED_CLASSES : UNSELECTED_CLASSES}`;

// The square that holds an option's icon: it fills white when the option is selected.
export const iconBoxClasses = (selected: boolean) =>
  `flex flex-none items-center justify-center rounded-lg border transition-colors duration-200 ${
    selected
      ? "border-white bg-white text-black"
      : "border-white/12 bg-white/[0.05] text-white"
  }`;
