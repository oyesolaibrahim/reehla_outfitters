import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/shared/logo.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";

const Header = ({ myCarts = [] }) => {
    const [number, setNumber] = useState(0);
    const [jalabMenu, setJalabMenu] = useState(false);
    const [fragranceMenu, setFragranceMenu] = useState(false);
    const [right, setRight] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [message, setMessage] = useState("");
    const [brands, setBrands] = useState([]);
    const { cartValue } = useCart();
    const adminToken = sessionStorage.getItem("adminToken");
    const userToken = sessionStorage.getItem("userToken");
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("userToken");
        navigate("/");
    };

    useEffect(() => {}, [myCarts]);

    const toggleJalabMenu = () => {
        setJalabMenu(prev => !prev);
    };

    const toggleFragranceMenu = () => {
        setFragranceMenu(prev => !prev);
    };

    const navOpen = () => {
        setRight(true);
    };

    const navClose = () => {
        setRight(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && searchQuery.trim()) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/api/collections?productName=${searchQuery}`);
                if (response.data.length > 0) {
                    setBrands(response.data);
                    navigate('/search', { state: { brands: response.data } });
                } else {
                    setMessage("This Brand is not Available");
                }
            } catch (error) {
                console.error('Error fetching collections:', error);
                setMessage("Error fetching collections. Please try again later.");
            }
        }
    };

    return (
        <header className="bg-red-400 sm:px-10 xs:px-1 sticky md:px-2 lg:px-10 md:-top-20 lg:-top-40 py-2 top top2 sm:-top-28 z-10">
            <div className="flex md:justify-center -pt-40 xs:mb-4 sm:justify-center items-center">
                <div>
                    <Link to="/">
                        <img className="lg:w-3/5 sm:w-1/3 md:w-full" src={logo} alt="logo-img" />
                    </Link>
                </div>
                <div className="flex items-center lg:mr-20 md:mr-0 sm:mr-20 xs:mr-16 space-x-2">
                    <input
                        className="px-5 search sm:py-4 lg:w-96 md:w-56 sm:w-80 rounded-lg xs:py-2"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchSubmit}
                    />
                    <i
                        className="fa fa-search sm:text-3xl xs:text-2xl cursor-pointer"
                        aria-hidden="true"
                        onClick={handleSearchSubmit}
                    ></i>
                </div>
                {/* Other Header Elements */}
            </div>
        </header>
    );
};

export default Header;
