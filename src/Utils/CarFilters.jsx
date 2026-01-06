import React, { useState, useEffect, useRef } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet"
import { Button } from "../components/ui/button";
import { Filter, Sliders, X } from "lucide-react";
import { Badge } from "../components/ui/badge";
import CarFilterControls from "./CarFilterControls";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFilter } from "./FilterContext.jsx";
import { useSearchParams } from "react-router-dom";

const CarFilters = ({ filters }) => {
    // const [make, setMake] = useState("");
    // const [bodyType, setBodyType] = useState("");
    // const [fuelType, setFuelType] = useState("");
    // const [transmission, setTransmission] = useState("");
    // const [priceRange, setPriceRange] = useState([0,0])
    // const [sortBy, setSortBy] = useState("newest");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const localMake = searchParams.get("make");
    const localBodyType = searchParams.get("bodyType");
    const localSearch = searchParams.get("search");
    const isInitialLoad = useRef(true);

    // const [activeFilterCount, setActiveFilterCount] = useState(0);
    // const [currentFilters, setCurrentFilters] = useState({});
    const { make, setMake, bodyType, setBodyType, fuelType, setFuelType, transmission, setTransmission, priceRange, setPriceRange, sortBy, setSortBy, activeFilterCount, setActiveFilterCount, currentFilters, setCurrentFilters, search, setSearch } = useFilter();

    // useEffect(() => {
    //     if (filters?.priceRange?.min != null && filters?.priceRange?.max != null) {
    //         setPriceRange([
    //             filters.priceRange.min,
    //             filters.priceRange.max
    //         ]);
    //     }
    //     // BCZ jab filters me value aa rhi h to even though ye component re-render ho rha hai 
    //     // But ye refresh nhi hua hai to states refresh nhi hui hai , to wo undefined hi padi hongi 
    // }, [filters?.priceRange]);


    // useEffect(() => {
    //     const arr = [make, bodyType, fuelType, transmission];
    //     setCurrentFilters({ make, bodyType, fuelType, transmission, priceRange, sortBy });
    //     let count = 0;
    //     arr.map((ele) => {
    //         if (ele.length > 0) count++;
    //     })
    //     if (sortBy !== "newest") count++;
    //     if (priceRange[0] > filters?.priceRange?.min || priceRange[1] < filters?.priceRange?.max) count++;
    //     setActiveFilterCount(count);
    // }, [make, bodyType, fuelType, transmission, priceRange, sortBy])
    // // console.log("filters jo mile ", filters);
    useEffect(() => {
        if (!isInitialLoad.current) return;
        if (localMake) {
            setMake(localMake);
        }

        if (localBodyType) {
            setBodyType(localBodyType);
        }

        if (localSearch) {
            setSearch(localSearch);
        }
        isInitialLoad.current = false;
    }, [])


    const handleFilterChange = (filterName, value) => {
        if (filterName === "make") setMake(value);
        else if (filterName === "bodyType") setBodyType(value);
        else if (filterName === "fuelType") setFuelType(value);
        else if (filterName === "transmission") setTransmission(value);
        else if (filterName === "priceRange") setPriceRange(value);
        else if (filterName === "sortBy") setSortBy(value);
        else if (filterName === "search") setSearch(value);
    }

    useEffect(() => {
        if (isInitialLoad.current) return;

        const params = {};

        if (make) params.make = make;
        if (bodyType) params.bodyType = bodyType;
        if (fuelType) params.fuelType = fuelType;
        if (transmission) params.transmission = transmission;
        if (search) params.search = search;
        if (sortBy && sortBy !== "newest") params.sortBy = sortBy;

        if (
            priceRange &&
            filters?.priceRange &&
            (priceRange[0] !== filters.priceRange.min ||
                priceRange[1] !== filters.priceRange.max)
        ) {
            params.minPrice = priceRange[0];
            params.maxPrice = priceRange[1];
        }

        setSearchParams(params, { replace: true });
    }, [
        make,
        bodyType,
        fuelType,
        transmission,
        search,
        sortBy,
        priceRange
    ]);

    const handleClearFilter = (filterName) => {
        handleFilterChange(filterName, "");
    }
    const clearFilters = () => {
        setMake("");
        setBodyType("");
        setFuelType("");
        setTransmission("");
        setPriceRange([filters?.priceRange?.min, filters?.priceRange?.max]);
        setSortBy("newest");
        setSearch("");
        setSearchParams({});
        setIsSheetOpen(false);
    }
    const applyFilters = () => {

    }
    return (
        <div className="flex lg:flex-col justify-between gap-4">
            {/* Mobile filters */}
            <div className="lg:hidden mb-4">
                <div className="flex items-center">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant={"outline"} className={"flex items-center gap-2"}>
                                <Filter className="h-4 w-4" />Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left"
                            className="w-full sm:max-w-md overflow-y-auto"
                            aria-describedby={undefined}>
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>

                            <div className="p-4">
                                <CarFilterControls
                                    filters={filters}
                                    currentFilters={currentFilters}
                                    onFilterChange={handleFilterChange}
                                    onClearFilter={handleClearFilter}
                                />
                            </div>

                            <SheetFooter className="sm:justify-between flex-row pt-2 border-t spcae-x-4 mt-auto">
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    onClick={clearFilters}
                                    className={"flex-1"}>Reset</Button>
                                <Button
                                    type="button"
                                    className={"flex-1"}
                                    onClick={() => {
                                        setIsSheetOpen(false)
                                        applyFilters()
                                    }}>Show Results</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value)
            }
                // call the applyFilter Button
            }>
                <SelectTrigger className="w-[180px] lg:w-full">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    {[
                        { value: "newest", label: "Newest First" },
                        { value: "priceAsc", label: "Price : Low to High" },
                        { value: "priceDesc", label: "Price : High to Low" }
                    ].map((options) => {
                        return (
                            <SelectItem key={options.value} value={options.value}>{options.label}</SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>

            {/* Desktop Filters */}
            <div className="hidden lg:block sticky top-24">
                <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                            <Sliders className="mr-2 h-4 w-4" />Filters
                        </h3>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className={"h-8 text-sm text-gray-600"}
                                onClick={clearFilters}
                            >
                                <X className="mr-1 h-3 w-3" />Clear All
                            </Button>
                        )}
                    </div>
                    <div className="p-4">
                        <CarFilterControls
                            filters={filters}
                            currentFilters={currentFilters}
                            onFilterChange={handleFilterChange}
                            onClearFilter={handleClearFilter}
                        />
                    </div>
                    <div className="px-4 py-4 border-t">
                        <Button onClick={applyFilters} className={"w-full"}>Apply Filters</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarFilters;