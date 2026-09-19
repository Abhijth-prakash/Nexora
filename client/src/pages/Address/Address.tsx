import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useEffect, useState } from "react"
import { getAddress } from "../../redux/features/addressSlice"
import AddressForm from "./AddressForm"

const Address = () => {
  const { address } = useAppSelector((state) => state.addressData)

  const dispatch = useAppDispatch()

  const [showForm, setShowForm] = useState(false)

  const [editingAddress, setEditingAddress] = useState(null)

  useEffect(() => {
    dispatch(getAddress())
  }, [dispatch])

  const handleAdd = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const handleEdit = (item: any) => {
    setEditingAddress(item)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  return (
    <div>

      <Link to="/">Home</Link>

      <h1>My Addresses</h1>

      {!showForm ? (
        <>
         <button
  disabled={address.length === 2}
  onClick={handleAdd}
>
  + Add Address
</button>

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

                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <AddressForm
          address={editingAddress}
          onClose={handleClose}
        />
      )}

    </div>
  )
}

export default Address