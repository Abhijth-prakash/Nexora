import { Link } from "react-router-dom"



const Home = () => {
  return (
    <div>this is home page
      <Link to={'/auth/register'}> Register </Link>

    </div>
  )
}

export default Home