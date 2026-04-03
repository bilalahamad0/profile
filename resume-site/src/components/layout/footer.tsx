export function Footer() {
    return (
        <footer className="py-6 text-center text-sm text-muted-foreground border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <p>&copy; {new Date().getFullYear()} Bilal Ahamad. All rights reserved.</p>
                <p className="mt-2 text-xs">Built with Next.js, Tailwind CSS, and Framer Motion.</p>
            </div>
        </footer>
    );
}
