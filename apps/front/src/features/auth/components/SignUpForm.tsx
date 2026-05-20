import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router";
import { passwordRules, registerSchema } from "../validation/Signup.schema";
import { OAuthButtons } from "./OAuthButtons";
import { FormField } from "../../../shared/components/UI/formField/FormField";

type Inputs = {
	email: string;
	password: string;
	confirmPassword: string;
};

export function SignUpForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>({
		resolver: yupResolver(registerSchema),
		mode: "onChange",
	});

	const password = watch("password", "");

	const rules = passwordRules(password);

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		if (data.password === data.confirmPassword) {
			console.log(data);

			//TODOS Request http to backend
			//Code...
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<FormField
				type="input"
				label="Email"
				error={errors.email?.message}
				{...register("email")}
			/>

			<FormField
				type="password"
				label="Mot de passe"
				error={errors.password?.message}
				{...register("password")}
			/>

			<div className="label">
				<span className="label-text-alt text-base-content/70">
					Votre mot de passe doit contenir :
				</span>
			</div>

			<ul className="text-xs text-base-content/70 ml-5">
				<li className={rules.length ? "text-secondary" : "text-base-content/70"}>
					{rules.length ? "✓" : "•"} au moins 8 caractères
				</li>
				<li className={rules.numbers ? "text-secondary" : "text-base-content/70"}>
					{rules.numbers ? "✓" : "•"} au moins 2 chiffres
				</li>
				<li className={rules.specials ? "text-secondary" : "text-base-content/70"}>
					{rules.specials ? "✓" : "•"} au moins 2 caractères spéciaux
				</li>
			</ul>

			<FormField
				type="password"
				label="Confirmation mot de passe"
				error={errors.confirmPassword?.message}
				{...register("confirmPassword")}
			/>

			<button className="btn btn-neutral mt-2 w-full">S'inscrire</button>

			<OAuthButtons />

			<Link to={"/auth/signin"}>
				<p className="flex justify-center">Déjà un compte ?</p>
			</Link>
		</form>
	);
}
