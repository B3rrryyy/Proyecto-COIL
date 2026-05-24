import { type HTMLAttributes } from "react";

type CardVariant = "default" | "flat" | "outlined" | "dark";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  border?: boolean;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  border?: boolean;
}

const VARIANTS: Record<CardVariant, string> = {
  default: "bg-white border border-gray-100 shadow-sm",
  flat: "bg-gray-50 border border-gray-100",
  outlined: "bg-white border border-gray-200",
  dark: "bg-[#0F1623] border border-white/10 text-white",
};

const PADDINGS = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "none",
  hoverable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-xl transition-shadow duration-150",
        VARIANTS[variant],
        PADDINGS[padding],
        hoverable ? "hover:shadow-md cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  border = true,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={[
        "flex items-center justify-between px-5 py-3.5",
        border ? "border-b border-gray-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div>
        <p className="text-[13px] font-semibold text-gray-800">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-gray-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardBody({
  padding = "md",
  className = "",
  children,
  ...props
}: { padding?: "none" | "sm" | "md" | "lg" } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[PADDINGS[padding], className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  border = true,
  className = "",
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={[
        "px-5 py-3",
        border ? "border-t border-gray-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;