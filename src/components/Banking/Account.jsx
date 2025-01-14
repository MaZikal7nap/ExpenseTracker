import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Banknote } from "lucide-react"
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { getAccountData, setDepAmount, setMonthTarget, setSavingTarget } from "./Services";
import { useNavigate } from "react-router";

export default function Account({ userId }) {

    const navigate = useNavigate();
    const [MonthlyTarget, setMonthlyTarget] = useState("");
    const [DepositAmount, setDepositAmount] = useState("");
    const [SavingTargetAmount, setSavingTargetAmount] = useState("");
    const [AccountData, setAccountData] = useState(null);

    useEffect(() => {
        const data = getAccountData(userId);
        setAccountData(data);
    }, [userId]);

    async function handleSetMonthTarget() {

        await setMonthTarget(MonthlyTarget, AccountData, userId).then(() => {
            navigate(0);
        })
    }

    async function handleSetSavingTarget() {

        await setSavingTarget(SavingTargetAmount, AccountData, userId).then(() => {
            navigate(0);
        });
    }

    async function handleDeposit() {

        await setDepAmount(DepositAmount, userId).then(() => {
            navigate(0);
            });
    }

    const handleMonthlyTargetChange = (e) => {
        setMonthlyTarget(e.target.value);
    };

    const handleDepositAmountChange = (e) => {
        setDepositAmount(e.target.value);
    };

    const handleSavingTargetAmountChange = (e) => {
        setSavingTargetAmount(e.target.value);
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button>
                        <Banknote /> ACCOUNT
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <Card className="w-full max-w-md border-none">
                        <CardHeader>
                            <CardTitle>Savings</CardTitle>
                            <CardDescription><i>Manage Your Monthly Savings</i></CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label> Monthly Savings Target ( For This Month )</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="target"
                                        type="number"
                                        placeholder="100"
                                        value={MonthlyTarget}
                                        onChange={handleMonthlyTargetChange}
                                    />
                                    <Button onClick={handleSetMonthTarget} variant="outline" size="sm">Set Target</Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Deposit</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="Deposit"
                                        type="number"
                                        placeholder="50"
                                        value={DepositAmount}
                                        onChange={handleDepositAmountChange}
                                    />
                                    <Button onClick={handleDeposit} variant="outline" size="sm">Deposit</Button>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between flex-col space-y-4">
                            <div className="grid gap-2">
                                <Label>Saving Target Amount</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="100"
                                        value={SavingTargetAmount}
                                        onChange={handleSavingTargetAmountChange}
                                    />
                                    <Button onClick={handleSetSavingTarget} variant="outline" size="sm">Set Savings Target</Button>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    )
}