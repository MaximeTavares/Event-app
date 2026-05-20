import type { ReactNode } from "react";

interface FormLayoutProps {
	title: string;
	children: ReactNode;
}

export function FormLayout({ title, children }: Readonly<FormLayoutProps>) {
	return (
		<div className="flex justify-center items-center p-6">
			<div className="w-full max-w-3xl">
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 flex flex-col gap-4">
					<h1 className="flex justify-center text-primary text-3xl font-bold">{title}</h1>
					{children}
				</fieldset>
			</div>
		</div>
	);
}
