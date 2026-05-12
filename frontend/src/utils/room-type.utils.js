import i18n from "@/i18n";
import { Star, BedDouble, ShieldPlus, BookOpen } from "lucide-react";

export const getRoomType = (type) => {
  const roomType = String(type || "").toLowerCase();

  let variant;
  switch (roomType) {
    case "premium":
      variant = "info";
      break;
    case "medical":
      variant = "error";
      break;
    case "studying":
      variant = "warning";
      break;
    case "regular":
    default:
      variant = "default";
  }

  let Icon;
  switch (roomType) {
    case "premium":
      Icon = Star;
      break;
    case "medical":
      Icon = ShieldPlus;
      break;
    case "studying":
      Icon = BookOpen;
      break;
    case "regular":
    default:
      Icon = BedDouble;
  }

  const label = i18n.t(`rooms:room_type.${roomType}`);

  return { roomType, label, variant, Icon };
};