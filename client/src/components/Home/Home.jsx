import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import FirstSection from "./Sections/FirstSEction";
import SecondSection from "./Sections/SecondSection";
import ThirdSection from "./Sections/ThirdSection";
import FourthSection from "./Sections/FourthSection";
import { useEffect } from "react";

const Home = () => {

    useEffect(() => {
        const textElements = document.querySelectorAll('.typing-text');
        
        textElements.forEach((textElement) => {
            const text = textElement?.innerText;
            let index = 0;
            textElement.innerText = '';

            function typeWriter() {
                if (index < text.length) {
                    textElement.innerHTML += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 50);
                }
            }

            typeWriter();
        });
    }, []);  
    
    return (
        <>  
        <Header/>
            <main className="bg-gray-700 pb-10 overflow-x-hidden">
                <div className="background">
                    <div className="text-container bg-amber-900 bg-opacity-90 text-white text-center justify-center py-5 px-10 lg:w-4/5 md:w-screen mx-auto">
                        <p className="typing-text text-4xl font-extrabold mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Welcome to Rehla's Outfitters and Fragrance!
                        </p>
                        <p className="typing-text text-xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Discover the finest selection of Jalabs and luxurious fragrances, crafted to elevate your style and essence. Let our exclusive collections inspire and transform your everyday moments into extraordinary experiences.
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
