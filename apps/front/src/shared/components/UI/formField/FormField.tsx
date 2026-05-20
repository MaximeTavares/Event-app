import type React from "react";

type FieldElement = "input" | "textarea" | "select";

type FormFieldProps = {
	as?: FieldElement;
	label?: string;
	error?: string;
	type?: React.HTMLInputTypeAttribute;
	children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
	React.TextareaHTMLAttributes<HTMLTextAreaElement> &
	React.SelectHTMLAttributes<HTMLSelectElement>;

export function FormField({
	as = "input",
	label,
	error,
	type = "text",
	children,
	...props
}: FormFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<label className="label p-1">{label}</label>

			{as === "textarea" && (
				<textarea
					className={`textarea w-full ${error ? "textarea-error" : ""}`}
					placeholder={label}
					{...props}
				/>
			)}

			{as === "select" && (
				<select className={`select w-full ${error ? "select-error" : ""}`} {...props}>
					{children}
				</select>
			)}

			{as === "input" && (
				<input
					type={type}
					className={`input w-full ${error ? "input-error" : ""}`}
					placeholder={label}
					{...props}
				/>
			)}

			{error && <p className="text-error text-sm">{error}</p>}
		</div>
	);
}
