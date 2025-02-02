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

    const jalabMenuDisplay = () => {
        setJalabMenu((prevState) => !prevState);
    };

    const fragranceMenuDisplay = () => {
        setFragranceMenu((prevState) => !prevState);
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
                    navigate('/search', { state: { brands: [], message: "This Product is not Available" } });
                }
            } catch (error) {
                console.error('Error fetching collections:', error);
                navigate('/search', { state: { brands: [], message: "Error fetching collections. Please try again later." } });
            }
        }
    };

    return (
        <header className="bg-muted-gold text-primary-brown sm:px-10 xs:px-1 sticky md:px-2 lg:px-10 md:-top-20 lg:-top-40 py-2 top top2 sm:-top-28 xs:-top-32 z-10">
            <div className="flex md:justify-center -pt-40 xs:mb-4 sm:justify-center items-center">
                <div className="w-full xs:relative">
                     <Link to="/">
                        <img className="lg:w-3/5 sm:w-1/2 md:w-full xs:absolute xs:-top-28 xs:-left-12 xs:min-w-40" src={logo} alt="logo-img" />
                    </Link>
                </div>
                <div className="flex items-center lg:mr-20 md:mr-0 sm:mr-20 xs:mr-16 xs:mt-16 space-x-2">
                    <input
                        className="px-5 text-black search sm:py-4 lg:w-96 md:w-56 sm:w-80 rounded-lg xs:py-2"
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
                <div className="sm:flex md:flex-row lg:flex-row lg:space-x-5 md:space-x-0 sm:items-start md:items-center">
                    <div className={`md:flex-row md:flex sm:flex sm:flex-col lg:flex lg:flex-row xs:items-start sm:items-start md:p-0 xs:pt-36 sm:pt-36 xs:fixed sm:fixed sm:z xs:pl-10 sm:pl-10 xs:h-screen sm:h-screen md:h-1/6 xs:w-4/5 sm:w-1/2 xs:top-0 sm:top-0 md:static md:bg-transparent xs:bg-gradient-to-l from-soft-ivory to-muted-gold  xs:text-charcoal-gray sm:bg-transparent sm:text-charcoal-gray transition-all duration-1000 md:-space-x-12 md:items-center ${right ? "right" : "negative-right"}`}>
                        <div className="md:flex-row md:flex lg:flex lg:flex-row sm:flex-col sm:items-start md:items-center md:-space-x-5">
                            <Link to="/">
                                <h3 className="cursor-pointer font-bold sm:mb-5 md:mb-0 py-3 md:px-5 sm:px-0 sm:hover:text-primary-brown hover:text-soft-ivory">Home</h3>
                            </Link>
                            <Link to="/about">
                                <h3 className="cursor-pointer min-w-32 font-bold sm:mb-5 md:mb-0 py-3 md:px-5 sm:hover:text-primary-brown hover:text-soft-ivory">About Us</h3>
                            </Link>
                            <Link to="/blog">
                                <h3 className="cursor-pointer lg:min-w-32 md:min-w-36 font-bold sm:mb-5 md:mb-0 py-3 hover:text-soft-ivory md:px-5 md:pr-10 md:hover:text-soft-ivory">Blog</h3>
                            </Link>
                        </div>
                        <div className="flex md:flex-row lg:flex-row md:mr-10 sm:pl-5 sm:flex-col sm:items-start xs:items-start xs:flex-col md:items-center">
                            <Link to="/signup">
                                <h3 className="cursor-pointer font-bold xs:mb-6 sm:mb-5 md:mb-0 hover:rounded-lg hover:bg-primary-brown text-primary-brown hover:text-soft-ivory py-3 px-5 xs:-ml-5 lg:mr-3 md:mr-3">Signup</h3>
                            </Link>
                            <div>
                                <Link to="/login">
                                    <h3 className={`cursor-pointer ${adminToken && "hidden"} ${userToken && "hidden"} font-bold sm:mb-5 md:mb-0 rounded-lg bg-primary-brown text-soft-ivory py-3 px-5 xs:-ml-5`}>Login</h3>
                                    <h3 className={`cursor-pointer ${adminToken ? "inline-block" : "hidden"} ${userToken ? "inline-block" : "hidden"} font-bold sm:mb-5 md:mb-0 rounded-lg bg-primary-brown text-soft-ivory py-3 px-5 xs:-ml-5`} onClick={logout}>Logout</h3>
                                </Link>
                            </div>

                        </div>
                    </div>
                    <div className="flex sm:z-50 xs:absolute xs:top-5 sm:absolute xs:right-5 sm:right-5">
                        <i onClick={navOpen} className={`fa fa-2x fa-bars hidden cursor-pointer ${right ? "hidden" : "xs:inline-block sm:inline-block"}`} aria-hidden="true"></i>
                        <i onClick={navClose} className={`fa xs:z-50 fa-2x fa-times fixed right-5 hidden cursor-pointer ${right ? "xs:inline-block sm:inline-block" : "hidden"}`} aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div className="flex items-center md:justify-center sm:justify-center lg:space-x-48 md:space-x-10 sm:-space-x-16 xs:-space-x-16">
                <div className="flex sm:justify-center md:justify-center items-center lg:space-x-60 xs:space-x-2 sm:space-x-2">
                    {/* <div className="flex sm:space-x-3 xs:space-x-0 sm:items-center xs:items-center xs:py-2 mt-10 rounded-lg bg-primary-brown sm:w-60 xs:w-28 sm:py-3 xs:px-2 text-gray-100">
                        <h3 className="font-bold uppercase xs:text-xs sm:ml-10 xs:ml-3">Start Shopping</h3>
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </div> */}
                    <div className={`flex ${right ? "sm:-z-10 xs:-z-10" : ""} sm:space-x-10 md:space-x-10 xs:space-x-3 mt-10 rounded-lg bg-primary-brown sm:w-72 md:w-72 xs:w-52 py-3 sm:px-5 md:px-5 xs:px-2 text-gray-100 font-bold uppercase ml-10`}>
                        <div className="flex items-center space-x-2 relative">
                            <h3 className="xs:text-xs">Jalabs</h3>
                            <i className={`fa fa-chevron-down cursor-pointer`} aria-hidden="true" onClick={jalabMenuDisplay}></i>
                            <div className={`sm:-z-10 xs:-z-10 absolute transition-all duration-1000 animate-popUp sm:top-10 xs:top-12 hidden sm:-left-36 xs:-left-28 rounded-lg bg-gray-900 sm:w-52 md:w-52 xs:w-44 py-5 px-7 text-gray-200 ${jalabMenu ? "inline-block" : "hidden"}`}>
                                <Link to="/male/jalabs">
                                    <h3 className="cursor-pointer xs:text-xs mb-5 hover:translate-x-3 transition-all duration-500">Male Jalabs</h3>
                                </Link>
                                <Link to="/female/jalabs">
                                    <h3 className="cursor-pointer mb-5 xs:text-xs hover:translate-x-3 transition-all duration-500">Female Jalabs</h3>
                                </Link>
                                <Link to="/children/jalabs">
                                    <h3 className="cursor-pointer mb-5 xs:text-xs hover:translate-x-3 transition-all duration-500">Children Jalabs</h3>
                                </Link>
                            </div>
                        </div>
                        <div className={`flex items-center space-x-2 relative ${right ? "sm:-z-10 xs:-z-10" : ""}`}>
                            <h3 className="xs:text-xs">Fragrances</h3>
                            <i className="fa fa-chevron-down cursor-pointer" aria-hidden="true" onClick={fragranceMenuDisplay}></i>
                            <div className={`sm:-z-10 xs:-z-10 absolute  transition-all duration-1000 animate-popUp  sm:top-10 xs:top-12 md:-right-36 sm:-left-16 xs:-left-5 rounded-lg bg-gray-900 sm:w-52 md:w-52 xs:w-36 py-3 px-5 text-gray-100 ${fragranceMenu ? "inline-block" : "hidden"}`}>
                                <Link to="/male/fragrance">
                                    <h3 className="cursor-pointer mb-5 hover:translate-x-3 xs:text-xs transition-all duration-500">Male</h3>
                                </Link>
                                <Link to="/female/fragrance">
                                    <h3 className="cursor-pointer mb-5 hover:translate-x-3 xs:text-xs transition-all duration-500">Female</h3>
                                </Link>
                                <Link to="/unisex/fragrance">
                                    <h3 className="cursor-pointer mb-5 hover:translate-x-3 xs:text-xs transition-all duration-500">Unisex</h3>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {adminToken ? (
                    <Link to="/jalabs/cart">
                        <button className={`cursor-pointer orders ${right ? "sm:-z-10 xs:-z-10" : ""} font-bold md:mb-0 rounded-lg bg-amber-800 sm:py-3 sm:px-5 text-white sm:absolute sm:right-10 md:static xs:absolute`}>
                            Orders
                        </button>
                    </Link>
                ) : (
                    <div className={`relative text-primary-brown sm:left-20 sm:top-5 cart cursor-pointer ${right ? "sm:-z-10 xs:-z-10" : ""}`}>
                        <div>
                            <Link to="/jalabs/cart">
                                <i className="fa fa-shopping-cart sm:text-6xl md:text-6xl xs:text-5xl cursor-pointer" aria-hidden="true"></i>
                                <div className="bg-gray-100 rounded-full absolute top-0 left-5">
                                    <p className="text-muted-gold text-center sm:px-3 md:px-3 xs:px-3 py-1">{cartValue || 0}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
