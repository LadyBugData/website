'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 cursor-pointer font-display';
  
  const variants = {
    primary: 'bg-ladybug-crimson text-white hover:bg-red-700 active:scale-95 shadow-md',
    secondary: 'bg-ladybug-dark text-white hover:bg-slate-900 active:scale-95 shadow-md',
    outline: 'border-2 border-ladybug-dark text-ladybug-dark hover:bg-ladybug-dark hover:text-white active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
