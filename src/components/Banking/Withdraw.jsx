import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { HandCoinsIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc, addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/config";
import { useNavigate } from "react-router";

export default function Withdraw({ userId }) {

    const navigate = useNavigate();
    const [WithdrawalAmount, setWithdrawalAmount] = useState("")
    const [Reason, setReason] = useState("")
    const [AccountData, setAccountData] = useState(null)

    async function getAccountData() {
        const data = await getDocument(db, "accounts", userId)
        setAccountData(data)
    }

    useEffect(() => {
        getAccountData();
    }, [userId])

    async function Withdrawing(e) {
        e.preventDefault();
        const withdrawamt = parseInt(WithdrawalAmount)

        if (withdrawamt > 0 && withdrawamt > AccountData?.DepositAmount) {
            return toast.error("Insufficinet Balance")
        }

        const docRef = doc(db, "accounts", userId)
        try {
            const account = { ...AccountData }
            if (account.hasOwnProperty("DepositAmount") && account.DepositAmount < 1) {
                return toast.error("Insufficinet Balance")
            }
            else {
                let depAmount = account.DepositAmount;
                depAmount -= withdrawamt
                const withdraw = {
                    WithdrawalAmount: withdrawamt,
                    Reason,
                    date: new Date(),
                    userId,
                }
                await addDoc(collection(db, "withdraw"), withdraw);
                await updateDoc(docRef, { DepositAmount: depAmount });
                toast.success("Withdrawal Succesful ")
                navigate(0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div>
            <Dialog>
                <DialogTrigger>
                    <Button className="mx-4">
                        <HandCoinsIcon />WITHDRAW
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <Card className="w-full max-w-md border-none">
                        <CardHeader>
                            <CardTitle>Transfer</CardTitle>
                            <CardDescription><i>Withdraw From Account</i></CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <Button>Balance</Button>
                                    <span>{AccountData?.DepositAmount}</span>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <form>
                                    <Label>Withdraw</Label>

                                    <Input type="number" placeholder="100" value={WithdrawalAmount} onChange={(event) => setWithdrawalAmount(event.target.value)} />

                                    <Textarea className="my-3" placeholder="Reason" value={Reason} onChange={(event) => setReason(event.target.value)} />

                                    <Button onClick={Withdrawing} type="submit" variant="secondary" size="sm" className="mt-3">Withdraw</Button>
                                </form>
                            </div>

                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    )
}

async function getDocument(db, collection, docId) {
    const docRef = doc(db, collection, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data()
    }
    else {
        console.log("No Document Exists")
    }

}