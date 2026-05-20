import { useNavigate } from "react-router";
import Button from "../../shared/components/UI/Button";

export default function Event() {
	const navigate = useNavigate();
	return (
		<div>
			<Button data-cy="create-event" onClick={() => navigate("/events/create")}>Créer un évènement</Button>

		</div>
	);
}
