import React from "react";
import { Slider } from "@/components/ui/slider"
import { Button } from "../components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "../components/ui/badge";

const CarFilterControls = ({ filters, currentFilters, onFilterChange, onClearFilter }) => {
  // console.log("aa bhirha " , filters);
  const { make, bodyType, fuelType, transmission, priceRange = [0, 0] , search = "" } = currentFilters;
  const filterSections = [
    {
      id: "make",
      title: "Make",
      options: filters?.makes?.map((make) => ({ value: make, label: make })),
      currentValue: make,
      onChange: (value) => onFilterChange("make", value),
    },
    {
      id: "bodyType",
      title: "Body Type",
      options: filters?.bodyTypes?.map((type) => ({ value: type, label: type })),
      currentValue: bodyType,
      onChange: (value) => onFilterChange("bodyType", value),
    },
    {
      id: "fuelType",
      title: "Fuel Type",
      options: filters?.fuelTypes?.map((type) => ({ value: type, label: type })),
      currentValue: fuelType,
      onChange: (value) => onFilterChange("fuelType", value),
    },
    {
      id: "transmission",
      title: "Transmission",
      options: filters?.transmissions?.map((type) => ({
        value: type,
        label: type,
      })),
      currentValue: transmission,
      onChange: (value) => onFilterChange("transmission", value),
    },
  ];
  // console.log("range hai bhai " , priceRange);
  // console.log(filterSections);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="car-search" className="font-medium text-sm">Search</label>
        <div className="flex items-center gap-2">
          <input
            id="car-search"
            type="search"
            value={search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by model, description, city..."
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
          />
          {search && (
            <Button
              size="sm"
              variant="ghost"
              className="h-9 p-2"
              onClick={() => onClearFilter("search")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <div className="px-2">
          <Slider
            min={filters?.priceRange?.min || 0}
            max={filters?.priceRange?.max || 0}
            step={100}
            value={priceRange}
            onValueChange={(value) => onFilterChange("priceRange", value)} />
        </div>
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">$ {priceRange && priceRange.length > 0 && priceRange[0]}</div>
          <div className="font-medium text-sm">$ {priceRange && priceRange.length > 0 && priceRange[1]}</div>
        </div>
      </div>
      {filterSections.map((filter) => {
        return (
          <div key={filter.id} className="space-y-3">
            <h4 className="text-sm font-medium flex justify-between">
              <span>{filter.title}</span>
              {filter.currentValue && (
                <Button size="sm" variant="outline" className={"text-xs text-gray-600 flex items-center cursor-pointer"}
                  onClick={() => onClearFilter(filter.id)}>
                  <X className="mr-1 h-3 w-4" />Clear
                </Button>
              )}
            </h4>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
              {filter.options && filter.options.map((option) => {
                return (
                  <Badge key={option.value}
                  variant={
                    filter.currentValue === option.value ? "default" : "outline"
                  }
                  className={`cursor-pointer px-3 py-1
                    ${filter.currentValue === option.value ? "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-200"
                      : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={()=> filter.onChange(filter.currentValue === option.value ? "" : option.value)}
                  >{option.label}
                    {filter.currentValue === option.value && (
                      <Check className="ml-1 h-3 w-3 inline" />
                    )}
                  </Badge>
                )
              })}
              
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CarFilterControls;