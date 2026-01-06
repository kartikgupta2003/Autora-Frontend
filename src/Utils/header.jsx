import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Heart, CarFront, Layout, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";


const Header = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { isSignedIn, user } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);

    const isAdminPage = location.pathname.startsWith("/admin");

    useEffect(() => {
        const authUser = async () => {
            // console.log("user hai ", user);
            const name = user?.fullName;
            const email = user?.emailAddresses[0]?.emailAddress;
            const clerkUserId = user?.id;
            const imageUrl = user?.imageUrl;

            const body = {
                name,
                email,
                clerkUserId,
                imageUrl
            }

            try {
                const token = await getToken();

                // console.log("secret " , token);
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                };

                const { data } = await axios.post("http://localhost:8000/api/authMe/addUser", body, config);

                // console.log("data aya hai " , data);

                if (data.role === "ADMIN") {
                    setIsAdmin(true);
                }

                // console.log(data);
            } catch (err) {
                console.log(err);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.response.data.message);
            }

        }

        if (isSignedIn) {
            authUser();
        }
    }, [isSignedIn]);


    return (
        <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
            <nav className="mx-auto px-2 flex items-center justify-between">
                <img onClick={() => { isAdminPage ? navigate("/admin") : navigate("/") }
                } src="/Autora Logo.png" alt="Autora Logo" className="h-20 w-auto object-contain cursor-pointer"
                ></img>
                {isAdminPage && (
                    <span
                        onClick={() => { isAdminPage ? navigate("/admin") : navigate("/") }
                        } className="text-s font-bold cursor-pointer">Admin Portal</span>
                )}
                {isAdminPage ? (
                    <Button variant="outline" className="cursor-pointer flex items-center gap-2" onClick={() => navigate("/")}>
                        <ArrowLeft size={18} />
                        {/* {Renders an icon from lucide-react (used by Shadcn UI). size={18} sets the icon size to 18px. */}
                        <span>Back to App</span>
                        {/* Shows the text Saved Cars only on medium (md) and larger screens. Hidden on small screens. */}
                    </Button>
                ) : (
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <Button className="cursor-pointer" onClick={() => navigate("/saved-cars")}>
                                <Heart size={18} />
                                {/* {Renders an icon from lucide-react (used by Shadcn UI). size={18} sets the icon size to 18px. */}
                                <span className="hidden md:inline">Saved Cars</span>
                                {/* Shows the text Saved Cars only on medium (md) and larger screens. Hidden on small screens. */}
                            </Button>
                            {!isAdmin ? (
                                <Button className="cursor-pointer" variant="outline" onClick={() => navigate("/reservations")}>
                                    <CarFront size={18} />
                                    {/* {Renders an icon from lucide-react (used by Shadcn UI). size={18} sets the icon size to 18px. */}
                                    <span className="hidden md:inline">Reservations</span>
                                    {/* Shows the text Saved Cars only on medium (md) and larger screens. Hidden on small screens. */}
                                </Button>
                            ) : (
                                <Button className="cursor-pointer" variant="outline" onClick={() => navigate("/admin")}>
                                    <Layout size={18} />
                                    {/* {Renders an icon from lucide-react (used by Shadcn UI). size={18} sets the icon size to 18px. */}
                                    <span className="hidden md:inline">Admin Portal</span>
                                    {/* Shows the text Saved Cars only on medium (md) and larger screens. Hidden on small screens. */}
                                </Button>
                            )}


                        </SignedIn>
                        <SignedOut>
                            <SignInButton forceRedirectUrl="/">
                                {/* forceRedirectUrl="/" tells Clerk where to send the user after they successfully sign in or sign up. */}
                                <Button variant="outline" className={"cursor-pointer"}>Login</Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton></UserButton>
                        </SignedIn>

                    </div>
                )}
            </nav>
        </header>
    )
}

export default Header;