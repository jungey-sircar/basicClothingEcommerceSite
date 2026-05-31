import CustomerFeedback from "./CustomerFeedback";
import FAQ from "./FAQ";
import Hero from "./Hero";
import OurProducts from "./OurProducts";
import Proccedures from "./Proccedures";

export default function Home(){
    return(
        <>
            <Hero />
            <OurProducts />
            <Proccedures />
            <CustomerFeedback />
            <FAQ />
        </>
    );
}