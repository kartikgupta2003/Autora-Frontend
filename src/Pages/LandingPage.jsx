import React , {useState , useEffect} from "react";
import HomeSearch from "./HomeSearch";
import { Button } from "../components/ui/button";
import { Car, ChevronRight, Calendar, Shield } from "lucide-react";
// import { featuredCars } from "../lib/data";
import { carMakes, bodyTypes, faqItems } from "../lib/data";
import CarCard from "../Utils/CarCard";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";


const LandingPage = () => {
    const navigate = useNavigate();
    const [featuredCars , setFeaturedCars] = useState([]);
    const { getToken } = useAuth();


    useEffect(()=>{

        const fetchFeaturedCars = async()=>{
            try{
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/fetchCars` , config);

                setFeaturedCars(data);
            }catch(err){
                return toast.error(err.response.data.message);
            }
        }

        fetchFeaturedCars();

    } , []);

    return (
        <div className="pt-20 flex flex-col">
            {/* Hero */}
            <section className="relative py-16 md:py-28 dotted-background">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-8xl mb-4 text-white">Find your Dream Car with Autora</h1>
                        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">Advanced AI Car Search and test drive from thousands of vehicles.</p>
                    </div>
                    {/* Seacrh  */}
                    <HomeSearch />
                </div>
            </section>
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Featured Cars</h2>
                        <Button variant="ghost"
                            className="cursor-pointer flex items-center"
                            onClick={() => navigate("/cars")}>View All
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCars.map((car) => {
                            return <CarCard key={car._id} car={car} />
                        })}
                    </div>
                </div>
            </section>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Browse by Make</h2>
                        <Button variant="ghost"
                            className="cursor-pointer flex items-center"
                            onClick={() => navigate("/cars")}>View All
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {carMakes.map((make) => {
                            return (
                                <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
                                    key={make.id}
                                    onClick={() => navigate(`/cars?make=${make.name}`)}>
                                    <div className="h-auto w-auto mx-auto mb-2 relative">
                                        <img src={make.image} alt={make.name} style={{ objectFit: "contain" }} />
                                    </div>
                                    {/* <h3 className="mt-2 font-medium">{make.name}</h3> */}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Browse by Body type</h2>
                        <Button variant="ghost"
                            className="cursor-pointer flex items-center"
                            onClick={() => navigate("/cars")}>View All
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bodyTypes.map((type) => {
                            return (
                                <div className="relative group cursor-pointer"
                                    key={type.id}
                                    onClick={() => navigate(`/cars?bodyType=${type.name}`)}>
                                    <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                                        <img src={type.image} alt={type.name} className="object-cover group-hover:scale-105 transition duration-300" />
                                        {/* object-fit: cover ->  Image zooms in slightly to fill the box Some edges may be cut off If the container’s aspect ratio is different, some part of the image will be cropped.*/}
                                        {/* object-fit: contain -> Whole image is visible May leave blank space above/below or left/right The image is scaled to fit inside the container without cropping.*/}
                                    </div>
                                    <h3 className="mt-2 font-medium">{type.name}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12">Why choose our platform ?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Car className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
                            <p className="text-gray-600 ">Thousands of verified vehicles from trusted dealerships and private sellers.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Calendar className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
                            <p className="text-gray-600 ">Book a test drive online in minutes , with flexible scheduling options.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Secure Process</h3>
                            <p className="text-gray-600 ">Verified listings and secure booking process for peace of mind.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                    >
                        {faqItems.map((faq , idx) => {
                            return (
                                <AccordionItem key={idx} value={`item-${idx}`}>
                                    <AccordionTrigger className="cursor-pointer">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">
                                        <p>
                                           {faq.answer}
                                        </p>
                                        
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}

                    </Accordion>
                </div>
            </section>
            <section className="py-16 dotted-background text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Car ?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who found their perfect 
                        vehicle through our platform.
                    </p>
                </div>
            </section>
            <footer className='bg-blue-50 py-12'>
          <div className='container mx-auto px-4 text-center text-gray-600'>
            <p>Made with ❤️ by Kartik</p>
          </div>
        </footer>
        </div>
    )
}

export default LandingPage;