import Acccount from "./Account";
import Withdraw from "./Withdraw";

export default function Actions({ userId }) {
    return (

        <div className="flex space-x-3">

            <Acccount userId={userId}/>
            <Withdraw userId={userId}/>
        </div>
    )
}   