import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import Image from "next/image";

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

const User = ({ name }: { name: string }) => {
  return <Button variant={"link"}>{name}</Button>;
};

export const TopBar = async () => {
  const session = await auth();
  console.log(session);

  return (
    <div className="max-w-2xl mx-auto pt-2 flex justify-end">
      {session ? <User name={session?.user.name} /> : <SignIn />}
    </div>
  );
};
