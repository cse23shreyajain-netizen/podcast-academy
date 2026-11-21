const styles = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
};

export default function Alert({ type = "error", children }) {
  if (!children) return null;
  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}