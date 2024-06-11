import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Angler } from "@/types/Angler";

export default async function createAccount({
	user,
}: {
	user: Angler;
}) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local/register`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: user.email,
				email: user.email,
				password: user.password,
			}),
		}
	);

	const userData = await response.json();

	if (userData.error) {
		toast.error(userData.error.message);
		return;
	}

	// create angler profile
	const profileResponse = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/anglers`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${userData.jwt}`,
			},
			body: anglerAsFormData(user),
		}
	);

	const profileData = await profileResponse.json();

	if (profileData.error) {
		toast.error(profileData.error.message);
		return;
	}

	toast.success("Account created successfully");

	// log the user in
	await signIn("credentials", {
		redirect: false,
		identifier: user.email,
		password: user.password,
	});

	window.location.href = "/profile";
}

function anglerAsFormData(user: {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: any;
    location: string;
}) {
    const formData = new FormData();

    formData.append("data", JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
    }));

    if (user.profilePicture) {
        formData.append("files.profilePicture", user.profilePicture);
    }

    return formData;
}