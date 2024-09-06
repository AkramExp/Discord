import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div className="text-xl font-bold">
      <UserButton />
    </div>
  );
};

export default Home;
