import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { CarIcon, Eye, Loader2, MoreHorizontal, Plus, Search, Star, StarOff, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

const CarsList = ({ index, setIndex }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [loadingCars, setLoadingCars] = useState(false);
    const [carsData, setCarsData] = useState(null);
    const { getToken } = useAuth();
    const [carToDelete, setCarToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingCar, setDeletingCar] = useState(false);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoadingCars(true);
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.get(`https://autora-backend.vercel.app/api/car/fetch?search=${search}`, config);

                // console.log("car jo ayi hai ", data);
                setCarsData(data);

                setLoadingCars(false);

            } catch (err) {
                setLoadingCars(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.response.data.message);
            }
        }

        fetchCars();
    }, [search]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(search);
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        if (status === "AVAILABLE") {
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>
            )
        }
        else if (status === "UNAVAILABLE") {
            return (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Unavailable</Badge>
            )
        }
        else if (status === "SOLD") {
            return (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sold</Badge>
            )
        }
        else {
            return (
                <Badge variant="outline">{status}</Badge>
            )
        }
    }

    const handleToggleFeatured = async (id, featured) => {
        try {
            const body = {
                id,
                featured
            }
            const token = await getToken();
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            };
            await axios.post("https://autora-backend.vercel.app/api/car/update", body, config);

            setCarsData((prev) => {
                const newArr = prev.map((car) => {
                    if (car._id === id) {
                        car.featured = featured;
                        return car;
                    }
                    return car;
                })
                return newArr
            })
        } catch (err) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("Failed to update");
        }
    }

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const body = {
                id,
                status: newStatus
            }
            const token = await getToken();
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            };
            await axios.post("https://autora-backend.vercel.app/api/car/update", body, config);

            setCarsData((prev) => {
                const newArr = prev.map((car) => {
                    if (car._id === id) {
                        car.status = newStatus;
                        return car;
                    }
                    return car;
                })
                return newArr
            })
        } catch (err) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("Failed to update");
        }
    }

    const handleDeleteCar = async () => {
        // console.log(carToDelete);
        if (!carToDelete) return;

        // console.log(carToDelete);
        setDeletingCar(true);
        try {
            const token = await getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            await axios.delete(`https://autora-backend.vercel.app/api/car/delete/${carToDelete._id}`, config);

            setCarsData((prev) => {
                const newArr = prev.filter((car) => {
                    return (car._id !== carToDelete._id);
                })
                return newArr
            });
            // console.log("delete ho gya")
            setDeleteDialogOpen(false);
            setCarToDelete(null);
            setDeletingCar(false);
        } catch (err) {
            setDeletingCar(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("Failed to delete");
        }
    }

    return (
        <div className="space-y-4 pb-20">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <Button
                    className="cursor-pointer flex items-center z-50"
                    onClick={() =>
                        setIndex(4)
                    }><Plus className="h-4 w-4" />Add Car</Button>
                <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input className="pl-9 w-full sm:w-60"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="search"
                            placeholder="search cars..." />
                    </div>
                </form>
            </div>

            {/* Cars Table */}
            <Card>
                <CardContent className="p-0">
                    {(loadingCars) ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <div>
                            {(carsData && carsData.length > 0) ? (<div className="overflow-x-auto">
                                {/* Automatically enable horizontal scrolling (x-axis scroll) when content overflows */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead>Make & Model</TableHead>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Featured</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {carsData.map((car, idx) => {
                                            return (<TableRow key={idx}>
                                                <TableCell className="w-10 h-10 rounded-md overflow-hidden">
                                                    {(car.images && car.images.length > 0) ? (
                                                        <img src={car.images[0].url}
                                                            alt={`${car.make} ${car.model}`}
                                                            height={40}
                                                            width={40}
                                                            className="w-full h-full object-cover"></img>
                                                    ) : (<div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <CarIcon className="h-6 w-6 text-gray-400" />
                                                    </div>)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {car.make} {car.model}
                                                </TableCell>
                                                <TableCell>{car.year}</TableCell>
                                                <TableCell>{formatCurrency(parseFloat(car.price.$numberDecimal))}</TableCell>
                                                <TableCell>{getStatusBadge(car.status)}</TableCell>

                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-0 h-9 w-9 cursor-pointer"
                                                        onClick={() =>
                                                            handleToggleFeatured(car._id, (!car.featured))}>
                                                        {car.featured ? (
                                                            <Star className="h-5 w-5 text-amber-500 fill-amber-500 "></Star>
                                                        ) : (
                                                            <StarOff className="h-5 w-5 text-gray-400"></StarOff>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="p-0 h-8  w-8">
                                                                <MoreHorizontal className="h-4 w-4"></MoreHorizontal>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => navigate(`/cars/${car._id}`)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(car._id, "AVAILABLE")} disabled={car.status === "AVAILABLE"}>Set Available</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(car._id, "UNAVAILABLE")} disabled={car.status === "UNAVAILABLE"}>set Unavailable</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(car._id, "SOLD")} disabled={car.status === "SOLD"}>Mark as Sold</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 cursor-pointer"
                                                                onClick={() => {
                                                                    setCarToDelete(car)
                                                                    setDeleteDialogOpen(true)
                                                                }}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>)
                                        })}
                                    </TableBody>
                                </Table>

                            </div>) : (<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <CarIcon className="h-12 w-12 text-gray-300 mb-4"/>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No cars found</h3>
                                <p className="text-gray-500 mb-4">
                                    {search ? "No cars match your search criteria"
                                    : "Your inventory is empty. Add cars to get started."}
                                </p>
                            </div>)}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {carToDelete?.make} {carToDelete?.model} {carToDelete?.year} ?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deletingCar}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                handleDeleteCar()
                            }
                            }
                            disabled={deletingCar}>
                            {deletingCar ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...
                                </>
                            ) : (
                                "Delete Car"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CarsList;