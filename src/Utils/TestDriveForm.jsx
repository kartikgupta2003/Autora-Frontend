import React, { useState, useEffect } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Car, CheckCircle2, Loader2 } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "react-toastify";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "@clerk/clerk-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";

const TestDriveForm = ({ car, testDriveInfo }) => {
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [dealerShip, setDealerShip] = useState(null);
    const [existingBookings, setExistingBookings] = useState(null);
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const [userNotes, setUserNotes] = useState("");
    const { getToken } = useAuth();
    const navigate = useNavigate();

    // console.log("existingBookings ", existingBookings);

    // console.log("car ", car);

    useEffect(() => {
        setExistingBookings(testDriveInfo?.userTestDrive);
        setDealerShip(testDriveInfo?.dealerShip);
    }, [testDriveInfo]);

    useEffect(() => {
        // console.log("date jo select hui " , selectedDate);
        if (!selectedDate) {
            return;
        }

        // console.log("date jo select hui " , selectedDate);

        const selectedDayOfWeek = format(selectedDate, "EEEE").toUpperCase();
        const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
        const daysSchedule = car?.testDriveInfo?.dealerShip?.workingHours?.find((schedule) => {
            return schedule.dayOfWeek === selectedDayOfWeek
        });

        // console.log(daysSchedule);

        if (!daysSchedule || !daysSchedule.isOpen) {
            setAvailableTimeSlots([]);
            return;
        }

        const openHour = parseInt(daysSchedule.openTime.split(":")[0]);
        const closeHour = parseInt(daysSchedule.closeTime.split(":")[0]);

        const slots = [];

        for (let hour = openHour; hour < closeHour; hour++) {
            // console.log("hour " , hour);
            const startTime = `${hour.toString().padStart(2, "0")}:00`;
            // this padstart makes the string have the given length by padding it with "0" fro the left 
            // eg -> "5" => "05"
            const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

            // check if this slot is already booked 

            const isBooked = existingBookings?.some((booking) => {
                const bookingDateStr = format(new Date(booking.bookingDate), "yyyy-MM-dd");

                return ((selectedDateStr === bookingDateStr) && (booking.startTime === startTime && booking.endTime === endTime))

            });

            // console.log("isbooked " , isBooked);
            if (!existingBookings) {
                // console.log("ye chala hoga ")
                slots.push({
                    id: `${startTime}-${endTime}`,
                    label: `${startTime}-${endTime}`,
                    startTime,
                    endTime
                });
            }
            else if (!isBooked) {
                slots.push({
                    id: `${startTime}-${endTime}`,
                    label: `${startTime}-${endTime}`,
                    startTime,
                    endTime
                });
            }
        }

        // console.log("all slots " , slots);

        setAvailableTimeSlots(slots);

        // console.log("all slots " , selectedTimeSlot);


    }, [selectedDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("Please select a date for test drive");
        }

        if (!selectedTimeSlot) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("Please select a time slot for test drive");
        }

        // console.log("selected time slot " , selectedTimeSlot)

        try {
            setBookingInProgress(true);
            const token = await getToken();
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            };
            const body = {
                carId: car._id, bookingDate: selectedDate, startTime: (selectedTimeSlot.split("-")[0]), endTime: (selectedTimeSlot.split("-")[1]), notes: userNotes
            }
            const { data } = await axios.post("https://autora-backend.vercel.app/api/test-drive/book", body, config);

            setBookingDetails({
                date: format(data?.bookingDate, "EEEE , MMMM d, yyyy"),
                timeSlot: `${data?.startTime} - ${data?.endTime}`,
                notes: data?.notes
            })

            // console.log(data);

            setShowConfirmation(true);
            setAvailableTimeSlots([]);
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setUserNotes("");
            setBookingInProgress(false);
        } catch (err) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setAvailableTimeSlots([]);
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setUserNotes("");
            setBookingInProgress(false);
            return toast.error(err.response.data.message);
        }
    }

    const isDayDisabled = (day) => {
        // disable past days 
        const startDay = new Date().setHours(0, 0, 0, 0);
        if (day < startDay) {
            return true;
        }

        const dayOfWeek = format(day, "EEEE").toUpperCase();
        // This format returns us day of week 

        // disable days on which autora is closed
        const daysSchedule = car?.testDriveInfo?.dealerShip?.workingHours?.find((schedule) => {
            return schedule.dayOfWeek === dayOfWeek
        });

        return (!daysSchedule || !daysSchedule.isOpen);

    }

    const handleCloseConfirmation = ()=>{
        setShowConfirmation(false);
        navigate(`/cars/${car._id}`)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">Car Details</h2>
                        <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
                            {car.images && car.images.length > 0 ? (
                                <img src={car.images[0].url} className="object-cover w-full h-full"></img>
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Car className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold">{car.year} {car.make} {car.model}</h3>
                        <div className="mt-2 text-xl font-bold text-blue-600">$ {car.price}</div>
                        <div className="mt-4 text-sm text-gray-500">
                            <div className="flex justify-between py-1 border-b">
                                <span>Mileage</span>
                                <span className="font-medium">{car.mileage} km/l</span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                                <span>Fuel Type</span>
                                <span className="font-medium">{car.fuelType}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                                <span>Transmission</span>
                                <span className="font-medium">{car.transmission}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                                <span>Body Type</span>
                                <span className="font-medium">{car.bodyType}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Color</span>
                                <span className="font-medium">{car.color}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="mt-6">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">Dealership Info</h2>
                        <div className="text-sm">
                            <p className="font-medium">{car?.testDriveInfo?.dealerShip?.name}</p>
                            <p className="text-gray-600 mt-1">{car?.testDriveInfo?.dealerShip?.address}</p>
                            <p className="text-gray-600 mt-3">
                                <span className="font-medium">Phone: </span>
                                {car?.testDriveInfo?.dealerShip?.phone}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Email: </span>
                                {car?.testDriveInfo?.dealerShip?.email}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardContent>
                        <h2 className="text-xl font-bold mb-6">Schedule Your Test Drive</h2>
                        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Select a Date
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        {/* asChild use karne ke bad ab PopoverTrigger apna button use nhi karta hai so hum apna khud ka button use kar skte hai */}
                                        <Button variant="outline" className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                            {/* setSelectedDate(date) stores a Date object  to hum usko directly render nhi kar skte */}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            className="rounded-lg border"
                                            disabled={isDayDisabled}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <label className="block tetx-sm font-medium">Select a Time Slot</label>
                                {!selectedDate && <p className="text-red-400">*Please select a date first</p>}
                                <Select
                                    value={selectedTimeSlot}
                                    onValueChange={setSelectedTimeSlot}
                                    disabled={!selectedDate}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={(!selectedDate) ? ("Please select a date first") : ((availableTimeSlots.length === 0) ? ("No available slots on this date") : ("Select a time slot"))} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTimeSlots?.map((slot) => {
                                            return (
                                                <SelectItem key={slot.id} value={slot.id}>
                                                    {slot.label}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Additional Notes (optional)</label>
                                <Textarea placeholder="Any specific questions or requests for your test drive ?" className={"min-h-24"}
                                    value={userNotes}
                                    onChange={(e) => setUserNotes(e.target.value)}></Textarea>
                            </div>
                            <Button type="submit" className={"w-full cursor-pointer"} disabled={bookingInProgress}>
                                {bookingInProgress ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Booking Your Test Drive...
                                    </>
                                ) : (
                                    "Book Test Drive"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500"/>Test Drive Booked Successfully</DialogTitle>
                        <DialogDescription>
                            Your test drive has been confirmed with the following details:
                        </DialogDescription>
                    </DialogHeader>
                    {bookingDetails && (
                        <div className="py-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Car:{" "}</span>
                                    <span>
                                        {car.year} {car.make} {car.model}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Date:{" "}</span>
                                    <span>
                                        {bookingDetails?.date}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Time Slot:{" "}</span>
                                    <span>
                                        {bookingDetails?.timeSlot}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Dealership:{" "}</span>
                                    <span>
                                        {testDriveInfo?.dealerShip?.name}
                                    </span>
                                </div>
                                <div className="mt-4 bg-blue-50 p-3 rounded text-sm text-blue-700">
                                    Please arrive 10 minutes early with your driver's licence.
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button onClick={handleCloseConfirmation}>Done</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TestDriveForm;