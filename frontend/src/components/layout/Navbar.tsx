import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"

function Navbar () {
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(
        JSON.parse(localStorage.getItem("user") || "null") ?.role === "ADMIN"
    );


    const [isSeller, setIsSeller] = useState(
        JSON.parse(localStorage.getItem("user") || "null")?.role === "SELLER"
    );

    const [cartCount, setCartCount] = useState(
        (JSON.parse(localStorage.getItem("cart") || "[]") as unknown[]).length
    );

    useEffect (() => {
        const checkAuth = () => {
            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            )
            setIsLoggedIn(Boolean(localStorage.getItem("token")));
            setIsAdmin(user?.role === "ADMIN");
            setIsSeller(user?.role === "SELLER");

        };

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartCount(Array.isArray(cart) ? cart.length : 0);
        };
        window.addEventListener("auth-change",checkAuth);
        window.addEventListener("cart-change", updateCartCount);

        return () => {
            window.removeEventListener("auth-change", checkAuth);
            window.removeEventListener("cart-change" , updateCartCount);
        };
    },[]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsSeller(false);

        window.dispatchEvent(new Event("auth-change"));

        window.location.href= "/login";
    };
    return (
        <nav className="bg-white text-black flex items-center justify-between px-6 py-2">
            <NavLink to="/">
               <img src={logo} alt="Skillpath"className="h-10 w-auto"></img>
            </NavLink>
            <div className="hidden items-center gap-6 md:flex">
                <NavLink to="/courses">Courses</NavLink>
                <NavLink to="/cart" className="relative">
                   Cart 
                   {cartCount > 0 && (
                    <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">{cartCount}</span>
                   )}
                </NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/blog">Blog</NavLink>
                <NavLink to="/my-orders">My Orders</NavLink>
                <NavLink to="/my-learning">My Learning</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                {isLoggedIn && (isAdmin || isSeller) && (
                    <NavLink to="/admin">Dashboard</NavLink>
                )}

                {isLoggedIn && (isSeller || isAdmin) && (
                    <NavLink to="/seller-orders">Seller Orders</NavLink>
                )}
                {isLoggedIn ? (
                    <button type="button" onClick={handleLogout}
                       className="font-medium text-red-600 hover:text-red-800">Logout</button>
               ) : (
                  <>
                      <NavLink to="/register">Register</NavLink>
                      <NavLink to="/login">Login</NavLink>
                  </>
                )}
            </div>
            
            <button type="button" onClick={() => navigate("/courses")}
                
             className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
               Explore Courses
            </button>
        </nav>
    )

    
}
export default Navbar;