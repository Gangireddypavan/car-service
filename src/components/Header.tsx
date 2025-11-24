"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        AutoFix<span className="text-primary">Pro</span>
                    </span>
                </div>
                <nav className="hidden md:block">
                    <ul className="flex space-x-8">
                        <li>
                            <Link
                                href="/"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/book-service"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Book Service
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/select-service"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/track-order"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Track Order
                            </Link>
                        </li>
                    </ul>
                </nav>
                <Link href="/book-service">
                    <Button className="rounded-full shadow-lg shadow-blue-500/20">
                        Book Now
                    </Button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
