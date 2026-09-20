import { LOGO_SVG_PATH, SITE_NAME } from "@/lib/site";

export default function SiteLogo({
  className = "h-10 w-10",
}: {
  className?: string;
}) {
  return (
    <img
      src={LOGO_SVG_PATH}
      alt={SITE_NAME}
      width={40}
      height={40}
      className={`shrink-0 ${className}`}
    />
  );
}
