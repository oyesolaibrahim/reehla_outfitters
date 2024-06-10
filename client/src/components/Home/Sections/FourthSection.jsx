import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const FourthSection = () => {
const [visible, setVisible] = useState(false);


useEffect (() => {
    const timer = setTimeout(() => {
        setVisible(true)
    }, 4000);

return () => clearTimeout(timer);
}, []);

const element = (e) => {
    console.log(e);
}
    return (
        <>  
            <section className={`flex justify-end sm:right-12 md:right-12 xs:right-5 fixed sm:bottom-32 md:bottom-32 xs:bottom-28 items-center space-x-4 ${visible ? "opacity-100 animate__animated animate__bounce" : "opacity-0"}`}>
                {/* <h3 className="font-bold rounded-lg bg-amber-800 py-3 px-5 xs:text-xs text-white toolpoint">Message us now</h3> */}
                <Link to="https://wa.link/hwaf21">
                    <i className="fa fa-whatsapp sm:text-2xl md:text-7xl xs:text-5xl text-green-500 cursor-pointer"  aria-hidden="true"></i>
                </Link>
            </section>
        </>
    )
}

export default FourthSection;


