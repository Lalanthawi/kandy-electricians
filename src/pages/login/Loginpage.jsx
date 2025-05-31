import Mainbutton from "../../components/Mainbutton";
import Logo from "../../assets/logo.png";

const Loginpage = () => {
  return (
    <>
      <div className="flex h-screen w-screen justify-center items-center">
        <div className="flex flex-col gap-2 bg-orange-100 h-1/2 w-1/4 justify-evenly items-center p-10">
          <img src={Logo} height="10px" width={100}></img>
          <h2 className="flex flex-col">
            {" "}
            Welcome to Kandy Electricians{" "}
            <span> Please Sign In To Your Account </span>
          </h2>

          <form
            className="flex flex-col justify-between gap-4"
            action="submit"
            type="post"
          >
            <div className="">
              {" "}
              <label>Email</label> <input type="email"></input>
            </div>
            <div>
              {" "}
              <label>Password </label> <input type="password"></input>
            </div>
          </form>

          <Mainbutton name="Login" />
          <h3> New User? Register Here. </h3>
        </div>
      </div>
    </>
  );
};

export default Loginpage;
