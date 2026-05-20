import Home from "./pages/Home";
import { Route, Routes } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Event from "./pages/event/Event";
import { EventDetailsPage } from "./pages/event/EventDetailsPage";
import { PrivateLayout } from "./shared/layout/PrivateLayout";
import PrivateRoute from "./pages/auth/PrivateRoute";
import UnauthorizedPage from "./pages/auth/Unauthorized.page";
import NotFoundPage from "./pages/NotFound.page";
import { VisitorLayout } from "./shared/layout/VisitorLayout";
import SignupPage from "./pages/auth/Signup.page";
import SigninPage from "./pages/auth/Signin.page";
import { AuthLayout } from "./shared/layout/AuthLayout";
import { EventCreationPage } from "./features/event/components/EventCreationPage";
import { Toaster } from "react-hot-toast";
import RoleBasedLayout from "./shared/layout/RoleBasedLayout";
import { useRefreshToken } from "./features/auth/hooks/use_auth.service";
import { SkeletonLoading } from "./shared/components/UI/states/SkeletonLoading";
import { MissionDetailsPage } from "./pages/mission/MissionDetailsPage";
import { SlotDetailsPage } from "./pages/Slot/SlotDetailsPage";

function useAuthBootstrap() {
	return useRefreshToken();
}

function App() {
	const { isLoading } = useAuthBootstrap();

	if (isLoading) return <SkeletonLoading />;

	return (
		<>
			<Toaster />
			<Routes>
				{/* AUTH */}
				<Route element={<AuthLayout />}>
					<Route path="/auth/signup" element={<SignupPage />} />
					<Route path="/auth/signin" element={<SigninPage />} />
				</Route>

				{/* VISITOR - Allow different layout for pages shared by an User with a role and Visitors */}
				<Route
					element={
						<RoleBasedLayout
						layouts={{
							USER: PrivateLayout,
						}}
						fallback={VisitorLayout}
						/>
					}
				>
					<Route path="/" element={<Home />} />
					<Route path="/events/:eventId" element={<EventDetailsPage />} />
				</Route>

				{/* PRIVATE - ONLY USER */}
				<Route element={<PrivateRoute allowedRoles={["USER"]} />}>
					<Route element={<PrivateLayout />}>
						<Route path="/me/events" element={<Event />} />
						<Route path="/events/create" element={<EventCreationPage />} />
						<Route path="/missions/:missionId" element={<MissionDetailsPage />} />
						<Route path="/slots/:slotId" element={<SlotDetailsPage />} />

					</Route>
				</Route>

				{/* OTHER PAGES */}
				<Route path="/unauthorized" element={<UnauthorizedPage />} />
				<Route path="/*" element={<NotFoundPage />} />
			</Routes>
			<ReactQueryDevtools />
		</>
	);
}

export default App;
