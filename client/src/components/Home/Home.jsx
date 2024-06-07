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

        function showText(element) {
            element.classList.add('show');
            element.classList.remove('hide');
        }

        function hideText(element) {
            element.classList.remove('show');
            element.classList.add('hide');
        }

        function displayTextSequence(elements, index = 0) {
            if (elements.length === 0) return;

            const currentElement = elements[index];
            const nextIndex = (index + 1) % elements.length;

            showText(currentElement);

            setTimeout(() => {
                hideText(currentElement);
                setTimeout(() => {
                    displayTextSequence(elements, nextIndex);
                }, 1000); // Time to allow fade-out before showing the next text
            }, 3000); // Display each text for 3 seconds
        }

        displayTextSequence(Array.from(textElements));
    }, []);

    return (
        <>  
        <Header/>
            <main className="bg-gray-700 pb-10 overflow-x-hidden">
                <div className="background relative">
                    <div className="text-container bg-amber-900 bg-opacity-90 text-white text-center justify-center py-5 lg:w-4/5 md:w-screen mx-auto">
                        <p className="typing-text text-4xl font-extrabold mb-4 hide" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Welcome to Reehla's Outfitters and Fragrance!
                        </p>
                        <p className="typing-text text-4xl font-extrabold mb-4 hide" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Discover the finest selection of Jalabs!
                        </p>
                        <p className="typing-text text-4xl font-extrabold mb-4 hide" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Explore luxurious fragrances!
                        </p>
                        <p className="typing-text text-4xl font-extrabold mb-4 hide" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Elevate your style and essence!
                        </p>
                        <p className="typing-text text-4xl font-extrabold mb-4 hide" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Let our collections inspire you!
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
