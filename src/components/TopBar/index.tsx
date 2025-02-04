import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { getCurrentSession, logout } from "@/lib/auth";
import SignIn from "@/components/TopBar/SignIn";

const User = ({ name }: { name: string }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="link" aria-label="User settings">
        {name}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={logout}>
        Sign out
        <ArrowLeftStartOnRectangleIcon className="ml-auto" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const TopBar = async () => {
  const { user } = await getCurrentSession();
  return user?.githubName ? <User name={user?.githubName} /> : <SignIn />;
};
