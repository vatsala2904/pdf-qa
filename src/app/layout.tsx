import "./globals.css";
import { ThemeProvider } from "@/components/Theme"; // ✅ no useTheme import here
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <ThemeProvider>
          <ThemeToggle />   {/* client component */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
