import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, Car, CircleCheckBig, CircleX, Clock, DollarSign, Info, TrendingUp } from "lucide-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const DashboardComp = ({ initialData }) => {
    const [activeTab, setActiveTab] = useState("overview");

    if (!initialData) {
        return (
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load dashboard data
                </AlertDescription>
            </Alert>
        )
    }

    const { cars, testDrives } = initialData;

    // console.log("cars ", cars);
    // console.log("testDrives ", testDrives);

    return (
        <div>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    <TabsTrigger value="test-drives" className="cursor-pointer">Test Drives</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                                <Car className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{cars.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    {cars.available} available , {cars.sold} sold
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Test Drives</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{testDrives.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    {testDrives.pending} pending , {testDrives.confirmed} confirmed
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{testDrives.conversionRate}%</div>
                                <p className="text-xs text-muted-foreground">
                                    From test drives to sales
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Cars Sold</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{cars.sold}</div>
                                <p className="text-xs text-muted-foreground">
                                    {((cars.sold / cars.total) * 100).toFixed(1)}% of inventory
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dealership Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm mb-2">Car Inventory</h3>
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-green-600 h-2.5 rounded-full"
                                                    style={{ width: `${(cars.available / cars.total) * 100}%` }}>
                                                </div>
                                            </div>
                                            <span className="ml-2 text-sm">
                                                {((cars.available / cars.total) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <p className="ml-2 text-sm">
                                            Available inventory capacity
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm mb-2">
                                            Test Drive Success
                                        </h3>
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{
                                                        width: `${(testDrives.completed / (testDrives.total || 1)) * 100
                                                            }%`
                                                    }}>
                                                </div>
                                            </div>
                                            <span className="ml-2 text-sm">
                                                {((testDrives.completed / (testDrives.total || 1)) * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Completed test drives
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-blue-600">
                                            {cars.sold}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-1">Cars Sold</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-amber-600">
                                            {testDrives.pending + testDrives.confirmed}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Upcoming Test Drives
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-green-600">
                                            {((cars.available / (cars.total || 1)) * 100).toFixed(0)}%
                                        </span>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Inventory Utilization
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="test-drives" className="space-y-6">
                    <div className="grid gap-4 lg:grid-cols-5 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{testDrives.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{testDrives.pending}</div>
                                <p className="text-xs text-muted-foreground">
                                    {((testDrives.pending / testDrives.total) * 100).toFixed(1)}% of bookings
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                                <CircleCheckBig className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{testDrives.confirmed}</div>
                                <p className="text-xs text-muted-foreground">
                                    {((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}% of bookings
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <CircleCheckBig className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{testDrives.completed}</div>
                                <p className="text-xs text-muted-foreground">
                                    {((testDrives.completed / testDrives.total) * 100).toFixed(1)}% of bookings
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                                <CircleX className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{testDrives.cancelled}</div>
                                <p className="text-xs text-muted-foreground">
                                    {((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}% of bookings
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Drive Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm mb-2">Conversion Rate</h3>
                                        <div className="flex items-center">
                                            <span className="ml-2 text-lg font-bold">
                                                {testDrives.conversionRate}%
                                            </span>
                                        </div>
                                        <p className="ml-2 text-sm">
                                            Test drives resulting in car purchases
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm mb-2">Completion Rate</h3>
                                        <div className="flex items-center">
                                            <span className="ml-2 text-lg font-bold">
                                                {(testDrives.total) ? (((testDrives.completed / testDrives.total) * 100).toFixed(1)) : (0)}%
                                            </span>
                                        </div>
                                        <p className="ml-2 text-sm">
                                            Test drives resulting in car purchases
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex-col">
                                    <h3 className="font-medium">Booking Status Breakdown</h3>
                                    <div className="mt-2 flex-col">
                                        <div>
                                            Pending
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-orange-400 h-2.5 rounded-full"
                                                style={{
                                                    width: `${(testDrives.pending / (testDrives.total || 1)) * 100
                                                        }%`
                                                }}>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex-col">
                                        <div>
                                            Confirmed
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-green-600 h-2.5 rounded-full"
                                                style={{
                                                    width: `${(testDrives.confirmed / (testDrives.total || 1)) * 100
                                                        }%`
                                                }}>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex-col">
                                        <div>
                                            Completed
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full"
                                                style={{
                                                    width: `${(testDrives.completed / (testDrives.total || 1)) * 100
                                                        }%`
                                                }}>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex-col">
                                        <div>
                                            Cancelled
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-yellow-400 h-2.5 rounded-full"
                                                style={{
                                                    width: `${(testDrives.cancelled / (testDrives.total || 1)) * 100
                                                        }%`
                                                }}>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex-col">
                                        <div>
                                            No Show
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-pink-400 h-2.5 rounded-full"
                                                style={{
                                                    width: `${(testDrives.noShow / (testDrives.total || 1)) * 100
                                                        }%`
                                                }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default DashboardComp;