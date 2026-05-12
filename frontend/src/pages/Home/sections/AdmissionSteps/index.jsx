import Heading from "@/components/ui/Heading";
import { useMousePosition } from "@/hooks/use-mouse-position.hook";
import {
  GraduationCap,
  UserPlus,
  Key,
  LogIn,
  Calendar,
  FileEdit,
  CheckSquare,
  Eye,
  Goal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdmissionStepCard from "./AdmissionStepCard";
import ZigzagTimeline from "./ZigzagTimeline";

export default function AdmissionSteps() {
  const { t } = useTranslation();
  const { position: mousePos, handleMouseMove } = useMousePosition();

  const steps = [
    { title: t("home:admission_steps_section.steps.choose_uni.title"), description: t("home:admission_steps_section.steps.choose_uni.description"), icon: GraduationCap },
    { title: t("home:admission_steps_section.steps.signup.title"), description: t("home:admission_steps_section.steps.signup.description"), icon: UserPlus },
    { title: t("home:admission_steps_section.steps.Verify.title"), description: t("home:admission_steps_section.steps.Verify.description"), icon: Key },
    { title: t("home:admission_steps_section.steps.login.title"), description: t("home:admission_steps_section.steps.login.description"), icon: LogIn },
    { title: t("home:admission_steps_section.steps.dates.title"), description: t("home:admission_steps_section.steps.dates.description"), icon: Calendar },
    { title: t("home:admission_steps_section.steps.application.title"), description: t("home:admission_steps_section.steps.application.description"), icon: FileEdit },
    { title: t("home:admission_steps_section.steps.requirements.title"), description: t("home:admission_steps_section.steps.requirements.description"), icon: CheckSquare },
    { title: t("home:admission_steps_section.steps.follow.title"), description: t("home:admission_steps_section.steps.follow.description"), icon: Eye },
    { title: t("home:admission_steps_section.steps.result.title"), description: t("home:admission_steps_section.steps.result.description"), icon: Goal },
  ];

  return (
    <section
      id="apply-process"
      className="relative w-full overflow-hidden py-16"
      onMouseMove={handleMouseMove}
      style={{ background: "linear-gradient(135deg, #0d1b2a, #07101c 80%)" }}
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Animated gradient layer */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-indigo-600/10 animate-gradient-slow" />

      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.18), transparent 70%)`,
        }}
      />

      {/* Glowing blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>

      {/* Header */}
      <Heading
        title={t("home:admission_steps_section.heading.title")}
        subtitle={t("home:admission_steps_section.heading.subtitle")}
        color="#ffffff"
        subtitleColor="#a0aec0"
      />

      <div className="relative max-w-4xl mx-auto px-4 mt-16">
        <ZigzagTimeline />
        
        {/* Steps */}
        <div className="relative z-10 space-y-15">
          {steps.map((step, index) => (
            <AdmissionStepCard
              key={index}
              index={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
