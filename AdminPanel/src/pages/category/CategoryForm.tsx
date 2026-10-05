

export type props ={
    onClose: ()=> void
}

const CategoryForm = ({onClose}:props) => {
  return (
    <div>
        <button onClick={onClose}>close</button>
        <h1>this is catform</h1>
      
    </div>
  )
}

export default CategoryForm
