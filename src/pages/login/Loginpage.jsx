import Mainbutton from "../../components/Mainbutton";

const Loginpage = () => {
  return (
    <>
      <div className="flex h-screen w-screen justify-center items-center">
        <div className="flex flex-col gap-2 bg-amber-100 h-1/2 w-1/4 justify-center">
          <h2> Welcome to Kandy Electricians </h2>
          <p> Please sign in to your account. </p>
          <Mainbutton name="Login" />
        </div>
      </div>
    </>
  );
};

export default Loginpage;
