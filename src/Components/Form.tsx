import React from "react";

type FormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Form content: inputs, buttons, etc. */
  children: React.ReactNode;
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
