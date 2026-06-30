import { Header } from "@/components/Header";

export function Layout({
  children,
  minimalHeader = false
}: {
  children: React.ReactNode;
  minimalHeader?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <Header minimal={minimalHeader} />
      <main>{children}</main>
    </div>
  );
}
