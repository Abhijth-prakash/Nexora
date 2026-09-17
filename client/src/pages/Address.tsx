import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect } from "react"
import { getAddress } from "../redux/features/addressSlice"

const Address = () => {
  const { address } = useAppSelector((state) => state.addressData)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAddress())
  }, [dispatch])

  return (
    <div>
      <h1>This is address page</h1>

      <Link to="/">Home</Link>

      {address.length === 0 ? (
        <p>No address found. Add an address.</p>
      ) : (
        <ol>
          {address.map((item) => (
            <li key={item._id}>
              <span>{item.fullName}</span>
              <span>{item.type}</span>
              <span>{item.address}</span>
              <span>{item.city}</span>
              <span>{item.country}</span>
              <span>{item.phone}</span>
              <span>{item.state}</span>
              <span>{item.zipCode}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default Address