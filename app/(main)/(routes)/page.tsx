import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="text-xl font-bold">
      <UserButton />
      <ModeToggle />
    </div>
  );
};

export default Home;
