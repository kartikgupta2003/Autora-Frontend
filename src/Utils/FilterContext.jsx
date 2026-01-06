import React, { createContext, useContext, useState , useEffect} from "react";

const FilterContext = createContext(null);

export const FilterProvider = ({ children , filters }) => {
    const [make, setMake] = useState("");
    const [bodyType, setBodyType] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [transmission, setTransmission] = useState("");
    const [priceRange, setPriceRange] = useState([0, 0])
    const [sortBy, setSortBy] = useState("newest");
    const [search , setSearch] = useState("");
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [currentFilters, setCurrentFilters] = useState({});

    useEffect(() => {
        if (filters?.priceRange?.min != null && filters?.priceRange?.max != null) {
            setPriceRange([
                filters.priceRange.min,
                filters.priceRange.max
            ]);
        }
        // BCZ jab filters me value aa rhi h to even though ye component re-render ho rha hai 
        // But ye refresh nhi hua hai to states refresh nhi hui hai , to wo undefined hi padi hongi 
    }, [filters?.priceRange]);


    useEffect(() => {
        const arr = [make, bodyType, fuelType, transmission , search];
        setCurrentFilters({ make, bodyType, fuelType, transmission, priceRange, sortBy , search});
        let count = 0;
        arr.map((ele) => {
            if (ele.length > 0) count++;
        })
        if (sortBy !== "newest") count++;
        if (priceRange[0] > filters?.priceRange?.min || priceRange[1] < filters?.priceRange?.max) count++;
        setActiveFilterCount(count);
    }, [make, bodyType, fuelType, transmission, priceRange, sortBy ,search])
    // console.log("filters jo mile ", filters);

    return(
        <FilterContext.Provider value={{make, setMake , bodyType, setBodyType , fuelType, setFuelType , transmission, setTransmission , priceRange, setPriceRange , sortBy, setSortBy , activeFilterCount, setActiveFilterCount , currentFilters, setCurrentFilters , search , setSearch}}>
            {children}
        </FilterContext.Provider>
    )
}

export const useFilter = ()=>{
    const context = useContext(FilterContext);
    return context;
}