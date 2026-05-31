import { Outlet } from "react-router";

export default function AuthLayout(){
    return(
        <section className="hero bg-base-200 md:min-h-[80vh]">
            {/* <h2>Auth Layout</h2> */}
            <Outlet />
        </section>
    );
}