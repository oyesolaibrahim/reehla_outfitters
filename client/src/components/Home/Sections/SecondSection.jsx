import { useEffect, useRef, useState } from "react";
import Article from "../../Article/Article"
import Best_Article from "../../Fragrances/Home/Best Sellers/Best_Seller_Article";

const SecondSection = () => {
const [visible, setVisible] = useState(false);
const popSection = useRef(null);


useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Right Element is in view');
            entry.target.classList.add("animate-popUp");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
  
    if (popSection.current) {
      observer.observe(popSection.current);
    }
  
    return () => {
      if (popSection.current) {
        observer.unobserve(popSection.current);
      }
    };
  }, []);
    return (
        <>  
            <section id="myElement" ref={popSection}>
                <div className={`sm:pt-10 md:pt-36 xs:pt-10 text-charcoal-gray sm:mb-24 md:mb24 ${visible ? 'animate-popUp' : ''}`}>
                    <h1 className="flex sm:text-6xl md:text-6xl xs:text-4xl justify-center">Best Sellers</h1>
                </div>
            <Article/>
            </section>
        </>
    )
}

export default SecondSection;


