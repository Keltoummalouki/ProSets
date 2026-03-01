interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

export function GlassInput({ label, icon, className = '', ...props }: GlassInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.35)] block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <i className={`${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(240,240,240,0.2)] text-xs`} />
        )}
        <input
          className={`w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[3px] text-[#f0f0f0] text-[12px] font-[family-name:var(--font-jetbrains)] placeholder-[rgba(240,240,240,0.2)] focus:outline-none focus:border-[rgba(0,255,255,0.4)] focus:shadow-[0_0_20px_rgba(0,255,255,0.08)] transition-all duration-200 ${icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5'} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function GlassTextarea({ label, className = '', ...props }: GlassTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.35)] block">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[3px] text-[#f0f0f0] text-[12px] font-[family-name:var(--font-jetbrains)] placeholder-[rgba(240,240,240,0.2)] focus:outline-none focus:border-[rgba(0,255,255,0.4)] focus:shadow-[0_0_20px_rgba(0,255,255,0.08)] transition-all duration-200 px-4 py-2.5 resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export function GlassSelect({ label, options, className = '', ...props }: GlassSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.35)] block">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[3px] text-[#f0f0f0] text-[12px] font-[family-name:var(--font-jetbrains)] focus:outline-none focus:border-[rgba(0,255,255,0.4)] focus:shadow-[0_0_20px_rgba(0,255,255,0.08)] transition-all duration-200 px-4 py-2.5 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0a0a0a]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
