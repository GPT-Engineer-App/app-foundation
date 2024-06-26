import { NavLink } from "react-router-dom";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Bot,
  Search,
  ShoppingCart,
  Users,
  User,
  Table,
  Map,
  Trello,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Outlet, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "../integrations/supabase/index.js";
import Chatbot from "../pages/Chatbot.jsx";

const SharedLayout = () => {
  const { session, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile(session?.user?.id);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Bot className="h-6 w-6" />
              <span className="">GPTE Demos</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  }`
                }
              >
                <Home className="h-4 w-4" />
                Home
              </NavLink>
              <NavLink
                to="/interactive-table"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  }`
                }
              >
                <Table className="h-4 w-4" />
                Animals
              </NavLink>
              <NavLink
                to="/chatbot"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  }`
                }
              >
                <Bot className="h-4 w-4" />
                Chatbot
              </NavLink>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  }`
                }
              >
                <Map className="h-4 w-4" />
                Map
              </NavLink>
              <NavLink
                to="/trello-board"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                  }`
                }
              >
                <Trello className="h-4 w-4" />
                Trello Board
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Bot className="h-6 w-6" />
                  <span className="sr-only">GPTE Demos</span>
                </a>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-primary ${
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    }`
                  }
                >
                  <Home className="h-5 w-5" />
                  Home
                </NavLink>
                <NavLink
                  to="/interactive-table"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-primary ${
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    }`
                  }
                >
                  <Table className="h-5 w-5" />
                  Animals
                </NavLink>
                <NavLink
                  to="/chatbot"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-primary ${
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    }`
                  }
                >
                  <Bot className="h-5 w-5" />
                  Chatbot
                </NavLink>
                <NavLink
                  to="/map"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-primary ${
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    }`
                  }
                >
                  <Map className="h-5 w-5" />
                  Map
                </NavLink>
                <NavLink
                  to="/trello-board"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-primary ${
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    }`
                  }
                >
                  <Trello className="h-5 w-5" />
                  Trello Board
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="flex items-center gap-2">
                {profile?.username && <span className="truncate max-w-[100px]">{profile.username}</span>}
                <Avatar>
                  <AvatarImage src={profile?.avatar_url} alt="User Avatar" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              {session ? (
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/login")}>Login</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SharedLayout;