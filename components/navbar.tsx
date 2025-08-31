import {  ChartCandlestickIcon } from "lucide-react";
import NavLink from "./nav-link";

export default function Navbar() {

    return (
        // <header className="flex  gap-4 justify-between py-3 font-light">
        <nav className="font-medium bg-accent flex justify-between items-center text-sm gap-6 container mx-auto p-4 rounded-b-md sticky top-0 z-40 shadow-md w-full">
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-2 font-semibold mr-auto">
                    <ChartCandlestickIcon className="size-6" />
                    <span className="sr-only md:not-sr-only">Web Charts</span>
                </div>

                    <NavLink href="/">
                        Dashboard
                    </NavLink>
                    <NavLink href="/chart">
                        Chart
                    </NavLink>
                    <NavLink href="/configurations">
                        Configurations
                    </NavLink>
            </div>


            <div className="flex items-center gap-2">
                    
            </div>
        </nav>
        // </header>
    );
}