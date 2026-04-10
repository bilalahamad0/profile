import { Dock, DockIcon } from "@/components/ui/dock";
import { Home, User, Briefcase, Code, Mail, FileText, GraduationCap } from "lucide-react";
import { useMotionValue } from "framer-motion";

const DATA = {
    navbar: [
        { href: "/", icon: Home, label: "Home" },
        { href: "#about", icon: User, label: "About" },
        { href: "#skills", icon: Code, label: "Skills" },
        { href: "#experience", icon: Briefcase, label: "Experience" },
        { href: "#projects", icon: FileText, label: "Projects" },
        { href: "#education", icon: GraduationCap, label: "Education" },
        { href: "/contact", icon: Mail, label: "Contact" },
    ],
};

export function NavDock() {
    const mouseX = useMotionValue(10000);

    return (
        <div
            className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(10000)}
        >
            <div className="pointer-events-auto">
                <Dock>
                    {DATA.navbar.map((item) => (
                        <DockIcon key={item.label} mouseX={mouseX} href={item.href} label={item.label}>
                            <item.icon className="h-6 w-6 text-neutral-400 group-hover:text-white transition-colors" />
                        </DockIcon>
                    ))}
                </Dock>
            </div>
        </div>
    );
}
