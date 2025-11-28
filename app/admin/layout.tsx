import SideBar from "@/components/admin/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <SideBar>
        {children}
      </SideBar>
    </div>
  );
}
