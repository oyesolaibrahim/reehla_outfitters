import { useEffect, useRef, useState } from "react";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Female_Fragrance from "../Categories/FemaleArticle";


const MainFemale = ({femaleJalabs}) => {
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
        <main className="bg-gray-700 overflow-x-hidden min-h-screen pb-16">
            <section ref={leftSlide}>
                <div className={`py-10 text-white sm:mb-10 ${visible ? 'animate-slideInRight' : ''}`}>
                    <h1 className="flex text-center sm:text-6xl md:text-6xl xs:text-4xl justify-center">Available Female Fragrance</h1>
                </div>   
                <Female_Fragrance femaleJalabs={femaleJalabs}/>
            </section>
        </main>
        <Footer/>
        </>
    )
}

export default MainFemale;


