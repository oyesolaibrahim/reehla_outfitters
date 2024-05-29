import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import FirstSection from "./Sections/FirstSEction";
import SecondSection from "./Sections/SecondSection";
import ThirdSection from "./Sections/ThirdSection";
import FourthSection from "./Sections/FourthSection";

const Home = () => {
    
    const userToken = sessionStorage.getItem("userToken")
    const FirstName = sessionStorage.getItem("User")
    return (
        <>  
            <Header/>
            <main className="bg-gray-700 pb-10">
                <div className="background"></div>
               <FirstSection/>
               <SecondSection/>
               <ThirdSection/>
               <FourthSection/>
            </main>
            <Footer/>
        </>
    )
}

export default Home;


