import { useState } from "react";
import { updateAvailability } from "../../services/bookingService";

export default function AvailabilityToggle({
    available,
    onUpdate
}){

    const [loading,setLoading]=useState(false);

    async function handleToggle(){

        setLoading(true);

        try{

            await updateAvailability(!available);

            onUpdate();

        }catch(err){

            console.error(err);

        }finally{

            setLoading(false);

        }

    }

    return(

        <button

            disabled={loading}

            onClick={handleToggle}

            className={`px-5 py-2 rounded-full font-semibold transition

            ${available

                ? "bg-green-100 text-green-700"

                : "bg-red-100 text-red-700"

            }

            disabled:opacity-50`}

        >

            {loading

                ? "Updating..."

                : available

                ? "🟢 Available"

                : "🔴 Unavailable"}

        </button>

    );

}
