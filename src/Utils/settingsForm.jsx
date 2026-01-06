import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Loader2, Search, Shield, User, Users, UserX } from "lucide-react";
import axios from "axios";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Button } from "../components/ui/button";
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

const DAYS = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
];


const SettingsForm = () => {
    const [workingHours, setWorkingHours] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [users, setUsers] = useState([]);
    const { getToken } = useAuth();

    useEffect(() => {
        const getHours = async () => {
            try {
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                const { data } = await axios.get("http://localhost:8000/api/settings/getDealership", config);

                setWorkingHours(data?.workingHours);

                // console.log(data);
            } catch (err) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.response.data.message);
            }
        }

        getHours();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                const { data } = await axios.get(`http://localhost:8000/api/settings/fetchUsers?search=${userSearch}`, config);


                // console.log("users jo aye " , data);

                setUsers(data);
            } catch (err) {
                return toast.error(err.response.data.message);
            }
        }

        fetchUsers();
    }, [userSearch]);

    const handleWorkingHoursUpdate = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            };
            const body = {
                workingHours
            }
            const { data } = await axios.post("http://localhost:8000/api/settings/update", body, config);

            setWorkingHours(data?.workingHours);

            // console.log(data);
            setIsLoading(false);
            // window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.success("Working Hours saved successfully");
        } catch (err) {
            setIsLoading(false);
            return toast.error(err.response.data.message);
        }
    }

    const handleMakeAdmin = async (user) => {
        if (
            confirm(
                `Are you sure you want to give admin priviliges to ${user.name || user.email}? Admin users can manage aspects of the dealership.`
            )
        ) {
            try {
                const token = await getToken();
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                };
                const body = {
                    userId: user._id,
                    role: "ADMIN"
                }
                await axios.post("http://localhost:8000/api/settings/updateUser", body, config);

                setUsers((prev) => {
                    const newArr = prev.map((ele) => {
                        if (ele._id === user._id) {
                            ele.role = "ADMIN";
                            return ele
                        }
                        else return ele;
                    })
                    return newArr;
                })

                return toast.success("User updated successfully");
            } catch (err) {
                return toast.error(err.response.data.message);
            }
        }
    }

    const handleRemoveAdmin = async (user) => {
        if (
            confirm(
                `Are you sure you want to remove admin priviliges from ${user.name || user.email}? They will no longer be able to access the admin dashboard.`
            )
        ) {
            try {
                const token = await getToken();
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                };
                const body = {
                    userId: user._id,
                    role: "USER"
                }
                await axios.post("http://localhost:8000/api/settings/updateUser", body, config);
                setUsers((prev) => {
                    const newArr = prev.map((ele) => {
                        if (ele._id === user._id) {
                            ele.role = "USER";
                            return ele
                        }
                        else return ele;
                    })
                    return newArr;
                })
                return toast.success("User updated successfully");
            } catch (err) {
                return toast.error(err.response.data.message);
            }
        }
    }

    return (
        <div className="space-y-6 ">
            <Tabs defaultValue="hours">
                <TabsList>
                    <TabsTrigger value="hours"><Clock className="h-4 w-4 mr-2"></Clock>Working Hours</TabsTrigger>
                    <TabsTrigger value="admins"><Shield className="h-4 w-4 mr-2" />Admin Users</TabsTrigger>
                </TabsList>
                <TabsContent value="hours" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Working Hours</CardTitle>
                            <CardDescription>Set your dealership's working hours for each day of the week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 ">
                                {workingHours.map((day, idx) => {
                                    return (
                                        <div key={idx}
                                            className="grid grid-cols-12 gap-8 md:gap-4 items-center py-3 px-4
                                        rounded-lg hover:bg-slate-50">
                                            <div className="col-span-3 md:col-span-2">
                                                <div className="font-bold text-sm">{day.dayOfWeek}</div>
                                            </div>
                                            <div className="col-span-9 md:col-span-2 flex items-center">
                                                <Checkbox
                                                    id={`is-open-${day.dayOfWeek}`}
                                                    checked={day.isOpen}
                                                    onCheckedChange={(checked) => {
                                                        setWorkingHours((prev) => {
                                                            const newArr = prev.map((ele) => {
                                                                if (ele.dayOfWeek === day.dayOfWeek) {
                                                                    ele.isOpen = !day.isOpen;
                                                                    return ele;
                                                                }
                                                                else return ele;
                                                            })
                                                            return newArr;
                                                        })

                                                    }} />
                                                <Label
                                                    htmlFor={`is-open-${day.dayOfWeek}`}
                                                    className="ml-2 cursor-pointer">
                                                    {day.isOpen ? "Open" : "Closed"}
                                                </Label>
                                            </div>
                                            {day.isOpen && <>
                                                <div className="col-span-7 md:col-span-3">
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                                        <Input
                                                            type="time"
                                                            value={day.openTime}
                                                            onChange={(e) => {
                                                                setWorkingHours((prev) => {
                                                                    const newArr = prev.map((ele) => {
                                                                        if (ele.dayOfWeek === day.dayOfWeek) {
                                                                            ele.openTime = e.target.value
                                                                            return ele;
                                                                        }
                                                                        else return ele;
                                                                    })
                                                                    return newArr;
                                                                });

                                                            }}
                                                            className="text-sm"></Input>
                                                    </div>
                                                </div>
                                                <div className="text-center col-span-1 text-sm font-bold">to</div>
                                                <div className="col-span-7 md:col-span-3">
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                                        <Input
                                                            type="time"
                                                            value={day.closeTime}
                                                            onChange={(e) => {
                                                                setWorkingHours((prev) => {
                                                                    const newArr = prev.map((ele) => {
                                                                        if (ele.dayOfWeek === day.dayOfWeek) {
                                                                            ele.closeTime = e.target.value
                                                                            return ele;
                                                                        }
                                                                        else return ele;
                                                                    })
                                                                    return newArr;
                                                                });

                                                            }}
                                                            className="text-sm"></Input>
                                                    </div>
                                                </div>
                                            </>}
                                        </div>
                                    )
                                })}
                                <div className="flex items-center justify-center">
                                    {isLoading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /><p className="text-sm font-medium">Saving...</p></>
                                    ) : (
                                        <Button className="cursor-pointer" onClick={handleWorkingHoursUpdate}>Save</Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>

                    </Card>
                </TabsContent>
                <TabsContent value="admins" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Users</CardTitle>
                            <CardDescription>Manage users with admin priviliges.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="pl-9 w-full"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}>
                                </Input>
                            </div>
                            {users.length > 0 ? (<>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => {
                                            return (<>
                                                <TableRow key={user._id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gray-200
                                                            items-center justofy-center overflow-hidden relative">
                                                                {
                                                                    user.imageUrl ?
                                                                        (
                                                                            <img src={user.imageUrl}
                                                                                className="w-full h-full object-cover"></img>
                                                                        ) : (
                                                                            <User className="h-4 w-4 text-gray-500" />
                                                                        )
                                                                }
                                                            </div>
                                                            <span>{user.name || "Unamed User"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={user.role === "ADMIN" ? "bg-green-800" : "bg-gray-800"}>
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.role === "ADMIN" ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className={"text-red-600 cursor-pointer"}
                                                                onClick={() => handleRemoveAdmin(user)}
                                                            ><UserX className="h-4 w-4 mr-2" />Remove Admin</Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleMakeAdmin(user)}
                                                                className={"cursor-pointer"}
                                                            >
                                                                <Shield className="h-4 w-4 mr-2" />Make Admin
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                            )
                                        })}

                                    </TableBody>
                                </Table>
                            </>) : (<>
                                <div className="py-12 text-center">
                                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                                    <p className="text-gray-500">
                                        {userSearch.length > 0 ? "No users match search criteria" : "There are no users registered yet"}
                                    </p>
                                </div>
                            </>)}
                        </CardContent>

                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SettingsForm;