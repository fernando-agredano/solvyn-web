// Shared look of every selectable option (cards, pills, rows): brighter border and fill when selected.
export const SELECTED_CLASSES = "border-white/85 bg-white/8 shadow-[0_0_24px_rgba(255,255,255,0.08)]";
export const UNSELECTED_CLASSES = "border-white/12 bg-white/[0.015] hover:border-white/40";
export const OPTION_TRANSITION = "cursor-pointer transition duration-200 ease-[ease]";

export const optionClasses = (selected: boolean) =>
  `${OPTION_TRANSITION} ${selected ? SELECTED_CLASSES : UNSELECTED_CLASSES}`;
