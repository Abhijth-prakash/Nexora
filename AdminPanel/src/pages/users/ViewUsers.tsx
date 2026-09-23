import { useEffect } from "react"
import { addPage, getUser, minusPage } from "../../redux/features/userSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"

const ViewUsers = () => {
    const dispatch = useAppDispatch()
    const {user,page,pages} = useAppSelector(state=> state.UsersData)

    useEffect(()=>{
        dispatch(getUser(page))
    },[dispatch,page])

    const listItems = user && user.map(item=> <li key={item._id}>
        <span>{item.name}</span>
        <span>{item.email}</span>
        <span>{item.verified}</span>
        <span>{item.banned}</span>
    </li>)
    
  return (
    <div>
        {listItems}

    <button
  disabled={page === 1}
  onClick={() => dispatch(minusPage())}
>
  Page -
</button>

<button
  disabled={page === pages}
  onClick={() => dispatch(addPage())}
>
  Page +
</button>
      
    </div>
  )
}

export default ViewUsers
