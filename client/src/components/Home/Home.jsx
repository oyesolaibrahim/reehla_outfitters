import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import FirstSection from "./Sections/FirstSEction";
import SecondSection from "./Sections/SecondSection";
import ThirdSection from "./Sections/ThirdSection";
import FourthSection from "./Sections/FourthSection";

const Home = () => {
    const backgroundImageUrl = 'https://unsplash.com/photos/a-bottle-of-perfume-on-a-pink-background-JIZvOtNHQWY';

    const containerStyle = {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }
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


