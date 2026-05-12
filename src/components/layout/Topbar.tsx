import { auth } from "@/src/auth";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";

interface TopbarProps {
  title?: string;
}

export async function Topbar({ title }: TopbarProps) {
  const session = await auth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 shrink-0 backdrop-blur-[4px]">
      <div className="flex items-center gap-3">
        <MobileNav />
        {title && (
          <h1 className="font-heading text-base font-semibold text-foreground hidden sm:block">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        {session?.user && <UserMenu user={session.user} />}
      </div>
    </header>
  );
}
