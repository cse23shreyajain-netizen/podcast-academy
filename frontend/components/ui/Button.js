import Link from "next/link";

const variants = {
  primary: "bg-amber text-ink hover:bg-amber-dark",
  secondary: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-ink/5",
};

export default function Button({
  children, href, variant = "primary", loading = false, className = "", ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if (href) {
    return <Link href={href} className={classes} {...props}>{children}</Link>;
  }
  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {loading ? "Please wait..." : children}
    </button>
  );
}