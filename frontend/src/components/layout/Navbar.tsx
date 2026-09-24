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

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const navLinkClass = "block py-2 md:py-0";

    return (
        <nav className="relative bg-white text-black px-6 py-2">
            <div className="flex items-center justify-between">
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                   <img src={logo} alt="Skillpath" className="h-10 w-auto"></img>
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

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/courses")}
                        className="hidden rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 sm:block"
                    >
                       Explore Courses
                    </button>

                    {/* Hamburger button — sirf mobile pe dikhega */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="rounded-lg border border-gray-300 p-2 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
                <div className="mt-3 flex flex-col border-t border-gray-100 pt-3 md:hidden">
                    <NavLink to="/courses" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Courses</NavLink>
                    <NavLink to="/cart" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                        Cart {cartCount > 0 && `(${cartCount})`}
                    </NavLink>
                    <NavLink to="/about" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>About</NavLink>
                    <NavLink to="/blog" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Blog</NavLink>
                    <NavLink to="/my-orders" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>My Orders</NavLink>
                    <NavLink to="/my-learning" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>My Learning</NavLink>
                    <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>

                    {isLoggedIn && (isAdmin || isSeller) && (
                        <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                    )}

                    {isLoggedIn && (isSeller || isAdmin) && (
                        <NavLink to="/seller-orders" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Seller Orders</NavLink>
                    )}

                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="py-2 text-left font-medium text-red-600 hover:text-red-800"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink to="/register" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Register</NavLink>
                            <NavLink to="/login" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            navigate("/courses");
                        }}
                        className="mt-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                        Explore Courses
                    </button>
                </div>
            )}
        </nav>
    )
}
export default Navbar;