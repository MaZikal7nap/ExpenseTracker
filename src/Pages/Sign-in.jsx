import { signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { MountainIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { auth, db } from "@/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
export default function SignIn() {
    const navigate = useNavigate();

    const onSignIn = () => {
        try {
            signInWithPopup(auth, provider)
                .then(async (user) => {
                    const docRef = doc(db, "accounts", user.user.uid);

                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        navigate("/");
                        return;
                    } else {
                        // create an account for this user
                        const { displayName, uid, photoURL } = user.user;
                        const account = {
                            name: displayName,
                            userId: uid,
                            depositAmount: 0,
                            photo: photoURL,
                            savingTarget: 0,
                            monthlyAccountSavings: [],
                        };

                        setDoc(doc(db, "accounts", uid), account)
                            .then(() => {
                                navigate("/");
                            })
                            .catch((err) => console.log(err));
                    }
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    console.log(errorMessage)
                });

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md text-center">
                    <div className="space-y-4">
                        <MountainIcon className="mx-auto h-12 w-12 " />

                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Welcome To ExpoTracker
                        </h1>

                        <p className="text-muted-foreground">
                            Effortlessly Track Your Expenses & Stay On Top Of Your Finances.
                        </p>
                    </div>

                    <div className="mt-6">
                        <Button
                            onClick={onSignIn}
                            className="flex w-full items-center justify-center gap-2"
                        >
                            Sign In With Google
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}