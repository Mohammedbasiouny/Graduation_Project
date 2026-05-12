import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { showToast } from "@/utils/toast.util";
import { useTranslation } from "react-i18next";

const CopyText = ({ text, children, styled = false }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Modern browsers
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for insecure contexts (mobile HTTP)
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      showToast("success", t("success_copied"), 1500);
      setTimeout(() => setCopied(false), 800);
    } catch (err) {
      showToast("error", t("failed_copied"));
      console.error("Failed to copy text:", err);
    }
  };

  const Icon = copied ? Check : Copy;

  if (!styled) {
    return (
      <button
        onClick={handleCopy}
        className="group relative flex items-center gap-2 transition"
        title={copied ? t("copied") : t("copy")}
      >
        {children}
        <Icon
          size={16}
          className={`${
            copied
              ? "text-(--green-dark) opacity-100"
              : "text-(--gray-dark) opacity-0 group-hover:opacity-100"
          } transition-opacity duration-200 cursor-pointer`}
        />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-(--gray-lightest) border border-(--gray-light) rounded-[10px] p-3 hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition">
      <div className="flex-1 text-(--gray-dark) text-sm">{children}</div>
      <button
        onClick={handleCopy}
        className="p-2 rounded-[10px] hover:bg-(--gray-light) transition"
        title={copied ? t("copied") : t("copy")}
      >
        <Icon
          size={18}
          className={`${
            copied ? "text-(--green-dark)" : "text-(--gray-dark)"
          } transition-colors cursor-pointer`}
        />
      </button>
    </div>
  );
};

export default CopyText;
