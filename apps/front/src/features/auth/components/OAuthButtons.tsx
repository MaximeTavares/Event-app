import { GoogleIcon, FacebookIcon } from "../../../shared/components/UI/icons/icons";

export function OAuthButtons() {
	return (
		<>
			{/* Boutons OAuth */}
			<div className="flex flex-row justify-center mt-4 w-full gap-2">
				{/* Google */}
				<button
					type="button"
					className="btn bg-white text-black border-[#e5e5e5] flex flex-1 items-center justify-center gap-2"
				>
					<GoogleIcon className="size-6" />
					Se connecter avec Google
				</button>

				{/* Facebook */}
				<button
					type="button"
					className="btn bg-[#1A77F2] text-white border-[#005fd8] flex flex-1 items-center justify-center gap-2 "
				>
					<FacebookIcon className="size-6" />
					Se connecter avec Facebook
				</button>
			</div>
		</>
	);
}
