import React from "react";
import "./Form.css";

type FormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Form content: inputs, buttons, etc. */
  children: React.ReactNode;
  /** Additional class names; `.dashboard-form` is the common dashboard style */
  className?: string;
};

export const Form: React.FC<FormProps> = ({ onSubmit, children, className }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};
