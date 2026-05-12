import hu_logo from "@/assets/logos/HU_for_dark_screen.png";
import hnu_logo from "@/assets/logos/HNU_for_dark_screen.png";
import hitu_logo from "@/assets/logos/HITU_for_dark_screen.png";
import udorm_logo from "@/assets/logos/white_UDORM_logo.png";
import ict_logo from "@/assets/logos/CICT.png";
import FloatingLogoBubble from '../../ui/FloatingLogoBubble';

const FloatingLogoBlob = () => {
  return (
    <>
      <FloatingLogoBubble
        image={hnu_logo}
        alt="HIU Logo"
        position="top-10 left-10"
        duration={6}
        size="w-40 h-40"
        imgSize="w-22 h-22"
      />

      <FloatingLogoBubble
        image={hu_logo}
        alt="HU Logo"
        position="top-1/5 right-20"
        duration={7}
      />

      <FloatingLogoBubble
        image={hitu_logo}
        alt="HIUT Logo"
        position="bottom-15 left-1/4"
        duration={5.5}
      />

      <FloatingLogoBubble
        image={udorm_logo}
        alt="UDORM Logo"
        position="bottom-10 right-30"
        duration={6.5}
        size="w-40 h-40"
        imgSize="w-22 h-22"
      />

      <FloatingLogoBubble
        image={ict_logo}
        alt="ICT Logo"
        position="top-10 left-2/5"
        size="w-40 h-40"
        imgSize="w-22 h-22"
        duration={7.2}
      />
    </>
  )
}

export default FloatingLogoBlob;
