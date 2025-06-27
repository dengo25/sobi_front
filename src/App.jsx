import { Routes, Route } from "react-router-dom"
import { Suspense } from "react"
import { routes } from "./config/routes"
import Header from "./components/Header"
import Footer from "./components/Footer"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {routes.map((route, index) => {
              let RoutePath = route.path;
              let RouteElement = route.element;

              return <Route key={index} path={RoutePath} element={<RouteElement />} />
            })}
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
