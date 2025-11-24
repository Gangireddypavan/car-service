"use client";

import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">
                                AutoFix<span className="text-primary">Pro</span>
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Modernizing car maintenance with technology and expert care. We
                            bring the shop to you.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Services</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Oil Change
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Brake Repair
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Battery Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Diagnostics
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Newsletter</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe for tips and exclusive offers.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1"
                            />
                            <Button size="icon">
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} AutoFixPro. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
