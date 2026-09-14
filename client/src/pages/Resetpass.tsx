import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  passwordSchema,
  type passwordData,
} from "../utils/Validation";
import { useAppDispatch } from "../redux/hooks";
import { resetPass } from "../redux/features/userSlice";
import { useSearchParams } from "react-router-dom";

const Resetpass = () => {
  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  
  //handle
  const handleData = (data: passwordData) => {
    try{
    const { confirmpassword, password } = data;

    const resetData = {
      token,
      password,
    };

    dispatch(resetPass(resetData));
    }catch(error){
        console.log('password dosent reset',error)
    }
   
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleData)}>
        <input
          {...register("password")}
          type="password"
          placeholder="password"
        />

        <input
          {...register("confirmpassword")}
          type="password"
          placeholder="confirmpassword"
        />

        <input type="submit" />
      </form>
    </div>
  );
};

export default Resetpass;