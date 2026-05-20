import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router";
import { OAuthButtons } from "./OAuthButtons";
import { loginSchema } from "../validation/Signin.schema";
import { FormField } from "../../../shared/components/UI/formField/FormField";
import { useSignin } from "../hooks/use_auth.service";
import type { SigninData } from "../types/types";

type Inputs = {
	email: string;
	password: string;
};

export function SignInForm() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Inputs>({
		resolver: yupResolver(loginSchema),
		mode: "onChange",
	});

	const navigate = useNavigate();
	const signin = useSignin()

	const onSubmit = async (data: SigninData) => {
		try {
			
			await signin.mutateAsync(data);
			navigate("/");
		} catch (error) {
			setError("password", {
				message: "Email ou mot de passe incorrect",
			});
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

			<button data-cy="signin-submit" className="btn btn-neutral mt-2 w-full">Se connecter</button>

			<OAuthButtons />

			<Link to={"/auth/signup"}>
				<p className="flex justify-center">Vous n'avez pas de compte ?</p>
			</Link>
		</form>
	);
}
