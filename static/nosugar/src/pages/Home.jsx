// import React from "react";
// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div style={{ height: "100vh", padding: "20px", backgroundColor: "#232323", color: "white" }}>
//       <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Homepage</h1>
//       <ul style={{ listStyle: "none", padding: "0" }}>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro9" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro9
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro8" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro8
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro1" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro1
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro2" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro2
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro3" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro3
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro4" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro4
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro11" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro11
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro12" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro12
//           </Link>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           <Link to="/iphone1415pro13" style={{ color: "#87CEFA", textDecoration: "none" }}>
//             IPhone1415Pro13
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Home;
import React from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  // При рендере компонента Home сразу перенаправляем на /iphone1415pro8
  return <Navigate to="/auth" />;
};

export default Home;

