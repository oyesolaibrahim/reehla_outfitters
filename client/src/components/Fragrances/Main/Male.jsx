import { useEffect, useRef, useState } from "react";
import Male_Fragrance from "../Categories/MaleArticle";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";


const MainMale = ({jalabs}) => {
const [visible, setVisible] = useState(false);
const leftSlide = useRef(null);


useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Left Element is in view');
            entry.target.classList.add("animate-slideInLeft");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
  
    if (leftSlide.current) {
      observer.observe(leftSlide.current);
    }
  
    return () => {
      if (leftSlide.current) {
        observer.unobserve(leftSlide.current);
      }
    };
  }, []); 

    return (
        <>  
            <Header/>
            <main className="bg-gray-700 overflow-x-hidden min-h-screen py-10">
            <section ref={leftSlide}>
                <div className={`sm:pt-10 md:pt-36   text-white sm:mb-10 ${visible ? 'animate-slideInRight' : ''}`}>
                    <h1 className="flex sm:text-6xl md:text-6xl xs:text-4xl justify-center text-center mb-3">Available Male Fragrance</h1>
                </div>   
                <Male_Fragrance jalabs={jalabs}/>
            </section>
            </main>
            <Footer/>
        </>
    )
}

export default MainMale;


