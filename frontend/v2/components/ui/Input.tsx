import { type InputHTMLAttributes, forwardRef } from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  inputSize?: InputSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const SIZES: Record<InputSize, { wrapper: string; input: string; icon: string }> = {
  sm: { wrapper: "h-8", input: "text-[12px]", icon: "px-2.5" },
  md: { wrapper: "h-9", input: "text-[13px]", icon: "px-3" },
  lg: { wrapper: "h-11", input: "text-[14px]", icon: "px-3.5" },
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      inputSize = "md",
      iconLeft,
      iconRight,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const sz = SIZES[inputSize];
    const hasError = Boolean(error);

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-medium text-gray-600"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-400">*</span>
            )}
          </label>
        )}

        <div className={`relative flex items-center ${sz.wrapper} ${fullWidth ? "w-full" : ""}`}>
          {iconLeft && (
            <span className={`absolute left-0 flex items-center ${sz.icon} text-gray-400`}>
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              "h-full w-full rounded-md border bg-white outline-none ring-0 transition-all duration-150 placeholder-gray-300",
              sz.input,
              iconLeft ? "pl-9" : sz.icon,
              iconRight ? "pr-9" : sz.icon,
              hasError
                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 text-red-700"
                : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-gray-900",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {iconRight && (
            <span className={`absolute right-0 flex items-center ${sz.icon} text-gray-400`}>
              {iconRight}
            </span>
          )}
        </div>

        {(error || hint) && (
          <p
            className={`text-[11px] leading-snug ${
              hasError ? "text-red-500" : "text-gray-400"
            }`}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;