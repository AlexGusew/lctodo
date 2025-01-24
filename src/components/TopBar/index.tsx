import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { ShowTags } from "@/components/TopBar/ShowTags";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <Button type="submit" variant={"link"}>
        <Image
          src="/github-mark-white.svg"
          alt="GitHub logo"
          width={24}
          height={24}
        />
        Sign in with GitHub
      </Button>
    </form>
  );
}

const User = ({ name }: { name: string }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="link">{name}</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <ShowTags />
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        Sign out
        <ArrowLeftStartOnRectangleIcon className="ml-auto" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const TopBar = async () => {
  const session = await auth();
  return session?.user?.name ? <User name={session.user.name} /> : <SignIn />;
};
