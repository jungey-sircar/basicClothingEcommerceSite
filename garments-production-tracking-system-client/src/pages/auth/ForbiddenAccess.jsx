import { Link } from "react-router";

export default function ForbiddenAccess(){
    return(
        <section className="min-h-screen w-full flex justify-center items-center">
            <title>Forbidden Access</title>
            <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl text-red-500">Forbidden Access!</h2>
                <p className="max-w-sm">You are trying to access a restricted page. We are unable to let you go</p>
                <Link to='/dashboard/home' className="btn btn-primary btn-outline">Back to Dashboard</Link>
            </div>
        </section>
    );
}