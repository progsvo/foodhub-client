"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "./ModeToggle";

interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  cartCount?: number;
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: { title: string; url: string };
    signup: { title: string; url: string };
  };
}

const Navbar = ({
  cartCount,
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "FoodHub",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Meals", url: "/meals" },
    { title: "Providers", url: "/providers" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: NavbarProps) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const navMenu = session?.user
    ? [
        ...menu,
        { title: "Cart", url: "/cart" },
        { title: "Orders", url: "/orders" },
        ...(session.user.role === "PROVIDER"
          ? [
              { title: "Incoming Orders", url: "/provider/orders" },
              { title: "Manage Meals", url: "/provider/meals" },
            ]
          : []),
        ...(session.user.role === "ADMIN"
          ? [{ title: "Admin", url: "/admin" }]
          : []),
      ]
    : menu;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const authButtons = session?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {session.user.name ?? session.user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button asChild variant="outline" size="sm">
        <Link href={auth.login.url}>{auth.login.title}</Link>
      </Button>
      <Button asChild size="sm">
        <Link href={auth.signup.url}>{auth.signup.title}</Link>
      </Button>
    </>
  );

  const mobileAuthButtons = session?.user ? (
    <>
      <Button variant="outline" asChild className="w-full">
        <Link href="/profile">Profile</Link>
      </Button>
      <Button variant="outline" onClick={handleLogout} className="w-full">
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button asChild variant="outline">
        <Link href={auth.login.url}>{auth.login.title}</Link>
      </Button>
      <Button asChild>
        <Link href={auth.signup.url}>{auth.signup.title}</Link>
      </Button>
    </>
  );

  return (
    <section className={cn("py-4", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {navMenu.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink
                        asChild
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
                      >
                        <Link
                          href={item.url}
                          className="inline-flex flex-row items-center gap-1.5"
                        >
                          {item.title}
                          {item.title === "Cart" &&
                            (cartCount ?? 0) > 0 && (
                              <Badge
                                variant="secondary"
                                className="size-5 shrink-0 rounded-full p-0 text-[10px] font-semibold leading-none tabular-nums"
                              >
                                {cartCount}
                              </Badge>
                            )}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <ModeToggle />
            {!isPending && authButtons}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex flex-col gap-4">
                    {navMenu.map((item) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="inline-flex items-center gap-2 text-base font-semibold"
                      >
                        {item.title}
                        {item.title === "Cart" &&
                          (cartCount ?? 0) > 0 && (
                            <Badge
                              variant="secondary"
                              className="size-5 shrink-0 rounded-full p-0 text-[10px] font-semibold leading-none tabular-nums"
                            >
                              {cartCount}
                            </Badge>
                          )}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    {!isPending && mobileAuthButtons}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
