import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
