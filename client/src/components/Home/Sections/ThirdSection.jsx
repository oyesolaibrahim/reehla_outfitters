import { useEffect, useRef, useState } from "react";
import Article from "../../Article/Article"
import New_Arrival_Article from "../../Article/New_Arrival_Article";

const ThirdSection = () => {
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
            <section ref={leftSlide}>
                <div className={`sm:pt-10 md:pt-36 xs:pt-10 text-charcoal-gray sm:mb-24 md:mb-24 ${visible ? 'animate-slideInLeft' : ''}`}>
                    <h1 className="flex sm:text-6xl md:text-6xl xs:text-4xl justify-center">New Arrivals</h1>
                </div>
                <New_Arrival_Article/>
                {/* <New_S */}
            </section>
        </>
    )
}

export default ThirdSection;


