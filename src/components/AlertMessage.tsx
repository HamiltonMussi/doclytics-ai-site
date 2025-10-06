type AlertMessageProps = {
  message: string;
  variant?: "error" | "success";
};

export const AlertMessage = ({ message, variant = "error" }: AlertMessageProps) => {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-600",
    success: "bg-green-50 border-green-200 text-green-600",
  };

  return (
    <div className={`border-2 px-4 py-3 rounded-xl text-sm font-medium ${styles[variant]}`}>
      {message}
    </div>
  );
};
