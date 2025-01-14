import { ModeToggle } from "./components/mode-toggle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config";
import { Button } from "./components/ui/button";
import { LogOutIcon } from "lucide-react";
import Actions from "./components/Banking";
import { Toaster } from "react-hot-toast";
import DepositTable from "./components/DepositTable";
import WithdrawalTable from "./components/WithdrawalTable";
import Graph from "./components/Graph";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/Sign-in");
      }
      setUser(user);
    });
  }, []);

  function signOutHandler() {
    try {
      signOut(auth)
        .then(() => {
          navigate("/Sign-in");
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <>
      <Toaster />

      <div className="flex justify-between items-center mx-4 my-4">
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button onClick={signOutHandler} variant="destructive">
            <LogOutIcon />
          </Button>
        </div>
        <Actions userId={user?.uid} />
      </div>

      <div className="mx-5 mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="col-span-2 space-y-6">
          <WithdrawalTable userId={user?.uid} />
          <DepositTable userId={user?.uid} />
        </div>

        <div className="my-10">
          <Graph userId={user?.uid} />
        </div>
      </div>
    </>
  );
}
