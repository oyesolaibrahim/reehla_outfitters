import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import FirstSection from "./Sections/FirstSEction";
import SecondSection from "./Sections/SecondSection";
import ThirdSection from "./Sections/ThirdSection";
import FourthSection from "./Sections/FourthSection";

const Home = () => {
    
    const userToken = sessionStorage.getItem("userToken");
    const FirstName = sessionStorage.getItem("User");

    const textStyle = {
        fontFamily: "'Dancing Script', cursive"
    };
    
    return (
        <>  
        <Header/>
            <main className="bg-gray-700 pb-10 overflow-x-hidden">
                <div className="background">
                    <div className="text-container text-white text-center justify-center bg-red-800 py-5 px-10 lg:w-4/5 md:w-screen mx-auto">
                        <h1 className="lg:text-4xl md:text-3xl xs:text-2xl sm:text-2xl font-extrabold mb-4 typing-container">
                            <span style={{fontFamily: "Dancing Script"}} className="typing-effect text-center">Welcome to Real Babs Jalab and Fragrance Store!</span>
                        </h1>
                        <p className="md:text-xl typing-container">
                            <span  className="typing-effect" style={{animationDelay: '4s', fontFamily: "Dancing Script" }}>Discover the finest selection of Jalabs and luxurious fragrances,</span>
                            <span  className="typing-effect" style={{fontFamily: "Dancing Script", animationDelay: '7s' }}> crafted to elevate your style and essence.</span>
                            <span  className="typing-effect" style={{ animationDelay: '10s', fontFamily: "Dancing Script" }}> Let our exclusive collections inspire and transform</span>
                            <span  className="typing-effect" style={{ animationDelay: '13s', fontFamily: "Dancing Script" }}> your everyday moments into extraordinary experiences.</span>
                        </p>
                    </div>
                </div>
                <FirstSection/>
                <SecondSection/>
                <ThirdSection/>
                <FourthSection/>
            </main>
            <Footer/>
        </>
    );
}

export default Home;