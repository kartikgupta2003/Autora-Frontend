import React , {useState} from "react";
import { LayoutDashboard, Car, Calendar, Cog } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        index: 0
    }, {
        label: "Cars",
        icon: Car,
        href: "/admin/cars",
        index: 1
    }, {
        label: "Test Drives",
        icon: Calendar,
        href: "/admin/test-drives",
        index: 2
    },
    {
        label: "Settings",
        icon: Cog,
        href: "/admin/settings",
        index: 3
    },
]

const Sidebars = ({ index, setIndex }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { open, setOpen } = useSidebar();
    const [sidebarOpen , setSidebarOpen] = useState(false); 

    return (
        
        <>
            <div className="hidden md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r w-56">
                {routes.map((route) => {
                    return (
                        <div key={route.href} className={`cursor-pointer flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50 h-12
                    ${index === route.index ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700" : ""}`} onClick={() => {
                                setIndex(route.index)
                                setOpen(false)
                            }}>
                            {/* Without transition-all, color and background would snap instantly. */}
                            <route.icon className="h-5 w-5" />
                            {route.label}
                        </div>
                    )
                })}
            </div>
            <div className="md:hidden h-full">
                    <SidebarTrigger />
                    <Sidebar>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {routes.map((route) => {
                                            return (
                                                <div key={route.href} className={`cursor-pointer flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50 h-12
                    ${index === route.index ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700" : ""}`} onClick={() => {
                                                        setIndex(route.index)
                                                        setOpen(false);
                                                    }}>
                                                    {/* Without transition-all, color and background would snap instantly. */}
                                                    <route.icon className="h-5 w-5" />
                                                    {route.label}
                                                </div>
                                            )
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
            </div>
        </>
    )
}

export default Sidebars;