import { doc, updateDoc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/config";
import { toast } from "react-hot-toast";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

async function getDocument(collection, docId) {
    const docRef = doc(db, collection, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data()
    }
    else {
        console.log("No Document Exists")
    }
}

async function getAccountData(userId) {
    const data = await getDocument(db, "account", userId)
    return data;
}

async function setMonthTarget(MonthlyTarget, AccountData,userId) {

    if (MonthlyTarget < 0) {
        toast.error("No Target found")
    }

    const docRef = doc(db, "accounts", userId)
    try {
        const account = { ...AccountData }
        const currentMonth = new Date().getMonth();
        const newMonthlyData = {
            month: months[currentMonth],
            MonthlyTarget: MonthlyTarget,
        }
        if (!account.monthlyAccountSavings) {
            account.monthlyAccountSavings = []
        }
        const existingMonthData = account.monthlyAccountSavings.find((data) => data.month === months[currentMonth])
        if (existingMonthData) {
            existingMonthData.MonthlyTarget = MonthlyTarget;
        }
        else {
            account.monthlyAccountSavings.push(newMonthlyData)
        }
        await updateDoc(docRef, account);
        toast.success("Monthly Target Set");

    } catch (error) {
        console.log(error)
    }
}

async function setDepAmount(DepositAmount,userId) {

    const docRef = doc(db, "accounts", userId)
    try {
        const parseDepositAmount = parseInt(DepositAmount)
        if (isNaN(parseDepositAmount) || parseDepositAmount < 0) {
            toast.error("Invalid Deposit Amount")
            return;
        }
        const docSnap = await getDoc(docRef)
        let account = { ...docSnap.data() }
        account.DepositAmount = account.DepositAmount + parseDepositAmount
        await updateDoc(docRef, { DepositAmount: account.DepositAmount });

        const depositRecord = {
            DepositAmount: parseDepositAmount,
            date: new Date(),
            userId: userId,
        }
        await addDoc(collection(db, "deposits"), depositRecord);
        toast.success("Deposit Success")
        return account;

    } catch (error) {
        console.log(error);
    }
}

async function setSavingTarget(SavingTargetAmount, AccountData , userId) {
    if (SavingTargetAmount < 1) {
        toast.error("Invalid Target Amount")
        return;
    }
    const docRef = doc(db, "accounts", userId)
    try {
        const account = { ...AccountData }
        account.savingTarget = 0;

        let data = { savingTarget: SavingTargetAmount, };
        if (account.hasOwnProperty("savingTarget")) {
            account.savingTarget = 0;
            await updateDoc(docRef, { ...data, })
            toast.success("Saving Target is Set")
        }
    } catch (error) {
        console.log(error);
    }
}

export { setSavingTarget, setDepAmount, setMonthTarget, getAccountData };