import { Outlet } from "react-router-dom";

const Layouts = () => {
  return (
    <>
      <div className="page-wrapper">
        <Outlet />
      </div>
    </>
  );
};

export default Layouts;
