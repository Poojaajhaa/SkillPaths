import { Routes , Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CourseDetailsPage from "./pages/CourseDetailsPage";
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage";
import AdminDashboard from './pages/AdminDashboard';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import ProtectedRoute from './components/ProtectedRoute';
import LearnPage from "./pages/LearnPage";
import CurriculumManager from './pages/CurriculumManager';
import MyLearningPage from './pages/MyLearningPage';


function App() {

  return (
    <>
    <Navbar/>
    <Routes>

      <Route path="/test" element={<h1 className="p-10 text-4xl">TEST PAGE</h1>} />
      <Route path="/" element = {<HomePage/>}/>
      <Route path="/courses" element = {<CoursesPage/>}/>
      <Route path="/courses/:courseName" element={<CourseDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about" element = {<AboutPage/>}/>
      <Route path="/my-orders" element={<MyOrdersPage/>}/>
      <Route path="/seller-orders" element={<SellerOrdersPage/>}/>
      <Route path="/blog" element = {<BlogPage/>}/>
      <Route path="/blog/:id" element={<ArticleDetailsPage />} />
      <Route path="/contact" element = {<ContactPage/>}/>
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN", "SELLER"]}><AdminDashboard/></ProtectedRoute>}/>
      <Route path="/seller-orders" element={<ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}><SellerOrdersPage/></ProtectedRoute>}/>
      <Route path="/learn/:courseId" element={<ProtectedRoute allowedRoles={["USER", "SELLER", "ADMIN"]}><LearnPage/></ProtectedRoute>}/>
      <Route path="/admin/courses/:courseId/curriculum" element={
        <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}><CurriculumManager/></ProtectedRoute>
      }/>
      <Route path="/my-learning" 
       element={
          <ProtectedRoute allowedRoles={["USER" , "SELLER" , "ADMIN"]}>
            <MyLearningPage/>
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage/>}/>
      
    </Routes>
    <Footer/>
    </>
    
  )
}

export default App
